# Dropdown Menu v2 review

Worktree `/Users/ankish/Downloads/Code/storybook-npm-v2`, branch `feat/v2`; local only.

## Changes

- Preserve native Radix Root/Content/item props, callbacks, refs, keyboard navigation, scrolling and dismissal.
- Fix `asChild` composition in Item, CheckboxItem, RadioItem and SubTrigger: keep one valid original element, adding descriptions, suffixes, indicators or chevrons inside it. Anchors retain their href and refs.
- Recorded 48px minimum rows, 10px / 6px padding, Inter 16px, 12px support text, 8px corners, teal checks. Destructive examples use semantic-error-text (B42318); semantic-error-primary renders F04438 and was corrected during browser review.
- Rewrite stories with synchronized open / checkbox / radio Controls; editable individual stories; contained inline presentations; real local inbox preference Usage. There is no artificial size API.

## Checks

- 34 focused tests pass, including five new asChild anchor/ref/callback/decoration/checkbox/radio/submenu tests. Breadcrumbs integration passes its four tests. Removed act warnings in the new keyboard test.
- Focused formatting, ESLint and story-inclusive TypeScript pass. Original v1 source/story/test hashes unchanged.
- Overview item label Control changes the real row; open Control opens the menu. ArrowDown and Escape close and restore trigger focus.
- Rendered real rows measure 48px height, padding 10px 6px, Inter 16px; selection check is rgb(39,171,184).
- Checkbox click updates checked Controls; changing checked Controls removes the rendered indicator. Radio selection updates value Controls to oldest. ArrowRight on a submenu opens Copy link.
- Gallery item label Control updates all three samples. Variant/state grids and full v1/v2 comparison manually reviewed; comparison includes header, descriptions/shortcuts, checkbox, submenu and destructive item. The document and viewport remain 980px wide.
- Usage toggle updates both the local Notifications display and status, with checked Controls synchronized.
- Docs migration and token tables manually reviewed: five / seven rows, zero heading elements inside cells, no menu portals over Docs.

Evidence: `design/review/dropdown-menu/selection.png`, `variants.png`, `states.png`, `comparison.png`, `usage.png`, `docs.png`.

Global production Storybook build and mobile sweep are main-agent gates. Browser connection briefly timed out during concurrent work; subsequent DOM inspection confirmed the actions and state updates described above.

## Final event logging audit

During the Button event repair, audited all eight owned stories for raw event-to-spy calls. Dropdown still forwarded one native selection event and constructed three events for inline actions. These story-only calls now log serializable `{type,label}` records. The actual Radix callback API, selection/close logic, labels, layouts and Controls remain unchanged.

Rechecked the latest 6008 preview:

- Actual Overview Edit selection logged a record, unmounted the menu and returned focus to **Conversation actions**.
- All Variants inline Edit, Share conversation and Archive buttons each logged a record. Expanded the Edit action: it contains only `label: "Edit conversation"` and `type: "select"`.
- No new SecurityError, toJSON or stringify failures appeared. Generic Chrome extension connection messages remain separate from component action behavior.
- Focused ESLint, Prettier and the nine-story TypeScript check pass. No component or v1 source changes were required for this audit.

Evidence: `design/review/dropdown-menu/{selection-action-fixed,inline-actions-fixed}.png`. Stories are source-frozen for the final production rebuild.
