# Tooltip v2 review

Worktree `/Users/ankish/Downloads/Code/storybook-npm-v2`, branch `feat/v2`; local only.

## Changes and preserved behavior

The existing hover, focus, touch-toggle, controlled open, Escape, refs and callbacks remain. Recorded styling is light info surface, Inter 12px, 6px corners, 6px / 16px padding, 320px maximum width and the small tooltip shadow. Stories expose live open, side, alignment, offset, copy, title and arrow Controls. Inline galleries avoid portals over Docs. Usage composes the recorded tour card as a labelled non-modal dialog with working Skip, Next and Done; these are explicitly story composition controls.

## Checks

- 20 focused Tooltip tests pass. Focused lint, formatting and story-inclusive TypeScript pass.
- Original v1 source, story and test hashes are unchanged.
- Overview: open, rich and copy Controls update the rendered help. Escape updates open false. Individual Right's side Control changes the live side.
- Browser computed tour content: Inter, background rgb(236,241,251), text rgb(52,62,85), padding 6px 16px, radius 6px. It is a labelled dialog and there is one visible Next button, avoiding duplicate interactive content in the hidden tooltip label.
- Usage: Next advances the synchronized step Control through 2 and 3; Done closes with completion status. Reopening via Controls then Skip closes with skipped status.
- AllVariants copy Control updates both samples. Sides/offset matrix has all 12 samples. Its 1472px content scrolls within a 948px preview, while document and viewport stay 980px wide.
- States and v1/v2 comparison manually reviewed. Plain, title/description, hidden, hover and focus presentations have clear hierarchy. Comparison shows dark v1 and light v2 surfaces.
- Docs migration and token tables manually reviewed: six rows each, readable values/swatches, no headings inside table cells, no dialogs over the Docs page.

Evidence: `design/review/tooltip/tour.png`, `variants.png`, `positions.png`, `states.png`, `comparison.png`, `docs.png`.

Global production Storybook build and mobile sweep are owned by the main agent. An old manager server-timeout notification remained after an earlier server restart; the reviewed stories rendered and Controls worked.
