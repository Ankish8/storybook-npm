# ContactListItem v2 review

Reviewed on `feat/v2` at http://localhost:6008 on 2026-10-01. Current v1 geometry and API were preserved; this additive port uses v2 Avatar and Inter. No fresh Figma claim is made for this current UI primitive.

Overview name Control changed Aditi Kumar to Noor Khan, updating initials to NK. Selection Control rendered the selected surface; Enter and Space on the row toggled selection and synchronized the Control. Individual Selected trailing Control changed MY01 to MY09. All compositions name Control changed all three rows to Mira Shah. Default/hover/selected/focus states inspected; keyboard focus measured solid 1px outline.

Contained v1/v2 comparison uses current v1 ContactListItem/Avatar and v2 versions: measured Source Sans + 32px avatar versus Inter + 30px avatar. Usage selected Mira Shah with Enter, then typing Noor filtered to Noor Khan and changed query Controls. The existing selection remains visible while filtering.

Docs install/import, both tables, individual examples, galleries and Usage were reviewed. Table cells contain no headings. Sixteen focused tests passed; focused lint, repository formatting and story-inclusive typecheck passed. Component native keyboard activation, callbacks, refs, optional subtitle/trailing and avatar image props remain unchanged.

Visually inspected screenshots: `/Users/ankish/.codex/visualizations/2026/10/01/v2-contact-list-item/overview.png`, `selected.png`, `compositions.png`, `states.png`, `comparison.png`, `usage.png`, `docs-top.png`, `docs-tables.png`.

## Final action-log repair (2026-10-01)

Rechecked at http://localhost:6008 after a story-only repair. Overview: Enter selects the row and Space deselects it; isSelected Controls follows both changes. Usage directory activation still selects a contact. Actions logs onClick: []. Galleries and current-v1 comparisons also use the safe adapter.

Component callback APIs and v1 source were not changed. Focused story ESLint, formatting and story-inclusive TypeScript checks pass. No Maximum call stack error occurred in the rechecks. Manually inspected screenshot: `/Users/ankish/.codex/visualizations/2026/10/01/v2-contact-list-item/action-log-fixed.png`.
