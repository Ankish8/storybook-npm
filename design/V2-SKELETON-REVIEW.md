# Skeleton v2 browser review

Reviewed root-owned files at http://127.0.0.1:6029 and corrected current files at http://localhost:6008 on 2026-10-01. Used recorded values; no fresh Figma read.

## Findings fixed and rechecked

- Explicit width and height were overridden by important `w-full` and `h-4` defaults. The initial default line was invisible; Usage's 80% and 60% lines both filled the parent and its 12px line measured 16px. Root made default dimensions conditional. Rechecked a 240px by 12px line, plus 203.19px and 152.39px lines in a 254px parent (80% / 60%), at 16px / 12px heights.
- Comparison width Control at 600px initially spilled out of a 348px card. Root added per-sample scrolling. Rechecked 600px component inside a 306px container with overflow-x auto and scrollWidth 600; adjacent cards remain separate.

## Views and interactions

- Overview: palette, circle shape and width / height Controls changed the actual sample to a 64px circle, subtle F5F5F5 surface and full radius. Default palette E9EAEB, line radius 4px and pulse animation were checked.
- All variants and all shapes inspected; both palettes, line, circle and rectangle render real components. Fixed axes excluded while meaningful Controls remain available.
- Usage: loading region supplies a single announcement; individual placeholders are aria-hidden. Show loaded content replaces placeholders with Example account, and aria-busy becomes false. Reload restores placeholders.
- Comparison: both complete versions render; explicit large dimensions are contained within their own scroll regions.
- Docs: title/install/import, changes two rows, tokens two rows and props four rows reviewed; explanatory body cells contain no headings.

Evidence in `design/review/skeleton/`: overview, loading, usage, comparison, docs-changes, docs-tokens and before-fix galleries. Source respects reduced motion; OS preference switching was not tested. The Chrome error log includes generic extension connection messages on earlier Docs pages, with no React component failure observed. Root owns tests/types.
