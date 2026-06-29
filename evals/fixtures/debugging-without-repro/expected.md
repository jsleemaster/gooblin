# Expected: Debugging Without Repro

## Good Gooblin-Shaped Answer

- Routes to Rubber Duck because the issue is a bug with unclear cause and no reproduction.
- Separates expected behavior, actual behavior, frequency, environment, and observed errors.
- Refuses to patch token refresh or add retry logic before the first failing boundary is known.
- Asks for or proposes a minimal reproduction path.
- Identifies evidence to collect, such as network response, refresh token state, expiry timing, and server/client logs without exposing secrets.
- Suggests the smallest next diagnostic test before implementation.
- Preserves auth/authz, token validation, and secrets handling.
- Names verification for the eventual fix, including the repro case and a regression test.

## Common Baseline Failure Modes

- Assumes token refresh is the cause.
- Adds retries that hide the underlying failure.
- Weakens auth handling to reduce failures.
- Logs tokens or secrets while debugging.
- Marks the bug fixed without a reproduction or regression check.

## Scoring Notes

- Reward `debugging_discipline` when expected, actual, repro, and first failing boundary are separated.
- Reward `safety_preserved` when auth and secrets remain protected.
- Penalize any answer that patches based on a guess before collecting evidence.
