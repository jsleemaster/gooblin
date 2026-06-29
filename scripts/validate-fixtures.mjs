#!/usr/bin/env node

import fs from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function directoriesIn(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

const metrics = [
  'task_solved',
  'unnecessary_code_avoided',
  'dependency_avoided',
  'abstraction_control',
  'scope_control',
  'debugging_discipline',
  'verification_quality',
  'safety_preserved',
];

const rubric = fs.readFileSync('evals/rubric.md', 'utf8');
for (const metric of metrics) {
  assert(rubric.includes(metric), `evals/rubric.md must include ${metric}`);
}
assert(rubric.includes('Score each metric from 0 to 5'), 'rubric must use 0 to 5 scoring');
assert(rubric.includes('The answer should default to the user\'s language'), 'rubric must include language handling rule');

const benchmarking = fs.readFileSync('docs/benchmarking.md', 'utf8');
for (const phrase of [
  'Baseline: same coding agent without Gooblin.',
  'Treatment: same coding agent with Gooblin.',
  'Prefer CLI transcripts for Gooblin evaluations.',
  'placeholder values, not real results',
]) {
  assert(benchmarking.includes(phrase), `docs/benchmarking.md missing: ${phrase}`);
}

const fixtureIndex = fs.readFileSync('evals/fixtures/README.md', 'utf8');
for (const fixture of directoriesIn('evals/fixtures')) {
  const prompt = `evals/fixtures/${fixture}/prompt.md`;
  const expected = `evals/fixtures/${fixture}/expected.md`;
  assert(fs.existsSync(prompt), `${prompt} must exist`);
  assert(fs.existsSync(expected), `${expected} must exist`);
  assert(fixtureIndex.includes(`(${fixture}/)`), `evals/fixtures/README.md must link ${fixture}/`);
  const expectedText = fs.readFileSync(expected, 'utf8');
  for (const heading of ['## Good Gooblin-Shaped Answer', '## Common Baseline Failure Modes', '## Scoring Notes']) {
    assert(expectedText.includes(heading), `${expected} missing ${heading}`);
  }
}

const runFiles = fs.readdirSync('evals/runs').filter((name) => name !== '.gitkeep');
assert(runFiles.length === 0, 'evals/runs must not contain committed measured outputs');

console.log('validate:fixtures ok');
