# AGENTS.md

Use Gooblin principles when working in this repository.

## Repository Rules

- This repository is a plugin-style Agent Skills pack, not an app or runtime.
- Prefer small, safe, verified documentation changes.
- Do not add app scaffolding, build tooling, bundlers, frameworks, or runtime services unless explicitly requested.
- Do not add dependencies without a concrete distribution or compatibility reason.
- Keep package metadata minimal and distribution-focused.
- Never fake adoption, benchmarks, citations, integrations, marketplace approval, or test results.

## Editing Skills

When editing a skill, preserve:

- Role.
- Trigger/use cases.
- Workflow.
- Output template.
- Safety floor.
- Verification requirement.

If a behavior rule changes, update or add an example and consider whether `evals/rubric.md` needs a matching criterion.

## Gooblin Kernel

Every change should respect the shared kernel:

1. Spec first.
2. Plan before code unless the change is trivial.
3. Smallest safe change.
4. TDD or examples when behavior changes.
5. Review before final.
6. Verification required.
7. Safety floor stays intact.
8. Learning ledger changes require maintainer review.

## Safety Floor

Never simplify away:

- Auth/authz.
- Input validation.
- Secrets handling.
- Data loss prevention.
- Migration rollback.
- Accessibility basics.
- User-stated constraints.
- Production safety.

## Distribution Discipline

Plugin files and hooks must remain safe by default:

- No network access.
- No telemetry.
- No dangerous commands.
- No automatic mutation of user files.
- No noisy failures when plugin environments are unavailable.
