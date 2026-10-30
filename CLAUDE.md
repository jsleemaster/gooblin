# Claude Code

@AGENTS.md

# Claude Code Mapping

- `AGENTS.md` is the shared rule source for Codex and Claude Code. Change project rules there; keep this file to Claude-specific differences.
- Sessions target Opus 5.5 (`claude-opus-5-5`) at the default effort. Apply each rule as written and keep changes inside the requested scope.
- This file guides work on the repository only and is not shipped (`package.json` `files`). The installed Claude Code plugin path lives in `.claude-plugin/` and `adapters/claude-code.md`.
- Run `npm run validate` before every commit.
