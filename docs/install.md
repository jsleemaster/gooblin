# Install

Gooblin is designed to be installed like a plugin-style Agent Skills pack.

Install commands vary by agent. The examples below describe the intended distribution model for compatible agents and should be verified against the current installer for each environment.

Plugin support may vary by agent. If plugin installation is not available, Gooblin still works as a readable skill pack. Hooks are optional and only used for activation/context injection.

## Plugin Installation

Use this path for agents that support plugin marketplaces, plugin manifests, or repository-based skill pack installation.

### Claude Code

```bash
/plugin marketplace add jsleemaster/gooblin
/plugin install gooblin@gooblin
```

### Codex

```bash
codex plugin marketplace add jsleemaster/gooblin
codex plugin add gooblin@gooblin
codex
```

You can also open `/plugins`, select the Gooblin marketplace, install Gooblin, review hooks if prompted, and start a new thread.

The repository includes:

- `.codex-plugin/plugin.json`
- `.agents/plugins/marketplace.json`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `plugin.yaml`
- `plugins/gooblin`
- `skills/`
- `commands/`
- `hooks/`

## npx Skill-Pack Installer

Use this path when a host does not support plugin installation but can run npm packages.

```bash
npx gooblin install
```

Current status:

| Path | Status |
| --- | --- |
| `npx gooblin install` | Registry behavior depends on the resolved version. Version 1.3.1 can delete consumer-owned files through `install --force` and `uninstall`; version 1.3.2 and newer refuse those operations. |
| `npx github:jsleemaster/gooblin install` | Repository-source version 1.3.2 containing the temporary destructive-operation refusal guard. |

The installer copies a readable skill pack into `.gooblin/` in the current working directory. It copies:

- `AGENTS.md`
- `README.md`
- `skills/`
- `commands/`
- `docs/`
- `adapters/`

It does not enable hooks, edit host settings, access the network, collect telemetry, or mutate files outside `.gooblin/`.

Useful commands:

```bash
npx gooblin install --dry-run
npx gooblin install --target /path/to/project
npx gooblin status
npx gooblin uninstall
```

Temporary safety guard: version 1.3.2 and newer refuse `install --force` and `uninstall` because the current marker cannot distinguish installed files from consumer-owned additions or edits. Version 1.3.1 predates this guard. Run `npx --yes gooblin --version` and do not use those lifecycle commands unless the resolved registry version is 1.3.2 or newer. Ownership-aware lifecycle support remains tracked in [#49](https://github.com/jsleemaster/gooblin/issues/49).

Repository-source fallback:

```bash
npx github:jsleemaster/gooblin install
```

## Verified Local Installer Path

The latest plugin installer verification remains:

- Claude Code `2.1.96`.
- Codex CLI `0.141.0`.

See [compatibility notes](compatibility.md) and [verified install paths](verified-install-paths.md) for the exact commands and results.

For status checks, configuration, uninstall steps, and statusline recipes, see [operations](operations.md).

## Manual Installation

For agents without plugin installation, clone the repo and point the agent at the docs:

```bash
git clone https://github.com/jsleemaster/gooblin.git
```

Copy or reference:

- `AGENTS.md`
- `skills/`
- `commands/`

Then ask your coding agent:

```text
Use /gooblin for this task. Diagnose the task type first, then route to the smallest useful teammate set.
```

For Cursor-style rule import, use `.cursor/rules/gooblin.mdc`.

## Activate `/gooblin`

Use `/gooblin` as the primary interface. It diagnoses the task first, then routes to the smallest useful teammate set.

```text
/gooblin Review this plan and find the smallest safe shippable path.
```

Expected shape:

```markdown
## Gooblin Router

Route:
Why:

## Selected teammate or Shipcheck

## Verdict

Do this:
Do not do this:
Verify with:
```

If the agent does not support slash commands, paste the equivalent request:

```text
Use /gooblin for this task. Diagnose the task type first, then route to the smallest useful teammate set.
```

## Use Individual Skills

Use focused skills as advanced direct-call shortcuts when you already know which teammate you need:

- `/clip`: cut unnecessary code, dependencies, rewrites, and abstractions.
- `/ground`: keep architecture grounded in the actual product problem.
- `/duck`: reproduce bugs and find the first contradiction.
- `/yak`: cut optional scope and identify the next practical move.
- `/shipcheck`: run final pre-ship review across all four perspectives.

If slash commands are unavailable, reference the matching `skills/*/SKILL.md` file directly.

## Disable Hooks

Hooks are optional and only used for activation/context injection. They are tiny reminder scripts and should not mutate files, access the network, or collect telemetry.

To disable Gooblin hooks when the host agent passes environment variables through to hook scripts:

```bash
GOOBLIN_DISABLE=1
```

You can also choose a hook mode:

```bash
GOOBLIN_HOOK_MODE=quiet
GOOBLIN_HOOK_MODE=brief
GOOBLIN_HOOK_MODE=verbose
GOOBLIN_HOOK_MODE=off
```

`brief` is the default. `quiet` and `off` produce no output. `verbose` adds extra safety-floor reminders.

If your agent asks whether to trust hooks, you can decline and still use Gooblin manually through `AGENTS.md`, `skills/`, and `commands/`.

## Troubleshooting

### Node not found

Hooks and the optional npx installer use dependency-free Node.js scripts. If Node is unavailable, disable hooks and use manual mode. The skills remain readable Markdown.

### Plugin command unavailable

Your agent may not support plugin installation yet, or the command may differ. Use the npx skill-pack installer or manual installation and reference `AGENTS.md`, `skills/`, and `commands/`.

### npx package not found

If npm registry resolution is unavailable, use the GitHub-source fallback:

```bash
npx github:jsleemaster/gooblin install
```

### Hooks not trusted

Decline hook execution if you are unsure. Gooblin hooks are optional; they only remind the agent about Gooblin mode and point to bundled skills/commands.

### Agent does not support plugins

Use the npx skill-pack installer or the manual fallback path. Gooblin is designed to stay useful even when no plugin system is available.

## Safety Summary

Gooblin hooks are reminder-only. They do not access the network, collect telemetry, run dangerous commands, or mutate user files automatically.

The npx installer is also local-only. A fresh install writes only `.gooblin/` in the target project unless you explicitly choose another target path. Version 1.3.2 and newer refuse automatic replacement and removal while file ownership cannot be verified; version 1.3.1 does not include that protection.
