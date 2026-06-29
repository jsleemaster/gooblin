# Plugin Distribution

Gooblin is distributed as an open-source plugin-style Agent Skills repository.

The repository shape is inspired by Ponytail-style plugin distribution, but Gooblin does not copy Ponytail content. It uses the idea of a public repo that contains agent-readable instructions, skills, commands, hooks, plugin manifests, and adapter folders.

## Distribution Goals

- Work as a plugin or extension where compatible agents support that model.
- Work as a manual skill pack where agents can read repository files.
- Keep package metadata minimal and distribution-only.
- Avoid app, runtime, framework, cloud agent, or messaging bot behavior.

## Included Surfaces

- `AGENTS.md`: repo-level agent behavior.
- `skills/`: skill definitions.
- `commands/`: command docs and prompt shapes.
- `hooks/`: safe lifecycle reminders.
- `.claude-plugin/`: Claude-style manifest.
- `.codex-plugin/`: Codex-style manifest.
- `.cursor/rules/`: Cursor-style fallback rules.
- `plugin.yaml`: lightweight metadata for simple plugin loaders.
- `package.json`: open-source distribution metadata only.

## Hook Policy

Hooks must remain tiny and safe:

- No network access.
- No telemetry.
- No dangerous commands.
- No automatic mutation of user files.
- No noisy failures when environment variables or plugin support are missing.

Hooks may remind the agent that Gooblin mode exists and point to bundled skills and commands.

## Claims Policy

Do not claim:

- Marketplace approval.
- Official support from a specific agent vendor.
- Adoption numbers.
- Benchmarks.
- Verified integrations unless actually verified and documented.
