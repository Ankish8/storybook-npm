# SystemMessage v2 review

Reviewed on `feat/v2` at http://localhost:6008 on 2026-10-01. Current v1 string/parser API and geometry preserved with explicit Inter; no new Figma dimensions are claimed for this primitive.

Overview text Control changed to Resolved by **Aditi Kumar**, rendering 13px Inter with medium emphasis. Plain Text's Control changed to Chat resumed by **Noor Khan**. Multiple Emphasis inspected all three emphasized phrases; Long Text wrapped within its 560px timeline. All formats' text Control updated both the plain and emphasized cards. Content states inspected empty, plain and embedded unmatched-marker text. Gallery cards contain their timeline rather than stretching across the page.

Contained comparison uses current v1 and v2: both 13px labels and medium link-colored emphasis, Source Sans versus Inter. Review corrected the emphasis token table to the actual recorded Storybook theme value `#4275D6`. Usage chose Noor Khan and assigned with Enter; event text and agent Controls synchronized. Changing agent Controls to Aditi Kumar updated the native select, and Space appended a second event while retaining prior history.

Docs install/import, migration/token tables, individual examples and Usage inspected; no table-cell headings. Static event text has no hover, disabled or loading state. Seven focused tests passed, covering parsing behavior, empty strings and native attributes/ref. Focused lint, repository formatting and story-inclusive typecheck passed. v1 files unchanged.

Visually inspected screenshots: `/Users/ankish/.codex/visualizations/2026/10/01/v2-system-message/overview.png`, `individual.png`, `formats.png`, `states.png`, `comparison.png`, `usage.png`, `long-text.png`, `docs-top.png`, `docs-tables.png`.
