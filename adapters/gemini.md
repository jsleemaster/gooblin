# Gemini CLI Adapter

Use this recipe when Gemini CLI is available and reads `GEMINI.md` context files.

## Setup

Add Gooblin's core files to the Gemini session context:

- `AGENTS.md`
- `skills/gooblin/SKILL.md`
- `skills/_core/SKILL.md`
- `skills/_core/safety-floor.md`
- `commands/gooblin.md`
- `commands/shipcheck.md`

If you use a `GEMINI.md` file, keep it short and point to the files above instead of copying full skill bodies.

Suggested `GEMINI.md` pointer:

```markdown
# Gooblin

Use `AGENTS.md`, `skills/gooblin/SKILL.md`, and `commands/gooblin.md` as the Gooblin skill-pack source of truth. Start with `/gooblin` unless a direct command is explicitly requested.
```

## Activation Prompt

```text
Use /gooblin for this task. Diagnose the task type first, then route to the smallest useful teammate set. Answer in my language and preserve code, commands, paths, API names, and error text.
```

## Status

This is a manual context recipe. It is not a verified Gemini extension or official Gemini support claim.

## Reference

- Gemini CLI context files: <https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html>
