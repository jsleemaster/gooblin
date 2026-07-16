# P0 Trust Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Restore Gooblin's release, provenance, activation, and public-claim trust boundaries without adding runtime scope or dependencies.

**Architecture:** Each numbered task is an independent PR-sized deliverable. Repository validators are executable policy: a failing validator is written and observed first, then the smallest files needed to satisfy it are added. Registry, GitHub settings, and host evidence remain explicit external gates and are never represented as complete until read back from the live service.

**Tech Stack:** Dependency-free Node.js ES modules, Markdown/JSON/YAML manifests, GitHub Actions, npm registry, GitHub CLI.

## Global Constraints

- This repository is a plugin-style Agent Skills pack, not an app or runtime.
- Add no runtime dependency, bundler, framework, telemetry, network hook, or automatic mutation of consumer files.
- Keep Node support at \`>=18\`; only the OIDC publish job may require Node 24 and npm 11.5.1 or newer.
- Preserve auth, validation, secrets handling, data-loss prevention, rollback, accessibility, user constraints, and production safety.
- Never claim npm publication, host activation, provenance, benchmark improvement, marketplace approval, or test success without live evidence.
- Keep root \`AGENTS.md\` maintainer-only and separate it from consumer instructions.
- Preserve stable skill identifiers until a compatibility wrapper or semver-major migration exists.
- Do not commit \`package-lock.json\`; the repository has no dependencies and does not currently track a lockfile.
- Every implementation task ends with \`npm run validate\`, \`git diff --check\`, and \`npm pack --dry-run\`.

---

### Task 1: Add the minimal supply-chain gate that unblocks #57

**Files:**
- Create: \`scripts/validate-supply-chain.mjs\`
- Create: \`.github/workflows/publish-npm.yml\`
- Create: \`SECURITY.md\`
- Create: \`docs/release-process.md\`
- Modify: \`scripts/validate.mjs\`
- Modify: \`package.json\`
- Modify: \`.github/workflows/validate.yml\`
- Modify: \`.github/workflows/gooblin-benchmark-pilot.yml\`
- Modify: \`docs/maintenance.md\`

**Interfaces:**
- Produces: \`npm run validate:supply-chain\`.
- Produces: manual GitHub workflow \`publish-npm.yml\`, bound to environment \`npm-release\`.
- Consumes: package version from \`package.json\`; no \`NPM_TOKEN\`.

- [ ] **Step 1: Write the failing supply-chain validator**

Create \`scripts/validate-supply-chain.mjs\` with these exact checks:

1. Walk \`.github/workflows/*.yml\`; every \`uses:\` value must match \`owner/repo@<40 lowercase hex characters>\`.
2. \`publish-npm.yml\` must contain:
   - \`workflow_dispatch\`
   - \`environment: npm-release\`
   - \`id-token: write\`
   - \`contents: read\`
   - Node version \`24\`
   - a Node/npm minimum-version check for Node \`>=22.14.0\` and npm \`>=11.5.1\`
   - \`npm run validate\`, \`git diff --check\`, \`npm pack --dry-run\`, and \`npm publish\`
   - a check that \`github.ref\` is \`refs/heads/main\`
   - a check that workflow input \`version\` equals \`package.json\` version
3. \`publish-npm.yml\` must not contain \`NPM_TOKEN\`, \`NODE_AUTH_TOKEN\`, \`secrets.\`, \`pull_request_target\`, or \`persist-credentials: true\`.
4. \`SECURITY.md\` must link \`https://github.com/jsleemaster/gooblin/security/advisories/new\`, state the supported source/registry boundary, and forbid public disclosure before coordinated review.
5. \`docs/release-process.md\` must name \`jsleemaster/gooblin\`, \`publish-npm.yml\`, \`npm-release\`, \`npm publish\`, registry verification, source SHA verification, tag/release ordering, and provenance verification.

Expose the script from \`package.json\` as:

\`\`\`json
"validate:supply-chain": "node scripts/validate-supply-chain.mjs"
\`\`\`

Add it to \`scripts/validate.mjs\` immediately before \`validate:claims\`.

- [ ] **Step 2: Run the validator and verify RED**

Run:

\`\`\`bash
npm run validate:supply-chain
\`\`\`

Expected: FAIL because \`publish-npm.yml\` and \`SECURITY.md\` do not exist and existing Actions use mutable \`@v4\` tags.

- [ ] **Step 3: Pin every Action to the verified full SHA**

Use these verified tag targets and retain the tag as a comment:

\`\`\`yaml
uses: actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5 # v4
uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4
uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4
\`\`\`

Set checkout \`persist-credentials: false\` in validation, benchmark, and publish workflows.

- [ ] **Step 4: Add the OIDC-only manual publish workflow**

Create \`.github/workflows/publish-npm.yml\` with:

- only \`workflow_dispatch\`;
- required string input \`version\`;
- \`permissions: { contents: read, id-token: write }\`;
- job environment \`npm-release\`;
- GitHub-hosted \`ubuntu-latest\`;
- checkout and setup-node pinned to the SHAs above;
- Node 24 and \`registry-url: https://registry.npmjs.org\`;
- \`package-manager-cache: false\`;
- no dependency installation because the package has no dependencies;
- explicit main-branch, source-version, clean-diff, Node/npm version, validation, and pack gates;
- \`npm publish\` as the final mutating command.

The version gate must read \`package.json\` and exit nonzero unless both the input and package version are identical. The runtime gate must parse semantic versions and reject Node below \`22.14.0\` or npm below \`11.5.1\`.

- [ ] **Step 5: Add the security and release contracts**

\`SECURITY.md\` must:

- direct private reports to GitHub private vulnerability reporting;
- explain that npm 1.3.1 must not be used for destructive lifecycle commands;
- state that source \`main\` and released versions are assessed separately;
- ask for affected version, reproduction, impact, and safe contact details;
- contain no response-time promise that cannot be maintained.

\`docs/release-process.md\` must define:

1. merge an exact reviewed source commit to \`main\`;
2. verify all required checks;
3. configure npm trusted publisher as user \`jsleemaster\`, repository \`gooblin\`, workflow \`publish-npm.yml\`, environment \`npm-release\`, allowed action \`npm publish\`;
4. dispatch from \`main\` with the exact package version;
5. verify registry version/dist-tag, \`npx --yes gooblin --version\`, fresh install, destructive-command preservation, integrity, and provenance;
6. only then create an annotated tag and GitHub release at the published source SHA;
7. update release evidence documents from observed output.

Update \`docs/maintenance.md\` so full-SHA Action pinning, OIDC publishing, and the \`npm-release\` environment are in the impact matrix.

- [ ] **Step 6: Run GREEN verification**

Run:

\`\`\`bash
npm run validate:supply-chain
npm run validate
git diff --check
npm pack --dry-run
\`\`\`

Expected: all commands exit 0; the tarball includes \`SECURITY.md\` and \`docs/release-process.md\`.

- [ ] **Step 7: Commit Task 1**

\`\`\`bash
git add .github/workflows SECURITY.md docs/release-process.md docs/maintenance.md package.json scripts/validate.mjs scripts/validate-supply-chain.mjs
git commit -m "ci: add trusted release safety gates"
\`\`\`

---

### Task 2: Merge the release gate and finish the live #57 publish chain

**Files:**
- Modify after live evidence: \`docs/releases/v1.3.2.md\`
- Modify after live evidence: \`docs/compatibility.md\`
- Modify after live evidence: \`docs/verified-install-paths.md\`
- Modify after live evidence: \`README.md\`
- Modify after live evidence: \`docs/install.md\`

**External state:**
- GitHub environment \`npm-release\`
- npm trusted publisher
- npm package \`gooblin@1.3.2\`
- Git tag/release \`v1.3.2\`

- [ ] **Step 1: Publish Task 1 as a reviewed PR**

Push the branch, open a PR linked to #57 and #55, wait for Node 18/20/24 validation, obtain the repository-required independent review, and merge only after all checks are green.

- [ ] **Step 2: Configure live GitHub trust controls**

Use GitHub APIs to:

- create environment \`npm-release\`;
- restrict deployments to protected branches;
- add user id \`75053960\` as the required reviewer with self-review allowed because this is a one-maintainer repository;
- enable private vulnerability reporting;
- add strict required status checks \`validate (Node 18)\`, \`validate (Node 20)\`, and \`validate (Node 24)\` to \`main\`;
- keep \`enforce_admins=false\` and record the solo-maintainer exception rather than deadlocking the repository.

Read every setting back after mutation.

- [ ] **Step 3: Configure npm trusted publishing**

On npmjs.com package settings for \`gooblin\`, configure:

\`\`\`text
Provider: GitHub Actions
Organization or user: jsleemaster
Repository: gooblin
Workflow filename: publish-npm.yml
Environment name: npm-release
Allowed action: npm publish
\`\`\`

Do not create or store a long-lived npm publish token.

- [ ] **Step 4: Dispatch and observe the publish workflow**

Run from the exact merged \`main\` revision:

\`\`\`bash
gh workflow run publish-npm.yml --ref main -f version=1.3.2
gh run watch --exit-status
\`\`\`

Expected: environment approval occurs, validation and pack gates pass, OIDC authentication succeeds, and npm publishes 1.3.2.

- [ ] **Step 5: Verify the live registry and installer safety**

Run:

\`\`\`bash
npm view gooblin name version dist-tags gitHead dist.integrity --json
npx --yes gooblin --version
\`\`\`

Then install into a fresh temporary project and run \`install --force\`, \`uninstall\`, and \`uninstall --force\` against marked and markerless modified fixtures. Each destructive command must exit nonzero and preserve the complete path/hash snapshot.

- [ ] **Step 6: Create immutable source linkage**

Only after Step 5 succeeds:

\`\`\`bash
git tag -a v1.3.2 <published-source-sha> -m "Gooblin v1.3.2"
git push origin v1.3.2
gh release create v1.3.2 --target <published-source-sha> --title "Gooblin v1.3.2" --notes-file docs/releases/v1.3.2.md
\`\`\`

Verify the tag target, release target, npm \`gitHead\`, integrity, and provenance all refer to the same source.

- [ ] **Step 7: Record only observed post-publish evidence**

Update the listed public docs with exact date, source SHA, workflow run URL, registry values, installer results, tag/release URL, and any limitations. Run the common gates, commit, review, and merge this evidence PR. Close #57 only after registry and tag/release readback succeeds.

---

### Task 3: Restore and publish v1.3.1 provenance for #50

**Files:**
- Create: \`scripts/validate-release-provenance.mjs\`
- Create: \`docs/releases/provenance/v1.3.1.json\`
- Create: \`docs/release-provenance.md\`
- Modify: \`scripts/validate.mjs\`
- Modify: \`package.json\`
- Modify: \`docs/releases/v1.3.1.md\`
- Modify: \`docs/maintenance.md\`

**Interfaces:**
- Produces: \`npm run validate:release-provenance\`.
- Evidence source commit: \`58114491d8c3eda81758ff2e418fa1966e72d465\`.
- Registry tarball SHA-256: \`9b05963f150cbdd539336f710bb40f472263c063529d2af2ca1bc91dac409766\`.

- [ ] **Step 1: Write the failing provenance validator**

The validator must require a JSON record containing:

- schema version \`1\`;
- package \`gooblin\`, version \`1.3.1\`;
- publish time \`2026-07-03T00:56:26.293Z\`;
- dist shasum \`d36e00cd822bf791bb96328b4e37e3dd17af274a\`;
- integrity \`sha512-81ezPy9eISnAEORHC0Oh/45F0ZrsYW84YhrB2EGy4z+eUPDF+iRrCAZ/6UNpiZvO7Bz1kgKRUrI5aNdoULxjQg==\`;
- registry \`gitHead\` and matched source SHA \`58114491d8c3eda81758ff2e418fa1966e72d465\`;
- tarball SHA-256 above;
- result \`matched\`;
- exact reproduction commands;
- a statement that extracted registry and source-built package trees had zero differences.

Add the script to \`package.json\` and \`scripts/validate.mjs\`.

- [ ] **Step 2: Run RED**

Run \`npm run validate:release-provenance\`.

Expected: FAIL because \`docs/releases/provenance/v1.3.1.json\` does not exist.

- [ ] **Step 3: Add the audited evidence record**

Record the live registry metadata and this reproduced comparison:

\`\`\`text
registry gooblin-1.3.1.tgz SHA-256:
9b05963f150cbdd539336f710bb40f472263c063529d2af2ca1bc91dac409766

source commit package SHA-256:
9b05963f150cbdd539336f710bb40f472263c063529d2af2ca1bc91dac409766

recursive extracted package diff:
0 differences
\`\`\`

\`docs/release-provenance.md\` must explain how to reproduce the comparison in a temporary directory and why tags are created only after payload matching.

- [ ] **Step 4: Run GREEN and common gates**

Run:

\`\`\`bash
npm run validate:release-provenance
npm run validate
git diff --check
npm pack --dry-run
\`\`\`

- [ ] **Step 5: Commit, review, and merge**

\`\`\`bash
git add docs/release-provenance.md docs/releases/v1.3.1.md docs/releases/provenance/v1.3.1.json docs/maintenance.md package.json scripts/validate.mjs scripts/validate-release-provenance.mjs
git commit -m "docs: restore v1.3.1 release provenance"
\`\`\`

- [ ] **Step 6: Create the historical tag/release only at the matched SHA**

After merge and readback:

\`\`\`bash
git tag -a v1.3.1 58114491d8c3eda81758ff2e418fa1966e72d465 -m "Gooblin v1.3.1"
git push origin v1.3.1
gh release create v1.3.1 --target 58114491d8c3eda81758ff2e418fa1966e72d465 --title "Gooblin v1.3.1" --notes-file docs/releases/v1.3.1.md --latest=false
\`\`\`

Read back the tag and release target before closing #50.

---

### Task 4: Fix the activation and consumer contract in #48

**Files:**
- Create: \`docs/adr/0001-host-activation-contract.md\`
- Create: \`CONSUMER.md\`
- Create: \`scripts/validate-activation-contract.mjs\`
- Modify: \`bin/gooblin.mjs\`
- Modify: \`scripts/validate-npx-installer.mjs\`
- Modify: \`scripts/validate-manifests.mjs\`
- Modify: \`scripts/validate-maintenance.mjs\`
- Modify: \`scripts/validate.mjs\`
- Modify: \`package.json\`
- Modify: \`README.md\`
- Modify: \`docs/index.html\`
- Modify: \`docs/install.md\`
- Modify: \`docs/operations.md\`
- Modify: \`docs/compatibility.md\`
- Modify: \`docs/verified-install-paths.md\`
- Modify: \`docs/plugin-distribution.md\`
- Modify: \`docs/stability.md\`
- Modify: \`docs/maintenance.md\`
- Modify: \`adapters/*.md\`
- Modify: \`.cursor/rules/gooblin.mdc\`
- Modify: \`.codex-plugin/plugin.json\`

**Interfaces:**
- Produces: host status vocabulary \`verified-install\`, \`verified-discovery\`, \`manual-only\`, \`unverified\`, \`unsupported\`.
- Produces: consumer entrypoint \`CONSUMER.md\`.
- npx payload copies \`CONSUMER.md\`, not maintainer-only root \`AGENTS.md\`.

- [ ] **Step 1: Write RED validator and installer assertions**

\`validate-activation-contract.mjs\` must require an ADR table with one row each for Claude Code, Codex CLI, and generic/manual agent, and columns:

\`\`\`text
install location | discovery | activation | hooks | rollback | evidence status
\`\`\`

It must reject:

- npx copy described as automatic plugin or slash-command activation;
- \`installed\` or \`enabled\` used as proof of skill discovery;
- unsupported universal-host language;
- consumer instructions containing repository-maintainer rules.

Modify the installer validator first so it expects \`CONSUMER.md\` in \`copyEntries\` and rejects \`AGENTS.md\`.

Run both validators and confirm they fail for the missing ADR/consumer file and current payload.

- [ ] **Step 2: Add the contract and consumer entrypoint**

The ADR must state:

- Claude/Codex GitHub plugin install was verified only to installed/enabled state on 2026-07-13;
- actual fresh-session discovery is unverified until #60;
- hooks are optional and host-specific until #61;
- generic npx installation is a readable local copy requiring explicit manual reference;
- rollback means host uninstall for plugin paths and ownership-aware local lifecycle only after #49.

\`CONSUMER.md\` must explain how to manually read \`skills/gooblin/SKILL.md\`, how direct commands map to skills, what is not auto-enabled, and the safety floor. It must not say the consumer repository is itself a plugin-pack repository.

- [ ] **Step 3: Change npx payload behavior**

Replace \`AGENTS.md\` with \`CONSUMER.md\` in \`copyEntries\`. Installer output must say:

\`\`\`text
Readable skill pack copied. Your host has not discovered or activated Gooblin automatically.
Manual entrypoint: .gooblin/CONSUMER.md
\`\`\`

Keep writes inside \`.gooblin/\` and preserve all #57 destructive-operation guards.

- [ ] **Step 4: Align every public host surface**

Use the ADR vocabulary across the listed README, Pages, docs, adapters, Cursor rule, and Codex metadata. Correct the stale Codex \`0.141.0\` “latest” entry to the dated \`0.144.1\` installed/enabled evidence without converting it into discovery evidence.

- [ ] **Step 5: Run the manual-copy smoke and common gates**

Install into a temporary fresh project. Verify:

- \`.gooblin/CONSUMER.md\` exists;
- \`.gooblin/AGENTS.md\` does not exist;
- no file outside \`.gooblin/\` changed;
- local links from the consumer entrypoint resolve;
- output contains the manual activation boundary.

Then run all common gates, commit as \`docs: define host activation contract\`, review, merge, and close #48 only after the smoke evidence is recorded.

---

### Task 5: Make claims validation cover every public surface for #59

**Files:**
- Create: \`scripts/lib/claims-policy.mjs\`
- Create: \`scripts/fixtures/claims.json\`
- Modify: \`scripts/validate-claims.mjs\`
- Modify: \`docs/claims-policy.md\`
- Modify: \`docs/maintenance.md\`
- Modify: \`README.md\`
- Modify: \`docs/index.html\`
- Modify: \`docs/benchmarking.md\`
- Modify: \`docs/compatibility.md\`
- Modify: \`docs/verified-install-paths.md\`
- Modify: \`docs/plugin-distribution.md\`
- Modify: \`package.json\`
- Modify: \`plugin.yaml\`
- Modify: \`.claude-plugin/plugin.json\`
- Modify: \`.claude-plugin/marketplace.json\`
- Modify: \`.codex-plugin/plugin.json\`

**Interfaces:**
- Produces rule ids \`numeric-improvement\`, \`unverified-comparison\`, \`activation-overclaim\`, \`official-support\`, and \`universal-compatibility\`.
- Claims evidence block requires method, sample, limitations, and raw-evidence link.

- [ ] **Step 1: Add fixture-first claim rules**

\`claims.json\` must include rejected cases for:

- \`+4 improved\`;
- do not allow \`20% safer\`;
- do not allow \`2x faster\`;
- \`npx gooblin install activates /gooblin\`;
- \`works with any coding agent\`;
- do not allow \`officially supported\`;
- \`stops overbuilding\` without evidence.

It must include allowed cases for:

- explicit negation of a claim;
- a dated, bounded four-task prompt-only pilot observation that links method, sample, limitations, and raw evidence;
- \`installed and enabled; discovery unverified\`;
- \`manual-only readable copy\`;
- exact documented host/version observation.

The validator must execute every fixture and assert both the decision and exact rule id. Do not treat any line containing \`not\` or \`no\` as automatically safe.

- [ ] **Step 2: Verify RED against current public files**

Run \`npm run validate:claims\`.

Expected: FAIL on current README \`+4\` language, Pages effect/universal-agent language, and metadata “team” wording that can imply runtime teammates.

- [ ] **Step 3: Cover Markdown, HTML, JSON, and YAML**

Scan these roots and extensions:

\`\`\`text
README.md, CONSUMER.md, AGENTS.md, docs/, adapters/, skills/, commands/,
evals/, package.json, plugin.yaml, .agents/, .claude-plugin/, .codex-plugin/
md, html, json, yaml, yml, mdc
\`\`\`

Parse structured files enough to report the exact file and field/line. Keep the implementation dependency-free.

- [ ] **Step 4: Correct public copy**

Replace the current \`No benchmark claims yet\` / \`+4 improved\` tension with a bounded observation or remove the number. Across Pages, npm, and plugin metadata, describe Gooblin as a lightweight engineering preflight/router made of reusable instructions, not an executing subagent team. Use #48 status vocabulary for host claims.

- [ ] **Step 5: Run GREEN and common gates**

Run \`npm run validate:claims\`, then all common gates. Commit as \`test: enforce public claims policy\`, obtain review, merge, and close #59 only when the validator catches each negative fixture and all public surfaces pass.

---

## Plan Self-Review

- Spec coverage: #57 and the early #55 slice are Tasks 1–2; #50 is Task 3; #48 is Task 4; #59 is Task 5.
- Dependency order: #57 release preparation precedes live publish; #50 and #48 precede #59; no P1 structure change is included.
- Safety: no long-lived npm token, no automatic consumer mutation expansion, no unsupported host or benchmark claim.
- Compatibility: stable skill identifiers are untouched in P0.
- External gates: npm trusted publisher, registry publication, GitHub environment/settings, and tag/release are explicitly live-readback steps.
- Placeholder scan: no deferred implementation placeholder is used; unknown live values must be filled only from observed output in the evidence PR.
