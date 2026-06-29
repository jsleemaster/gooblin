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

## Verified Local Installer Path

The v0.2.0 release verified local install behavior with:

- Claude Code `2.1.96`.
- Codex CLI `0.141.0`.

See [compatibility notes](compatibility.md) for the exact commands and results.

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
Use Gooblin council mode for this task.
```

For Cursor-style rule import, use `.cursor/rules/gooblin.mdc`.

## Activate `/gooblin`

Use `/gooblin` when you want all four teammates to review the task together.

```text
/gooblin Review this plan and find the smallest safe shippable path.
```

Expected shape:

```markdown
## Gooblin Council

### The Clipper
### Ground Control
### Rubber Duck
### Yak Shaver

## Verdict

Do this:
Do not do this:
Verify with:
```

If the agent does not support slash commands, paste the equivalent request:

```text
Use Gooblin council mode for this task.
```

## Use Individual Skills

Use focused skills when you do not need full council mode:

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

If your agent asks whether to trust hooks, you can decline and still use Gooblin manually through `AGENTS.md`, `skills/`, and `commands/`.

## Troubleshooting

### Node not found

Hooks use tiny dependency-free Node.js scripts. If Node is unavailable, disable hooks and use manual mode. The skills remain readable Markdown.

### Plugin command unavailable

Your agent may not support plugin installation yet, or the command may differ. Use manual installation and reference `AGENTS.md`, `skills/`, and `commands/`.

### Hooks not trusted

Decline hook execution if you are unsure. Gooblin hooks are optional; they only remind the agent about Gooblin mode and point to bundled skills/commands.

### Agent does not support plugins

Use the manual fallback path. Gooblin is designed to stay useful even when no plugin system is available.

## Safety Summary

Gooblin hooks are reminder-only. They do not access the network, collect telemetry, run dangerous commands, or mutate user files automatically.
