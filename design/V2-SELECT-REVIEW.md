# Select v2 review

Reviewed locally on `feat/v2`, 1 October 2026, at `http://localhost:6008`. Used recorded Selection Field values, with current v1 primitive behavior retained. No fresh Figma read.

## Changes

The additive v2 primitives retain Radix navigation, grouping, wrapped/truncated labels, viewport callbacks and scroll handling. Trigger text is regular Inter, error decoration includes the recorded soft halo, and disabled surfaces suppress it. Story-only composition arguments are clearly categorized by primitive or Example.

The rewritten stories synchronize `value` and `open` through `useArgs`; provide editable individual examples, independent galleries, both container widths, all trigger states, grouped/disabled/long/empty options, a full v1 comparison and a working webhook authentication form. The options Control is guarded against malformed arrays in the example renderer and comparison. The Usage error is associated with the trigger using `aria-describedby`.

## Browser review performed

| View | Controls / interaction checked |
| --- | --- |
| Overview | Opened with Enter; selected Bearer Token and saw `value=bearer` in Controls; changed value to `api-key` and saw API Key; toggled open from Controls and inspected the popup (8px radius, Inter). Selection closes and synchronizes open=false. |
| Docs | Inspected seven change rows and eleven token rows, swatches and import/install instructions. No headings inside table cells. |
| Error | Edited label, placeholder and width. Preview rendered the new placeholder, 320px width and red border/4px halo. |
| All variants | Changed width to 360px (committed the number Control with Tab) and selected Basic Auth in the first sample. Both widths changed; the second sample retained its independent placeholder. |
| Height and width | Measured 40px height at 420px/280px widths; edited placeholder and confirmed both samples followed it. |
| States | Default/error × default/hover/focus/disabled/disabled-hover: ten fields, ninety recorded-spec expectations, zero mismatches. Also used actual keyboard focus and confirmed teal border and soft halo. |
| v1 vs v2 | Inspected twelve triggers (three states × empty/selected × two versions), edited shared label and confirmed containment: document width stays 980px. |
| Usage | Selected API Key and saved; confirmed saved feedback and live `value=api-key` Control; cleared value through Controls and submitted to reveal the error message/aria-invalid. |
| With groups | Inspected People and Groups headings/separator and selected Sales team. |
| With disabled items | Confirmed the unavailable SSO option is `aria-disabled=true`; closed with Escape. |

Storybook's CSS hot-update temporarily neutralized the pseudo-state samples. Actual focus remained correct; a later refresh after the shared stylesheet settled restored the entire matrix before final measurement/capture. No source workaround was necessary.

## Verification / evidence

- Focused regression tests: **29 passed**.
- Focused ESLint, formatting and story-inclusive TypeScript: clean.
- Screenshots inspected: `/Users/ankish/.codex/visualizations/2026/10/01/v2-select-review/` — `docs-changes.png`, `docs-tokens.png`, `overview-open.png`, `variants.png`, `sizes.png`, `states.png`, `comparison.png`, `usage.png`, `groups.png`.
- Measurements: `/tmp/myoperator-text-field-review/select-measurements.json`.
- No public API metadata changes. Parent owns the shared Storybook build and integration gates.
- No v1 files/shared helpers changed; all work remains local without commits/pushes/publication.
