# Accordion v2 review

Reviewed locally on feat/v2 at http://localhost:6008 on 2026-10-01. Source values come from the previously verified web-panel diff and recorded specs; v1 is untouched.

## Implementation and stories

Existing single/multiple value arrays, controlled/uncontrolled behavior, disabled items, native trigger semantics and animated content remain. Trigger uses Inter16/500, normal line height,10px vertical/16px horizontal padding and12px gap. Bordered uses8px radius and white surface; content uses16px horizontal inset and14px body.

Stories now expose working value checkboxes and content Controls. Named renders synchronize open sections through useArgs. Galleries fix only variant/mode/state axes, maintain independent samples, and preserve live label/content/chevron controls. All four shared variant/mode combinations are paired between v1 and v2 in a contained comparison. Usage edits a local contact form with visible save feedback; unique React IDs avoid duplicate Docs field labels.

## Manual checks

- Overview: measured trigger spacing/type above. Toggled Custom fields then verified its checked Control in Single Mode after Enter activation. Single Mode closes Basic information and opens Custom fields. Clearing basic in Controls closes Basic information.
- All Variants: changed label Control to Contact summary and both variants updated.
- All Modes: single and multiple samples render and retain live content/value controls.
- States: Closed/Open/Hover/Focus/Disabled checked. Forced hover is#F5F5F5; focus ring visible; disabled trigger remains disabled. Actual element forced-state classes used.
- v1 vs v2: eight instances (two variants × two modes × versions), Source Sans v1 vs medium Inter v2 checked. Layout remains contained.
- Usage: typed Mira Shah, clicked Save contact, saw Saved locally: Mira Shah.
- Docs: install/import, migration and token tables, controls and stories read. No headings inside table cells. Both repeated Contact name fields have unique labels.

21 focused tests passed; focused lint and story-inclusive typecheck passed. Shared preview emitted manager lifecycle messages during HMR, with no Accordion render failure.

Screenshots, all visually reviewed: /Users/ankish/.codex/visualizations/2026/10/01/v2-accordion/overview.png, variants.png, modes.png, states.png, comparison.png, usage.png, docs-top.png, docs-tables.png.
