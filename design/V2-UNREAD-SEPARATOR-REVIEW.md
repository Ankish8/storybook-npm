# UnreadSeparator v2 review

Reviewed on `feat/v2` at http://localhost:6008 on 2026-10-01. Current v1 count/label API and geometry preserved with explicit Inter; no new Figma dimensions are claimed for this primitive.

Overview count Control changed from 3 to 1 and rendered the singular label. Custom Label's text Control changed to Messages since your last visit. Count states inspected 0/1/3, including generated plural and singular labels. Width Control changed every state to 360px; gallery cards measured 394px, containing the timeline plus card padding.

Contained comparison uses current v1 and v2: both 12px labels with the existing gray surface, Source Sans versus Inter. Usage Receive message changed count to 4 in both timeline and Controls. Mark as read changed count to 0, displayed All messages are read and disabled that action. Changing count Controls to 2 restored the separator and message example. Static separators have no hover, disabled or loading state; Usage owns read state.

Docs install/import, migration/token tables, individual examples and Usage inspected; no table-cell headings. Seven focused tests passed, covering count grammar, explicit custom/empty labels and native attributes/ref. Focused lint, repository formatting and story-inclusive typecheck passed. v1 files unchanged.

Visually inspected screenshots: `/Users/ankish/.codex/visualizations/2026/10/01/v2-unread-separator/overview.png`, `individual.png`, `states.png`, `comparison.png`, `usage.png`, `docs-top.png`, `docs-tables.png`.
