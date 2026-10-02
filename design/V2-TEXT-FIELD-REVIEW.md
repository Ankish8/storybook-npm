# TextField v2 review

Reviewed locally on `feat/v2`, 1 October 2026, in the shared Storybook at `http://localhost:6008`. This component uses the recorded Input/TextField specification; no fresh Figma read was needed.

## Changes

- Preserved the current v1 value normalization, caret handling, counters, clear callback, addons, numeric wheel handling and ref behavior in the additive v2 source.
- Fixed compact text classes and addon input shrinkage. Disabled and loading surfaces now override error decoration, including the halo, while retaining the solid grey disabled surface.
- Replaced copied stories with a live Overview, editable individual examples, independently editable galleries, both sizes, complete standalone/addon state matrices, full v1 comparison, password visibility and a functional workspace form.

## Browser review actually performed

| View | Actions and observations |
| --- | --- |
| Overview | Typed in the field and saw the value Control update; edited value and label Controls and saw the field update; enabled clearable and cleared both the input and its Control; changed size to compact and measured 36px. |
| Docs | Inspected both change and token tables. Eight change rows and thirteen token rows; no heading elements inside table cells. Swatches, install/import instructions and normal table typography render correctly. |
| Error | Changed error text and compact size, then typed a new value. Error description, size and value Control followed the changes. |
| All variants | Changed size, placeholder and left icon. All three variants rendered the changes. Typed in the first independent gallery sample. |
| All sizes | Changed value, icon and counter Controls. Both samples showed the same controlled value/counter and the correct 40px/36px heights and 16px/12px text. |
| States and States with addons | Inspected normal, hover, focus, disabled, disabled-hover and loading treatments. Read the rendered styles for all three variants, both sizes and both compositions. 72 fields, 648 expectations, zero mismatches against recorded values. |
| v1 vs v2 | Inspected all twenty samples in the DOM (five states, two sizes, two versions). Edited shared label and value Controls; both versions received them. The comparison remains within the preview width. |
| Password | Activated Show password with Enter and confirmed a text input; typed a new value and clicked Hide password. |
| Usage | Typed and saved a valid workspace name, confirmed saved feedback and synchronized value Control; submitted a two-character name and confirmed the error description/aria-invalid; cleared and confirmed an empty Control; enabled disabled and confirmed Save became disabled. |

The wide state grid scrolls inside its own preview: document width remains 980px while the grid is 1320px. A CSS hot-update did not refresh Storybook's pseudo-state transform; reloading the review tab restored the correct hover/focus simulations before measuring them. Tailwind's disabled `shadow-none` computes to transparent zero-size shadows; the comparison correctly treats these as no visible halo.

## Verification

- Focused TextField regression tests: **59 passed**.
- Focused ESLint and formatting: clean.
- Story-inclusive TypeScript check: clean (`node_modules/.tmp/tsconfig.text-field-review.json`).
- Shared Storybook build and repository-wide integration gates are owned by the parent agent.
- No v1 file, shared helper or CLI metadata was changed by this component work. No commit, push or publication.

## Screenshots inspected

Saved under `/Users/ankish/.codex/visualizations/2026/10/01/v2-text-field-review/`: `docs-changes.png`, `docs-tokens.png`, `all-variants.png`, `all-sizes.png`, `states.png`, `addon-states.png`, `comparison.png`, `usage.png`. Additional captures: `overview.png`, `error-control.png`.

Rendered state measurements: `/tmp/myoperator-text-field-review/text-field-measurements.json`.

No component-specific metadata change is needed; the public TextField API is unchanged.

## Action logging follow-up

Audited all ten owned stories for raw React events reaching action spies. Only TextField, Textarea and PhoneInput required an adapter. Their default onChange callbacks now invoke a named string spy with event.target.value; existing event callbacks, component APIs and live Controls plumbing remain intact.

Manually rechecked this component at `http://127.0.0.1:6008` with native keyboard input. The rendered field and value Control agreed on `QA`; Actions logged scalar string payloads ending in `["QA"]` rather than a React event object. No SecurityError or event-serialization error appeared. Unrelated Chrome-extension connection errors remained in the tab log.

Manually viewed screenshot: `/Users/ankish/.codex/visualizations/2026/10/01/v2-text-field-review/actions-value.png`.

The three modified stories pass ESLint, formatting and story-inclusive typechecks. Source and test files were unchanged by this repair.
