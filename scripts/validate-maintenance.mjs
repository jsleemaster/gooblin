#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function filesIn(dir, suffix) {
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(suffix))
    .sort();
}

function directoriesIn(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

const pkg = JSON.parse(read('package.json'));
const readme = read('README.md');
const maintenance = read('docs/maintenance.md');
const prTemplate = read('.github/pull_request_template.md');
const adaptersIndex = read('adapters/README.md');

for (const phrase of [
  'Change Impact Matrix',
  'Skill behavior or skill wording',
  'Command docs or slash command wording',
  'Adapter or host recipe',
  'Release or version bump',
  'Evaluation or benchmark guidance',
  'Public claim, compatibility claim, or benchmark claim',
]) {
  assert(maintenance.includes(phrase), `docs/maintenance.md missing: ${phrase}`);
}

for (const phrase of [
  'Change Type',
  'Impact Check',
  'docs/maintenance.md',
  'npm run validate',
  'git diff --check',
]) {
  assert(prTemplate.includes(phrase), `.github/pull_request_template.md missing: ${phrase}`);
}

assert(fs.existsSync(`docs/releases/v${pkg.version}.md`), `docs/releases/v${pkg.version}.md must exist for package version`);
assert(readme.includes('docs/maintenance.md'), 'README.md Development section must link docs/maintenance.md');

const commandNames = filesIn('commands', '.md').map((file) => path.basename(file, '.md'));
for (const command of commandNames) {
  const commandPath = `commands/${command}.md`;
  assert(read(commandPath).includes(`# /${command}`), `${commandPath} must document /${command}`);
  assert(readme.includes(`| \`/${command}\``), `README.md command table must include /${command}`);
}

const adapterFiles = filesIn('adapters', '.md')
  .filter((file) => file !== 'README.md')
  .map((file) => path.basename(file, '.md'));

const adapterReadmeLabels = new Map([
  ['claude-code', 'Claude Code'],
  ['codex', 'Codex'],
  ['continue', 'Continue-style context'],
  ['cursor', 'Cursor'],
  ['devin', 'Devin'],
  ['gemini', 'Gemini CLI'],
  ['generic-agent', 'generic agents'],
  ['hermes', 'Hermes Agent'],
  ['opencode', 'OpenCode'],
]);

for (const adapter of adapterFiles) {
  assert(adaptersIndex.includes(`(${adapter}.md)`), `adapters/README.md must link ${adapter}.md`);
  const label = adapterReadmeLabels.get(adapter);
  assert(label, `scripts/validate-maintenance.mjs needs a README label for adapter ${adapter}`);
  assert(readme.includes(label), `README.md must mention adapter label: ${label}`);
}

for (const example of directoriesIn('examples')) {
  assert(fs.existsSync(`examples/${example}/prompt.md`), `examples/${example}/prompt.md must exist`);
  assert(fs.existsSync(`examples/${example}/expected-output.md`), `examples/${example}/expected-output.md must exist`);
  assert(readme.includes(`examples/${example}/`), `README.md Examples table must link examples/${example}/`);
}

console.log('validate:maintenance ok');
