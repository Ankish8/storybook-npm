# V2 content components: text hierarchy review

Workspace: `/Users/ankish/Downloads/Code/storybook-npm-v2`, branch `feat/v2`. Date: 2026-10-02. Changes are local.

## Scope and decisions

Reviewed the current handoff and story standard. The user’s latest color and weight correction overrides the original text-color and ordinary heading-weight specifications. No new Figma read was needed for this visual correction.

Owned components: Tabs, Table, Accordion, Alert, Avatar, PageHeader, PageFooter, Pagination, EmptyState, UiCard, ContactListItem, ImageMedia, ReplyQuote, SystemMessage, DateDivider and UnreadSeparator.

- Headings and selected labels: `--v2-text-primary`, `#484848`.
- Main body and field values: `--v2-text-secondary`, `#5E5E5E`.
- Supporting text and placeholders: `#707070` through their v2 role variables.
- Normal titles and labels: 500; body and metadata: 400.
- Tabs selected and inactive labels both use 500. Selection remains visible through its color and existing underline/vertical indicator.
- EmptyState retains its prominent 24px/32px, 600 headline. Actual v1 samples retain their legacy colors and weights.

## Refinements after the shared migration

1. TabsContent now has a secondary body default; counts use secondary text; inactive labels use muted text. Ordinary Tabs panel headings use 500. Geometry and selection behavior remain unchanged.
2. Table headers and emphasized campaign names use primary text; general cells inherit secondary body text. Caption and empty-state text stay muted.
3. Alert titles are primary and descriptions/default body are secondary. Status icon palettes are preserved.
4. UiCard titles are explicitly primary, descriptions/default body are secondary, and disabled titles/descriptions stay muted. Metrics remain medium weight.
5. EmptyState explanation uses secondary body text; ReplyQuote uses a medium primary sender and regular secondary quoted message.
6. ContactListItem has a medium primary name, regular muted subtitle and trailing metadata. DateDivider, UnreadSeparator and SystemMessage supporting text remain regular/muted; existing link emphasis is retained.
7. Ordinary example headings and section labels use 500 rather than 600; supporting comparison labels use 400. Added explicit primary roles to previously uncolored headings/field labels.
8. Tabs and Accordion comparison content uses conditional legacy colors for v1. The isolated prefixed ReplyQuote comparison CSS was restored to the existing v1 color variables.

Only text roles/weights and corresponding documentation/style assertions changed. User-added interaction stories, Controls, synchronized values, dimensions, component APIs, layout, keyboard behavior and status palettes were preserved.

## Local checks

- Focused ESLint: all 32 owned source/story files and five updated test files pass.
- Story-inclusive TypeScript: `design/verify/tsconfig.all-stories.json` passes after parallel edits settled.
- Formatting: all owned files pass. Files were formatted atomically through `design/verify/format-v2.mjs`.
- Six behavior suites: 146/146 pass (Tabs, Table, Alert, EmptyState, UiCard, ReplyQuote).
- Four suites with refreshed existing style assertions: 101/101 pass (Avatar, DateDivider, PageHeader, Pagination).
- No new tests mirror these simple style changes.
- `git diff -- src/components/ui/*.tsx` has no v1 component source changes.

## Browser review

Completed against the restarted final source preview at `http://localhost:6008` on 2026-10-02, after the color and weight edits were frozen. Each of the 16 components was manually reviewed in Docs, its contained variant/composition gallery and Usage. This pass saved 53 rendered views, 16 additional scrolled specification/token screenshots and a Tabs Controls screenshot. DOM-computed colors, sizes and weights accompany the screenshots in [content-observations.json](verify/text-hierarchy/content-observations.json).

Every measured preview document had `clientWidth = scrollWidth = 1620px`. No page-level horizontal overflow was found. Internal table/gallery scrolling is preserved. Each component’s specification/change table and token table are plain text; all inspected tables had zero heading elements inside cells. The rows below include header rows.

