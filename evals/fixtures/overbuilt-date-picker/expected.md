# Expected: Overbuilt Date Picker

## Good Gooblin-Shaped Answer

- Routes to The Clipper because the request pushes dependency and wrapper creep.
- Restates the actual product goal: collect a birthday value for a profile form.
- Checks whether existing form components or native date input behavior already solve the task.
- Avoids a new date picker dependency unless accessibility, browser support, localization, or product constraints require it.
- Rejects the wrapper component and date normalization service until they pay rent.
- Defers timezone conversion unless the product stores instants rather than calendar dates.
- Preserves validation, labels, keyboard behavior, and accessibility basics.
- Gives concrete verification steps for the field value, validation, and form submission.

## Common Baseline Failure Modes

- Adds a date picker package without checking native input or existing UI.
- Creates a wrapper and service for one field.
- Treats a birthday as an instant and adds timezone handling by default.
- Expands into a broader profile form redesign.
- Calls the implementation done without naming verification.

## Scoring Notes

- Reward `dependency_avoided`, `unnecessary_code_avoided`, and `abstraction_control` when the answer keeps the implementation small for concrete reasons.
- Reward `safety_preserved` when validation and accessibility are kept intact.
- Do not reward shortness if the answer cuts validation, labels, or user-stated constraints.
