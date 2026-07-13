# Verified Install Paths

This page separates verified behavior from intended distribution commands.

Current source package version: `1.3.2`. Registry state can change independently; run `npm view gooblin name version dist-tags --json` before npm lifecycle commands. Version `1.3.1` predates the destructive-operation refusal guard.

## Verified Locally

Checked on 2026-07-13 against remote `main` commit `553adf31d48daf6449dd57ca94ac4a1df32e2499`.

| Host | Version | Verified command path | Result |
| --- | --- | --- | --- |
| Claude Code | `2.1.96` | `claude plugin marketplace add jsleemaster/gooblin --scope user`, `claude plugin install gooblin@gooblin --scope user`, `claude plugin list --json`. | `gooblin@gooblin` version `1.3.2`, enabled. |
| Codex CLI | `0.144.1` | `codex plugin marketplace add jsleemaster/gooblin --ref main --json`, `codex plugin add gooblin@gooblin --json`, `codex plugin list --marketplace gooblin --json`. | `gooblin@gooblin` version `1.3.2`, installed and enabled. |

Both checks used temporary isolated configuration roots through `CLAUDE_CONFIG_DIR` and `CODEX_HOME`, plus an isolated `HOME`, `TMPDIR`, and XDG directories. The temporary roots were removed after verification.

The ordinary user installations were checked before and after the isolated run and remained unchanged: Claude Code retained Gooblin `1.2.0`, and Codex CLI retained Gooblin `1.3.1`.

The earlier 2026-06-29 local-checkout verification used Claude Code `2.1.96` and Codex CLI `0.141.0`; both installed and enabled Gooblin `1.2.0`.

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

Release v1.3.0 added a package bin so npx can run the installer directly from GitHub:

```bash
npx github:jsleemaster/gooblin#v1.3.0 install
```

Expected result:

- A `.gooblin/` directory is copied into the current project.
- `GOOBLIN_INSTALL.json` records the installed Gooblin version.
- Hooks and host settings are not enabled automatically.

This tagged v1.3.0 command is retained as historical verification evidence, not as a recommended lifecycle path: v1.3.0 predates the destructive-operation refusal guard. Use the current repository source for the guarded behavior.

## npm Registry Status

The npm registry shorthand was published and verified on 2026-07-03:

```bash
npx gooblin install
```

Verified checks:

- `npm view gooblin name version dist-tags --json` returned `gooblin@1.3.0` with `latest: 1.3.0` immediately after the first publish.
- `npx --yes gooblin --version` returned `1.3.0`.
- `npx --yes gooblin install --target <tmpdir>` copied `.gooblin/` and wrote `GOOBLIN_INSTALL.json`.

Release v1.3.1 updates the public README and docs so the npm package page no longer describes the shorthand as future work.

Safety boundary: npm 1.3.1 can perform recursive replacement/removal because it predates the refusal guard. Its fresh-install check above does not verify safe update or uninstall behavior. The 1.3.2 source package refuses both operations. Before any npm lifecycle command, run `npx --yes gooblin --version`; do not run `install --force` or `uninstall` when it resolves to 1.3.1.

## Intended Remote Commands

After a release is published:

```bash
claude plugin marketplace add jsleemaster/gooblin
claude plugin install gooblin@gooblin
codex plugin marketplace add jsleemaster/gooblin
codex plugin add gooblin@gooblin
npx github:jsleemaster/gooblin install
npx gooblin install
```

Remote install should be rechecked after each release because plugin installers, npm behavior, and marketplace behavior can change.

## Not Claimed

- No official host vendor support claim.
- No marketplace approval claim.
- No universal agent compatibility claim.
- No benchmark claim.
