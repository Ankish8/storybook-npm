# Typography v2 browser review

Reviewed root-owned files at http://127.0.0.1:6029 and corrected current files at http://localhost:6008 on 2026-10-01. Recorded type values were used; no fresh Figma read.

## Rendered hierarchy

All five kinds and three sizes were measured in the browser:

| Kind | Large / medium / small px | Weight | Line heights px |
| --- | --- | --- | --- |
| Display | 57 / 45 / 36 | 400 | 64 / 52 / 44 |
| Headline | 32 / 28 / 24 | 600 | 40 / 36 / 32 |
| Title | 18 / 16 / 14 | 500 | 22 / 20 / 18 |
| Label | 14 / 12 / 10 | 600 | 20 / 16 / 14 |
| Body | 16 / 14 / 12 | 400 | 20 / 18 / 16 |

All use Inter. Label letter spacing measured 0.014px / 0.06px / normal. Default semantic tags and explicit h2 override were checked.

## Views, Controls and fixes

- Overview text, kind, size, tag and alignment Controls were exercised. Explicit title-large h2 measured 18px / 22px / weight 500.
- All kinds, sizes and eight colors were reviewed. Primary181D27, secondary 343E55, muted 717680, placeholder A2A6B1, link 4275D6, inverted FFFFFF, error F04438, success 17B26A.
- Found missing color-name labels and low contrast inverted captions. Root added labels/light captions; latest inverted label measured white on 343E55.
- States initially failed to truncate an inline span: 467.58px sentence in a 280px parent. Root enabled constrained block display. Current sample is 280px wide, clientWidth280 / scrollWidth468, overflow hidden and text-overflow ellipsis.
- Alignment initially changed only computed style on the default inline span. Root made explicit alignment a constrained block. Current right-aligned sample fills its padded available width (1540px), and screenshot shows actual right alignment.
- Usage Read guidance reveals the supporting explanation; Hide guidance closes it. Inverted guidance/captions were corrected by root.
- Complete v1/v2 comparison reviewed; each version receives the same Controls, and font difference is visible.
- Docs title/install/import, changes three rows, tokens three rows and props seven rows reviewed. Explanatory table body cells contain no headings.

Evidence: `design/review/typography/` overview, variants, sizes, colors, states, alignment, usage, comparison, docs-changes, docs-tokens; before-fix truncation screenshot retained. Chrome generic extension connection messages were present on earlier pages; no React component failure observed. Root owns tests/types.
