#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function runHook(file, env = {}) {
  return spawnSync(process.execPath, [file], {
    encoding: 'utf8',
    env: {
      ...process.env,
      GOOBLIN_DISABLE: '',
      GOOBLIN_HOOK_MODE: '',
      ...env,
    },
  });
}

function expectSilent(file, env) {
  const result = runHook(file, env);
  assert(result.status === 0, `${file} should exit 0 for ${JSON.stringify(env)}`);
  assert(result.stdout === '', `${file} should not print stdout for ${JSON.stringify(env)}`);
  assert(result.stderr === '', `${file} should not print stderr for ${JSON.stringify(env)}`);
}

const hooks = [
  'hooks/gooblin-activate.js',
  'hooks/gooblin-mode-tracker.js',
];

for (const hook of hooks) {
  const brief = runHook(hook);
  assert(brief.status === 0, `${hook} default mode should exit 0`);
  assert(brief.stdout.includes('Gooblin'), `${hook} default mode should mention Gooblin`);
  assert(brief.stderr === '', `${hook} default mode should not write stderr`);

  const verbose = runHook(hook, { GOOBLIN_HOOK_MODE: 'verbose' });
  assert(verbose.status === 0, `${hook} verbose mode should exit 0`);
  assert(verbose.stdout.includes('Gooblin'), `${hook} verbose mode should mention Gooblin`);
  assert(verbose.stderr === '', `${hook} verbose mode should not write stderr`);

  for (const mode of ['quiet', 'off', 'disabled']) {
    expectSilent(hook, { GOOBLIN_HOOK_MODE: mode });
  }

  expectSilent(hook, { GOOBLIN_DISABLE: '1' });
}

console.log('validate:hooks ok');
