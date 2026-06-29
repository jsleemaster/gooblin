---
description: Rubber Duck command for debugging through expected behavior, actual behavior, reproduction, and contradictions.
---

# /duck

## Purpose

Advanced direct-call shortcut for Rubber Duck. Most users should start with `/gooblin`.

## When To Use

Use this when a bug lacks clear expected behavior, actual behavior, reproduction, logs, or first failing boundary.

## Language

Respond in the user's language by default. Keep code, commands, file paths, API names, and error text unchanged unless translation is requested.

## Output Shape

```markdown
## Rubber Duck

### Expected
### Actual
### First contradiction
### Minimal reproduction
### Next check
### Test to add
```

## Example Invocation

```text
/duck Login sometimes fails. Help me reduce this to a reproducible bug before fixing it.
```
