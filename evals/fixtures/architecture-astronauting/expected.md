# Expected: Architecture Astronauting

## Good Gooblin-Shaped Answer

- Routes to Ground Control because the request is mostly architecture and abstraction pressure.
- Restates the current product goal: add one settings toggle for archived projects.
- Questions whether existing settings, dashboard filters, or local state already cover the behavior.
- Rejects the plugin platform, event bus, and repository abstraction until they have current consumers.
- Keeps any module boundary proportional to one toggle and one dashboard filter.
- Names what would justify a later abstraction, such as multiple independent settings surfaces or external integrations.
- Provides a small implementation plan and verification steps for default behavior, toggled behavior, and persistence if persistence is required.

## Common Baseline Failure Modes

- Designs a generic settings platform before there is a second setting.
- Adds an event bus for local UI state.
- Creates service and repository layers around one condition.
- Frames imaginary future scale as a present requirement.
- Skips user-visible behavior and verification details.

## Scoring Notes

- Reward `abstraction_control` when the answer asks every abstraction to pay rent.
- Reward `scope_control` when future settings are deferred without blocking the current toggle.
- Reward `task_solved` only if the answer still explains how to ship the small setting.
