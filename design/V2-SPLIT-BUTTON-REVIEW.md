# Split Button review — 2026-10-07

## Implementation

New `ui/v2/split-button`, exported as `SplitButton`, `SplitButtonProps`, and `SplitButtonAction`. No v1 equivalent or automatic replacement. Composes existing v2 Button and Dropdown Menu; preserves the primary color and 8px outer radius. Supports primary/secondary plus default/outline aliases, 36/44/50px text sizes, icons, per-item disabled/destructive styles, loading, controlled/uncontrolled menu visibility, native main-button attributes and ref.

The main action and alternative callbacks are independent. Empty actions render one normal button. Disabled/loading closes and blocks the menu. Shared Button label/icon/width feedback, a stable popup anchor, chevron rotation and staggered content fades provide restrained motion. Reduced motion removes movement. The divider is attached to the trigger edge with a pseudo-element, so it does not sit inside the centered icon content. The docs preview reserves a 420px minimum viewport in both closed and open states so opening the menu does not move the trigger during its animation.

## Screenshot follow-up — focus and preview sizing

The external focus outline exposed the square inner corners of each joined segment. An inset outline was tried first; the user subsequently requested removing the selection outline completely. Both joined segments now suppress the focus outline. A button without alternative actions retains the shared Button focus treatment. Brand colors and outer corner radius are unchanged.

The follow-up passes all 19 Split Button tests, all 11 preview tests, the compiled preview Button CSS check, preview TypeScript and component ESLint. All 49 Split Button class tokens compile. Preview entrypoint lint findings were compared against the pre-edit source: the same six errors and two warnings remain; this change introduces none. The CLI build and 45-component v1 integrity check pass. Local browser inspection remains blocked as described below.

Fifteen stories cover Overview, styles, sizes, disabled/loading, icons, disabled items, long labels, comparisons, Usage and keyboard interaction. The controlled examples synchronize menu visibility with Customize; galleries keep menus independent. Example feedback is local and does not send, publish or delete real data.

## Reference observation

Inspected https://uiarc.dev/components/split-button through the external browser. Opened its menu, inspected the screenshot, selected Save as draft and observed the changed main label and returned trigger focus. Used its default-action-plus-alternatives interaction pattern with our shared component styles.

## Verification

- 155 focused tests pass across SplitButton (19), Button (93) and Dropdown Menu (43). Final divider correction also passed all 19 SplitButton tests.
- 11 docs preview tests pass, including three new SplitButton tests for synchronized menu visibility, live Controls/feedback, and independent comparison menus. Registry imports 58 story modules / 816 story exports.
- 60 CLI v2 registry/dependency/source tests pass after the final source correction.
- Story and preview TypeScript checks, focused ESLint, formatting and diff whitespace checks pass.
- All 45 new class tokens compile; no missing utility output.
- CLI, Storybook and Next docs production builds pass. The final preview build includes popup sizing and the corrected divider.
- Fresh React 18 consumer installation of only v2-split-button installs SplitButton, Button and Dropdown Menu verbatim plus eight npm dependencies, including Radix Dropdown Menu, Motion and tailwindcss-animate; creates no v1 Button file.
- Plain and tw-prefixed consumers install all 58 v2 sources verbatim and retain correct v1 output/prefix guidance.
- All 309 pre-existing UI component/story/test files match the pre-task snapshot. All 45 v1 primitives pass the integrity check.
- Generated public catalog/token source snapshots are restored after the Storybook build to avoid unrelated stale-metadata churn; generated build output includes the new component. Existing v1-only MCP payload remains unchanged; its metadata source now describes SplitButton for future generation.

## Limitations

Localhost browser access remains explicitly restricted by the browser tool. No alternative browser or transport workaround was used. Local visual review, motion feel, actual viewport geometry and real-browser Storybook play execution remain unverified; tests and build output are not visual sign-off.

Local only on codex/v2-motion-polish. No commits, pushes, publishing, Figma changes or product synchronization.
