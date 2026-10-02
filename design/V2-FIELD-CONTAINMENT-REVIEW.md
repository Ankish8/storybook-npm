# Field story containment review

Reviewed on 1 October 2026 in Chrome at http://127.0.0.1:6008.

## Result

All 20 widest States and v1/v2 comparison views pass. No owned source or story edits were required. Every view already uses the shared `gallery()` helper; the eight non-picker stories also explicitly declare `layout: "padded"`, and both pickers declare padded layout in their component metadata. The root agent added padded layout to the shared gallery helper.

## Browser measurements

A temporary 1100 × 900 browser viewport gives an 800px Storybook preview. This intentionally forces each grid to overflow its local container. For every view: document client/scroll width = 800/800px; story root client/scroll width = 768/768px; local scroll container client width = 768px; its left/right edges = 16/784px; computed horizontal overflow = auto. The viewport override was reset after review.

| Component | States content width | v1/v2 content width | Page overflow |
| --- | ---: | ---: | --- |
| TextField | 1320px | 900px | 0px in both |
| Textarea | 1200px | 850px | 0px in both |
| Select | 1200px | 850px | 0px in both |
| SelectField | 1420px | 870px | 0px in both |
| PhoneInput | 1330px | 850px | 0px in both |
| MultiSelect | 1420px | 870px | 0px in both |
| CreatableSelect | 1370px | 870px | 0px in both |
| CreatableMultiSelect | 1370px | 870px | 0px in both |
| DateRangePicker | 1370px | 870px | 0px in both |
| DateTimePicker | 2100px | 980px | 0px in both |

## Scroll interaction

In DateTimePicker comparison, clicking the visible v2 header brought the right column into view through the local container: scrollLeft moved from 0 to 180px. The document stayed 800/800px.

In its 2100px States grid, clicking the far “Disabled + hover” column brought it into view: local scrollLeft moved from 0 to 1332px (the full available range). The document stayed 800/800px. Screenshot review confirms the far columns are visible and scrolling is contained to the preview grid.

## Evidence

- Numeric evidence: [/tmp/myoperator-text-field-review/containment-measurements.json](/tmp/myoperator-text-field-review/containment-measurements.json).
- [TextField comparison](/Users/ankish/.codex/visualizations/2026/10/01/v2-text-field-review/containment-comparison.png).
- [Textarea States](/Users/ankish/.codex/visualizations/2026/10/01/v2-textarea-review/containment-states.png).
- [DateTimePicker States](/Users/ankish/.codex/visualizations/2026/10/01/v2-date-time-picker-review/containment-states.png).
- [DateTimePicker comparison](/Users/ankish/.codex/visualizations/2026/10/01/v2-date-time-picker-review/containment-comparison.png).
- [DateTimePicker far columns after local scrolling](/Users/ankish/.codex/visualizations/2026/10/01/v2-date-time-picker-review/containment-scrolled.png).

All five saved screenshots were opened and visually inspected. This follow-up addresses grid containment only; the prior component behavior and Controls reviews remain recorded in each component report.
