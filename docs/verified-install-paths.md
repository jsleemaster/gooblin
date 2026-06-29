# Verified Install Paths

This page separates verified behavior from intended distribution commands.

## Verified Locally

Checked on 2026-06-29 from `/Users/smlee/Gooblin`.

| Host | Version | Verified command path |
| --- | --- | --- |
| Claude Code | `2.1.96` | `claude plugin marketplace add /Users/smlee/Gooblin`, `claude plugin install gooblin@gooblin --scope user`, `claude plugin list`. |
| Codex CLI | `0.141.0` | `codex plugin marketplace add /Users/smlee/Gooblin --json`, `codex plugin add gooblin@gooblin --json`, `codex plugin list`. |

Expected local result for v1.2.0:

- Claude Code: `gooblin@gooblin`, version `1.2.0`, status `enabled`.
- Codex CLI: `gooblin@gooblin`, version `1.2.0`, status `installed, enabled`.

## Verified From Git Branch

Codex CLI was also checked against the remote release branch before merge:

```bash
codex plugin marketplace add jsleemaster/gooblin --ref release/v1.2.0
codex plugin add gooblin@gooblin
codex plugin list
```

Result: `gooblin@gooblin`, version `1.2.0`, status `installed, enabled`.

Claude Code's marketplace add command in the checked version did not expose a `--ref` option, so Claude remote verification should be repeated after the release is published on `main`.

## Intended Remote Commands

After a release is published:

```bash
claude plugin marketplace add jsleemaster/gooblin
claude plugin install gooblin@gooblin
codex plugin marketplace add jsleemaster/gooblin
codex plugin add gooblin@gooblin
```

Remote install should be rechecked after each release because plugin installers and marketplace behavior can change.

## Not Claimed

- No official host vendor support claim.
- No marketplace approval claim.
- No universal agent compatibility claim.
- No benchmark claim.
