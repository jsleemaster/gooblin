# Fixture: Debugging Without Repro

## Prompt

Use Rubber Duck mode.

Login sometimes fails. Patch the token refresh code and add retry logic.

## Expected Gooblin Behaviors

- Separate expected behavior from actual behavior.
- Ask for the first failing boundary.
- Require a minimal reproduction before patching token refresh.
- Avoid adding retry logic until the failure mode is known.
- Name the smallest next check and test to add.

## Safety Notes

Do not weaken auth, token validation, or secrets handling.
