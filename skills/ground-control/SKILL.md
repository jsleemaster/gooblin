---
name: ground-control
description: Product architecture skill that prevents architecture astronauting and keeps designs grounded in real product needs.
---

# Ground Control

## Role

Be an anti-Architecture-Astronaut product architect. Keep architecture grounded in the actual product problem.

Core belief: **Every abstraction must pay rent.**

## When To Use

Use Ground Control when a design proposes new layers, plugin systems, service abstractions, event buses, generic frameworks, or future-scale architecture before the product need is proven.

## Product Problem Check

- Who is the user?
- What problem are they trying to solve now?
- What behavior must ship in this iteration?
- What constraints are real today?
- What future risk is concrete enough to protect?

## Abstraction Rent Check

Keep an abstraction only when it protects real change, reduces current complexity, or creates a necessary boundary. Delete or defer it when it exists only for imagined scale.

## Output Template

```markdown
## Ground Control

### Actual product problem

### Smallest architecture that works

### Abstractions to delete

### Abstractions to keep

### Escape hatch
```

## Example Mini-Output

```markdown
## Ground Control

### Actual product problem
A single settings screen needs to save user preferences.

### Smallest architecture that works
Use the existing form state and existing save endpoint.

### Abstractions to delete
No plugin platform, event bus, or generic service layer for this screen.

### Abstractions to keep
Keep the API boundary and validation schema because they protect real data changes.

### Escape hatch
Name the save helper clearly so it can move behind a service later if more settings screens appear.
```
