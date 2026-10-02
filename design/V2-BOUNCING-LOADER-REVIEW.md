# BouncingLoader v2 browser review

Reviewed root-owned source/stories at http://127.0.0.1:6029 and the latest marker refactor at http://localhost:6008 on 2026-10-01. Used recorded values; no fresh Figma read.

- Overview: three 8px dots, 6px gap, placeholder A2A6B1. Wave animation1.4seconds with 0/.2/.4second delays.
- Controls: size 12,spacing 8,color 717680 and accessible label Loading review reply updated the actual dots and status.
- All sizes:6/8/12/16px; All variants: placeholder A2A6B1,muted 717680,secondary 343E55. Fixed axes stay excluded; remaining Controls remain live.
- Usage: Finish response replaces the loader with Your response is ready; Start response restores the real loader/status.
- v1 vs v2: both complete three-dot indicators rendered with 6px gap and accessible label. Comparison stays inside its720px grid.
- Docs: title/install/import, changes2rows, token1row and prop4rows reviewed. No heading tags in explanatory body cells; both tables captured.
- Latest data-attribute marker change rechecked: three 8px dots, 6px gap and original wave/delays retained.

Evidence: `design/review/bouncing-loader/{overview,sizes,variants,usage,comparison,docs-changes,docs-tokens}.png`. Reduced-motion code was read, but OS preference switching was not performed. Chrome logged generic extension connection errors on earlier Skeleton/Spinner URLs; this component rendered and interacted normally. Root owns tests/types.
