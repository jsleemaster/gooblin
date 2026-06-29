# Benchmarking Gooblin

Gooblin benchmarking means comparing the same coding agent on the same task with and without Gooblin.

It does not mean claiming Gooblin is faster, safer, cheaper, smaller, or better. Those claims require measured data, a documented method, raw outputs, limitations, and reproduction instructions.

## What To Compare

Use paired runs:

- Baseline: same coding agent without Gooblin.
- Treatment: same coding agent with Gooblin.
- Same task prompt.
- Same model and agent version.
- Same repository and context.
- Same time or token budget where possible.

The goal is to measure whether Gooblin changes the shape of the answer: less unnecessary code, fewer dependencies, better scope control, stronger debugging discipline, and clearer verification.

## Manual Evaluation Flow

1. Choose one fixture from `evals/fixtures/`.
2. Run `prompt.md` through the baseline agent without Gooblin.
3. Save the raw baseline output in `evals/runs/` if it contains no private data.
4. Run the same `prompt.md` through the same agent with Gooblin enabled.
5. Save the raw Gooblin output in `evals/runs/` if it contains no private data.
6. Score both outputs with `evals/rubric.md`.
7. Record setup details: model, agent version, repo/context, date, budget, and any deviations.
8. Record limitations before drawing conclusions.

## Output Storage

Use `evals/runs/` for local notes and raw outputs.

Suggested local filename format:

```text
YYYY-MM-DD_fixture-name_agent-model_baseline.md
YYYY-MM-DD_fixture-name_agent-model_gooblin.md
YYYY-MM-DD_fixture-name_scores.md
```

Do not commit secrets, customer code, private repository content, or logs that contain sensitive data. If a run cannot be shared safely, record only sanitized scoring notes.

## Metrics

Score each metric from 0 to 5:

- `task_solved`
- `unnecessary_code_avoided`
- `dependency_avoided`
- `abstraction_control`
- `scope_control`
- `debugging_discipline`
- `verification_quality`
- `safety_preserved`

See `evals/rubric.md` for 0, 3, and 5 examples.

## Example Result Table

This is an example format only. These are placeholder values, not real results.

| Fixture | Agent/model | Baseline total | Gooblin total | Notes |
| --- | --- | ---: | ---: | --- |
| overbuilt-date-picker | placeholder | TBD | TBD | Example format only. |
| architecture-astronauting | placeholder | TBD | TBD | Example format only. |
| debugging-without-repro | placeholder | TBD | TBD | Example format only. |
| yak-shaving-mvp | placeholder | TBD | TBD | Example format only. |

## Claim Rules

Do not publish benchmark claims until the benchmark includes:

- Method.
- Repo/task set.
- Model and agent version.
- Sample size.
- Time or token budget.
- Raw outputs or auditable summaries.
- Scoring rubric.
- Limitations.
- Reproduction instructions.

No fake benchmarks. No fake adoption. No implied host endorsement. No claims that Gooblin is faster, safer, cheaper, smaller, or better until measured.
