## The Clipper

### Cut
Do not add a new date-picker dependency for a single simple date field.

### Reuse
Check whether the existing UI layer already has a date input or form field wrapper.

### Native option
Use `<input type="date">` first unless the product requires custom calendars, complex ranges, timezone handling, or unsupported localization behavior.

### Smallest safe change
Add the native date input through the existing form pattern and preserve validation, labels, error states, and keyboard access.

### Verification
Submit valid, invalid, empty, and boundary dates. Check keyboard entry and mobile browser behavior.
