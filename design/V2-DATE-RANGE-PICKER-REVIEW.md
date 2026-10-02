# DateRangePicker v2 review

Reviewed manually at `http://127.0.0.1:6029`, with final corrections rechecked in the frozen production preview at `http://127.0.0.1:6030`, 2026-10-01. Current v1 APIs, range behavior and calendar layout remain compatible; v1 files are unchanged. Work remains local.

## Browser views

- Docs: inspected seven change rows and twelve token rows; neither table contains headings. Review caught a value-column typo in the disabled-surface token (`#FFFFFF` with a correct grey swatch); corrected atomically to `#F5F5F5`. The corrected value was rechecked in the final frozen preview: `#F5F5F5`. Both tables still contain zero nested headings.
- Overview: edited serialized JSON range to October 12–16 and verified the trigger. Enter opened the calendar and checked the open Control. Selected October 8 then October 11; completed selection synchronized range JSON, rendered text and closed the open Control. Clear synchronized both dates to empty strings.
- Presets: changed presetMode to custom, opened through Controls, selected October review and verified October 15–21 in Controls and open=false.
- All Variants: shared label `Report dates` and width 360 affected both independent default/error examples; both measured height 40.
- States: ten fields passed 90 recorded-input-family checks without a mismatch: height 40, radius 8, Inter 16/400, exact border/background values and 4px focus/error halos. Disabled fields have grey backgrounds/borders and no visible halo.
- Height and width: measured 40px height at widths 420 and 280.
- v1 vs v2: inspected twelve triggers covering empty/selected × default/error/disabled. The 1620px preview had a 1620px document scroll width.
- Date Bounds: October 4 and October 21 were disabled; October 5 was enabled, consistent with the October 5–20 bounds.
- Usage: selected October 10–13 and saved; observed the exact reporting-period confirmation and synchronized Controls. Cleared, resubmitted and checked `aria-invalid=true` with associated `Choose a start and end date.` feedback. Disabled Controls disabled Save period.

No DateRangePicker error appeared in the console. The initial browser retained earlier unrelated extension connection messages; the final recapture tab had no console errors.

## Evidence

Manually viewed screenshots: `/Users/ankish/.codex/visualizations/2026/10/01/v2-date-range-picker-review/` (`docs-changes.png`, `docs-tokens.png`, `calendar-open.png`, `overview.png`, `variants.png`, `states.png`, `sizes.png`, `comparison.png`, `bounds.png`, `usage.png`). The docs-tokens screenshot was replaced and manually viewed after the final frozen build; it shows the corrected grey value and swatch.

Measurements: `/tmp/myoperator-text-field-review/date-range-picker-measurements.json`.

## Checks and verification boundary

35 tests pass. Source/story/test ESLint, formatting and story-inclusive typecheck passed after the documentation-only token correction. All ten owned suites pass together (396 tests).

The recorded v2 input-family trigger spec is verified. Exact calendar-grid/day dimensions and inner popover spacing remain unverified against Figma because the parent's Chrome read failed with WebGL/transport errors. Existing inner layouts and day sizing were retained; neither this report nor the stories claim fresh Figma parity for those values. No API/registry change is required.
