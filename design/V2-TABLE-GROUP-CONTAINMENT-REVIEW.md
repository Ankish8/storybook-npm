# V2 comparison containment review

Completed on `feat/v2` at http://localhost:6008 on 2026-10-01 after the root agent added `layout: "padded"` to the v2 `gallery()` helper.

## Changes in this audit

No component or story files changed in this audit. All 15 original components already have padded meta layout. Every widest gallery in Stepper, Scrollbar, OtpInput and NumberStepField uses `gallery()`, so the shared helper fixes those previews without separate story overrides. No centered-layout comparison was left uncovered in this group. Controls and shipped component behavior were preserved.

## Browser measurements

Used Storybook's Tablet preview, which renders an 834px iframe. For every view below, `documentElement.scrollWidth` equals `documentElement.clientWidth`: 834px. Wider comparison content scrolls only in its local wrapper. The temporary viewport was reset afterward.

| Component | View | Page / viewport | Local scroll content / wrapper |
| --- | --- | --- | --- |
| Table | States | 834 / 834px | 1120 / 802px |
| Tabs | v1 vs v2 | 834 / 834px | 1100 / 802px |
| Alert | v1 vs v2 | 834 / 834px | 900 / 802px |
| Avatar | v1 vs v2 | 834 / 834px | 900 / 802px |
| Accordion | v1 vs v2 | 834 / 834px | 900 / 802px |
| PageHeader | v1 vs v2 | 834 / 834px | 1100 / 800px |
| Pagination | v1 vs v2 | 834 / 834px | Fits without horizontal scrolling |
| EmptyState | v1 vs v2 | 834 / 834px | Fits without horizontal scrolling |
| Panel | All sizes | 834 / 834px | 1500 / 802px |
| ContactListItem | States | 834 / 834px | 820 / 802px |
| ImageMedia | v1 vs v2 | 834 / 834px | Fits without horizontal scrolling |
| ReplyQuote | v1 vs v2 | 834 / 834px | Fits without horizontal scrolling |
| SystemMessage | v1 vs v2 | 834 / 834px | Fits without horizontal scrolling |
| DateDivider | v1 vs v2 | 834 / 834px | Fits without horizontal scrolling |
| UnreadSeparator | v1 vs v2 | 834 / 834px | Fits without horizontal scrolling |
| Stepper | States | 834 / 834px | Fits without horizontal scrolling |
| Scrollbar | States | 834 / 834px | Fits without horizontal scrolling |
| NumberStepField | All variants | 834 / 834px | Fits without horizontal scrolling |
| OtpInput | States, six digits | 834 / 834px | 1000 / 802px |

The widest fixed grid is Panel All sizes: 1500px content inside an 802px wrapper, with an 834px page. OTP six-digit States uses 1000px content inside its 802px wrapper at tablet width. At normal width, OTP was also measured at 1620px page / 1620px viewport with its intended 1000px content inside the 980px gallery wrapper. Hover and Focus remain visible after the layout change.

Raw per-view measurements and exact story IDs: `V2-TABLE-GROUP-CONTAINMENT.json`.

## Evidence

Manually inspected final screenshots:

- `/Users/ankish/.codex/visualizations/2026/10/01/v2-containment-final/otp-states.png`
- `/Users/ankish/.codex/visualizations/2026/10/01/v2-containment-final/panel-sizes-normal.png`
- `/Users/ankish/.codex/visualizations/2026/10/01/v2-containment-final/otp-states-tablet.png`
- `/Users/ankish/.codex/visualizations/2026/10/01/v2-containment-final/panel-sizes-tablet.png`

The tablet screenshots show Storybook's taller device viewport within the shorter canvas area; the DOM measurements above establish horizontal page containment. Normal screenshots show the complete gallery structure.

No component tests were repeated for this preview-only audit. The root agent owns the shared-helper validation and final frozen production build/recheck.
