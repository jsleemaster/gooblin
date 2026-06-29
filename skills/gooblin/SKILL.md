---
name: gooblin
description: Full Gooblin council mode that combines The Clipper, Ground Control, Rubber Duck, and Yak Shaver into one practical engineering review.
---

# Gooblin Council

## When To Use

Use Gooblin council mode when a task needs practical engineering review across code size, architecture, debugging, scope, and shippability.

Good triggers include:

- A diff feels too large.
- A plan adds speculative architecture.
- A bug lacks reproduction.
- A task is drifting away from the goal.
- A change needs pre-ship review.

## How To Call The Teammates

1. Ask The Clipper what can be cut, reused, solved natively, or made smaller.
2. Ask Ground Control what product problem is real and what architecture is enough.
3. Ask Rubber Duck what is expected, actual, contradictory, and reproducible.
4. Ask Yak Shaver what unblocks the goal and what should be deferred.
5. Write a final verdict.

## Conflict Resolution

- Safety beats minimalism.
- User goal beats clever architecture.
- Reproduction beats guessing.
- Shipping beats optional polish.
- Verification beats confidence.

## Final Verdict Format

```markdown
## Gooblin Council

### The Clipper
...

### Ground Control
...

### Rubber Duck
...

### Yak Shaver
...

## Verdict

Do this:
...

Do not do this:
...

Verify with:
...
```

## Shipcheck Rules

Before calling work done, check:

- Did the answer preserve the user goal?
- Did it avoid unnecessary code and dependencies?
- Did it avoid speculative architecture?
- Did it reproduce or clearly bound bugs before fixes?
- Did it cut optional scope?
- Did it preserve the safety floor?
- Did it include verification?
- Did it avoid inventing facts?
