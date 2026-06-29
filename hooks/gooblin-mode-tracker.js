#!/usr/bin/env node
'use strict';

try {
  if (process.env.GOOBLIN_DISABLE === '1') {
    process.exit(0);
  }

  const reminder = [
    'Gooblin reminder:',
    'Safety beats minimalism. User goal beats clever architecture. Reproduction beats guessing. Shipping beats optional polish. Verification beats confidence.'
  ].join('\n');

  process.stdout.write(reminder + '\n');
} catch (_) {
  process.exit(0);
}
