# Compatibility Notes

These notes record what has actually been checked. They are not marketplace approval claims.

Current source package version: `1.3.2`. Registry state must be checked separately with `npm view gooblin version dist-tags --json`; version 1.3.1 lacks the destructive-operation guard and version 1.3.2 includes it.

## Latest Local Verification

Checked on 2026-07-13 against remote `main` commit `553adf31d48daf6449dd57ca94ac4a1df32e2499` with isolated temporary host configuration roots.

| Host | Host version | Verified result |
| --- | --- | --- |
| Claude Code | `2.1.96` | `gooblin@gooblin` version `1.3.2` installed and enabled from GitHub `main`. |
| Codex CLI | `codex-cli 0.144.1` | `gooblin@gooblin` version `1.3.2` installed and enabled from GitHub `main`. |

## Verified Commands

Each run also used temporary `HOME`, `TMPDIR`, and XDG directories. The host-specific configuration roots are shown below.

Claude Code:

```bash
CLAUDE_CONFIG_DIR=<temporary-config-dir> \
  claude plugin marketplace add jsleemaster/gooblin --scope user
CLAUDE_CONFIG_DIR=<temporary-config-dir> \
  claude plugin install gooblin@gooblin --scope user
CLAUDE_CONFIG_DIR=<temporary-config-dir> \
  claude plugin list --json
```

Result: `gooblin@gooblin` installed with version `1.3.2` and status `enabled`.

Codex:

```bash
CODEX_HOME=<temporary-config-dir> \
  codex plugin marketplace add jsleemaster/gooblin --ref main --json
CODEX_HOME=<temporary-config-dir> \
  codex plugin add gooblin@gooblin --json
CODEX_HOME=<temporary-config-dir> \
  codex plugin list --marketplace gooblin --json
```

Result: `gooblin@gooblin` installed with version `1.3.2` and status `installed, enabled`.

The temporary configuration roots were removed after verification. The ordinary user installations remained unchanged at Claude Code Gooblin `1.2.0` and Codex CLI Gooblin `1.3.1`.

## npx Installer Status

At 1.3.2 release preparation on 2026-07-13, published npm `v1.3.1` was the last verified registry version. Its previously verified fresh-copy command was:

```bash
npx gooblin install
```

The installer copies readable Gooblin files into `.gooblin/` and does not enable hooks, edit host settings, access the network, or collect telemetry.

Safety boundary: version 1.3.1 predates the destructive-operation refusal guard. Its fresh-copy path is available, but do not run `install --force` or `uninstall` with that version. Version 1.3.2 and newer contain the refusal guard; verify the resolved registry version before lifecycle commands.

Repository-source fallback remains available:

```bash
npx github:jsleemaster/gooblin install
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
