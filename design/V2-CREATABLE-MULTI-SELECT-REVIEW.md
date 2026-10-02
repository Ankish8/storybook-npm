# CreatableMultiSelect v2 review

Manual review on `http://127.0.0.1:6029`, 2026-10-01. Existing v1 APIs and files remain unchanged. No commit, push or publication.

## Browser views

- Docs: inspected nine change rows and twelve token rows; neither table contains headings. Captured and viewed both tables.
- Overview: pressed Enter on the closed trigger, Tab from the focused input to Professional, verified option focus, and pressed Enter. The selected-values Control became `["professional"]`. Added `Calm` with Enter and removed that final value with Backspace; both synchronized Controls.
- Array Controls: edited values to Friendly and Empathetic through JSON. Rendered chips matched. Set maximum to two and tried adding Professional through keyboard option activation; the values remained unchanged. A center click on a chip-containing div can target a nested remove button, so subsequent opening/limit checks used its keyboard handler.
- Dynamic disabled: toggled disabled while open and verified the input and all three remaining preset buttons were disabled.
- All Variants: shared label `Agent tones` and width 360 affected both independent validation examples; both measured 40px high.
- States: ten samples passed 90 recorded-spec checks without a mismatch. Height 40, radius 8, Inter 16/400, exact border/background colors and appropriate focus/error halos match. Disabled overrides error/hover and removes the visible halo.
- Height and width: measured empty minimum height 40 at widths 420 and 280. Wrapping selected values can increase height.
- v1 vs v2: inspected twelve samples across three treatments and empty/selected values. The 1620px preview had a 1620px document scroll width. Switched the shared trigger display to summary and verified both versions changed from chips to text.
- Usage: selected Friendly with the mouse, saved and saw `Saved tones: Friendly`; cleared to `[]`, submitted again and checked `aria-invalid=true` and its associated `Choose at least one tone.` description. Disabled Controls disabled Save tones.

No component error was captured for the creatable stories. The browser retained the earlier extension connection errors described in the MultiSelect report.

## Evidence and checks

Manually viewed screenshots: `/Users/ankish/.codex/visualizations/2026/10/01/v2-creatable-multi-select-review/` (`docs-changes.png`, `docs-tokens.png`, `overview.png`, `disabled-open.png`, `variants.png`, `states.png`, `sizes.png`, `comparison.png`, `comparison-summary.png`, `usage.png`).

Measurements: `/tmp/myoperator-text-field-review/creatable-multi-select-measurements.json`.

19 tests pass. The keyboard fixture now waits for initial animation-frame input focus, then uses Tab/Enter and asserts focused option; this removes the aggregate-suite race. All ten owned component suites pass together (393 tests). ESLint, formatting and story-inclusive typecheck pass. No new public prop or registry change is required.
