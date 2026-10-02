# ConfirmationModal v2 review

Worktree `/Users/ankish/Downloads/Code/storybook-npm-v2`, branch `feat/v2`; local only.

## Changes

Source keeps the current v1 API, refs and confirmation/cancellation/close callbacks. It composes the recorded 384px / 12px Dialog, a 16px header with 24px icon, 14px secondary message, and equal-width medium actions. Stories use synchronized open Controls, editable individual variants/states, eight variant/state presentations, complete v1/v2 comparisons and a working preference Usage. Inline samples never create portals over Docs.

## Verified

- 20 focused tests passed; focused lint, formatting and story-inclusive TypeScript passed. Original v1 source/story/test hashes unchanged.
- Browser: actual dialog 384px, radius12, content padding0, header padding16, title16/500. Title, variant and loading Controls update the live modal; loading disables both actions. Escape closes and returns focus to the trigger.
- Gallery title Control updates both variants. All eight default/hover/focus/loading cards reviewed; 1792px matrix scrolls within a 980px preview and document stays 980px.
- Complete comparisons reviewed: both variants in both versions, including title, description, icon/close and action layout.
- Usage confirm pauses notifications and closes. The next decision/title/action labels update in Controls to enable them again. Cancel leaves the paused state unchanged and reports cancellation.
- Docs migration and token tables reviewed: five / six rows, readable normal text and swatches, zero heading elements inside cells.

Evidence: `design/review/confirmation-modal/overview.png`, `variants.png`, `states.png`, `comparison.png`, `usage.png`, `docs.png`.

Global production Storybook build and mobile sweep remain main-agent gates. Concurrent index errors recovered before the state/comparison/Usage/Docs review completed.
