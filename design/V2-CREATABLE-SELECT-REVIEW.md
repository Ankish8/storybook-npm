# CreatableSelect v2 review

Reviewed manually at `http://127.0.0.1:6029`, 2026-10-01. v1 and all current public APIs remain unchanged; no commit, push or publication.

## Browser review

- Docs: inspected eight change rows and twelve token rows. Neither table contains headings; captured and viewed both tables.
- Overview: opened the field with Enter, typed a custom role and committed with Enter. The selected value Control matched the trimmed result. Edited `value` to `sales` in Controls and verified Sales Representative appeared.
- Draft guards: enabled `lettersOnly` and `collapseSpaces`, entered `  Ops123   Lead!`, and observed `Ops Lead` in the draft. Enter created that exact selected value and synchronized Controls. The draft remains an internal component value; the story does not pretend it is a controlled public prop.
- All Variants: edited shared label `Routing role` and width 360; both default/error examples retained their axis and measured 40px high.
- States: ten fields (two variants × five interactions) passed 90 recorded-spec checks without a mismatch. Height 40, radius 8, Inter 16/400, recorded border/background colors and soft 4px focus/error halos all match. Disabled overrides error/hover and removes the visible halo.
- Height and width: measured 40px height at 420px and 280px widths.
- v1 vs v2: inspected twelve samples covering empty/selected values for default, error and disabled treatments. The 1620px preview had a 1620px document scroll width. Shared label Controls updated both versions.
- Usage: created `Service lead`, saved, and observed `Saved role: Service lead`; cleared and resubmitted, then checked `aria-invalid=true` and the associated required description. Disabled Controls disabled Save role.

No new component/Storybook error appeared during this review. The browser retained the earlier extension connection messages described in the MultiSelect report.

## Evidence and checks

Manually viewed screenshots: `/Users/ankish/.codex/visualizations/2026/10/01/v2-creatable-select-review/` (`docs-changes.png`, `docs-tokens.png`, `overview.png`, `variants.png`, `states.png`, `sizes.png`, `comparison.png`, `usage.png`).

Measurements: `/tmp/myoperator-text-field-review/creatable-select-measurements.json`.

13 tests pass, including inner-control accessible naming and dynamically disabled open fields. ESLint, formatting and story-inclusive typecheck pass. The ten owned field/picker suites pass together (393 tests). No registry/API changes are needed.
