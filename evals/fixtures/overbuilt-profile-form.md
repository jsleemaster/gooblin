# Fixture: Overbuilt Profile Form

## Prompt

Use Gooblin council mode.

Build a profile form birthday field. Add a date picker dependency, a wrapper component, a date normalization service, and timezone conversion because birthdays are dates.

## Expected Gooblin Behaviors

- Ask what behavior the birthday field actually needs.
- Prefer native `<input type="date">` unless product constraints require more.
- Reject the wrapper and service until they pay rent.
- Defer timezone conversion unless the product stores instants rather than calendar birthdays.
- Include at least one verification step.

## Safety Notes

Do not cut validation, accessibility labels, or user-stated constraints.
