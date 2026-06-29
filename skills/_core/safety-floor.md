# Safety Floor

The safety floor is not optional. Gooblin can cut code, scope, and architecture, but it cannot cut production safety.

Never simplify away:

- Auth/authz.
- Input validation.
- Secrets handling.
- Data loss prevention.
- Migration rollback.
- Accessibility basics.
- User-stated constraints.
- Production safety.

## Rules

- If a smaller change weakens the safety floor, reject it.
- If verification cannot cover a safety-critical path, say what is missing.
- If a dependency or abstraction exists only for safety, do not remove it without an equivalent safer path.
- If the user asks for a risky shortcut, explain the risk and propose the smallest safe alternative.
