#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const failures = [];
const publishFile = '.github/workflows/publish-npm.yml';

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

function indentOf(line) {
  return line.match(/^ */)[0].length;
}

function parseYamlMappingLine(line, { allowSequence = false } = {}) {
  const sequence = line.match(/^( *)(-)\s+(.+)$/);
  const candidate = sequence && allowSequence ? `${sequence[1]}  ${sequence[3]}` : line;
  if (sequence && !allowSequence) return null;
  const match = candidate.match(/^( *)(?:"([^"]+)"|'([^']+)'|([A-Za-z0-9_-]+))\s*:\s*(.*)$/);
  if (!match) return null;
  return {
    indent: match[1].length,
    key: match[2] ?? match[3] ?? match[4],
    value: match[5].trim(),
    sequence: Boolean(sequence),
  };
}

function yamlScalar(value) {
  const trimmed = value.trim();
  const doubleQuoted = trimmed.match(/^"([^"]*)"(?:\s+#.*)?$/);
  if (doubleQuoted) return doubleQuoted[1];
  const singleQuoted = trimmed.match(/^'([^']*)'(?:\s+#.*)?$/);
  if (singleQuoted) return singleQuoted[1];
  const commentIndex = trimmed.search(/\s+#/);
  const plain = (commentIndex === -1 ? trimmed : trimmed.slice(0, commentIndex)).trim();
  return plain || null;
}

function findYamlBlock(lines, key, indent, start = 0, end = lines.length, label = key, file = publishFile) {
  for (let index = start; index < end; index += 1) {
    const mapping = parseYamlMappingLine(lines[index]);
    if (!mapping || mapping.indent !== indent || mapping.key !== key) continue;
    let blockEnd = end;
    for (let cursor = index + 1; cursor < end; cursor += 1) {
      const trimmed = lines[cursor].trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      if (indentOf(lines[cursor]) <= indent) {
        blockEnd = cursor;
        break;
      }
    }
    return {
      key,
      indent,
      start: index,
      end: blockEnd,
      value: mapping.value,
      label,
      file,
    };
  }
  failures.push(`${file} missing ${label} block`);
  return null;
}

function directYamlEntries(lines, block) {
  if (!block) return [];
  const childIndent = block.indent + 2;
  const entries = [];
  for (let index = block.start + 1; index < block.end; index += 1) {
    const trimmed = lines[index].trim();
    if (!trimmed || trimmed.startsWith('#') || indentOf(lines[index]) !== childIndent) continue;
    const mapping = parseYamlMappingLine(lines[index]);
    if (!mapping || mapping.indent !== childIndent) {
      failures.push(`${block.file}:${index + 1} ${block.label} contains a noncanonical direct child`);
      continue;
    }
    entries.push({ key: mapping.key, value: mapping.value, line: index + 1 });
  }
  return entries;
}

function directYamlValue(lines, block, key) {
  const matches = directYamlEntries(lines, block).filter((entry) => entry.key === key);
  check(matches.length === 1, `${publishFile} ${block?.key || 'missing block'} must define ${key} exactly once`);
  return matches[0]?.value;
}

function requireExactKeys(lines, block, expected, label) {
  const actual = directYamlEntries(lines, block).map((entry) => entry.key).sort();
  const wanted = [...expected].sort();
  check(JSON.stringify(actual) === JSON.stringify(wanted), `${publishFile} ${label} keys must be exactly: ${wanted.join(', ')}`);
}

function yamlStepItems(lines, jobBlock) {
  if (!jobBlock) return [];
  const steps = findYamlBlock(lines, 'steps', jobBlock.indent + 2, jobBlock.start + 1, jobBlock.end, `${jobBlock.key}.steps`);
  if (!steps) return [];
  const itemIndent = steps.indent + 2;
  const starts = [];
  for (let index = steps.start + 1; index < steps.end; index += 1) {
    const trimmed = lines[index].trim();
    if (!trimmed || trimmed.startsWith('#') || indentOf(lines[index]) !== itemIndent) continue;
    const mapping = parseYamlMappingLine(lines[index], { allowSequence: true });
    if (!mapping?.sequence || mapping.indent !== itemIndent + 2) {
      failures.push(`${steps.file}:${index + 1} ${jobBlock.key}.steps contains a noncanonical sequence item`);
    }
    starts.push({ start: index, initial: mapping });
  }
  return starts.map((item, index) => {
    const end = starts[index + 1]?.start ?? steps.end;
    const properties = item.initial?.sequence ? [item.initial] : [];
    for (let cursor = item.start + 1; cursor < end; cursor += 1) {
      const trimmed = lines[cursor].trim();
      if (!trimmed || trimmed.startsWith('#') || indentOf(lines[cursor]) !== itemIndent + 2) continue;
      const mapping = parseYamlMappingLine(lines[cursor]);
      if (!mapping || mapping.indent !== itemIndent + 2) {
        failures.push(`${steps.file}:${cursor + 1} ${jobBlock.key}.steps item contains a noncanonical direct property`);
        continue;
      }
      properties.push(mapping);
    }
    const names = properties.filter((property) => property.key === 'name');
    check(names.length <= 1, `${steps.file}:${item.start + 1} workflow step must define name at most once`);
    const name = names.length === 1 ? yamlScalar(names[0].value) : null;
    check(names.length === 0 || name !== null, `${steps.file}:${item.start + 1} workflow step name must be a scalar`);
    return {
      start: item.start,
      name,
      indent: itemIndent,
      end,
      text: lines.slice(item.start, end).join('\n'),
    };
  });
}

