#!/usr/bin/env node

import fs from 'node:fs';

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
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

console.log('validate:npx-installer ok');
