# DateDivider v2 review

Reviewed on `feat/v2` at http://localhost:6008 on 2026-10-01. Current v1 geometry/API preserved with explicit Inter; no new Figma dimensions are claimed for this primitive.

Overview changed label to Thursday, 1 October and width to 420px; measured 12px Inter and a 420px example. Calendar Date's label Control changed to Yesterday. All three relative/calendar/long label defaults inspected; width Control changed all to 360px. Review caught oversized gallery cards: the gallery now sizes to the controlled timeline width plus card padding, and was recaptured at 594px rather than stretching across the page.

Contained comparison uses current v1 and v2: both 12px labels, Source Sans versus Inter. Usage Show earlier messages displayed Yesterday and synchronized showPrevious Controls true; changing that Control hid the earlier section. Static date labels have no hover, disabled or loading state.

Docs install/import, migration/token tables, individual examples and Usage inspected; no table-cell headings. Six focused tests passed, covering native ref/attributes and ReactNode labels. Focused lint, repository formatting and story-inclusive typecheck passed. v1 files unchanged.

Visually inspected screenshots: `/Users/ankish/.codex/visualizations/2026/10/01/v2-date-divider/overview.png`, `individual.png`, `formats.png`, `comparison.png`, `usage.png`, `docs-top.png`, `docs-tables.png`.
