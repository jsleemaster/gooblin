# Gooblin

<p align="center">
  <img src="assets/logo.png" alt="Gooblin mascot and team" width="280">
</p>

<p align="center">
  <strong>Your agent has ideas. Gooblin has scissors.</strong><br>
  A geeky product-engineering team for AI coding agents.<br>
  <em>Less nonsense. More shippable code.</em>
</p>

<p align="center">
  <img alt="version 1.0.0" src="https://img.shields.io/badge/version-1.0.0-111111">
  <img alt="license MIT" src="https://img.shields.io/badge/license-MIT-111111">
  <img alt="plugin style" src="https://img.shields.io/badge/plugin--style-yes-111111">
  <img alt="agent skills" src="https://img.shields.io/badge/agent--skills-yes-111111">
  <img alt="no telemetry" src="https://img.shields.io/badge/telemetry-no-111111">
</p>

Gooblin is an open-source plugin-style Agent Skills pack. It is not an app, runtime, framework, cloud agent, messaging bot, or npm library.

It installs where compatible agents support plugins. It still works as plain Markdown when they do not.

## The Goblin In The Room

You know him. Tall hat. Bad grin. Worse patience.

He watches your agent install a library for a native input, draw a service layer around one function, and redesign the roadmap to fix a button.

Then he calls the team.

## Before / After

User asks for a simple profile form birthday field.

| Before Gooblin | With Gooblin |
| --- | --- |
| Adds a date picker dependency. | The Clipper checks native input first. |
| Creates a wrapper component. | Ground Control rejects the unnecessary abstraction. |
| Adds custom styles. | Rubber Duck asks what behavior actually needs testing. |
| Starts discussing timezone handling. | Yak Shaver cuts timezone discussion unless required. |
| Expands profile form scope. | The change stays boring. |

```html
<input type="date" name="birthday" />
```

The point is not fewer lines. The point is fewer unnecessary decisions.

## The Team

| Teammate | Job | Belief |
| --- | --- | --- |
| **The Clipper** | Minimal-code senior engineer. Ponytail/Greybeard-inspired, but safer. | Smallest safe change wins. |
| **Ground Control** | Anti-Architecture-Astronaut product architect. | Every abstraction must pay rent. |
| **Rubber Duck** | Debugging coach and contradiction finder. | Do not fix what you have not reproduced. |
| **Yak Shaver** | Scope cutter and delivery PM. | If it does not unblock the goal, defer it. |

## How It Works

Before writing code, Gooblin forces the agent through this ladder:

1. What is the actual product goal?
2. What is the expected behavior?
3. What is the smallest safe change?
4. Does existing code already solve it?
5. Can native platform or stdlib solve it?
6. Is this abstraction paying rent?
7. Has the bug been reproduced?
8. What scope can be deferred?
9. What verifies the change?

Gooblin is lazy about unnecessary work, not lazy about understanding the problem.

Never cut: auth/authz, validation, secrets handling, data-loss protection, rollback paths, accessibility basics, or user-stated constraints.

## Install

Gooblin is designed to be installed like a plugin-style Agent Skills pack.

### Claude Code

```bash
/plugin marketplace add jsleemaster/gooblin
/plugin install gooblin@gooblin
```

You may need to send those as two separate prompts.

### Codex

```bash
codex plugin marketplace add jsleemaster/gooblin
codex plugin add gooblin@gooblin
codex
```

You can also open `/plugins`, select the Gooblin marketplace, install Gooblin, review hooks if prompted, and start a new thread.

### Manual fallback

If your agent does not support plugins yet, copy or reference:

- `AGENTS.md`
- `skills/`
- `commands/`

Then ask your coding agent:

```text
Use Gooblin council mode for this task.
```

Plugin support may vary by agent. If plugin installation is not available, Gooblin still works as a readable skill pack.

Hooks are optional. They only inject Gooblin context and should never mutate user files automatically.

See [install docs](docs/install.md) and [compatibility notes](docs/compatibility.md) for currently verified local installer behavior.
Optional host recipes live in [adapters](adapters/).
Stable surfaces and claim rules are documented in [stability](docs/stability.md), [verified install paths](docs/verified-install-paths.md), and [claims policy](docs/claims-policy.md).

## Commands

| Command | What it does |
| --- | --- |
| `/gooblin` | Full council review using all four teammates. |
| `/clip` | The Clipper only: cuts code, dependencies, rewrites, and unnecessary abstractions. |
| `/ground` | Ground Control only: reviews architecture and product fit. |
| `/duck` | Rubber Duck only: debugging, reproduction, contradiction finding. |
| `/yak` | Yak Shaver only: scope control and next shippable move. |
| `/shipcheck` | Final pre-ship review before calling work done. |

In some agents, commands may be exposed as skills instead of slash commands.

## Examples

| Example | What it catches |
| --- | --- |
| [Overbuilt date picker](examples/overbuilt-date-picker/) | Dependency and wrapper creep. |
| [Architecture astronauting](examples/architecture-astronauting/) | Plugin platforms, event buses, and service layers before need. |
| [Debugging without reproduction](examples/debugging-without-repro/) | Fixing before expected/actual/repro are clear. |
| [Yak-shaving an MVP](examples/yak-shaving-mvp/) | Redesigning the system before shipping the page. |
| [Unsafe auth shortcut](examples/unsafe-auth-shortcut/) | Over-cutting past the safety floor. |
| [Plugin install verification](examples/plugin-install-verification/) | Separating verified install facts from assumptions. |
| [Release train governance](examples/release-train-governance/) | Shipping fast without pretending review happened. |
| [Claims policy review](examples/claims-policy-review/) | Cutting unsupported safety, speed, and compatibility claims. |

These examples are not benchmarks.

## Numbers

No benchmark claims yet.

Gooblin will not claim "less code," "faster," "cheaper," or "safer" until measured on real agentic coding sessions.

Planned measurements:

| Metric | Why it matters |
| --- | --- |
| diff size | Catches unnecessary churn. |
| dependency additions avoided | Tracks native/platform reuse. |
| tests added | Checks behavior changes are verified. |
| scope reduced | Measures avoided rabbit holes. |
| verification quality | Separates confidence from proof. |
| safety regressions | Makes sure cutting did not cut the floor. |

If benchmarks are added later, include method, repo/task set, model/agent version, sample size, limitations, and reproduction instructions.

Eval fixtures live in [evals/fixtures](evals/fixtures/). They are behavior checks, not benchmarks.

## Development

This repo should stay boring.

- Keep skills readable as plain Markdown.
- Keep hooks tiny and dependency-free.
- Keep plugin manifests aligned.
- Update examples when behavior changes.
- Do not add runtime scaffolding unless explicitly needed.
- Do not add fake automation.

`package.json` exists only as minimal open-source plugin metadata. Do not add app dependencies, build tooling, or runtime scaffolding.

## FAQ

**Q: Is Gooblin an agent runtime?**

A: No. It is a plugin-style Agent Skills pack.

**Q: Does it write code for me?**

A: Your coding agent writes code. Gooblin makes it harder for the agent to overbuild, guess, or drift.

**Q: Are the four teammates actual subagents?**

A: Not by default. They are skills and review modes. Future adapters may map them to subagents where supported.

**Q: Does Gooblin need hooks?**

A: No. Hooks improve activation in compatible agents. The skills still work as plain Markdown.

**Q: Why "Gooblin"?**

A: Because your agent needed adult supervision and got a goblin with scissors.

## License

MIT.
Small enough to ship.
