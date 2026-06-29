#!/usr/bin/env node

import fs from 'node:fs';

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const pkg = readJson('package.json');
const claudePlugin = readJson('.claude-plugin/plugin.json');
const codexPlugin = readJson('.codex-plugin/plugin.json');
const hooks = readJson('hooks/claude-codex-hooks.json');
const codexMarketplace = readJson('.agents/plugins/marketplace.json');
const claudeMarketplace = readJson('.claude-plugin/marketplace.json');
const pluginYaml = fs.readFileSync('plugin.yaml', 'utf8');
const readme = fs.readFileSync('README.md', 'utf8');

assert(pkg.name === 'gooblin', 'package name must be gooblin');
assert(pkg.license === 'MIT', 'package license must be MIT');
assert(!pkg.dependencies, 'package must not declare runtime dependencies');
assert(!pkg.devDependencies, 'package must not declare dev dependencies');
assert(!pkg.optionalDependencies, 'package must not declare optional dependencies');
assert(!pkg.peerDependencies, 'package must not declare peer dependencies');
assert(pkg.files.includes('scripts/'), 'package files must include scripts/');

for (const [name, value] of [
  ['.claude-plugin/plugin.json', claudePlugin.version],
  ['.codex-plugin/plugin.json', codexPlugin.version],
  ['hooks/claude-codex-hooks.json', hooks.version],
]) {
  assert(value === pkg.version, `${name} version must match package.json`);
}

assert(pluginYaml.includes(`version: ${pkg.version}`), 'plugin.yaml version must match package.json');
assert(readme.includes(`version-${pkg.version}`), 'README badge version must match package.json');

assert(codexMarketplace.plugins?.[0]?.source?.path === './plugins/gooblin', 'Codex marketplace must point at ./plugins/gooblin');
assert(claudeMarketplace.plugins?.[0]?.source === './plugins/gooblin', 'Claude marketplace must point at ./plugins/gooblin');

for (const path of [
  'plugins/gooblin/AGENTS.md',
  'plugins/gooblin/skills',
  'plugins/gooblin/commands',
  'plugins/gooblin/docs',
  'plugins/gooblin/hooks',
  'plugins/gooblin/.codex-plugin',
  'plugins/gooblin/.claude-plugin',
]) {
  assert(fs.existsSync(path), `${path} must exist in plugin adapter`);
  assert(fs.lstatSync(path).isSymbolicLink(), `${path} must be a symlink to the root skill pack`);
}

console.log('validate:manifests ok');
