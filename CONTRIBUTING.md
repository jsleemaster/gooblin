# Contributing To Gooblin

Gooblin is a small plugin-style Agent Skills pack. Keep changes boring, reviewable, and easy to delete.

## What To Open

- Bugs, typo fixes, and small documentation corrections can go straight to a pull request.
- New skills, new commands, new adapters, new hooks, benchmark claims, and distribution changes should start with an issue.
- Keep one conceptual change per pull request.

## Design Rules

- `/gooblin` stays the primary interface.
- Character commands are advanced shortcuts, not the main user experience.
- Skills should stay readable as plain Markdown.
- Hooks should stay tiny, dependency-free, and safe by default.
- Do not add app scaffolding, runtime services, build tooling, or dependencies without a concrete compatibility reason.

## Before Opening A Pull Request

Check `docs/maintenance.md` for affected surfaces, then run:

```bash
npm run validate
git diff --check
```

For release or package changes, also run:

```bash
npm pack --dry-run
```

Do not claim adoption, benchmarks, marketplace approval, official host support, or integrations unless the repository includes evidence and reproduction notes.
