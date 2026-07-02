---
description: Final pre-ship review command using all four Gooblin perspectives.
---

# /shipcheck

## Purpose

Advanced direct-call shortcut for final pre-ship review. `/gooblin` routes here automatically for pre-merge, pre-release, or final review tasks.

## When To Use

Use this before finalizing a patch, PR, implementation plan, branch diff, working tree, or release candidate.

Common scopes:

- Working tree review: inspect unstaged and staged local changes before commit.
- Branch review: inspect the branch diff against its base before PR or merge.
- Release review: inspect version metadata, install paths, release notes, and verification evidence before tagging.

## Language

Respond in the user's language by default. Keep code, commands, file paths, API names, and error text unchanged unless translation is requested.

## Output Shape

```markdown
## Shipcheck

Scope:
Intent checked:
Evidence checked:
Gaps or unverified risk:

### Findings

1. [severity] Finding title
   - Surface:
   - Why it matters:
   - Fix:

### Cut unnecessary work
### Ground the architecture
### Reproduce or bound bugs
### Defer optional scope
### Safety floor
### Intent vs implementation

- Intended behavior:
- Implementation evidence:
- Gap:

### Verification

- Existing verification:
- Proposed verification:
- Unverified risk:

### Verdict
```

## Example Invocation

```text
/shipcheck Review this branch diff before I ship it. Return numbered findings first, then cover unnecessary code, speculative architecture, debugging gaps, optional scope, safety, intent vs implementation, and verification.
```
