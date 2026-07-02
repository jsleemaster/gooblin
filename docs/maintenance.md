# Maintenance Guardrails

Gooblin has several public surfaces that must stay aligned. Use this page before opening a PR when a change touches behavior, distribution, or public copy.

This is a checklist, not a process framework. Keep it small and update it when a new surface becomes easy to forget.

## Change Impact Matrix

Use this matrix as the copy-sync map. When a public behavior changes, update the smallest set of affected surfaces rather than adding a new process or parallel source of truth.

| Change | Check these surfaces |
| --- | --- |
| Skill behavior or skill wording | `skills/`, `commands/`, `README.md`, `examples/`, `evals/rubric.md`, `evals/fixtures/` |
| Router or `/gooblin` behavior | `skills/gooblin/SKILL.md`, `commands/gooblin.md`, `commands/shipcheck.md`, `README.md`, `AGENTS.md`, `.cursor/rules/gooblin.mdc` |
| Command docs or slash command wording | `commands/`, `README.md` command table, `docs/install.md`, `docs/operations.md` |
| Adapter or host recipe | `adapters/`, `adapters/README.md`, `README.md`, `docs/install.md`, `docs/plugin-distribution.md`, `docs/compatibility.md`, `docs/verified-install-paths.md` |
| Plugin manifest or hook behavior | `plugin.yaml`, `.agents/plugins/marketplace.json`, `.claude-plugin/`, `.codex-plugin/`, `hooks/`, `docs/install.md`, `docs/operations.md`, `docs/plugin-distribution.md` |
| Release or version bump | `package.json`, `plugin.yaml`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `hooks/claude-codex-hooks.json`, `README.md` badge, `docs/releases/`, `docs/compatibility.md`, `docs/verified-install-paths.md` |
| Evaluation or benchmark guidance | `docs/benchmarking.md`, `evals/rubric.md`, `evals/fixtures/`, `examples/`, `README.md` Numbers section |
| Public claim, compatibility claim, or benchmark claim | `README.md`, `docs/claims-policy.md`, `docs/compatibility.md`, `docs/verified-install-paths.md`, `docs/plugin-distribution.md` |
| Example prompt or expected output | `examples/`, `README.md` Examples table, `evals/fixtures/` if it changes scoring expectations |
| Safety floor or simplification rule | `AGENTS.md`, `skills/_core/safety-floor.md`, `skills/_core/SKILL.md`, teammate skills, `evals/rubric.md` |

## Local Gates

Run these before release PRs and before any PR that changes distribution surfaces:

```bash
npm run validate
git diff --check
npm pack --dry-run
```

For release PRs, also verify at least the current local plugin install paths documented in `docs/verified-install-paths.md`.

The validation workflow should stay tiny: checkout, Node, `npm run validate`. Do not add dependency installs, generated reports, or release automation unless a real failing PR shows the need.

## What Not To Add

- No heavy CI beyond the lightweight validation gate.
- No generated docs index unless manual drift becomes common.
- No benchmark numbers without method, task set, sample size, limitations, and reproduction instructions.
- No official host support claims unless the specific installer path has been verified against the released repository.

