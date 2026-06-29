---
description: Final pre-ship review command using all four Gooblin perspectives.
---

# /shipcheck

## Purpose

Advanced direct-call shortcut for final pre-ship review. `/gooblin` routes here automatically for pre-merge, pre-release, or final review tasks.

## When To Use

Use this before finalizing a patch, PR, implementation plan, or release candidate.

## Language

Respond in the user's language by default. Keep code, commands, file paths, API names, and error text unchanged unless translation is requested.

## Output Shape

```markdown
## Shipcheck

### Cut unnecessary work
### Ground the architecture
### Reproduce or bound bugs
### Defer optional scope
### Safety floor
### Verification
### Verdict
```

## Example Invocation

```text
/shipcheck Review this diff before I ship it. Focus on unnecessary code, speculative architecture, debugging gaps, optional scope, and verification.
```
