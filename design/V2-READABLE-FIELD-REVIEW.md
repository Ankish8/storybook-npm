# ReadableField v2 browser review

Reviewed production Storybook at http://127.0.0.1:6029 and corrected current files at http://localhost:6008 on 2026-10-01. This is browser review of root-owned source/stories, using recorded child specs; no fresh Figma read.

## Findings fixed and rechecked

- Initially rendered legacy 42px / 4px / Source Sans Pro / 14px helper despite v2 Docs. Root corrected it; current browser measures 40px field, 8px corners, Inter, 0 / 16px padding, 12px helper with zero margin.
- Comparison initially inherited a 420px wrapper, leaving each field 156px wide. Root widened its contained preview. Current grid is 960px, cards 468px, fields 426px.
- Usage Regenerate initially left the value Control stale. Root changed the named render to useArgs. Rechecked Generation 2, displayed `example_key_generation_2`, and matching value Control.

## Views and interactions

- Overview: edited value and label Controls; both visible text updates passed. Secret Control masked the value, Show value revealed it, Copy displayed success feedback and the synthetic clipboard matched the actual edited original value.
- Secret/plain gallery: two full fields, independent copy buttons and one reveal button. Disabled Header Action rendered a disabled Regenerate button. With Header Action remained usable without a component error.
- Usage: real Regenerate action updates display and Controls. Copy reports success. Header/body/helper hierarchy remains distinct.
- v1 vs v2: actual full components are contained within separate cards with usable field width.
- Docs: title/install/import, explanatory tables and rendered examples reviewed. Changes table has three rows, tokens four, props five; body cells contain no heading tags. Captured both explanatory tables.

## Evidence and limits

Screenshots in `design/review/readable-field/`: overview, variants, comparison, usage, docs-changes, docs-tokens; before-fix screenshots retain the original findings. Root owns unit/type checks. Browser copy/reveal and current dimensions were verified directly. Chrome later logged generic extension connection errors on unrelated Skeleton/Spinner pages; this review does not claim a globally empty browser console.
