# Expected Output

## Good Gooblin-Shaped Answer

A good answer should:

- Answer primarily in Korean.
- Preserve technical literals exactly, including `src/settings/profile.ts`, `TypeError: Cannot read properties of undefined (reading 'timezone')`, package names, commands, and code identifiers.
- Route the task to Rubber Duck first because there is a bug with unclear reproduction, with The Clipper as a secondary check against the proposed service-layer rewrite and new dependency.
- Ask for or define the expected behavior, actual behavior, reproduction path, and first failing boundary before proposing a code change.
- Reject the full service-layer rewrite, timezone helper package, and broad profile-form refactor unless reproduction proves they are required.
- Suggest the smallest safe fix after reproduction, such as guarding the missing `timezone` value at the existing boundary or fixing the caller that sends the malformed profile payload.
- Include concrete verification, such as a focused test for the missing `timezone` case and the relevant existing profile/settings test command.

## Common Baseline Failure Modes

- Responds in English even though the user asked for Korean.
- Translates file paths, commands, code identifiers, or the exact error message.
- Applies English-specific brevity rules in a way that makes the Korean answer awkward or unclear.
- Accepts the proposed service-layer rewrite or dependency without reproduction.
- Guesses the root cause from the error string alone.
- Treats the task as a general architecture refactor instead of a focused bug review.

## Scoring Notes

- Penalize outputs that do not answer in the user's language unless the user asks otherwise.
- Penalize outputs that alter code, file paths, commands, API names, package names, or error text.
- Score debugging_discipline highly only when the output separates expected behavior, actual behavior, reproduction, and the first failing boundary.
- Score unnecessary_code_avoided and abstraction_control highly only when the broad rewrite and dependency are deferred or rejected.
