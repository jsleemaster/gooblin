# Verified Install Paths

This page separates verified behavior from intended distribution commands.

Current package version: `1.3.0`. Installer verification should be repeated after this release because local filesystem access was restricted during the release preparation session.

## Verified Locally

Checked on 2026-06-29 from `/Users/smlee/Gooblin`.

| Host | Version | Verified command path |
| --- | --- | --- |
| Claude Code | `2.1.96` | `claude plugin marketplace add /Users/smlee/Gooblin`, `claude plugin install gooblin@gooblin --scope user`, `claude plugin list`. |
| Codex CLI | `0.141.0` | `codex plugin marketplace add /Users/smlee/Gooblin --json`, `codex plugin add gooblin@gooblin --json`, `codex plugin list`. |

Expected local result for current package version v1.3.0:

- Claude Code: `gooblin@gooblin`, version `1.3.0`, status `enabled`.
- Codex CLI: `gooblin@gooblin`, version `1.3.0`, status `installed, enabled`.

## Verified From Git Branch

Codex CLI was checked against the remote release branch before the v1.2.0 merge:

```bash
codex plugin marketplace add jsleemaster/gooblin --ref release/v1.2.0
codex plugin add gooblin@gooblin
codex plugin list
```

Result: `gooblin@gooblin`, version `1.2.0`, status `installed, enabled`.

Claude Code's marketplace add command in the checked version did not expose a `--ref` option, so Claude remote verification should be repeated after the release is published on `main`.

## GitHub-source npx Path

Release v1.3.0 adds a package bin so npx can run the installer directly from GitHub:

```bash
npx github:jsleemaster/gooblin#v1.3.0 install
```

Expected result:

- A `.gooblin/` directory is copied into the current project.
- `GOOBLIN_INSTALL.json` records the installed Gooblin version.
- Hooks and host settings are not enabled automatically.

This path should be rechecked on a writable machine before describing it as locally verified in release marketing.

## npm Registry Status

The npm registry shorthand is pending publication and verification:

```bash
npx gooblin install
```

Track that work in [issue #43](https://github.com/jsleemaster/gooblin/issues/43). Do not move this command into a verified section until the package exists on npm and the command has been checked.

## Intended Remote Commands

After a release is published:

```bash
claude plugin marketplace add jsleemaster/gooblin
claude plugin install gooblin@gooblin
codex plugin marketplace add jsleemaster/gooblin
codex plugin add gooblin@gooblin
npx github:jsleemaster/gooblin install
```

Remote install should be rechecked after each release because plugin installers, npm behavior, and marketplace behavior can change.

## Not Claimed

- No official host vendor support claim.
- No marketplace approval claim.
- No universal agent compatibility claim.
- No npm registry publish claim until the package is published.
- No benchmark claim.
