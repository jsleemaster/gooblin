# Hermes Agent Adapter

Use this recipe when Hermes Agent can read local skills, project context, or plugin-like Markdown resources.

## Setup

Until Gooblin ships a dedicated Hermes plugin, use Gooblin as a readable skill pack:

- `AGENTS.md`
- `skills/`
- `commands/`
- `docs/stability.md`
- `docs/claims-policy.md`
- `evals/rubric.md`

If a Hermes workspace supports plugin packaging, keep any wrapper thin and point back to the files above. Do not fork Gooblin behavior into a Hermes-only copy.

For skill-style usage, keep Gooblin skills as Markdown and preserve the `SKILL.md` source files. For plugin-style usage, treat any Hermes wrapper as an adapter around the same source files, not as a separate product.

## Activation Prompt

```text
Use /gooblin for this task. Diagnose the task type first, then route to the smallest useful teammate set.
```

## Status

This is an experimental recipe. Gooblin does not currently ship a verified Hermes plugin, MCP server, scheduler, memory integration, or Hermes-specific tools.

## Reference

- Hermes skills: <https://hermes-agent.nousresearch.com/docs/user-guide/features/skills>
- Hermes plugins: <https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins>
