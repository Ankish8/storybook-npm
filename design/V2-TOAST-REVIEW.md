# Toast v2 review

Worktree `/Users/ankish/Downloads/Code/storybook-npm-v2`, branch `feat/v2`; local only.

## Changes

Preserved the current provider, store/reducer, helper functions, removal delay and limit. The component uses the recorded 384px / 8px container and two-row composition: header16/gap16, title16/500; description/action row12/16/gap12, description12/400, small outline action. Six treatments include destructive as an error alias. Status borders use their color-200 tokens; default description is muted and status descriptions use semantic text colors. Stories keep composition-only arguments out of Radix DOM props, synchronize primitive open state with Controls and show full contained comparisons plus a working store-backed form.

## Verified

- 31 focused tests passed without act warnings. Focused lint/formatting and story-inclusive TypeScript passed; original v1 hashes unchanged.
- Browser Overview: width384, radius8, header padding16, body12/16. Title and variant Controls update the actual toast. Close and visible duration500 update open=false.
- Individual Info story title is editable. Browser caught React-event serialization from raw action spies; callbacks now call spies without the browser event. Its real action now invokes and closes, synchronizing open=false.
- All six gallery copies update from a title Control. Measured defaults/statuses: default white/E9EAEB/717680, success ECFDF3/ABEFC6/067647, error+destructive FEF3F2/FECDCA/B42318, warning FFFAEB/FEDF89/B54708, info ECF1FB/A8C0EC/2F5398 (surface/border/description).
- Visible, disabled action and genuinely unmounted dismissed-state presentation reviewed. No invented faded closed toast remains.
- Complete v1/v2 comparison has 12 samples, including the error/destructive alias mapping, icons/close/actions. Width is contained: document980 / viewport980.
- Usage typing updates workspaceName Controls. Save updates the saved card and emits the shipped toast(); Undo restores the prior card, field and Control and dismisses the notification.
- Docs change/token tables inspected: five/nine rows, readable swatches and values, no headings inside cells. Inline presentations never mount global notification viewports over Docs.

Evidence: `design/review/toast/overview.png`, `variants.png`, `states.png`, `comparison.png`, `usage.png`, `docs.png`.

Concurrent Storybook index errors were cleared before final Usage/Docs checks. Global build, mobile and swipe gesture sweep remain integration gates; swipe API is preserved but no gesture-parity claim is made.
