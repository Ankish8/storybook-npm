# DateTimePicker v2 review

Reviewed manually at `http://127.0.0.1:6029`, with final corrections rechecked in the frozen production preview at `http://127.0.0.1:6030`, 2026-10-01. Current APIs, widths, parsing, time increments, date bounds and calendar/time layouts are retained. v1 files are unchanged. Work remains local.

## Browser views

- Docs: inspected eight change rows and twelve token rows; neither table contains headings. Corrected the error-message value column to `#B42318`, matching its already-correct swatch and actual supporting text. The final frozen preview shows `#B42318` in the value column and its matching swatch. Both tables still contain zero nested headings.
- Overview: typed `15/10/2026 02:45 PM`; the rendered input and serialized value Control agreed (`2026-10-15`, `14:45:00`). Edited the value JSON to October 20, 09:15 and observed the corresponding rendered date/time.
- Popup Controls: opening through Controls rendered the October calendar. The actual open button synchronized open=true. Escape closed the calendar after nested time menus were dismissed and synchronized open=false. Clearing synchronized date/startTime/endTime to empty strings.
- Calendar/time selection: selected October 8, then 02:45 PM through the hour, minute and meridiem choices. The serialized Control and rendered trigger both reflected October 8, `14:45:00`.
- Date Only / Time Only: typed October 18 and 04:20 PM respectively; the inputs and serialized Controls agreed (`2026-10-18`, `16:20:00`).
- All Variants: edited the shared label to `Appointment time`; all three modes reflected it and measured height 40. Date/time, date-only and time-only displayed the correct respective values.
- All Sizes: measured 40px height with widths 280, 336 and 360. These widths retain the public size API.
- States: reviewed all three modes × default/error × five interactions at each width size. Ninety fields passed 810 recorded-spec checks without a mismatch: height 40, radius 8, Inter 16/400, exact border/background values, disabled state and 4px focus/error halos. Disabled fields use grey surfaces/borders and no visible halo. The final frozen preview was rechecked after the fixed-mode mask repair: all thirty state fields use their matching combined/date-only/time-only placeholders.
- v1 vs v2: inspected all 54 fields covering three modes × three widths × default/error/disabled × both versions. A shared label Control affected every field; every v2 height was 40. The 1620px preview had a 1620px document scroll width.
- Date Bounds: October 4 and October 21 were disabled; October 5 was enabled, matching the October 5–20 bounds.
- With Seconds: selected 35 in the seconds column; the input displayed `10:30:35 AM` and the startTime Control was `10:30:35`.
- Time Range: selected 12:30 PM in the end-time selector; endTime synchronized to `12:30:00` and the trigger displayed `10:30 AM - 12:30 PM`.
- Read Only: native readOnly and the disabled calendar button were correct. Browser review caught an inherited inconsistency: focusing the input requested open=true even though the popup was suppressed. Added a v2 opening guard and made aria-expanded reflect the actual permitted popup. Three focused tests verify direct read-only interaction and controlled-open suppression for disabled/readOnly. Final browser recheck confirms input interaction leaves open=false, aria-expanded=false, zero dialogs and no opening callback. Supplying open=true through Controls still keeps the read-only popup suppressed and aria-expanded=false.
- Usage: typed October 22 at 03:30 PM, closed the popup and saved. Observed `Appointment saved: 2026-10-22 15:30:00`. Clear synchronized all values. Resubmitting the empty form produced `aria-invalid=true` with associated `Complete the appointment field.` feedback. Disabled Controls disabled both input and Save appointment.

No DateTimePicker error appeared in the console. Earlier unrelated browser-extension connection errors remained in the initial tab log; the final recapture tab had no console errors.

## Evidence

Manually viewed screenshots in `/Users/ankish/.codex/visualizations/2026/10/01/v2-date-time-picker-review/`: `docs-changes.png`, `docs-tokens.png`, `overview.png`, `calendar-open.png`, `time-selector.png`, `variants.png`, `sizes.png`, `states.png`, `states-large.png`, `comparison.png`, `usage-saved.png`, `usage.png`, `bounds.png`, `seconds.png`, `time-range.png`, `read-only.png`, `read-only-controlled.png`, `time-only.png`, `date-only.png`. The docs-tokens, read-only, states and comparison screenshots were replaced and manually viewed after the final frozen build. The final comparison still contains 54 fields, with all three correct mode masks and 1620px document width in the 1620px preview.

Measurements: `/tmp/myoperator-text-field-review/date-time-picker-measurements.json`.

## Checks and verification boundary

66 focused tests pass. All ten owned suites pass together (396 tests). Latest source/story/test ESLint, formatting and story-inclusive typecheck pass. The invalid raw-variable opacity-suffix classes on inner controls were repaired to valid recorded hover/focus CSS classes. `date-time` is an API variant rather than a missing utility.

The recorded v2 input-family trigger spec is verified. Exact inner calendar/day/time dimensions remain unverified against Figma because the parent's Chrome read failed with WebGL/transport errors. Existing inner layouts and day/time sizing were retained; neither this report nor the stories claim fresh Figma parity for those values. No API/registry change is required.
