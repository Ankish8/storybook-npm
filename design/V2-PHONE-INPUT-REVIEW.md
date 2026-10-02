# PhoneInput v2 review

Reviewed manually on stable Storybook `http://127.0.0.1:6029`, 2026-10-01. Source and stories remain local; v1 is unchanged.

## Views and interactions

- Docs: inspected all eight change rows and twelve token rows, captured both tables, and checked there are no headings inside either table.
- Overview: entered letters mixed with eleven digits. The rendered input retained ten digits and the value Control synchronized to `9876543210`. Edited value in Controls; the field reflected the ten-digit sample.
- Country chooser: activated the prefix button with Enter, inspected the four-country dialog, selected United States, and verified country Controls `US` / `+1` plus the matching rendered button. The value remained ten digits.
- All variants: edited common label to `Contact number` and width to 360. All three treatments retained their independent default/empty/error axis and measured 48px height.
- States: fifteen samples (three treatments × default, hover, focus, disabled, disabled + hover) passed 135 recorded-spec checks without a mismatch. The measured family is 48px high, radius 8, Inter 16/400. Hover/focus/error borders and 4px halos match the recorded palette. Disabled fields have a solid grey surface and no visible halo.
- Height and width: measured 48px height at 420px and 280px widths.
- v1 vs v2: inspected all eight examples and edited the shared label. The 1620px preview had a 1620px document scroll width, so the comparison did not widen the page.
- Usage: entered a ten-digit value, saved and saw `Saved in this example`; cleared and confirmed empty Controls; resubmitted and verified `aria-invalid=true` with the associated `Enter 10 digits.` message. Disabled Controls disabled the input and Save.

The final tab reported no console errors. The country picker uses the existing callback; making its trigger a native button repairs keyboard access while preserving the public API.

## Evidence and checks

Manually viewed screenshots: `/Users/ankish/.codex/visualizations/2026/10/01/v2-phone-input-review/` (`docs-changes.png`, `docs-tokens.png`, `overview.png`, `country-chooser.png`, `variants.png`, `states.png`, `sizes.png`, `comparison.png`, `usage.png`).

Measurements: `/tmp/myoperator-text-field-review/phone-input-measurements.json`.

25 component tests pass; ESLint, formatting and story-inclusive typecheck pass. Ten owned field/picker suites pass together (393 tests). No new component prop or registry update is required.

## Action logging follow-up

Audited all ten owned stories for raw React events reaching action spies. Only TextField, Textarea and PhoneInput required an adapter. Their default onChange callbacks now invoke a named string spy with event.target.value; existing event callbacks, component APIs and live Controls plumbing remain intact.

Manually rechecked this component at `http://127.0.0.1:6008` with native keyboard input. The rendered field and value Control agreed on `12`; Actions logged scalar string payloads ending in `["12"]` rather than a React event object. No SecurityError or event-serialization error appeared. Unrelated Chrome-extension connection errors remained in the tab log.

Manually viewed screenshot: `/Users/ankish/.codex/visualizations/2026/10/01/v2-phone-input-review/actions-value.png`.

The three modified stories pass ESLint, formatting and story-inclusive typechecks. Source and test files were unchanged by this repair.
