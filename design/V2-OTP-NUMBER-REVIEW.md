# Final OTP and NumberStepField browser review

Reviewed on `feat/v2` on 2026-10-01. OTP/NumberStepField component files remained unchanged during this follow-up. The only OTP change was the States story repair described below. No v1 files, commits, pushes or publishing were involved.

## OTP States: reproduced regression and repair

The frozen production preview at http://127.0.0.1:6030 reproduced a real States story defect. Initial four-digit Hover and Focus were correct. Switching length Controls to six remounted the sample inputs; the pseudo-state addon did not reapply its classes. Separate settled DOM reads and a screenshot showed neutral borders in both examples. Error and Disabled remained correct.

Replaced the remount-sensitive addon selectors with scoped descendant styling on the Hover and Focus sections. This is a story-only display of forced states; the component's real hover/focus behavior and callback API are unchanged. Hover still yields to actual input focus. The first Focus cell retains the recorded teal border and glow.

Rechecked the corrected story at http://localhost:6008:

- Switching 4 → 6 → 4 retains Hover and Focus styling, with the expected input count in every sample.
- Changing value Controls also remounts the samples without losing their state styling.
- Default border is `rgb(233, 234, 235)`; Hover is `rgb(192, 195, 202)`; Focus is `rgb(39, 171, 184)` with the 4px teal glow; Error is `rgb(240, 68, 56)`; Disabled inputs remain disabled.
- Cells measure 54 × 60px with 8px corners. The six-digit comparison remains in its local horizontally scrollable grid rather than widening the page.
- Value and length Controls remain editable. Fixed error/disabled/helper-text axes stay excluded from the States Controls panel.

Focused ESLint, repository formatting and story-inclusive TypeScript checks for the changed OTP story pass. The production preview is being rebuilt by the root agent to include this fix; the corrected States screenshots below are from 6008.

## OTP Usage: typing, Controls, focus and reset

Reconfirmed at http://127.0.0.1:6030 in Usage. These paths were unchanged by the States-only repair.

- Typed the synthetic example one digit at a time. Value Controls followed `1`, `12`, `123`, then `1234`.
- Typing the first digit advanced focus to Digit 2.
- Completing four digits enabled Verify code. Enter on Verify displayed Code submitted for verification.
- Request new code cleared every cell and the value Control, disabled Verify and restored Waiting for your code.
- The earlier accepted reverse-Control check changed the rendered digits when value Controls changed to `9876`. Browser redaction of the first digit was respected; the remaining digits were verified.

This exercises the local Storybook example only, without using a real authentication code or making an external request.

## NumberStepField: sizing, focus priority and Usage

Reconfirmed at http://127.0.0.1:6030.

- Every States sample measures 40px overall height. The inner input is 38px inside the 40px border box.
- Actual pointer hover and input focus were active together on Focus. Focus retained the teal `rgb(39, 171, 184)` border and 4px glow, proving hover does not override focus.
- Usage typing `7` updated value Controls to `7`.
- Increase value changed both field and Control to `8`.
- Enter on Save delay displayed Saved 8 hours.
- Changing value Controls to `12` changed the rendered field to `12`.

## Screenshots

Manually reviewed browser evidence:

- `/Users/ankish/.codex/visualizations/2026/10/01/v2-otp-input-final/states-four.png`
- `/Users/ankish/.codex/visualizations/2026/10/01/v2-otp-input-final/states-six.png`
- `/Users/ankish/.codex/visualizations/2026/10/01/v2-otp-input-final/states-six-before.png` (the old production regression)
- `/Users/ankish/.codex/visualizations/2026/10/01/v2-otp-input-final/usage-typed.png`
- `/Users/ankish/.codex/visualizations/2026/10/01/v2-otp-input-final/usage-reset.png`
- `/Users/ankish/.codex/visualizations/2026/10/01/v2-number-step-field-final/usage.png`
- `/Users/ankish/.codex/visualizations/2026/10/01/v2-number-step-field-final/focus-hover.png`

The separate Stepper and Scrollbar reports remain complete at `V2-STEPPER-REVIEW.md` and `V2-SCROLLBAR-REVIEW.md`, including their final synchronized Usage rechecks. This follow-up report covers the stated browser checks; it does not replace root integration/build gates or claim a fresh Figma read.