function shellCommands(lines) {
  const commands = [];
  for (let index = 0; index < lines.length; index += 1) {
    const mapping = parseYamlMappingLine(lines[index], { allowSequence: true });
    if (mapping?.key !== 'run') continue;
    const runIndent = mapping.indent;
    if (mapping.value && mapping.value !== '|' && mapping.value !== '>') {
      const value = yamlScalar(mapping.value);
      commands.push({ line: index + 1, text: (value ?? mapping.value).replace(/\s+/g, ' ').trim() });
      continue;
    }
    let heredoc = null;
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const trimmed = lines[cursor].trim();
      if (trimmed && indentOf(lines[cursor]) <= runIndent) break;
      if (!trimmed) continue;
      if (heredoc) {
        if (trimmed === heredoc) heredoc = null;
        continue;
      }
      commands.push({ line: cursor + 1, text: trimmed.replace(/\s+/g, ' ') });
      const delimiter = trimmed.match(/<<-?['"]?([A-Za-z_][A-Za-z0-9_]*)['"]?/);
      if (delimiter) heredoc = delimiter[1];
    }
  }
  return commands;
}

const workflowDir = '.github/workflows';
const workflowFiles = fs.readdirSync(workflowDir)
  .filter((name) => name.endsWith('.yml'))
  .sort();
const actionRef = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+@[0-9a-f]{40}$/;
const actionLike = /\b[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+@[A-Za-z0-9_.-]+/;

for (const name of workflowFiles) {
  const file = path.join(workflowDir, name);
  const text = fs.readFileSync(file, 'utf8');
  for (const [index, line] of text.split('\n').entries()) {
    const mapping = parseYamlMappingLine(line, { allowSequence: true });
    if (mapping?.key !== 'uses') {
      const trimmed = line.trim();
      check(
        !trimmed || trimmed.startsWith('#') || !actionLike.test(line),
        `${file}:${index + 1} action-like reference must use a canonical uses mapping`,
      );
      continue;
    }
    const reference = yamlScalar(mapping.value);
    check(
      reference !== null && actionRef.test(reference),
      `${file}:${index + 1} uses must pin owner/repo to a 40-character lowercase commit SHA`,
    );
  }

  const lines = text.split('\n');
  for (const [index, line] of lines.entries()) {
    const mapping = parseYamlMappingLine(line, { allowSequence: true });
    const reference = mapping?.key === 'uses' ? yamlScalar(mapping.value) : null;
    if (!reference?.startsWith('actions/checkout@')) continue;
    const propertyIndent = mapping.indent;
    const itemIndent = propertyIndent - 2;
    let itemStart = index;
    for (let cursor = index; cursor >= 0; cursor -= 1) {
      if (indentOf(lines[cursor]) === itemIndent && /^\s*-\s+/.test(lines[cursor])) {
        itemStart = cursor;
        break;
      }
    }
    let itemEnd = lines.length;
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (indentOf(lines[cursor]) === itemIndent && /^\s*-\s+/.test(lines[cursor])) {
        itemEnd = cursor;
        break;
      }
    }
    const withBlock = findYamlBlock(
      lines,
      'with',
      propertyIndent,
      itemStart,
      itemEnd,
      `checkout step at line ${index + 1} with`,
      file,
    );
    const persistEntries = directYamlEntries(lines, withBlock)
      .filter((entry) => entry.key === 'persist-credentials');
    check(
      persistEntries.length === 1 && persistEntries[0]?.value === 'false',
      `${file}:${index + 1} checkout step must set persist-credentials: false exactly once`,
    );
  }
}

const publish = readRequired(publishFile);

if (publish) {
  const publishLines = publish.split('\n');
  const onBlock = findYamlBlock(publishLines, 'on', 0, 0, publishLines.length, 'top-level on');
  requireExactKeys(publishLines, onBlock, ['workflow_dispatch'], 'trigger');
  const dispatchBlock = findYamlBlock(publishLines, 'workflow_dispatch', 2, onBlock?.start + 1, onBlock?.end, 'workflow_dispatch');
  requireExactKeys(publishLines, dispatchBlock, ['inputs'], 'workflow_dispatch');
  const inputsBlock = findYamlBlock(publishLines, 'inputs', 4, dispatchBlock?.start + 1, dispatchBlock?.end, 'workflow_dispatch.inputs');
  requireExactKeys(publishLines, inputsBlock, ['source_sha', 'version'], 'workflow inputs');
  for (const inputName of ['version', 'source_sha']) {
    const inputBlock = findYamlBlock(publishLines, inputName, 6, inputsBlock?.start + 1, inputsBlock?.end, `input ${inputName}`);
    check(directYamlValue(publishLines, inputBlock, 'required') === 'true', `${publishFile} ${inputName} must be required`);
    check(directYamlValue(publishLines, inputBlock, 'type') === 'string', `${publishFile} ${inputName} must have type string`);
  }

  const topPermissions = findYamlBlock(publishLines, 'permissions', 0, 0, publishLines.length, 'top-level permissions');
  requireExactKeys(publishLines, topPermissions, ['contents'], 'top-level permissions');
  check(directYamlValue(publishLines, topPermissions, 'contents') === 'read', `${publishFile} top-level contents permission must be read`);

  const concurrency = findYamlBlock(publishLines, 'concurrency', 0, 0, publishLines.length, 'top-level concurrency');
  requireExactKeys(publishLines, concurrency, ['cancel-in-progress', 'group'], 'concurrency');
  check(directYamlValue(publishLines, concurrency, 'group') === 'publish-npm', `${publishFile} concurrency group must be publish-npm`);
  check(directYamlValue(publishLines, concurrency, 'cancel-in-progress') === 'false', `${publishFile} must not cancel an in-progress publish`);

  const jobsBlock = findYamlBlock(publishLines, 'jobs', 0, 0, publishLines.length, 'jobs');
  requireExactKeys(publishLines, jobsBlock, ['prepare', 'publish'], 'jobs');
  const prepareJobBlock = findYamlBlock(publishLines, 'prepare', 2, jobsBlock?.start + 1, jobsBlock?.end, 'prepare job');
  const publishJobBlock = findYamlBlock(publishLines, 'publish', 2, jobsBlock?.start + 1, jobsBlock?.end, 'publish job');
  const preparePermissions = findYamlBlock(publishLines, 'permissions', 4, prepareJobBlock?.start + 1, prepareJobBlock?.end, 'prepare permissions');
  requireExactKeys(publishLines, preparePermissions, ['contents'], 'prepare permissions');
  check(directYamlValue(publishLines, preparePermissions, 'contents') === 'read', `${publishFile} prepare contents permission must be read`);
  check(!directYamlEntries(publishLines, prepareJobBlock).some((entry) => entry.key === 'environment'), `${publishFile} prepare job must not use an environment`);
  const publishPermissions = findYamlBlock(publishLines, 'permissions', 4, publishJobBlock?.start + 1, publishJobBlock?.end, 'publish permissions');
  requireExactKeys(publishLines, publishPermissions, ['contents', 'id-token'], 'publish permissions');
  check(directYamlValue(publishLines, publishPermissions, 'contents') === 'read', `${publishFile} publish contents permission must be read`);
  check(directYamlValue(publishLines, publishPermissions, 'id-token') === 'write', `${publishFile} publish id-token permission must be write`);
  check(directYamlValue(publishLines, publishJobBlock, 'needs') === 'prepare', `${publishFile} publish must need prepare`);
  check(directYamlValue(publishLines, publishJobBlock, 'environment') === 'npm-release', `${publishFile} publish environment must be npm-release`);

  const commands = shellCommands(publishLines);
  const packCommands = commands.filter((command) => (
    !/^(?:#|echo\b|printf\b)/.test(command.text)
    && /\bnpm(?:\s+--[^\s]+)*\s+pack\b/.test(command.text)
  ));
  const dryRuns = packCommands.filter((command) => command.text === 'npm pack --dry-run');
  const realPacks = packCommands.filter((command) => command.text !== 'npm pack --dry-run');
  check(dryRuns.length === 1, `${publishFile} must run exactly one npm pack --dry-run`);
  check(realPacks.length === 1 && realPacks[0]?.text === 'npm pack --json > npm-pack.json', `${publishFile} must run exactly one approved real npm pack --json and no alternate repack`);

  const publishSteps = yamlStepItems(publishLines, publishJobBlock);
  const prepareSteps = yamlStepItems(publishLines, prepareJobBlock);
  const artifactName = 'gooblin-npm-${{ inputs.version }}-${{ inputs.source_sha }}';
  const uploadStep = prepareSteps.find((step) => step.name === 'Upload prepared release artifact');
  const downloadStep = publishSteps.find((step) => step.name === 'Download prepared release artifact');
  check(Boolean(uploadStep) && Boolean(downloadStep), `${publishFile} must upload and download the prepared artifact`);
  if (uploadStep && downloadStep) {
    const uploadWith = findYamlBlock(publishLines, 'with', 8, uploadStep.start + 1, uploadStep.end, 'artifact upload with');
    const downloadWith = findYamlBlock(publishLines, 'with', 8, downloadStep.start + 1, downloadStep.end, 'artifact download with');
    check(directYamlValue(publishLines, uploadWith, 'name') === artifactName, `${publishFile} upload artifact name must bind version and source_sha`);
    check(directYamlValue(publishLines, downloadWith, 'name') === artifactName, `${publishFile} download must use the same artifact name`);
  }

  const artifactSteps = publishSteps.filter((step) => step.name === 'Verify exact prepared artifact');
  const draftSteps = publishSteps.filter((step) => step.name === 'Verify attached draft release assets');
  const finalPublishSteps = publishSteps.filter((step) => step.name === 'Publish exact prepared tarball with OIDC');
  check(artifactSteps.length === 1, `${publishFile} publish job must contain exactly one exact artifact verification step by name`);
  check(draftSteps.length === 1, `${publishFile} publish job must contain exactly one draft release machine gate by name`);
  check(finalPublishSteps.length === 1, `${publishFile} publish job must contain exactly one final publish step by name`);
  const [artifactStep] = artifactSteps;
  const [draftStep] = draftSteps;
  const [finalPublishStep] = finalPublishSteps;
  if (artifactStep && draftStep && finalPublishStep) {
    check(
      publishSteps.indexOf(artifactStep) < publishSteps.indexOf(draftStep)
        && publishSteps.indexOf(draftStep) < publishSteps.indexOf(finalPublishStep)
        && publishSteps.indexOf(finalPublishStep) === publishSteps.length - 1,
      `${publishFile} artifact verification, draft gate, and final publish steps must be unique and ordered last`,
    );
  }
  if (artifactStep) {
    for (const value of [
      "createHash('sha256')",
      "createHash('sha1')",
      "createHash('sha512')",
      ".digest('base64')",
      "requireNonEmpty(metadata, ['package', 'version', 'source_sha', 'tarball', 'sha256', 'integrity', 'shasum']",
      "requireNonEmpty(pack, ['name', 'version', 'filename', 'integrity', 'shasum']",
      'checksumSha256 !== recomputed.sha256',
      'metadata.package !== pack.name',
      'metadata.version !== pack.version',
      'metadata.tarball !== pack.filename',
      'metadata.sha256 !== recomputed.sha256',
      'metadata.shasum !== recomputed.shasum',
      'pack.shasum !== recomputed.shasum',
      'metadata.integrity !== recomputed.integrity',
      'pack.integrity !== recomputed.integrity',
    ]) requireText(artifactStep.text, value, `${publishFile} artifact verification step`);
  }

  if (draftStep) {
    const draftEnv = findYamlBlock(publishLines, 'env', 8, draftStep.start + 1, draftStep.end, 'draft release gate env');
    requireExactKeys(publishLines, draftEnv, ['GH_TOKEN', 'INPUT_SOURCE_SHA', 'INPUT_VERSION', 'TARBALL'], 'draft release gate env');
    check(directYamlValue(publishLines, draftEnv, 'GH_TOKEN') === '${{ github.token }}', `${publishFile} draft gate must use ephemeral github.token`);
    for (const [pattern, description] of [
      [/^\s*gh api "repos\/\$\{GITHUB_REPOSITORY\}\/git\/matching-refs\/tags\/v\$\{INPUT_VERSION\}" > "\$RUNNER_TEMP\/tag-refs\.json"\s*$/m, 'exact read-only matching tag refs query'],
      [/^\s*const expectedTagRef = `refs\/tags\/\$\{expectedTag\}`;\s*$/m, 'exact expected tag ref construction'],
      [/^\s*const exactTagRefs = tagRefs\.filter\(\(tagRef\) => tagRef\.ref === expectedTagRef\);\s*$/m, 'exact tag ref filtering'],
      [/^\s*if \(exactTagRefs\.length !== 0\) \{\s*$/m, 'pre-existing exact tag rejection'],
    ]) {
      requirePattern(draftStep.text, pattern, `${publishFile} draft release machine gate missing ${description}`);
    }
    for (const value of [
      'gh api --paginate',
      'release.tag_name === expectedTag && release.draft === true',
      'matchingDrafts.length !== 1',
      'release.target_commitish !== process.env.INPUT_SOURCE_SHA',
      'JSON.stringify(actualNames) !== JSON.stringify(expectedNames)',
      'asset.digest !== expected.digest',
      'sha256:',
    ]) {
      requireText(draftStep.text, value, `${publishFile} draft release machine gate`);
    }
  }

  for (const [pattern, description] of [
    [/^\s*node-version:\s*['"]?24['"]?\s*$/m, 'Node 24'],
    [/^\s*package-manager-cache:\s*false\s*$/m, 'disabled package-manager cache'],
    [/^\s*registry-url:\s*https:\/\/registry\.npmjs\.org\s*$/m, 'npm registry URL'],
    [/^\s*runs-on:\s*ubuntu-latest\s*$/m, 'GitHub-hosted Ubuntu runner'],
  ]) {
    requirePattern(publish, pattern, `${publishFile} missing ${description}`);
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
    'sha256sum',
    'npm-pack.json',
    'release-metadata.json',
    'npm publish',
  ]) {
    requireText(publish, value, publishFile);
  }

  requireText(publish, 'ref: ${{ github.sha }}', publishFile);
  check(!publish.includes('ref: ${{ inputs.source_sha }}'), `${publishFile} must not check out the unverified source_sha input`);

  requireText(publish, 'sha256sum --check', publishFile);
  requireText(publish, 'release-artifact/${{ needs.prepare.outputs.tarball }}', publishFile);
  requireText(publish, 'npm publish "release-artifact/${{ needs.prepare.outputs.tarball }}"', publishFile);
  check(
    publish.trimEnd().endsWith('run: npm publish "release-artifact/${{ needs.prepare.outputs.tarball }}"'),
    `${publishFile} must end with publishing the prepared tarball`,
  );

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
    'machine gate',
    'GitHub-reported SHA-256',
    'queries matching tag refs and requires no exact `refs/tags/vV` before npm publication',
    'legacy npm `gitHead` is observational only',
    'trusted-publishing provenance',
  ]) {
    requireText(release, value, releaseFile);
  }
}

const planFile = 'docs/superpowers/plans/2026-07-16-p0-trust-recovery.md';
const plan = readRequired(planFile);
if (plan) {
  const task1Start = plan.indexOf('### Task 1:');
  const task2Start = plan.indexOf('### Task 2:');
  const task3Start = plan.indexOf('### Task 3:');
  const normalizedTask1 = plan.slice(task1Start, task2Start).replace(/\\`/g, '`');
  const task2 = plan.slice(task2Start, task3Start);
  const normalizedTask2 = task2.replace(/\\`/g, '`');
  check(task1Start > -1 && task2Start > task1Start && task3Start > task2Start, `${planFile} must contain bounded Task 1, Task 2, and Task 3 sections`);
  for (const value of [
    'concurrency group `publish-npm` with `cancel-in-progress: false`',
    'independently recomputes SHA-256, SHA-1 shasum, and SHA-512 SRI',
    'draft release machine gate',
    'GitHub-reported SHA-256 digests',
    'queries matching tag refs and requires no exact `refs/tags/v<version>` before npm publication',
  ]) {
    requireText(normalizedTask1, value, `${planFile} Task 1`);
  }
  for (const value of [
    'legacy npm `gitHead` is observational only',
    'must not be required for tarball publication',
    'trusted-publishing provenance',
    'workflow identity and source SHA',
    'queries matching tag refs and requires no exact `refs/tags/v<version>` before npm publication',
  ]) {
    requireText(normalizedTask2, value, `${planFile} Task 2`);
  }
  check(!normalizedTask2.includes('npm view gooblin name version dist-tags gitHead'), `${planFile} Task 2 registry gate must not require gitHead`);
  check(!normalizedTask2.includes('npm `gitHead`, integrity'), `${planFile} Task 2 source-linkage gate must not require gitHead`);
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
