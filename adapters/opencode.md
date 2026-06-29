# OpenCode Adapter

Use this recipe when OpenCode reads project rules from `AGENTS.md` or configured instruction files.

## Setup

Gooblin already ships `AGENTS.md`, which is the preferred project-level instruction entrypoint.

For explicit instruction configuration, point OpenCode at:

- `AGENTS.md`
- `skills/gooblin/SKILL.md`
- `commands/gooblin.md`
- `commands/shipcheck.md`

Do not duplicate full Gooblin skills into OpenCode-specific files unless the host cannot read the repository files directly.

## Activation Prompt

```text
Use /gooblin for this task. Diagnose the task type first, then route to the smallest useful teammate set.
```

## Status

This is a manual recipe. It is not a verified OpenCode plugin or official OpenCode support claim.

## Reference

- OpenCode rules and `AGENTS.md`: <https://opencode.ai/docs/rules/>
