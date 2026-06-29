---
description: Primary Gooblin router command. Diagnose the task type first, then route to the smallest useful teammate set.
---

# /gooblin

## Purpose

Run the Gooblin Router. Users should not need to know which teammate to call.

## When To Use

Use this as the default Gooblin command for implementation plans, bugs, architecture questions, scope decisions, and pre-ship review.

## Language

Respond in the user's language by default. Keep code, commands, file paths, API names, and error text unchanged unless translation is requested.

## Routing

| Task type | Route |
| --- | --- |
| Code bloat, unnecessary dependencies, rewrites, smallest safe implementation | The Clipper |
| Architecture, module boundaries, abstractions, scalability, system design | Ground Control |
| Bug, failing test, unexpected behavior, unclear cause, reproduction | Rubber Duck |
| MVP, scope, deadline, task breakdown, roadmap, rabbit holes | Yak Shaver |
| Pre-merge, pre-release, final review | Shipcheck |
| Ambiguous or high-risk | Full Gooblin Council |

Direct commands like `/clip`, `/ground`, `/duck`, and `/yak` are advanced shortcuts.

## Output Shape

```markdown
## Gooblin Router

Route:
Why:

## Selected teammate or Shipcheck

...

## Verdict

Do this:
Do not do this:
Verify with:
```

## Example Invocation

```text
/gooblin Review this implementation plan and find the smallest safe shippable path.
```
