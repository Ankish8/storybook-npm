# MultiSelect v2 review

Manual review on stable Storybook `http://127.0.0.1:6029`, 2026-10-01. v1 files are unchanged; work remains local.

## Browser views

- Docs: inspected seven change rows and twelve token rows. Tables have no nested headings; screenshots show normal body hierarchy and restrained swatches.
- Overview: enabled searchable, typed `react`, and verified both the query Control and the single filtered result. Selecting React updated selected-value Controls. Switched the value editor to JSON, entered `["typescript","python"]`, and verified both rendered chips. Set the maximum to two; unselected React was disabled. Clear all synchronized back to `[]`.
- All variants: label `Team skills` and width 360 applied to both independent validation examples; both measured 40px high.
- States: twelve samples (two treatments × six interactions) passed 108 recorded-spec checks with zero mismatches. Measured height 40, radius 8, Inter 16/400, exact border/background colors and appropriate 4px focus/error halos. Disabled/loading samples have no visible halo.
- Height and width: measured empty minimum height 40 at widths 420 and 280. Selected chips may increase height when wrapping, as documented.
- v1 vs v2: inspected all eight treatments. The 1620px preview has a 1620px document scroll width. Changed `optionVariant` to detailed and opened the v2 trigger to inspect checkbox rows; captured both modes.
- Usage: chose React, saved and saw `Saved in this example`; cleared, submitted again and checked `aria-invalid=true` and the associated `Select at least one skill.` description.
- Inside a dialog: opened Assign team skills, searched `python`, selected Python while the dialog remained open, and verified value Controls became `["python"]`. The popup renders above the modal and its search and choices remain interactive.
- Lazy loading: Load next page advanced 12 of 48 to 24 of 48.

The Chrome console captured extension connection errors (`Could not establish connection. Receiving end does not exist.`), including `chrome-extension://.../all-frames.js`. No Storybook/component exception or hook error appeared in the reviewed paths. The local usage/dialog/paging children avoid calling Storybook hooks during local React state updates.

## Evidence and checks

Manually viewed screenshots: `/Users/ankish/.codex/visualizations/2026/10/01/v2-multi-select-review/` (`docs-changes.png`, `docs-tokens.png`, `overview.png`, `variants.png`, `states.png`, `sizes.png`, `comparison.png`, `comparison-detailed.png`, `usage.png`, `dialog-popup.png`, `pagination.png`).

Measurements: `/tmp/myoperator-text-field-review/multi-select-measurements.json`.

62 tests pass, including disabled/loading keyboard chip guards. ESLint, formatting and story-inclusive typecheck pass. All ten owned field/picker suites pass together (393 tests). v2 uses its own Tooltip dependency; no public API or registry change is needed.
