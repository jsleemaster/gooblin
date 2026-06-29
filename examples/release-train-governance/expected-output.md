# Expected Output

## Gooblin Router

Route: Shipcheck
Why: The request is release-governance work before shipping.

## Shipcheck

### Cut unnecessary work

Cut optional polish, not release controls. Keep the release path small: one PR per release, one release review note, one tag.

### Ground the architecture

The product goal is a trustworthy public repo. Release mechanics are part of the product surface.

### Reproduce or bound blockers

Name the blocker exactly. If a required approval cannot be produced by the current actor, record the review evidence and any temporary protection change.

### Defer optional scope

Defer nonessential screenshots, demos, and speculative integrations. Do not defer version alignment, release notes, or verification.

### Safety floor

Do not weaken branch protection permanently or claim an approval that did not happen.

### Verification

Check PR state, release tag, milestone state, and final branch protection settings.

## Verdict

Do this: keep PRs, review notes, merge records, tags, and restored branch protection.

Do not do this: permanently weaken protections or claim an approval that did not happen.

Verify with: PR state, release tag, milestone state, and final branch protection settings.
