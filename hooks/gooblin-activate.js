#!/usr/bin/env node
'use strict';

try {
  if (process.env.GOOBLIN_DISABLE === '1') {
    process.exit(0);
  }

  const message = [
    'Gooblin mode available:',
    '- Use skills/gooblin/SKILL.md for full council review.',
    '- Use commands/gooblin.md or commands/shipcheck.md for review prompts.',
    '- Rules: spec first, smallest safe change, reproduce before fixing, defer optional scope, verify.'
  ].join('\n');

  process.stdout.write(message + '\n');
} catch (_) {
  process.exit(0);
}
