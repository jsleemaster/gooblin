# Generic Agent Adapter

Use this when an agent can read repository files but does not support Gooblin as a plugin.

## Setup

Reference these files or folders in the agent context:

- `AGENTS.md`
- `skills/`
- `commands/`
- `docs/install.md`

Then prompt:

```text
Use /gooblin for this task. Diagnose the task type first, then route to the smallest useful teammate set.
```

## Expected Behavior

The agent should preserve the Gooblin kernel:

- Spec first.
- Route before roleplay.
- Smallest safe change.
- Reproduce before fixing.
- Defer optional scope.
- Verify before calling work done.

## Do Not Claim

Do not call this an official plugin install. It is manual skill-pack usage.
