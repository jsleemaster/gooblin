# Adapters

Adapters are small recipes for hosts that do not use the same plugin manifest shape.

They are not separate Gooblin products. They should stay readable, optional, and easy to delete.

## Rules

- Keep the source of truth in `AGENTS.md`, `skills/`, `commands/`, and `docs/`.
- Do not fork skill behavior into adapter-specific copies.
- Do not claim official host support unless that host install path has been verified.
- Prefer references, symlinks, or copy instructions over generated code.
- Keep hooks optional and safe by default.

## Current Adapters

| Adapter | Status | Purpose |
| --- | --- | --- |
| [Generic agent](generic-agent.md) | Manual fallback | Reference Gooblin files in any coding agent that accepts repo instructions. |
| [Cursor](cursor.md) | Rule recipe | Use the bundled `.cursor/rules/gooblin.mdc` fallback rule. |
| [Continue-style context](continue.md) | Manual recipe | Add Gooblin docs as readable context without pretending there is a verified plugin path. |
