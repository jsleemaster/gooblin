# Claude Code Adapter

Use this path when Claude Code plugin marketplace commands are available.

## Setup

```bash
/plugin marketplace add jsleemaster/gooblin
/plugin install gooblin@gooblin
```

You may need to send those as two separate prompts.

## What It Uses

- `.claude-plugin/marketplace.json`
- `.claude-plugin/plugin.json`
- `AGENTS.md`
- `skills/`
- `commands/`
- `hooks/`

## Activation

Start with `/gooblin`. Direct commands like `/clip`, `/ground`, `/duck`, `/yak`, and `/shipcheck` are advanced shortcuts.

## Status

This install path is verified when the exact version and command result are recorded in `docs/compatibility.md` and `docs/verified-install-paths.md`.
