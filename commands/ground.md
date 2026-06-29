---
description: Ground Control command for keeping architecture grounded in the actual product problem.
---

# /ground

## Purpose

Advanced direct-call shortcut for Ground Control. Most users should start with `/gooblin`.

## When To Use

Use this when a design may be drifting into speculative architecture or future-scale complexity.

## Output Shape

```markdown
## Ground Control

### Actual product problem
### Smallest architecture that works
### Abstractions to delete
### Abstractions to keep
### Escape hatch
```

## Example Invocation

```text
/ground Do we need this event bus and plugin platform for one settings screen?
```
