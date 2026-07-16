# Release Process

This contract applies to releases from `jsleemaster/gooblin`. It separates reviewed source, the exact npm artifact, registry evidence, and the final immutable GitHub release.

## One-time trust configuration

Before a future release starts, enable GitHub release immutability for the repository. Do not treat a release as protected until that setting has been enabled and read back.

Configure the npm trusted publisher for package `gooblin` with these exact values:

- user or organization: `jsleemaster`;
- repository: `gooblin`;
- workflow: `publish-npm.yml`;
- environment: `npm-release`;
- allowed action: `npm publish`.

The workflow uses GitHub OIDC and must not receive a long-lived npm token. Protect `npm-release` with required reviewers so the `publish` job waits while the prepared workflow artifact is attached to the draft release.

The top-level `publish-npm` concurrency group does not cancel an in-progress run. This keeps a second dispatch from replacing the artifact or approval context of the first release.

For static auditability, `publish-npm.yml` follows a canonical run scalar policy: every `run` value is either a plain inline scalar or the exact literal block marker `|`. Folded or chomped block markers, quoted, escaped, anchored, or other decorated inline scalar forms, and shell backslash continuations outside a heredoc are rejected.

## Per-release ordering

Let `V` be the exact version from `package.json` and `S` the full source SHA selected for release. For the pending trust-recovery release, `V` is `1.3.2` and the draft release is `v1.3.2`; still read the value from the reviewed source instead of typing it from memory.

1. Merge the exact reviewed source commit to `main`. Record `S`, then verify that `github.sha`, the checked-out `HEAD`, and the live `origin/main` head all resolve to `S`.
2. Verify all required checks for `S`: `npm run validate`, `git diff --check`, and `npm pack --dry-run`. Review the payload before creating a release artifact.
3. Create a draft release for `vV` in `jsleemaster/gooblin`, targeted at source SHA `S`. Keep it as a draft; do not create or move the public tag yet.
4. Dispatch `publish-npm.yml` from `main` with required inputs `version=V` and `source_sha=S`. The `prepare` job creates exactly one real tarball with `npm pack --json`, records its SHA-256 and npm pack metadata, and uploads the tarball, checksum, and metadata as one workflow artifact.
5. After `prepare` succeeds, download that exact workflow artifact. Verify its SHA-256, attach the `.tgz` and `.sha256` files to the draft release at `S`, and read the draft back to confirm both assets and the target source SHA.
6. Only after the attachment check, approve the waiting `npm-release` environment deployment. The `publish` job downloads the same Actions artifact and independently recomputes its SHA-256, SHA-1 shasum, and SHA-512 integrity. A machine gate then uses the ephemeral `${{ github.token }}` under `contents: read` to require exactly one matching draft at `S`, exactly the expected `.tgz` and `.sha256` assets, and GitHub-reported SHA-256 digests equal to the downloaded files. Through the same read-only GitHub API access, it queries matching tag refs and requires no exact `refs/tags/vV` before npm publication; a draft's `target_commitish` is not proof that a public tag is absent. Only then may it run `npm publish <tgz>` with OIDC as its final mutating command. It must not run a second `npm pack`.
7. Complete the registry, source SHA, safety, integrity, and provenance verification below.
8. Only after every verification passes, publish the draft. Confirm that the resulting immutable release and tag resolve to `S`; never retarget the tag or replace assets after publication.
9. Update release evidence documents only from observed output. Keep failed, pending, and verified states distinct.

A maintainer can start the bounded flow with commands shaped like these after checking every value:

```bash
VERSION="$(node -p "require('./package.json').version")"
SOURCE_SHA="$(git rev-parse origin/main)"
gh release create "v${VERSION}" --repo jsleemaster/gooblin --target "${SOURCE_SHA}" --draft --title "Gooblin v${VERSION}" --notes-file "docs/releases/v${VERSION}.md"
gh workflow run publish-npm.yml --repo jsleemaster/gooblin --ref main -f version="${VERSION}" -f source_sha="${SOURCE_SHA}"
```

When `prepare` finishes, download the named artifact from that workflow run, verify it locally, and attach the exact files before approving `npm-release`:

```bash
shasum -a 256 -c "gooblin-${VERSION}.tgz.sha256"
gh release upload "v${VERSION}" "gooblin-${VERSION}.tgz" "gooblin-${VERSION}.tgz.sha256" --repo jsleemaster/gooblin
gh release view "v${VERSION}" --repo jsleemaster/gooblin --json isDraft,targetCommitish,tagName,assets
```

## Post-publish verification

Record raw output for each check against `V` and `S`:

1. Registry version and dist-tag: `npm view gooblin name version dist-tags --json` must report `V` at the intended tag.
2. Resolved CLI: `npx --yes gooblin --version` must return `V`.
3. Fresh install: install `gooblin@V` into a new temporary project and confirm the expected `.gooblin/` payload and marker version without touching an existing user installation.
4. Verify destructive-command preservation: on disposable marked and markerless fixtures, snapshot every path and byte hash, run `install --force`, `uninstall`, and `uninstall --force`, require nonzero exits, and prove the snapshots are unchanged.
5. Integrity: compare the registry artifact's integrity and SHA-256 with the attached `.tgz`, the workflow checksum, and `npm-pack.json`.
6. Provenance: verify the npm provenance attestation names `jsleemaster/gooblin`, `publish-npm.yml`, and source SHA `S`; use registry provenance evidence and an npm signature audit from a fresh temporary install.
7. Source SHA verification: confirm the successful workflow run head SHA, provenance subject, draft target, and eventual tag all resolve to `S`.

Any legacy npm `gitHead` is observational only and may be absent when an already-built tarball is published. It is not a release gate. The authoritative source linkage is trusted-publishing provenance that binds the workflow identity and source SHA to the published artifact.

If any comparison fails, do not publish the draft release. Investigate with the draft and environment gate intact; never repair evidence by replacing the artifact or moving a tag.

## Final immutable readback

After npm and safety verification, publish the draft and read back the release, assets, and tag:

```bash
gh release edit "v${VERSION}" --repo jsleemaster/gooblin --draft=false
gh release view "v${VERSION}" --repo jsleemaster/gooblin --json isDraft,isImmutable,targetCommitish,tagName,assets
git fetch origin "refs/tags/v${VERSION}:refs/tags/v${VERSION}"
test "$(git rev-list -n 1 "v${VERSION}")" = "${SOURCE_SHA}"
```

The observed output must show a non-draft immutable release, the original tarball and checksum assets, and a tag resolving to `S`. Preserve those results in the versioned release evidence; do not infer success from the publish command alone.
