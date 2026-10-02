# Dialog v2 review

Worktree: `/Users/ankish/Downloads/Code/storybook-npm-v2`, branch `feat/v2`. Local, uncommitted.

## Changes

- Existing Radix props, callbacks, portals, scroll containment, focus trap, Escape and focus return are preserved.
- Content uses 12px corners, the recorded 1.2px stroke and overlay shadow, with no outer padding. Header owns its 24px padding and divider; body composition uses 24px / 16px gaps; footer uses 0 / 24 / 24px padding and 8px gaps. Composed modal overrides continue to merge after these defaults.
- Existing size names remain; widths are 384 / 512 / 672 / 896px, with full viewport size. A 16px viewport gutter prevents narrow screens touching the edges.
- Stories expose synchronized open Controls, editable titles/descriptions/body/actions, header icon, close visibility and loading. Individual sizes inherit the playground. Galleries are inline presentations without portals or focus scopes, contained horizontally; Usage is a working local profile form.

## Checks completed

- 27 focused tests passed, including v1/v2 accessibility, Tab trapping, Shift+Tab, Escape and focus return parity; consumer Escape cancellation; content ref; section override merging.
- Focused ESLint and formatting passed. Story-inclusive TypeScript check passed using `/tmp/myoperator-dialog-stories-tsconfig.json`.
- Browser on localhost:6008: opening updates the open Control; Escape closes and restores trigger focus; changing open Controls opens/closes the actual dialog. Small size Control rendered 384px; title and icon Controls updated the visible header. Loading disabled the primary action, hideCloseButton removed the corner control, and Escape still dismissed.
- Rendered: Inter title 16px / 500; description 12px; corners 12px; header padding 24px; body padding 24px / gap16; footer 0 / 24 / 24px / gap8. Chromium rasterizes the authored 1.2px stroke to a computed 1px at its device scale.
- Original v1 Dialog source, stories and tests retain their pre-edit SHA-256 hashes.

## Remaining browser review completed

- Docs: seven migration rows and nine token rows reviewed. No headings inside table cells, no portals over the page. Installation, import, guidance and tables remain readable.
- Individual Small: size Control changed from small to large and the actual dialog measured 672px.
- AllVariants: editing title updated all three compositions; loading disabled all three actions. All inline views have zero modal roles.
- AllSizes: measured 384 / 512 / 672 / 896 / 896px (the inline Full sample is deliberately bounded). Gallery scroll is contained: client width 1248px, content 3464px, document and viewport both 1280px.
- States: default, saving and hidden corner close reviewed, including their differing close/action controls.
- Comparison: all ten v1/v2 cards reviewed. The 968px comparison is contained within its 948px scroller; document and viewport remain 980px. Legacy title/corners and v2 divider/type/actions are visible.
- Usage: typed a new profile name and observed its Control update; changed email via Controls and observed the field update. Tab and Shift+Tab stayed inside the dialog. Save updated the profile card and closed; Cancel restored the previously saved name in Controls.

Evidence: `design/review/dialog/overview-controls.png`, `all-sizes.png`, `states.png`, `comparison.png`, `usage-form.png`, `docs.png`, `docs-change-table.png`, `docs-token-table.png`.

## Integration gate

Global production Storybook build, mobile sweep and composed Confirmation/Delete/FormModal integration are owned by the main agent. Shared indexing briefly failed during other concurrent writes and recovered before the completed reviews above.
