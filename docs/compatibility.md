# Compatibility Notes

These notes record what has actually been checked. They are not marketplace approval claims.

Current package version: `1.3.0`. The latest plugin installer verification below remains the last checked installer result and may lag current package metadata until rechecked.

## Latest Local Verification

Checked on 2026-06-29.

| Host | Local version | Verified result |
| --- | --- | --- |
| Claude Code | `2.1.96` | `gooblin@gooblin` version `1.2.0` installed and enabled from a local checkout. |
| Codex CLI | `codex-cli 0.141.0` | `gooblin@gooblin` version `1.2.0` installed and enabled from a local checkout. |

## Verified Commands

Claude Code:

```bash
claude plugin validate .
claude plugin marketplace add /Users/smlee/Gooblin
claude plugin install gooblin@gooblin --scope user
claude plugin list
```

Result: `gooblin@gooblin` installed with version `1.2.0` and status `enabled`.

Codex:

```bash
codex plugin marketplace add /Users/smlee/Gooblin --json
codex plugin add gooblin@gooblin --json
codex plugin list
```

Result: `gooblin@gooblin` installed with version `1.2.0` and status `installed, enabled`.

## npx Installer Status

Release `v1.3.0` exposes a minimal dependency-free bin installer:

```bash
npx github:jsleemaster/gooblin install
```

The installer copies readable Gooblin files into `.gooblin/` and does not enable hooks, edit host settings, access the network, or collect telemetry.

The npm registry shorthand is tracked in [issue #43](https://github.com/jsleemaster/gooblin/issues/43) and is not claimed as verified until the package is published and checked:

```bash
npx gooblin install
```

## Remote Install Status

The intended remote commands remain:

```bash
claude plugin marketplace add jsleemaster/gooblin
claude plugin install gooblin@gooblin
codex plugin marketplace add jsleemaster/gooblin
codex plugin add gooblin@gooblin
```

Remote install should be rechecked after each release tag is pushed. Do not describe a host as officially supported unless that host's installer has been verified against the released repository.

## Known Notes

- Claude Code validation currently warns when a marketplace description is absent because the local validator does not accept the same root `description` key used by some public marketplace manifests.
- Hooks require Node.js when enabled.
- Hooks are reminder-only and can be disabled with `GOOBLIN_DISABLE=1`.
- The npx installer requires Node.js 18 or newer.
