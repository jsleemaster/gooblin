#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const scripts = [
  'scripts/validate-manifests.mjs',
  'scripts/validate-skill-pack.mjs',
  'scripts/validate-fixtures.mjs',
  'scripts/validate-maintenance.mjs',
  'scripts/validate-claims.mjs',
];

for (const script of scripts) {
  const result = spawnSync(process.execPath, [script], { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log('validate ok');
