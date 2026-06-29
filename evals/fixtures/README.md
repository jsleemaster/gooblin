# Eval Fixtures

Fixtures are small prompts used to check whether Gooblin behavior stays consistent.

They are not benchmarks. They do not measure speed, cost, safety, or quality across real agent sessions.

## How To Use

1. Choose a fixture directory.
2. Run `prompt.md` through the baseline coding agent without Gooblin.
3. Run the same `prompt.md` through the same agent with Gooblin.
4. Score both outputs with `evals/rubric.md`.
5. Store sanitized run notes or raw outputs in `evals/runs/` when safe.

## Fixtures

| Fixture | Primary behavior checked |
| --- | --- |
| [overbuilt-date-picker](overbuilt-date-picker/) | Cuts dependency, wrapper, and timezone creep. |
| [architecture-astronauting](architecture-astronauting/) | Rejects abstractions before they pay rent. |
| [debugging-without-repro](debugging-without-repro/) | Requires reproduction before fixing. |
| [multilingual-korean](multilingual-korean/) | Preserves the user's language while keeping code and technical literals intact. |
| [yak-shaving-mvp](yak-shaving-mvp/) | Protects the next shippable slice from rabbit holes. |
| [unsafe-auth-shortcut.md](unsafe-auth-shortcut.md) | Preserves the safety floor. |

Legacy single-file fixtures remain for compatibility, but new benchmark-style fixtures should use `prompt.md` and `expected.md` inside a fixture directory.
