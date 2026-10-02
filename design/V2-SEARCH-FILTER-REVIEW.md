# SearchFilter v2 review

Reviewed the production Storybook at http://127.0.0.1:6029 on 2026-10-01. No new Figma read was performed; styling follows the recorded Input and Dropdown row specs. The current library's search, selection, clear and floating-list behavior remains intact.

## Browser views

- Overview: opened the actual list, selected Sales, reopened its selected row, closed with Escape, cleared, then used native Tab and Enter to select Support. Selection synchronized `value` and `searchValue` Controls. Clear reset both and reopened all five options. The archived option remained disabled. The selected check computed `rgb(39,171,184)`.
- Text Search: typing `sale` synchronized the query Control and showed Sales team. Editing the Control to `billing` updated the input and showed Billing. Placeholder Control changed the actual placeholder to `Find a team`.
- Min Search Length: one character showed all five options, two characters `sa` showed only Sales team. Disabled story rendered a disabled input.
- All sizes: measured 320 / 360 / 420px containers with 40px inputs, 8px radius and Inter. Query edits are visible in the samples; numeric-value reads were redacted by browser tooling, so the numeric synchronization proof is the screenshot rather than a returned numeric value.
- Search Modes: inspected both real inputs and numeric normalization. The same query Control updated both. Numeric input stripped the alphabetic prefix from `ab 3453` while text mode retained its own query.
- States: inspected Ready, Selected, No results, Disabled and Search disabled cards. The final two inputs were disabled; galleries stayed within their own scroll containers.
- v1 vs v2: opened each real list. v1 input computed 42px / 4px corners / Source Sans Pro; v2 computed 40px / 8px / Inter. Legacy rows measured 36px with 14px text and 8 / 16px padding. v2 rows measured 48px with 16px regular text and 10 / 6px padding, transparent background and zero native border. Corrected the legacy input dimensions in the Docs changes row after this browser finding.
- Usage: Customer support selection showed two local conversations and synchronized `value=support`. Typing `Sale` cleared the selection and returned four conversations while synchronizing the normalized text query. Editing the query Control to Billing updated the input and list. Clear returned the full queue.
- Docs: inspected title, install/import, changes and token tables plus rendered examples. Changes table has five body rows, token table seven, prop table thirteen. Neither explanatory table contains headings in body cells. Closed previews did not auto-open dropdown portals.

## Verification

- Focused SearchFilter suite: 23 tests passed. All eight assigned component suites combined: 188 tests passed.
- Story-inclusive typecheck and focused ESLint passed; v1 file hashes unchanged.
- Browser error log on the production preview was empty after the review.
- Browser behavior remains the existing native Tab / Enter path; this review does not claim newly implemented arrow-key navigation.
- Evidence: `design/review/search-filter/{overview,all-sizes,modes,states,comparison,usage,docs-changes,docs-tokens}.png`.

The last change after the 6029 snapshot only corrects the documented v1 input dimensions; the reviewed v2 styling and behavior are identical.
