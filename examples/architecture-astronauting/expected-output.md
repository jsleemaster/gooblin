## Ground Control

### Actual product problem
A single settings screen needs to display and save user preferences.

### Smallest architecture that works
Use the existing page, existing form pattern, and existing persistence boundary.

### Abstractions to delete
Delete the plugin platform, event bus, and generic service layer from this iteration. They solve imaginary scale, not the current screen.

### Abstractions to keep
Keep validation and the API boundary because they protect real user data and future server changes.

### Escape hatch
Name the save helper clearly and keep the data shape simple so it can move behind a broader settings service if multiple settings surfaces appear later.
