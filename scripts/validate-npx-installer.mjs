#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(filePath) {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

const pkg = readJson('package.json');
const installerPath = 'bin/gooblin.mjs';
const source = fs.readFileSync(installerPath, 'utf8');
const mode = fs.statSync(installerPath).mode;

assert(pkg.bin?.gooblin === installerPath, 'package bin.gooblin must point to bin/gooblin.mjs');
assert(pkg.engines?.node === '>=18', 'package engines.node must be >=18');
assert(pkg.files.includes('bin/'), 'package files must include bin/');
assert(pkg.scripts?.['validate:npx-installer'] === 'node scripts/validate-npx-installer.mjs', 'package must expose validate:npx-installer');
assert(source.startsWith('#!/usr/bin/env node'), 'installer must have a node shebang');
assert((mode & 0o111) !== 0, 'installer must be executable');

for (const required of [
  '.gooblin',
  'GOOBLIN_INSTALL.json',
  '--dry-run',
  '--force',
  '--target',
  'Readable skill pack only',
  'Use /gooblin for this task.',
]) {
  assert(source.includes(required), `installer must include ${required}`);
}

for (const forbidden of [
  'fetch(',
  'XMLHttpRequest',
  'http://',
  'https://',
  'child_process',
  'exec(',
  'spawn(',
]) {
  assert(!source.includes(forbidden), `installer must not include ${forbidden}`);
}

function runInstaller(target, args) {
  return spawnSync(process.execPath, [installerPath, ...args, '--target', target], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
}

function createInstalledFixture(root) {
  const installRoot = path.join(root, '.gooblin');
  fs.mkdirSync(installRoot, { recursive: true });

  const marker = {
    name: 'gooblin',
    version: pkg.version,
    installedAt: '2026-01-01T00:00:00.000Z',
    installer: 'gooblin-npx',
    target: root,
  };

  fs.writeFileSync(
    path.join(installRoot, 'GOOBLIN_INSTALL.json'),
    `${JSON.stringify(marker, null, 2)}\n`,
    'utf8',
  );

  const userFile = path.join(installRoot, 'user-notes.md');
  fs.writeFileSync(userFile, '# Keep me\nconsumer-owned content\n', 'utf8');

  return { userFile, hash: sha256(userFile) };
}

function assertPreserved(userFile, expectedHash, label) {
  assert(fs.existsSync(userFile), `${label} removed an existing user file`);
  assert(sha256(userFile) === expectedHash, `${label} changed an existing user file`);
}

function verifyDestructiveCommandIsBlocked(args, label) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gooblin-installer-'));
  try {
    const { userFile, hash } = createInstalledFixture(root);
    const result = runInstaller(root, args);

    assert(result.status !== 0, `${label} must fail until owned-file tracking exists`);
    assertPreserved(userFile, hash, label);
    assert(
      result.stderr.includes('Refusing') || result.stderr.includes('disabled'),
      `${label} must explain the safety refusal`,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function verifyDryRunPreservesFiles(args, label) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gooblin-installer-'));
  try {
    const { userFile, hash } = createInstalledFixture(root);
    const result = runInstaller(root, [...args, '--dry-run']);

    assert(result.status === 0, `${label} must succeed: ${result.stderr}`);
    assertPreserved(userFile, hash, label);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

verifyDestructiveCommandIsBlocked(['install', '--force'], 'install --force');
verifyDestructiveCommandIsBlocked(['uninstall'], 'uninstall');
verifyDestructiveCommandIsBlocked(['uninstall', '--force'], 'uninstall --force');

verifyDryRunPreservesFiles(['install', '--force'], 'install --force --dry-run');
verifyDryRunPreservesFiles(['uninstall'], 'uninstall --dry-run');
verifyDryRunPreservesFiles(['uninstall', '--force'], 'uninstall --force --dry-run');

{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gooblin-installer-'));
  try {
    const result = runInstaller(root, ['install']);
    assert(result.status === 0, `new-target install must succeed: ${result.stderr}`);
    assert(
      fs.existsSync(path.join(root, '.gooblin', 'GOOBLIN_INSTALL.json')),
      'new-target install must create the marker',
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

console.log('validate:npx-installer ok');
