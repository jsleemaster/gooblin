---
description: Final pre-ship review command using all four Gooblin perspectives.
---

# /shipcheck

## Purpose

Run a final pre-ship checklist using all four Gooblin perspectives.

## When To Use

Use this before finalizing a patch, PR, implementation plan, or release candidate.

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
