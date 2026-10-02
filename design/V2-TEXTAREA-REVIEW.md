# Textarea v2 review

Reviewed locally on `feat/v2`, 1 October 2026, at `http://localhost:6008`. Values came from the recorded specification. No fresh Figma read.

## Changes

Preserved current normalization, multiline input, caret restoration, controlled/uncontrolled values, native resizing, hard/soft limits and `displayCharCount`. The recorded typography is compact 12px, default 14px and large 16px. Added the approved optional `lg` size; existing `sm` and `default` remain supported. Disabled surfaces take precedence over the error halo and horizontal resizing remains contained.

Stories now have live `useArgs` values, editable individual examples, independent galleries, all three sizes, full state matrices, complete v1 comparisons and a functional notes form. Comparison cells explicitly identify large as new in v2 because v1 has no large option.

## Browser review performed

| View | Controls / behavior checked |
| --- | --- |
| Overview | Typed multiline content with consecutive spaces; the live value Control preserved newlines and normalized spaces. Edited value, size (`lg`), rows (6) and showCount; rendered text became 16px and the field height changed. |
| Docs | Inspected seven change rows and thirteen token rows, swatches and import/install text. No headings inside table cells. |
| With error | Edited error text and size (`sm`), typed a value and confirmed both the 12px field/error description and synchronized Control. |
| All variants | Changed label, size (`lg`) and counter. Both default/error samples followed the controls. |
| All sizes | Edited the shared value. Compact/default/large rendered 12px/14px/16px and 8px radii. |
| States | Measured default/error × default/hover/focus/disabled/disabled-hover at all three sizes: thirty samples, 240 expectations, zero mismatches. Checked Inter, opacity, typography, radius, border, background, disabled state and visible halo. |
| v1 vs v2 | Inspected all fifteen fields: default/error/disabled across three v2 sizes and both available v1 sizes. Edited label across both versions; document width stays 980px. |
| Usage | Typed a valid note, saved, confirmed saved feedback and live Control; submitted a short note and confirmed associated error and `aria-invalid`. |
| Soft character limit | Typed 66 characters with a 30-character soft limit. Input remained editable, Control reflected the value and counter became red (`66/30`). |

Reviewed screenshot hierarchy, wrapping, alignment and containment. A shared Storybook connection timeout toast appeared during the comparison and Usage review; the component remained interactive. The parent owns server recovery/build checks. Pseudo-state measurements were taken after refreshing the review tab.

## Verification / evidence

- Focused regression tests: **37 passed**.
- Focused ESLint, formatting and story-inclusive TypeScript: clean.
- Screenshots inspected: `/Users/ankish/.codex/visualizations/2026/10/01/v2-textarea-review/` — `docs-changes.png`, `docs-tokens.png`, `variants.png`, `sizes.png`, `states.png`, `comparison.png`, `usage.png`, `soft-limit.png`. Also captured `overview.png`.
- Measurements: `/tmp/myoperator-text-field-review/textarea-measurements.json`.
- Shared Storybook build and CLI metadata are owned by the parent. **Metadata should include the additive `lg` size**.
- All edits remain local. No v1 file or shared helper changed; no commit/push/publication.

## Action logging follow-up

Audited all ten owned stories for raw React events reaching action spies. Only TextField, Textarea and PhoneInput required an adapter. Their default onChange callbacks now invoke a named string spy with event.target.value; existing event callbacks, component APIs and live Controls plumbing remain intact.

Manually rechecked this component at `http://127.0.0.1:6008` with native keyboard input. The rendered field and value Control agreed on `OK`; Actions logged scalar string payloads ending in `["OK"]` rather than a React event object. No SecurityError or event-serialization error appeared. Unrelated Chrome-extension connection errors remained in the tab log.

Manually viewed screenshot: `/Users/ankish/.codex/visualizations/2026/10/01/v2-textarea-review/actions-value.png`.

The three modified stories pass ESLint, formatting and story-inclusive typechecks. Source and test files were unchanged by this repair.
