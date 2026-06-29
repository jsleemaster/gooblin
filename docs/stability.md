# Stability

Gooblin v1.0 is stable as a plugin-style Agent Skills pack.

It is not stable as an app runtime, SDK, CLI framework, service, or automation platform because Gooblin is not those things.

## Stable Public Surfaces

- Skill names: `gooblin-core`, `clipper`, `ground-control`, `rubber-duck`, `yak-shaver`, `gooblin`.
- Command docs: `/gooblin`, `/clip`, `/ground`, `/duck`, `/yak`, `/shipcheck`.
- Manual fallback: `AGENTS.md`, `skills/`, and `commands/`.
- Plugin metadata: `plugin.yaml`, `.codex-plugin/plugin.json`, `.claude-plugin/plugin.json`.
- Marketplace manifests: `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`.
- Reminder hooks: `hooks/claude-codex-hooks.json` plus dependency-free Node scripts.

## Compatibility Promise

Gooblin should remain useful even when plugin installation is unavailable.

Host-specific adapters may change as plugin ecosystems change. When an adapter changes, the root skills and commands should remain readable as plain Markdown.

## Breaking Change Policy

A change is breaking if it:

- Renames a stable skill or command.
- Removes the manual fallback path.
- Changes the safety floor.
- Turns hooks from reminder-only into file-mutating automation.
- Adds required network access, telemetry, accounts, API keys, or cloud services.

Breaking changes require a release note and maintainer review.
