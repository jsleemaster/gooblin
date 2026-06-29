# Codex Adapter

Use this path when Codex plugin marketplace commands are available.

## Setup

```bash
codex plugin marketplace add jsleemaster/gooblin
codex plugin add gooblin@gooblin
codex
```

You can also open `/plugins`, select the Gooblin marketplace, install Gooblin, review hooks if prompted, and start a new thread.

## What It Uses

- `.agents/plugins/marketplace.json`
- `.codex-plugin/plugin.json`
- `plugins/gooblin/`
- `AGENTS.md`
- `skills/`
- `commands/`

## Activation

Start with `/gooblin`. Direct commands like `/clip`, `/ground`, `/duck`, `/yak`, and `/shipcheck` are advanced shortcuts.

## Status

This install path is verified when the exact version and command result are recorded in `docs/compatibility.md` and `docs/verified-install-paths.md`.
