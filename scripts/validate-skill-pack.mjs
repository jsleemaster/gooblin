#!/usr/bin/env node

import fs from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const expectedSkills = new Map([
  ['skills/_core/SKILL.md', 'gooblin-core'],
  ['skills/clipper/SKILL.md', 'clipper'],
  ['skills/ground-control/SKILL.md', 'ground-control'],
  ['skills/rubber-duck/SKILL.md', 'rubber-duck'],
  ['skills/yak-shaver/SKILL.md', 'yak-shaver'],
  ['skills/gooblin/SKILL.md', 'gooblin'],
]);

for (const [file, expectedName] of expectedSkills) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert(match, `${file} must have YAML frontmatter`);
  const lines = match[1].trim().split('\n').map((line) => line.trim());
  const keys = lines.map((line) => line.split(':')[0]);
  assert(keys.length === 2 && keys[0] === 'name' && keys[1] === 'description', `${file} frontmatter must contain only name and description`);
  const actualName = lines[0].replace(/^name:\s*/, '').replace(/^['"]|['"]$/g, '');
  assert(actualName === expectedName, `${file} name must be ${expectedName}`);
}

for (const command of ['gooblin', 'clip', 'ground', 'duck', 'yak', 'shipcheck']) {
  const file = `commands/${command}.md`;
  assert(fs.existsSync(file), `${file} must exist`);
  const text = fs.readFileSync(file, 'utf8');
  assert(text.includes(`# /${command}`), `${file} must document /${command}`);
}

const cursorRule = fs.readFileSync('.cursor/rules/gooblin.mdc', 'utf8');
for (const phrase of [
  'Treat `/gooblin` as the primary interface.',
  'Do not invent benchmarks',
  'Always include verification',
]) {
  assert(cursorRule.includes(phrase), `.cursor/rules/gooblin.mdc missing: ${phrase}`);
}

const shipcheck = fs.readFileSync('commands/shipcheck.md', 'utf8');
for (const phrase of ['Working tree review', 'Branch review', 'Release review', 'numbered findings']) {
  assert(shipcheck.includes(phrase), `commands/shipcheck.md missing: ${phrase}`);
}

const adaptersIndex = fs.readFileSync('adapters/README.md', 'utf8');
for (const adapter of ['codex', 'claude-code', 'gemini', 'opencode', 'devin', 'hermes', 'generic-agent', 'cursor', 'continue']) {
  assert(fs.existsSync(`adapters/${adapter}.md`), `adapters/${adapter}.md must exist`);
  assert(adaptersIndex.includes(`(${adapter}.md)`), `adapters/README.md must link ${adapter}.md`);
}

console.log('validate:skill-pack ok');
