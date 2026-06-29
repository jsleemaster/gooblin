#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

const roots = ['README.md', 'AGENTS.md', 'docs', 'adapters', 'skills', 'commands', 'evals', '.codex-plugin', '.claude-plugin', '.agents'];
const files = roots.flatMap((root) => {
  if (!fs.existsSync(root)) return [];
  return fs.statSync(root).isDirectory() ? walk(root) : [root];
}).filter((file) => /\.(md|json|yaml|yml|mdc)$/.test(file));

const forbidden = [
  /\b\d+%\s+(faster|safer|cheaper|smaller|better)\b/i,
  /\b\d+x\s+(faster|safer|cheaper|better)\b/i,
  /\bmarketplace approved\b/i,
  /\bofficially supported\b/i,
  /\bproven (faster|safer|cheaper|better)\b/i,
  /\bguaranteed (safe|safer|secure|faster|cheaper)\b/i,
];

const failures = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (const [index, line] of lines.entries()) {
    const allowedNegation = /\b(do not|does not|not |no |without|unless)\b/i.test(line);
    for (const pattern of forbidden) {
      if (pattern.test(line) && !allowedNegation) {
        failures.push(`${file}:${index + 1}: ${pattern}`);
      }
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('validate:claims ok');
