# Final gallery containment review

Reviewed in Chrome against the current Storybook development preview at `http://127.0.0.1:6008`, on `feat/v2`, on 2026-10-01. Browser viewport: 1280 × 960; the Storybook preview iframe document had a 980px client width. The viewport override was reset after the review.

## Change

`ReadableField`'s `V1VsV2` story inherited centered layout and measured `scrollWidth=992`, `clientWidth=980`, producing 12px of page overflow. Its existing `widePreview: true` parameter now also sets `layout: "padded"`. After the change, both values are 980px. No component, v1, label, layout inside the comparison, Controls, or event behavior changed.

The other three comparison stories that bypass the shared `gallery()` helper—Skeleton, Spinner and BouncingLoader—already measured 980/980 and were left unchanged. The root agent's shared `gallery()` layout change is a separate edit.

## Browser measurements

All 31 reviewed views across 16 components pass the document containment check after the fix: `documentElement.scrollWidth <= documentElement.clientWidth` (980/980). Wide grids retain their local scrolling container. The local widths below are client/scroll widths; a value greater than the local client width is expected and does not cause page overflow.

| Component | Views reviewed | Page client/scroll | Overflowing local containers client/scroll |
| --- | --- | --- | --- |
| Dialog | V1VsV2; States | 980/980 each | Comparison 948/968; States 948/1208 |
| Tooltip | V1VsV2; States | 980/980 each | States 948/1132 |
| DropdownMenu | V1VsV2; States | 980/980 each | States 948/972 |
| ConfirmationModal | V1VsV2; States | 980/980 each | Comparison 948/956; States 948/1792 |
| DeleteConfirmationModal | V1VsV2; States | 980/980 each | States 948/1672 |
| Toast | V1VsV2; States | 980/980 each | Comparison 948/956; States 948/1256 |
| FormModal | V1VsV2; States | 980/980 each | States 948/1216 |
| SearchFilter | V1VsV2; States | 980/980 each | States 948/1224 |
| ReadableField | V1VsV2; States | 980/980 each | None |
| Skeleton | V1VsV2; AllShapes | 980/980 each | None |
| Spinner | V1VsV2; AllVariants | 980/980 each | None |
| BouncingLoader | V1VsV2; AllSizes | 980/980 each | None |
| Typography | V1VsV2; States | 980/980 each | None |
| UiCard | AllVariants; States | 980/980 each | None |
| PageFooter | AllVariants; States | 980/980 each | None |
| ShimmeringText | States (alias of AllVariants) | 980/980 | None |

Each measurement followed an actual browser navigation and a visible rendered story. No measured view displayed Storybook's error state. This review addresses the final containment risk; previously completed Docs, Controls and interaction reviews remain recorded in each component's report. Radio and Breadcrumbs containment were assigned to the root agent and are not included in this table. Broad tests were not repeated for this story parameter change; the root agent confirmed the final story type, lint and format checks.

## Evidence

- Raw measurements: [measurements.json](review/containment-dialog/measurements.json).
- Before: [ReadableField comparison overflow](review/containment-dialog/readablefield-before.png).
- After: [ReadableField comparison contained](review/containment-dialog/readablefield-after.png).
- Wide local scrolling: [Dialog States](review/containment-dialog/dialog-states-contained.png).
- Additional gallery: [ShimmeringText States](review/containment-dialog/shimmering-states-contained.png).

Sources and stories are frozen for the final production build. No commits, pushes or publishing were performed.
