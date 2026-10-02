# Scrollbar v2 browser review

Reviewed on `feat/v2` at http://localhost:6008 on 2026-10-01. This was a browser-only review of the root agent's component and stories; source/test files were not edited.

Overview, Dark, Horizontal, Without Controls, both variant galleries, fitting/scrollable states, Usage and Docs reviewed. Measured the 16px rail, 8px thumb, and dark rail's 1px divider. Orientation and showControls Controls updated the preview and both gallery examples. No table-cell headings in the specification/token tables.

Vertical forward arrow changed scrollTop from 0 to 200. Home, End and PageDown worked; the matching boundary arrow became disabled. Horizontal forward arrow and native ArrowRight worked. Actual pointer dragging clamped horizontal scrollLeft to 1626 (its maximum) and 0, disabling the matching arrow. The fitting-content state disabled both controls and bounded its thumb to the available track.

Usage loaded 12 to 17 contacts, reducing thumb height from 94.47px to 67.39px. Selecting the newly loaded Contact 17 with Enter updated feedback. Changing itemCount Controls to 1 reset the example to one fitting contact, as described by the story. The root agent subsequently synchronized Load five more with itemCount Controls. Final recheck passed: both list and Control changed 12 to 17; changing the Control to 80 rendered 80 contacts and disabled Load five more. Earlier screenshots show the initial-only count; usage-controls.png captures the final live count.

Visually inspected screenshots: `/Users/ankish/.codex/visualizations/2026/10/01/v2-scrollbar/overview.png`, `horizontal-dark.png`, `without-controls.png`, `individual-dark.png`, `individual-horizontal.png`, `individual-without-controls.png`, `variants.png`, `variants-horizontal.png`, `states.png`, `usage.png`, `usage-controls.png`, `docs-top.png`, `docs-tables.png`.
