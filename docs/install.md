# Install

Gooblin is designed to be installed like a plugin-style Agent Skills pack.

Install commands vary by agent. The examples below describe the intended distribution model for compatible agents and should be verified against the current installer for each environment.

## Plugin Install Path

Use this path for agents that support plugin marketplaces, plugin manifests, or repository-based skill pack installation.

### Claude Code

```bash
/plugin marketplace add jsleemaster/gooblin
/plugin install gooblin@gooblin
```

### Codex-style plugin agents

Use the repository URL with a compatible plugin installer:

```text
https://github.com/jsleemaster/gooblin
```

The repository includes:

- `.codex-plugin/plugin.json`
- `.claude-plugin/plugin.json`
- `plugin.yaml`
- `skills/`
- `commands/`
- `hooks/`

## Manual Fallback Path

For agents without plugin installation, clone the repo and point the agent at the docs:

```bash
git clone https://github.com/jsleemaster/gooblin.git
```

Use:

- `AGENTS.md` for general rules.
- `skills/gooblin/SKILL.md` for council mode.
- `commands/` for command-style prompts.
- `.cursor/rules/gooblin.mdc` for Cursor-style rule import.

## Safety

Gooblin hooks are reminder-only. They do not access the network, collect telemetry, run dangerous commands, or mutate user files automatically.
