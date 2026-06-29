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
| [Codex](codex.md) | Verified plugin path | Use Gooblin through Codex plugin marketplace commands. |
| [Claude Code](claude-code.md) | Verified plugin path | Use Gooblin through Claude Code plugin marketplace commands. |
| [Gemini CLI](gemini.md) | Manual recipe | Use Gemini context files to reference Gooblin without copying skill bodies. |
| [OpenCode](opencode.md) | Manual recipe | Use OpenCode `AGENTS.md` rules or config instructions. |
| [Devin](devin.md) | Manual recipe | Use Devin's `AGENTS.md` support and a `/gooblin` activation prompt. |
| [Hermes Agent](hermes.md) | Experimental recipe | Use Gooblin as a readable skill pack until a dedicated Hermes plugin exists. |
| [Generic agent](generic-agent.md) | Manual fallback | Reference Gooblin files in any coding agent that accepts repo instructions. |
| [Cursor](cursor.md) | Rule recipe | Use the bundled `.cursor/rules/gooblin.mdc` fallback rule. |
| [Continue-style context](continue.md) | Manual recipe | Add Gooblin docs as readable context without pretending there is a verified plugin path. |

Verified means a command path is recorded in `docs/compatibility.md` and `docs/verified-install-paths.md`. Manual and experimental recipes are adapter notes, not official host support claims.
