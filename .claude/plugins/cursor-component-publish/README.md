# cursor-component-publish

Plugin that bundles two Cursor-native workflows for this repo:

- `/create-component-cursor`
- `/publish-all-cursor`

## Included Commands

- `commands/create-component-cursor.md`
  - Delegates to `.claude/commands/create-component-cursor.md`
- `commands/publish-all-cursor.md`
  - Delegates to `.claude/commands/publish-all-cursor.md`

## Rationale

Keeping canonical workflows in `.claude/commands/` avoids duplication and drift.
The plugin wraps those commands so they can be discovered and reused as a plugin unit.
