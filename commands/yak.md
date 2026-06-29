---
description: Yak Shaver command for cutting optional scope and identifying the next shippable move.
---

# /yak

## Purpose

Advanced direct-call shortcut for Yak Shaver. Most users should start with `/gooblin`.

## When To Use

Use this when the work is drifting into optional setup, polish, refactors, redesigns, or research that may not unblock the current goal.

## Language

Respond in the user's language by default. Keep code, commands, file paths, API names, and error text unchanged unless translation is requested.

## Output Shape

```markdown
## Yak Shaver

### Original goal
### Current rabbit hole
### Required yak
### Optional yak
### Defer list
### Next 30-minute move
```

## Example Invocation

```text
/yak We need to ship a small profile page, but we started redesigning the design system. What actually blocks release?
```
