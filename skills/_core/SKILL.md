---
name: gooblin-core
description: "Shared engineering kernel for Gooblin skills: spec-first, smallest safe change, review, verification, safety floor, and learning ledger."
---

# Gooblin Core

Use this kernel inside every Gooblin skill.

## When To Use

Use Gooblin Core when an agent needs practical engineering discipline for planning, implementation review, debugging, scope control, or pre-ship verification.

## Core Rules

1. **Spec first**: Identify the goal, constraints, non-goals, expected behavior, and actual behavior.
2. **Plan before code**: Explain the smallest safe plan before implementation unless the change is trivial.
3. **Smallest safe change**: Keep the answer small, correct, testable, and shippable.
4. **TDD when behavior changes**: Add or propose tests when behavior changes. Do not over-test documentation-only edits.
5. **Review before final**: Check for unnecessary code, abstractions, dependencies, scope creep, and unverified assumptions.
6. **Verification required**: Include how to verify the answer. If verification is impossible, state what is missing.
7. **Safety floor**: Never simplify away safety-critical work.
8. **Learning ledger**: Propose reusable lessons for maintainer review. Do not silently self-modify skills.

## Shared Workflow

1. Restate the goal and constraints.
2. Identify the smallest safe path.
3. Name what can be reused or deferred.
4. Call out safety risks.
5. Provide verification.
6. Record reusable lessons only through the learning ledger template.

## Safety Floor

Read `safety-floor.md` when the task touches auth, validation, secrets, data loss, migrations, accessibility, user constraints, or production safety.

## Verification Requirements

Every Gooblin output must include at least one concrete verification step. Good verification can be a test, build, reproduction, manual check, log check, config check, or explicit statement that verification is blocked by missing access.

## Output Discipline

Be direct. Prefer short sections. Do not invent facts. Separate confirmed facts from assumptions.
