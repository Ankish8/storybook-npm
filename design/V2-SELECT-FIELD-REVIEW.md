# SelectField v2 review

Reviewed 2026-10-01 on the local Storybook at 6008, then the stable production snapshots 6028 and 6029. v1 is unchanged. No commit, push or publication.

## Browser review

- Overview: enabled searchable in Controls, typed `bear`, verified `searchValue` also became `bear`, selected Bearer token, and verified the selected value Control and cleared query.
- Docs: manually inspected the seven change rows and twelve token rows. Both tables use body text and contain no heading elements.
- Error: edited message and width 320; verified the rendered message, invalid state and accessible description.
- All variants: changed label and width to 360; both validation examples retained their independent state.
- Height and width: measured 40px height at 420px and 280px widths. Replaced the earlier screenshot taken during a shared development-server overlay.
- States: the stable 6029 build passed 108 recorded-spec checks across twelve fields (two validation variants × default, hover, focus, disabled, disabled + hover, loading). Height 40, radius 8, Inter 16/400, exact recorded border/background colors and halo presence all matched. Disabled and loading fields had no visible halo.
- v1 vs v2: inspected all eight samples and edited the common label. The comparison remained contained in the preview; the earlier 980px preview had 980px document scroll width.
- Usage: selected API key and saved; cleared, submitted again, and verified associated required feedback. Disabled Controls disabled Save.
- Action items: entered the create dialog without changing `basic`, created `Signed request`, then verified `custom-method` in Controls and the rendered selected label.
- Lazy loading: Load next page advanced 12 of 48 to 24 of 48.
- Searchable separated groups: inspected People and Groups, then typed `not-found`; the no-results popup appeared and `searchValue` synchronized. Empty options opened with its no-options message.

The final review tab reported no console errors. A shared development-index failure and the story-only local-state hook error were diagnosed during earlier review; the action dialog, paging and search now run on the stable snapshot without that error.

## Evidence

Screenshots, manually viewed: `/Users/ankish/.codex/visualizations/2026/10/01/v2-select-field-review/` (`docs-changes.png`, `docs-tokens.png`, `variants.png`, `sizes.png`, `states.png`, `comparison.png`, `usage.png`, `action-dialog.png`, `pagination.png`, `group-search.png`, `group-no-results.png`). The old group screenshot captures only the lower group due to popup placement; the later no-results image captures the complete search state.

Measurements: `/tmp/myoperator-text-field-review/select-field-measurements.json`.

## Local checks

51 tests pass. Source, stories and tests pass ESLint and formatting; source and story typecheck pass. All ten owned field/picker suites also pass together (393 tests).

Source repairs retain current v1 APIs and behavior while anchoring the loading indicator and naming search inputs. Stories use synchronized values and search, contained grids, editable defaults and functional child examples. No registry change is needed.
