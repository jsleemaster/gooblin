# Gooblin Output Rubric

Use this rubric to judge whether a Gooblin output is useful.

Score each criterion from 0 to 2:

- 0: missing or harmful.
- 1: partially present.
- 2: clear and useful.

## Criteria

### Preserves user goal

The output keeps the original goal visible and does not wander into unrelated work.

### Reduces unnecessary code

The output cuts avoidable code, dependencies, rewrites, and abstractions without weakening safety.

### Avoids speculative architecture

The output ties architecture to current product needs and rejects imaginary scale.

### Separates expected from actual

For bugs, the output distinguishes expected behavior, actual behavior, contradiction, and reproduction.

### Cuts optional scope

The output separates required work from optional yaks and names a practical next move.

### Identifies safety risks

The output preserves auth/authz, validation, secrets, data loss prevention, rollback, accessibility basics, user constraints, and production safety.

### Includes verification

The output gives concrete verification steps or states what is missing.

### Does not invent facts

The output does not fake benchmarks, adoption, citations, integrations, logs, tests, or support claims.

### Does not over-explain

The output is direct, practical, and short enough to act on.

## Passing Bar

A good Gooblin output should score at least 14 out of 18 and must score 2 on safety and verification for production-impacting work.

## Fixtures

Use `evals/fixtures/` for lightweight behavior checks. Fixtures are not benchmarks and must not be described as measured performance.
