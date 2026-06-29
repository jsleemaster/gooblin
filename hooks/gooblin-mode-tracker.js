#!/usr/bin/env node
'use strict';

try {
  const mode = (process.env.GOOBLIN_HOOK_MODE || 'brief').toLowerCase();

  if (process.env.GOOBLIN_DISABLE === '1' || mode === 'off' || mode === 'disabled' || mode === 'quiet') {
    process.exit(0);
  }

  const lines = [
    'Gooblin reminder:',
    'Safety beats minimalism. User goal beats clever architecture. Reproduction beats guessing. Shipping beats optional polish. Verification beats confidence.'
  ];

  if (mode === 'verbose') {
    lines.push('Start with /gooblin unless you already know the direct shortcut: /clip, /ground, /duck, /yak, or /shipcheck.');
  }

  process.stdout.write(lines.join('\n') + '\n');
} catch (_) {
  process.exit(0);
}
