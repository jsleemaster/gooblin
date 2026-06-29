# Gooblin

![Gooblin mascot and team](assets/logo.png)

Your agent has ideas. Gooblin has scissors.

A geeky product-engineering team for AI coding agents.

Less nonsense. More shippable code.

**Korean reading:** 고오블린

![version 0.1.0](https://img.shields.io/badge/version-0.1.0-111111)
![license MIT](https://img.shields.io/badge/license-MIT-111111)
![plugin style](https://img.shields.io/badge/plugin--style-yes-111111)
![agent skills](https://img.shields.io/badge/agent--skills-yes-111111)
![no telemetry](https://img.shields.io/badge/telemetry-no-111111)

## The Goblin In The Room

You know him.
Tall hat. Bad grin. Worse patience.
He watches your agent install a library for a native input,
draw a service layer around one function,
and redesign the roadmap to fix a button.

Then he calls the team.

Gooblin puts a weird senior product-engineering team inside your AI coding agent.

It is open source. It is plugin-first. It still works as plain Markdown when plugins are not available.

## Before / After

User asks for a simple profile form birthday field.

Before Gooblin:

- The agent adds a date picker dependency.
- It creates a wrapper component.
- It adds custom styles.
- It starts discussing timezone handling.
- It expands the scope of the profile form.

With Gooblin:

- The Clipper checks the native input first.
- Ground Control rejects the unnecessary abstraction.
- Rubber Duck asks what behavior actually needs testing.
- Yak Shaver cuts timezone discussion unless the product requires it.

```html
<input type="date" name="birthday" />
```

The point is not fewer lines.
The point is fewer unnecessary decisions.

## The Team

**The Clipper** cuts unnecessary code.
Minimal-code senior engineer. Ponytail/Greybeard-inspired, but safer.
Smallest safe change wins.

**Ground Control** drags architecture back to earth.
Anti-Architecture-Astronaut product architect.
Every abstraction must pay rent.

**Rubber Duck** exposes broken assumptions.
Debugging coach.
Do not fix what you have not reproduced.

**Yak Shaver** kills scope creep.
Scope cutter.
If it does not unblock the goal, defer it.

## How It Works

Before writing code, Gooblin forces the agent through:

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

Never cut:

- auth/authz
- validation
- secrets handling
- data-loss protection
- rollback paths
- accessibility basics
- user-stated constraints

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
codex
```

Then open `/plugins`, select the Gooblin marketplace, install Gooblin, review hooks if prompted, and start a new thread.

### Manual fallback

If your agent does not support plugins yet, copy or reference:

- `AGENTS.md`
- `skills/`
- `commands/`

Then ask your coding agent:

```text
Use Gooblin council mode for this task.
```

Plugin support may vary by agent.
If plugin installation is not available, Gooblin still works as a readable skill pack.

Hooks are optional.
They only inject Gooblin context and should never mutate user files automatically.

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

- [Overbuilt date picker](examples/overbuilt-date-picker/)
- [Architecture astronauting](examples/architecture-astronauting/)
- [Debugging without reproduction](examples/debugging-without-repro/)
- [Yak-shaving an MVP](examples/yak-shaving-mvp/)

These examples are not benchmarks.

## Numbers

No benchmark claims yet.

Gooblin will not claim "less code," "faster," "cheaper," or "safer" until measured on real agentic coding sessions.

Planned measurements:

- diff size
- dependency additions avoided
- tests added
- scope reduced
- verification quality
- safety regressions

If benchmarks are added later, include:

- method
- repo/task set
- model/agent version
- sample size
- limitations
- reproduction instructions

## Development

This repo should stay boring.

When changing Gooblin:

- keep skills readable as plain Markdown
- keep hooks tiny and dependency-free
- keep plugin manifests aligned
- update examples when behavior changes
- do not add runtime scaffolding unless explicitly needed
- do not add fake automation

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
