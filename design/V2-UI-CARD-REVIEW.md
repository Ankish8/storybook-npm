# UiCard v2 browser review

Reviewed root-owned source/stories at http://localhost:6008 on 2026-10-01 using recorded values. No new Figma read or source edits by reviewer.

## Rendered visuals

- Default card: 300px width,16px padding,12px radius,1px border, Inter. Title 16px /500; description 14px.
- Five variants: default/template/metrics300px,  icon/action200px. Action border dashed. Each gallery renders the actual slots rather than a bare placeholder.
- States: default inset shadow; hover gradient with 0 /2 /8px shadow; selected EAF8FA, border 27ABB8 and 4px teal glow; disabled F5F5F5/no shadow/aria-disabled true. Hover presentation uses actual forced pseudo state.
- showActions renders a non-interactive card with a real Preview button. Clicking it updates the local Previewing status, avoiding nested interactive card/button semantics.

## Interactions and findings fixed

- Initial Overview click and Space failed because the story spy received a React event containing Window; Storybook serialization threw before updating selected. Root wrapped the spy safely. Rechecked click→selected Control true / aria-pressed true; Space→false in both UI and Control.
- Initial Usage choice was local with stale selected Control. Root added a labelled workspace composition Control. Enter on Sales now shows Selected: Sales and workspace Control Sales. Selecting Support in Controls updates the exact card and status while clearing Sales.
- State gallery clicks run the safe spy without new serialization errors; fixed selected/disabled axes remain deliberate reference states. Content Controls remain editable.
- Docs: title/install/import, changes four rows, tokens four rows and props/composition table eight rows reviewed; explanatory cells contain no heading tags. Captured both explanatory tables.

Evidence: `design/review/ui-card/{overview,actions,variants,states,usage,docs-changes,docs-tokens}.png`. Earlier SecurityError entries remain in the browser log at 12:37:43/12:37:58 UTC, before the fix; no new serialization error appeared after the corrected mouse, keyboard, workspace and state interactions. Generic Chrome extension connection messages also existed. Root owns focused code checks. This v2-only component has no artificial v1 comparison.

Final gallery Control check: editing heading to Shared review heading updated all four state samples.
