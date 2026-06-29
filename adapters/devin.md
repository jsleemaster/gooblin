# Devin Adapter

Use this recipe when Devin reads repository instructions from `AGENTS.md`.

## Setup

Gooblin already ships `AGENTS.md` at the repository root. Ask Devin to include these paths when the task needs Gooblin behavior:

- `AGENTS.md`
- `skills/gooblin/SKILL.md`
- `skills/_core/SKILL.md`
- `commands/gooblin.md`
- `commands/shipcheck.md`
- `evals/rubric.md`

## Activation Prompt

```text
Use /gooblin for this task. Diagnose the task type first, then route to the smallest useful teammate set. Keep the change small, safe, reproduced, scoped, and verified.
```

## Status

This is a manual repository-instructions recipe. It is not a verified Devin integration or official Devin support claim.

## Reference

- Devin `AGENTS.md`: <https://docs.devin.ai/onboard-devin/agents-md>
