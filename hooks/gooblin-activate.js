#!/usr/bin/env node
'use strict';

try {
  const mode = (process.env.GOOBLIN_HOOK_MODE || 'brief').toLowerCase();

  if (process.env.GOOBLIN_DISABLE === '1' || mode === 'off' || mode === 'disabled' || mode === 'quiet') {
    process.exit(0);
  }

  const lines = [
    'Gooblin mode available:',
    '- Use skills/gooblin/SKILL.md for full council review.',
    '- Use commands/gooblin.md or commands/shipcheck.md for review prompts.',
    '- Rules: spec first, smallest safe change, reproduce before fixing, defer optional scope, verify.'
  ];

  if (mode === 'verbose') {
    lines.push(
      '- Safety floor: do not cut auth, validation, secrets, data-loss protection, rollback paths, accessibility basics, or user-stated constraints.',
      '- Manual fallback: AGENTS.md, skills/, and commands/ remain enough without plugin support.'
    );
  }

  process.stdout.write(lines.join('\n') + '\n');
} catch (_) {
  process.exit(0);
}