| Component | Actual reviewed gallery | Docs table rows: specification / tokens | Rendered hierarchy | Evidence |
| --- | --- | --- | --- | --- |
| Tabs | All variants; Full width with counts; v1 vs v2 | 6 / 11 | Labels 14/500; selected primary, inactive muted. Counts 12/400 secondary. Panel title 16/500 primary, body 14/400 secondary, helper 12/400 muted. | [Gallery](verify/text-hierarchy/tabs-variants.png), [Usage](verify/text-hierarchy/tabs-usage.png), [Docs](verify/text-hierarchy/tabs-docs-tokens.png) |
| Table | All variants: framed and borderless | 6 / 10 | Header 14/500 primary. Emphasized names medium/primary; general cells regular/secondary. Captions and helpers muted. | [Gallery](verify/text-hierarchy/table-variants.png), [Usage](verify/text-hierarchy/table-usage.png), [Docs](verify/text-hierarchy/table-docs-tokens.png) |
| Accordion | All variants: default and bordered | 6 / 8 | Triggers 16/500 primary; expanded body 14/400 secondary; example helpers 12/400 muted. | [Gallery](verify/text-hierarchy/accordion-variants.png), [Usage](verify/text-hierarchy/accordion-usage.png), [Docs](verify/text-hierarchy/accordion-docs-tokens.png) |
| Alert | All variants; inline/header/overlay presentations | 7 / 10 | Title 16/500 primary; description 12/400 secondary. Six status icon/surface palettes remain distinct. | [Gallery](verify/text-hierarchy/alert-variants.png), [Presentations](verify/text-hierarchy/alert-presentations.png), [Usage](verify/text-hierarchy/alert-usage.png), [Docs](verify/text-hierarchy/alert-docs-tokens.png) |
| Avatar | All variants: soft, outline and filled | 6 / 11 | Initials 14/500 muted in soft/outline; white in filled. Profile name 14/500 primary; presence 12/400 muted. Presence-dot palette preserved. | [Gallery](verify/text-hierarchy/avatar-variants.png), [Usage](verify/text-hierarchy/avatar-usage.png), [Docs](verify/text-hierarchy/avatar-docs-tokens.png) |
| PageHeader | All layouts: horizontal, vertical and responsive | 6 / 8 | Title 16/500 primary; description 12/400 muted. Actions retain their Button intent. | [Gallery](verify/text-hierarchy/page-header-variants.png), [Usage](verify/text-hierarchy/page-header-usage.png), [Docs](verify/text-hierarchy/page-header-docs-tokens.png) |
| PageFooter | All variants: desktop and mobile | 4 / 7 | Description 14/400 secondary; surrounding section title 16/500 primary and local feedback 12/400 muted. | [Gallery](verify/text-hierarchy/page-footer-variants.png), [Usage](verify/text-hierarchy/page-footer-usage.png), [Docs](verify/text-hierarchy/page-footer-docs-tokens.png) |
| Pagination | All compositions: widget and links | 6 / 8 | Page labels 14/500; selected primary, inactive muted. Range explanation muted with the existing medium/primary numeric emphasis retained. | [Gallery](verify/text-hierarchy/pagination-variants.png), [Usage](verify/text-hierarchy/pagination-usage.png), [Docs](verify/text-hierarchy/pagination-docs-tokens.png) |
| EmptyState | Icon/actions, icon only, text/action and text only | 6 / 7 | Prominent headline 24/32/600 primary; explanation 16/400 secondary. Ordinary containing section headings 16/500. | [Gallery](verify/text-hierarchy/empty-state-variants.png), [Usage](verify/text-hierarchy/empty-state-usage.png), [Docs](verify/text-hierarchy/empty-state-docs-tokens.png) |
| UiCard | All variants; default/hover/selected/disabled states | 5 / 9 | Title 16/500 primary; body 14/400 secondary; metric 32/500 primary. Disabled title and body both muted. | [Gallery](verify/text-hierarchy/ui-card-variants.png), [States](verify/text-hierarchy/ui-card-states.png), [Usage](verify/text-hierarchy/ui-card-usage.png), [Docs](verify/text-hierarchy/ui-card-docs-tokens.png) |
| ContactListItem | Name only; subtitle; trailing slot | 4 / 8 | Name 14/500 primary; subtitle and trailing metadata 12/400 muted. | [Gallery](verify/text-hierarchy/contact-list-item-variants.png), [Usage](verify/text-hierarchy/contact-list-item-usage.png), [Docs](verify/text-hierarchy/contact-list-item-docs-tokens.png) |
| ImageMedia | All height caps: 140, 280, 35vh | 4 / 8 | Native image remains unchanged. Example title 16/500 primary; message 14/400 secondary; helper 12/400 muted. | [Gallery](verify/text-hierarchy/image-media-variants.png), [Usage](verify/text-hierarchy/image-media-usage.png), [Docs](verify/text-hierarchy/image-media-docs-tokens.png) |
| ReplyQuote | Static/interactive text and thumbnails; v1 vs v2 | 5 / 8 | Sender 14/500 primary; quoted message 14/400 secondary. Legacy comparison still uses sender 600 and original v1 colors. | [Gallery](verify/text-hierarchy/reply-quote-variants.png), [Comparison](verify/text-hierarchy/reply-quote-comparison.png), [Usage](verify/text-hierarchy/reply-quote-usage.png), [Docs](verify/text-hierarchy/reply-quote-docs-tokens.png) |
| SystemMessage | Plain and emphasized formats | 4 / 8 | Event text 13/400 muted; existing emphasized phrases 13/500 link blue #4275D6. Message body 14/400 secondary. | [Gallery](verify/text-hierarchy/system-message-variants.png), [Usage](verify/text-hierarchy/system-message-usage.png), [Docs](verify/text-hierarchy/system-message-docs-tokens.png) |
| DateDivider | Relative, calendar and long dates | 4 / 8 | Date 12/400 muted; timeline body 14/400 secondary; containing title 16/500 primary. | [Gallery](verify/text-hierarchy/date-divider-variants.png), [Usage](verify/text-hierarchy/date-divider-usage.png), [Docs](verify/text-hierarchy/date-divider-docs-tokens.png) |
| UnreadSeparator | Zero, singular and plural counts | 4 / 8 | Label 12/400 muted; timeline body 14/400 secondary; containing title 16/500 primary. | [Gallery](verify/text-hierarchy/unread-separator-variants.png), [Usage](verify/text-hierarchy/unread-separator-usage.png), [Docs](verify/text-hierarchy/unread-separator-docs-tokens.png) |

