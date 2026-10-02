# Panel v2 review

Reviewed locally on `feat/v2` at http://localhost:6008 on 2026-10-01. Recorded values and current v1 behavior were used; v1 files are unchanged.

## Source and stories

Inter typography and 16px medium title; recorded 1.2px left border and three-layer XL shadow. The existing 280/320/400px width API, 300ms transition, initial focus, Escape forwarding, default/custom header, scrollable body and optional footer remain available. Native attributes and ref are retained. The Figma frame's 72px placement inset was not added to the component.

Overview and individual examples synchronize open/name/email with Controls. Galleries fix only their documented axes, retain other controls and keep independent panel state. Comparisons use current v1 Panel/Input/Button and v2 equivalents. Usage saves contact changes locally.

## Manual browser review

- Overview measured 320px, Inter and the exact three-layer shadow. Closing measured an intermediate 227px then settled at 0px; reopening measured an intermediate 222px then settled at 320px. Escape closed the panel and changed the open Control to false. The Control reopened it. Typing Noor Khan updated name Controls.
- Individual Footer, Custom Header, Small, Large, Collapsed and Scrollable compositions reviewed through Docs and their gallery examples.
- All sizes measured 280/320/400px. All compositions, open/closed/disabled/focused states, and six v1/v2 width samples inspected. Focused close has a solid 1px outline. A gallery bug that used a state caption as the contact name was corrected and rechecked: all samples retain the name Control.
- Usage typed Mira Shah and saved: local confirmation appeared. Clicking Custom field 10 scrolled the body to 623px of 938px content in a 315px viewport; header and footer remained fixed.
- Docs install/import, migration table, token table and stories inspected. No heading elements occur inside table cells.

19 focused tests passed; focused lint and story-inclusive TypeScript passed. Temporary shared HMR index errors were resolved by clean navigation before the final captures; they are not claimed as successful component reviews.

Screenshots visually inspected: `/Users/ankish/.codex/visualizations/2026/10/01/v2-panel/overview.png`, `sizes.png`, `compositions.png`, `states.png`, `comparison.png`, `usage.png`, `scrolling.png`, `docs-top.png`, `docs-tables.png`.
