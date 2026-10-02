# V2 Alert review

Local `feat/v2`, 2026-10-01. v1 source and stories unchanged; no commit, push or publishing.

## Implementation

All existing variants, custom/no icons, primary/secondary actions, refs, native attributes and controlled/uncontrolled dismissal remain available. Added optional `presentation="header" | "overlay"`; inline remains default.

- Header: 16px padding, 12px gap, 1.2px bottom status border.
- Overlay: 384px reference maximum width, 8px radius, recorded three-layer XL shadow, 16px header/body padding, 16px header gap, 12px body gap and 0.4px divider. AlertTitle goes into its header (also through fragments); arbitrary other children remain body content.
- Title: Inter 16px / 500. Description: Inter 12px / 400. Both use CSS line-height:normal and primary text.
- Status borders use the 200 palette; overlays have white surfaces. Existing 20px icon dimensions are retained. The coordinating agent could not verify the missing icon child values because the logged-in Figma browser became unavailable; those dimensions are explicitly unverified.

Rebuilt all existing example coverage with args-driven Controls. Added Header, Overlay, contained presentation/state galleries, all six v1/v2 inline pairs and a working local settings form. Close and Show alert synchronize open in Controls. Gallery dismissal is independent.

## Actual browser checks at localhost:6008

- Overview: variant success and presentation overlay changed the actual card. Measured width384, radius8, success border rgb(171,239,198), exact XL shadow, header/body padding16, header gap16, title16/500, description12/400 primary text.
- Closed the alert; open Control became false. Show alert restored it.
- Overlay individual: changed variant to warning; actual white surface and warning200 border applied; both action buttons measured32px.
- All variants: changed presentation to header; all six alerts changed together. Measured16px padding, zero top border, status200 bottom borders (browser pixel rounding renders1.2px as1px at this viewport). Inspected every color.
- All presentations: checked inline/header/overlay composition and text alignment.
- States: visible, focus, disabled actions and dismissed. After reload the focus action computed solid1px outline; disabled action was disabled. Checked all four cards.
- v1 vs v2: checked all12 inline samples; actual title fonts were Source Sans Pro and Inter. Rechecked readable first-pair text after HMR settled.
- Usage: typed Priority support, saved, and verified Saved locally: Priority support. Dismissed/reopened feedback and checked open synchronization.
- Docs: checked install/import and both tables, zero headings within table cells; actual hex swatches readable. No component console errors in the final review.

## Checks / evidence

43 focused Alert tests passed, including fragmented overlay title placement, controlled dismissal and header custom content/actions. Focused ESLint, Prettier and story-inclusive TypeScript passed. Root owns full Storybook production build and metadata generation.

Screenshots manually read: `/Users/ankish/.codex/visualizations/2026/10/01/v2-alert/` overview-overlay.png,variants.png,presentations.png,states.png,comparison.png,usage.png,docs-top.png,docs-tables.png.

Metadata: Alert source needs only lucide-react and existing utility dependencies; Button/Input are story compositions, not shipped Alert imports.

## Final action-log repair (2026-10-01)

Rechecked at http://localhost:6008 after a story-only repair. With Two Actions: Continue with Enter and Cancel with a pointer click log onAction: [] and onSecondaryAction: []. The earlier 6030 check confirmed the old code logged React event objects; that particular Alert click did not throw. Both action adapters are now safe across all alert compositions.

Component callback APIs and v1 source were not changed. Focused story ESLint, formatting and story-inclusive TypeScript checks pass. No Maximum call stack error occurred in the rechecks. Manually inspected screenshot: `/Users/ankish/.codex/visualizations/2026/10/01/v2-alert/action-log-fixed.png`.