### Screenshot-matched Tabs view and Controls

The exact **Full width with counts** view renders selected and inactive tab labels at 14px/500, with primary #484848 and muted #707070 respectively. Count labels are 12px/400/secondary #5E5E5E. All three triggers retain their 54px height. The selected panel uses title 16px/500/primary, body 14px/400/secondary and helper 12px/400/muted.

- [Default full-width view](verify/text-hierarchy/tabs-full-width-counts.png): Open 12, Assigned 10, Resolved 8.
- Keyboard Space activation of Assigned updated the `value` Control. Changing `value` to Resolved through Controls updated the selected panel. Changing the base `count` Control from 12 to 18 rendered Open 18, Assigned 16, Resolved 14 with the same 500 label weights and 54px trigger heights: [Controls result](verify/text-hierarchy/tabs-controls-resolved.png).
- [Final v1/v2 comparison](verify/text-hierarchy/tabs-comparison.png): v1 retains #181D27 selected text, #717680 inactive text, #343E55 body, and 600 panel headings. v2 uses the new roles and 500 panel headings. ReplyQuote’s generated scoped v1 CSS also retains its original 600 sender and legacy neutral colors.

### Review boundaries and result

No concrete rendering defect remained in these 16 components after the final color/weight review; no source changes were needed during the frozen browser pass. Earlier dev-index error overlays and incorrect navigation IDs were excluded from the evidence. This pass checks the user’s new text hierarchy correction; it does not claim a new Figma comparison or repeat the earlier complete behavior/state matrix. The prior component review reports remain the detailed interaction baseline.

The Docs page title retains its prominent 32px/600 style. Syntax highlighting, the framework Copy control and intentionally stronger primary Button actions are separate from ordinary component titles/body text. Their existing intent styles were not flattened into the body hierarchy.

Sources and stories remain frozen. This agent has not committed, pushed, published, changed v1 component source, changed registry metadata or started/restarted build/server processes. The parent agent owns final production integration.
