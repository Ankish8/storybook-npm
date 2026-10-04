# V2 motion polish — content and composed components

Reviewed in the supported Codex In-app Browser against live Storybook at `http://localhost:6008`. This group contains 18 components. All 79 Docs/story views listed below rendered actual content and were visually inspected; initial loading placeholders and an incorrectly typed story ID were excluded.

| Component | Views reviewed |
| --- | --- |
| Alert | `docs`, `overview`, `all-variants`, `states`, `usage` |
| Avatar | `docs`, `overview`, `all-variants`, `states`, `usage` |
| Badge | `docs`, `overview`, `all-variants`, `usage` |
| Breadcrumbs | `docs`, `overview`, `all-variants`, `usage` |
| ButtonGroup | `docs`, `overview`, `all-variants`, `states`, `usage` |
| Button | `docs`, `overview`, `all-variants`, `states`, `usage` |
| ContactListItem | `docs`, `overview`, `states`, `usage` |
| DateDivider | `docs`, `overview`, `usage` |
| EmptyState | `docs`, `overview`, `all-variants`, `states`, `usage` |
| ImageMedia | `docs`, `overview`, `content-states`, `usage` |
| PageHeader | `docs`, `overview`, `states`, `usage` |
| ReplyQuote | `docs`, `overview`, `states`, `usage` |
| SystemMessage | `docs`, `overview`, `content-states`, `usage` |
| Table | `docs`, `overview`, `all-variants`, `states`, `usage` |
| Tag | `docs`, `overview`, `all-variants`, `usage` |
| Typography | `docs`, `overview`, `all-variants`, `states`, `usage` |
| UiCard | `docs`, `overview`, `all-variants`, `states`, `usage` |
| UnreadSeparator | `docs`, `overview`, `all-counts`, `usage` |

## Interaction review

- Button: real pointer down/up verifies 80ms press, 200ms release and .98 scale; icon buttons .97; links stay stationary. Reduced motion removes scale. The Usage Save button is a pattern example, so no automatic loading state is claimed.
- ButtonGroup: selected List with the pointer; the pressed button and “Showing the list view” status update together.
- UiCard: selected Support with pointer and Enter; selected state/status agree. Hover is a 150ms colour/border/shadow change, without lifting or scaling the card.
- Alert: dismissed the result, then saved to reopen it; local feedback and visible alert update together.
- EmptyState: Clear search restores all three contacts and its confirmation.
- Table: enabled toggle updates campaign state; select-all and bulk pause update all rows; live query accepts typed input. Row changes remain immediate; embedded controls supply feedback.
- Breadcrumbs: Workspace moves the current page up one level and updates the path.
- Tag: real remove-button hover is 1.03 with normal motion and 1.00 with reduced motion. Dismissal remains parent-owned, as its existing API specifies.

## Restraint

Avatar, Badge, DateDivider, ImageMedia, SystemMessage, Typography, UnreadSeparator, ReplyQuote and other static content receive no entrance animation. This prevents new messages, unread counts and avatars from fading or moving every time data updates. PageHeader/EmptyState/composed patterns inherit Button and control feedback. Comparison grids and table examples keep their existing contained scrolling and hierarchy.

## Evidence boundary

The browser review establishes visual rendering and the interactions above. Source hash comparison checks all 90 legacy source/story files; none changed. The machine-readable snapshots are `/tmp/v2-motion-root-review.json` and `/tmp/v2-motion-root-interactions.json`. Exact frame/timing assertions are recorded separately in the motion probe report. No claim is made about a fresh Figma comparison, physical file drag, or every possible consumer application.
