# Operations

Gooblin should stay boring to operate.

This repo does not ship a daemon, background service, telemetry collector, or runtime config system. Operations are simple checks and reversible install/remove steps for hosts that support plugins or the optional npx skill-pack copy.

## Status Checks

Codex:

```bash
codex plugin list
```

Expected shape when installed:

```text
gooblin@gooblin  installed, enabled  1.3.2
```

Claude Code:

```bash
claude plugin list
```

Expected shape when installed:

```text
gooblin@gooblin
Version: 1.3.2
Status: enabled
```

npx skill-pack copy:

```bash
npx gooblin status
```

Global package metadata:

```bash
npm list -g gooblin --depth=0
```

## Configuration

Gooblin does not require a config file.

Available hook environment variables:

| Variable | Effect |
| --- | --- |
| `GOOBLIN_HOOK_MODE=brief` | Default reminder output. |
| `GOOBLIN_HOOK_MODE=quiet` | No reminder output. |
| `GOOBLIN_HOOK_MODE=verbose` | Extra safety-floor reminders. |
| `GOOBLIN_HOOK_MODE=off` | Disable hook reminders. |
| `GOOBLIN_DISABLE=1` | Disable Gooblin hook reminders. |

Language behavior is controlled by the skill instructions: Gooblin should answer in the user's language by default while preserving code, commands, paths, API names, and error text.

## Disable Hooks

Hooks are optional. If a host asks whether to trust hooks, you can decline and still use Gooblin manually through `AGENTS.md`, `skills/`, and `commands/`.

For environments that pass variables to hooks:

```bash
GOOBLIN_DISABLE=1
```

or:

```bash
GOOBLIN_HOOK_MODE=off
```

## Uninstall

Codex:

```bash
codex plugin remove gooblin@gooblin
codex plugin marketplace remove gooblin
```

Claude Code:

```bash
claude plugin uninstall gooblin
claude plugin marketplace remove gooblin
```

npx skill-pack copy:

```bash
npx gooblin uninstall
```

The 1.3.2 source release candidate refuses automatic removal and leaves `.gooblin/` unchanged. Published npm 1.3.1 predates this guard and can recursively delete the directory, so do **not** run the 1.3.1 registry-package uninstall command. Back up the directory, inspect consumer-added or modified files, and remove only files you have confirmed are disposable. Publishing and verifying 1.3.2 is tracked in [#57](https://github.com/jsleemaster/gooblin/issues/57); ownership-aware uninstall is tracked in [#49](https://github.com/jsleemaster/gooblin/issues/49).

Global package metadata:

```bash
npm uninstall -g gooblin
```

Manual installation:

- Remove copied Gooblin files from the target project.
- Remove any references to `AGENTS.md`, `skills/`, and `commands/` that you added manually.
- Remove the local clone if it is no longer needed.

## Statusline Recipe

Gooblin does not automatically write host statusline settings.

If a host supports a statusline and you want a small reminder, use static text like:

```text
Gooblin: /gooblin primary | hooks: brief | no telemetry
```

Do not make statusline setup automatic in this repo unless it is explicitly opt-in, reversible, and documented with an uninstall path.

## Recovery

If plugin installation breaks, remove the plugin and marketplace entry, then use the manual fallback:

```text
Use /gooblin for this task. Diagnose the task type first, then route to the smallest useful teammate set.
```

If an npx copy breaks, first back up `.gooblin/`, then inspect it for consumer-added or modified files. The repository-source 1.3.2 `uninstall` command intentionally refuses automatic deletion. Published npm 1.3.1 does not contain that refusal, so do not use its uninstall path; remove files manually only after confirming they are disposable.

If a host-specific statusline setting breaks, remove that host setting. Gooblin does not currently create statusline files or mutate host settings automatically.

## Claims

Status, config, uninstall, and statusline recipes are operational guidance. They are not official host support claims and do not imply marketplace approval.
