#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function readRequired(file) {
  if (!fs.existsSync(file)) {
    failures.push(`${file} must exist`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function requireText(text, value, file) {
  check(text.includes(value), `${file} missing: ${value}`);
}

function requirePattern(text, pattern, message) {
  check(pattern.test(text), message);
}

const workflowDir = '.github/workflows';
const workflowFiles = fs.readdirSync(workflowDir)
  .filter((name) => name.endsWith('.yml'))
  .sort();
const actionRef = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+@[0-9a-f]{40}$/;

for (const name of workflowFiles) {
  const file = path.join(workflowDir, name);
  const text = fs.readFileSync(file, 'utf8');
  for (const [index, line] of text.split('\n').entries()) {
    const match = line.match(/^\s*(?:-\s*)?uses:\s*([^\s#]+)/);
    if (!match) continue;
    check(
      actionRef.test(match[1]),
      `${file}:${index + 1} uses must pin owner/repo to a 40-character lowercase commit SHA`,
    );
  }

  if (text.includes('actions/checkout@')) {
    requireText(text, 'persist-credentials: false', file);
  }
}

const publishFile = '.github/workflows/publish-npm.yml';
const publish = readRequired(publishFile);

if (publish) {
  for (const [pattern, description] of [
    [/^\s{2}workflow_dispatch:\s*$/m, 'workflow_dispatch'],
    [/^\s{6}version:\s*$/m, 'required version input'],
    [/^\s{6}source_sha:\s*$/m, 'required source_sha input'],
    [/^\s{2}prepare:\s*$/m, 'prepare job'],
    [/^\s{2}publish:\s*$/m, 'publish job'],
    [/^\s*environment:\s*npm-release\s*$/m, 'npm-release environment'],
    [/^\s*id-token:\s*write\s*$/m, 'id-token: write permission'],
    [/^\s*contents:\s*read\s*$/m, 'contents: read permission'],
    [/^\s*node-version:\s*['"]?24['"]?\s*$/m, 'Node 24'],
    [/^\s*package-manager-cache:\s*false\s*$/m, 'disabled package-manager cache'],
    [/^\s*registry-url:\s*https:\/\/registry\.npmjs\.org\s*$/m, 'npm registry URL'],
    [/^\s*runs-on:\s*ubuntu-latest\s*$/m, 'GitHub-hosted Ubuntu runner'],
  ]) {
    requirePattern(publish, pattern, `${publishFile} missing ${description}`);
  }

  check((publish.match(/^\s*required:\s*true\s*$/gm) || []).length >= 2, `${publishFile} inputs must be required`);
  check((publish.match(/^\s*type:\s*string\s*$/gm) || []).length >= 2, `${publishFile} inputs must be strings`);

  for (const trigger of ['pull_request', 'push', 'schedule', 'workflow_call', 'repository_dispatch']) {
    check(!new RegExp(`^  ${trigger}:`, 'm').test(publish), `${publishFile} must only use workflow_dispatch`);
  }

  for (const value of [
    'actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5 # v4',
    'actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4',
    'actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4',
    'actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093 # v4',
    '${{ github.ref }}',
    '${{ github.sha }}',
    '${{ inputs.version }}',
    '${{ inputs.source_sha }}',
    'refs/heads/main',
    'git rev-parse HEAD',
    'git ls-remote',
    'package.json',
    '22.14.0',
    '11.5.1',
    'process.versions.node',
    "execFileSync('npm', ['--version']",
    'parseVersion',
    'meetsMinimum',
    'npm run validate',
    'git diff --check',
    'npm pack --dry-run',
    'npm pack --json',
    'sha256sum',
    'npm-pack.json',
    'release-metadata.json',
    'needs: prepare',
    'npm publish',
  ]) {
    requireText(publish, value, publishFile);
  }

  requireText(publish, 'ref: ${{ github.sha }}', publishFile);
  check(!publish.includes('ref: ${{ inputs.source_sha }}'), `${publishFile} must not check out the unverified source_sha input`);

  check((publish.match(/npm pack --json/g) || []).length === 1, `${publishFile} must create exactly one real tarball`);
  const artifactName = 'gooblin-npm-${{ inputs.version }}-${{ inputs.source_sha }}';
  check(
    (publish.match(new RegExp(artifactName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length === 2,
    `${publishFile} prepare and publish jobs must use the same workflow artifact`,
  );
  requireText(publish, 'sha256sum --check', publishFile);
  requireText(publish, 'release-artifact/${{ needs.prepare.outputs.tarball }}', publishFile);
  requireText(publish, 'npm publish "release-artifact/${{ needs.prepare.outputs.tarball }}"', publishFile);
  check(
    publish.trimEnd().endsWith('run: npm publish "release-artifact/${{ needs.prepare.outputs.tarball }}"'),
    `${publishFile} must end with publishing the prepared tarball`,
  );

  const prepareStart = publish.indexOf('\n  prepare:');
  const publishStart = publish.indexOf('\n  publish:');
  const prepareJob = publish.slice(prepareStart, publishStart);
  const publishJob = publish.slice(publishStart);
  check(!prepareJob.includes('id-token:'), `${publishFile} prepare job must not receive id-token permission`);
  check(!prepareJob.includes('environment:'), `${publishFile} prepare job must not use a protected environment`);
  requireText(publishJob, 'environment: npm-release', `${publishFile} publish job`);
  requireText(publishJob, 'id-token: write', `${publishFile} publish job`);

  for (const forbidden of [
    'NPM_TOKEN',
    'NODE_AUTH_TOKEN',
    'secrets.',
    'pull_request_target',
    'persist-credentials: true',
  ]) {
    check(!publish.includes(forbidden), `${publishFile} must not contain ${forbidden}`);
  }
}

const securityFile = 'SECURITY.md';
const security = readRequired(securityFile);
if (security) {
  for (const value of [
    'https://github.com/jsleemaster/gooblin/security/advisories/new',
    'source `main`',
    'npm registry',
    'assessed separately',
    '1.3.1',
    'destructive lifecycle commands',
    'affected version',
    'reproduction',
    'impact',
    'safe contact details',
    'coordinated review',
  ]) {
    requireText(security, value, securityFile);
  }
  requirePattern(
    security,
    /do not (?:disclose|report|publish).*public/i,
    `${securityFile} must forbid public disclosure before coordinated review`,
  );
}

const releaseFile = 'docs/release-process.md';
const release = readRequired(releaseFile);
if (release) {
  for (const value of [
    'jsleemaster/gooblin',
    'publish-npm.yml',
    'npm-release',
    'npm publish',
    'release immutability',
    'source SHA',
    'draft release',
    'workflow artifact',
    'SHA-256',
    'registry',
    'npx --yes gooblin --version',
    'destructive-command preservation',
    'integrity',
    'provenance',
    'publish the draft',
    'immutable release',
    'tag',
    'observed output',
  ]) {
    requireText(release, value, releaseFile);
  }
}

const maintenanceFile = 'docs/maintenance.md';
const maintenance = readRequired(maintenanceFile);
if (maintenance) {
  for (const value of ['full 40-character commit SHA', 'OIDC', 'npm-release']) {
    requireText(maintenance, value, maintenanceFile);
  }
}

const pkg = JSON.parse(readRequired('package.json') || '{}');
check(
  pkg.scripts?.['validate:supply-chain'] === 'node scripts/validate-supply-chain.mjs',
  'package.json must expose validate:supply-chain',
);
check(pkg.files?.includes('SECURITY.md'), 'package.json files must include SECURITY.md');

const validateFile = 'scripts/validate.mjs';
const validate = readRequired(validateFile);
const validateScripts = [...validate.matchAll(/'([^']+\.mjs)'/g)].map((match) => match[1]);
const supplyChainIndex = validateScripts.indexOf('scripts/validate-supply-chain.mjs');
check(
  supplyChainIndex > -1 && validateScripts[supplyChainIndex + 1] === 'scripts/validate-claims.mjs',
  'scripts/validate.mjs must run validate:supply-chain immediately before validate:claims',
);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('validate:supply-chain ok');
