# Gooblin

A geeky product-engineering team for AI coding agents.

**Korean reading:** 고오블린

Gooblin gives your coding agent four brutally practical teammates:

- **The Clipper** cuts unnecessary code.
- **Ground Control** drags architecture back to earth.
- **Rubber Duck** exposes broken assumptions.
- **Yak Shaver** kills scope creep.

**Less nonsense. More shippable code.**

Gooblin is an open-source plugin-style Agent Skills pack. It is designed to be installed by compatible AI coding agents, or read manually by agents that can use `AGENTS.md`, `skills/`, `commands/`, and copied rules.

It is not an app, runtime, framework, cloud agent, messaging bot, or npm library. The minimal package metadata exists only to help distribute the skill pack.

## Why Gooblin Exists

Most AI coding agents are too quick to guess, too eager to write code, and too comfortable inventing abstractions. Gooblin puts a weird senior product-engineering team in the loop so the agent slows down where it matters:

- Understand the product goal before implementation.
- Prefer the smallest safe shippable change.
- Reproduce bugs before fixing them.
- Cut optional work that does not unblock the goal.
- Verify results instead of trusting confidence.

## The Team

### The Clipper

Minimal-code senior engineer. The Clipper prefers existing code, native platform features, standard libraries, and small patches before new dependencies or rewrites.

Core belief: **Shortest is not enough. Smallest safe change wins.**

### Ground Control

Anti-Architecture-Astronaut product architect. Ground Control keeps design decisions tied to the actual product problem and deletes abstractions that do not pay rent.

Core belief: **Every abstraction must pay rent.**

### Rubber Duck

Debugging coach and contradiction finder. Rubber Duck separates expected behavior from actual behavior, finds the first contradiction, and builds a minimal reproduction before proposing fixes.

Core belief: **Do not fix what you have not reproduced.**

### Yak Shaver

Scope cutter, delivery PM, and fake-productivity detector. Yak Shaver protects the current goal by separating required work from optional rabbit holes.

Core belief: **If it does not unblock the goal, defer it.**

## How The Council Works

Use full council mode when a task has unclear scope, risky architecture, debugging ambiguity, or a high chance of unnecessary work.

The council checks a task from four angles:

1. **The Clipper:** What can be cut, reused, or solved with native options?
2. **Ground Control:** What is the actual product problem and smallest architecture that works?
3. **Rubber Duck:** What is expected, what is actual, and what must be reproduced?
4. **Yak Shaver:** What unblocks the goal now, and what should be deferred?

The final verdict should say what to do, what not to do, and how to verify it.

## Install

Gooblin is designed to be installed like a plugin-style Agent Skills pack.

These install paths are intended for compatible agents and plugin systems. They should be treated as expected distribution shapes until verified in each agent marketplace or installer.

### Claude Code

```bash
/plugin marketplace add jsleemaster/gooblin
/plugin install gooblin@gooblin
```

### Codex-style plugin agents

Point the compatible plugin installer at this public repository:

```text
https://github.com/jsleemaster/gooblin
```

The repository includes `.codex-plugin/plugin.json`, `plugin.yaml`, `skills/`, `commands/`, and reminder-only hooks.

### Manual fallback

For agents without plugin installation, copy or reference the relevant files:

```bash
git clone https://github.com/jsleemaster/gooblin.git
```

Then point the agent at:

- `AGENTS.md` for repo-level behavior.
- `skills/gooblin/SKILL.md` for full council mode.
- `skills/clipper/SKILL.md` for minimal-code review.
- `skills/ground-control/SKILL.md` for product architecture review.
- `skills/rubber-duck/SKILL.md` for debugging review.
- `skills/yak-shaver/SKILL.md` for scope review.
- `commands/` for command-style prompts.

## Usage Examples

Full council review:

```text
Use Gooblin council mode for this task. Find the smallest safe shippable change and verify it.
```

Focused minimal-code review:

```text
Use The Clipper. This patch adds a dependency and a new abstraction. Tell me what can be reused or cut.
```

Debugging review:

```text
Use Rubber Duck. The login flow sometimes fails, but we do not have a reproduction yet.
```

Pre-ship check:

```text
Run shipcheck on this diff. Identify unnecessary code, speculative architecture, missing repro, optional scope, and verification gaps.
```

## Project Structure

```text
AGENTS.md                    Repo-level agent instructions
LICENSE                      MIT license
package.json                 Minimal plugin distribution metadata
plugin.yaml                  Lightweight plugin metadata
.claude-plugin/plugin.json   Claude-style plugin manifest
.codex-plugin/plugin.json    Codex-style plugin manifest
.cursor/rules/gooblin.mdc    Cursor-style fallback rules
hooks/                       Reminder-only lifecycle hooks
skills/                      Gooblin skill definitions
commands/                    Command docs and invocation shapes
examples/                    Prompt and expected-output examples
evals/rubric.md              Practical output rubric
docs/                        Install, distribution, brand, and roadmap notes
assets/README.md             Placeholder instructions for future logo asset
```

## Non-Goals

Gooblin will not be:

- A long-running agent runtime.
- A cloud agent or VPS agent.
- A messaging bot or gateway.
- A dependency-heavy CLI.
- A framework, app scaffold, or npm library.
- An automatic self-modifying skill system.
- A benchmark claim generator.
- A marketplace approval claim.

## Roadmap

### v0.1

- Docs-first open-source plugin-style skill pack.
- MIT license.
- AGENTS.md.
- Six skills including the shared kernel and full council mode.
- Command docs.
- Reminder-only hooks.
- Plugin manifests.
- Examples and eval rubric.

### v0.2

- Verified install guides for popular compatible agents.
- Stronger examples.
- Logo asset integration if provided.

### v0.3

- Optional adapters.
- Optional hooks.
- More eval cases.

### v1.0

- Stable skill pack for real repo usage.

## Contributing

Contributions are welcome when they keep Gooblin practical and lean.

Good contributions usually improve one of these:

- Clearer skill instructions.
- Better examples.
- Better eval criteria.
- Safer plugin distribution docs.
- Adapter compatibility notes that have been verified.

Please do not add runtime scaffolding, dependencies, generated code, fake metrics, or broad rewrites without a concrete reason.

## License

MIT
