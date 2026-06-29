# Plugin Distribution

Gooblin is distributed as an open-source plugin-style Agent Skills repository. It is plugin-first and skill-pack-compatible.

The repository shape uses a public plugin-style distribution model: agent-readable instructions, skills, commands, hooks, plugin manifests, and adapter folders.

## Distribution Goals

- Work as a plugin or extension where compatible agents support that model.
- Stay usable even when plugin support is unavailable.
- Work as a manual skill pack where agents can read repository files.
- Keep package metadata minimal and distribution-only.
- Avoid app, runtime, framework, cloud agent, or messaging bot behavior.
- Require no central server, accounts, API keys, telemetry, or cloud services.

## Included Surfaces

- `AGENTS.md`: repo-level agent behavior.
- `skills/`: skill definitions.
- `commands/`: command docs and prompt shapes.
- `hooks/`: safe lifecycle reminders.
- `.agents/plugins/marketplace.json`: Codex marketplace manifest that exposes the repo root as the `gooblin` plugin.
- `.claude-plugin/`: Claude-style marketplace and plugin manifests.
- `.codex-plugin/`: Codex-style plugin manifest.
- `.cursor/rules/`: Cursor-style fallback rules.
- `plugins/gooblin/`: thin marketplace adapter with symlinks back to the root skill pack.
- `adapters/`: optional host recipes for agents without the same plugin marketplace shape, including Codex, Claude Code, Gemini CLI, OpenCode, Devin, Hermes Agent, Cursor, Continue-style context, and generic agents.
- `plugin.yaml`: lightweight metadata for simple plugin loaders.
- `package.json`: open-source distribution metadata only.

Agent-specific folders are adapters, not separate products. They should stay small, readable, and easy to delete or adapt.

## Hook Policy

Hooks must remain tiny and safe:

- No network access.
- No telemetry.
- No dangerous commands.
- No automatic mutation of user files.
- No noisy failures when environment variables or plugin support are missing.

Hooks may remind the agent that Gooblin mode exists and point to bundled skills and commands.

Hooks are optional. The skills must remain useful if every hook is disabled.

Hook modes:

- `GOOBLIN_HOOK_MODE=brief`: default reminder output.
- `GOOBLIN_HOOK_MODE=quiet`: no reminder output.
- `GOOBLIN_HOOK_MODE=verbose`: extra safety-floor reminders.
- `GOOBLIN_HOOK_MODE=off` or `GOOBLIN_DISABLE=1`: disabled.

## Skill Pack Compatibility

Keep skills readable as plain Markdown:

- Do not require a central service to understand or run Gooblin.
- Do not hide core behavior inside hook scripts.
- Do not make plugin manifests the only source of truth.
- Keep `AGENTS.md`, `skills/`, and `commands/` enough for manual use.
- Keep `package.json` limited to open-source plugin metadata.
- Do not add app dependencies, build tooling, or runtime scaffolding.

## Claims Policy

See `docs/claims-policy.md` for the full policy.

See `docs/operations.md` for status, configuration, uninstall, and statusline recipes.

Do not claim:

- Marketplace approval.
- Official support from a specific agent vendor.
- Adoption numbers.
- Benchmarks.
- Verified integrations unless actually verified and documented.
