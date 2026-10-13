# V2 custom documentation site

## Direction

Replace the rejected Fumadocs presentation with a custom Next.js shell closely matching the UIArc component reference. The reference was opened and inspected through computer use in Chrome: header, sidebar, main article, table of contents, rounded preview canvas, installation/usage sections and page actions. The current documentation canvas is a warm near-white (`#fdfdfc`) with neutral boundaries; component colors stay consumer-owned.

The implementation uses original MyOperator names, content and components. Fumadocs and its direct dependencies have been removed. Navigation includes working component and Foundations destinations; no placeholder pricing, premium filters or external-account actions were introduced.

## Architecture

### Live migration comparisons

Every catalog entry has source-audited migration notes in `lib/migration-comparisons.ts`. Unchanged v1 stories load in two isolated frames: actual v1 imports and the same story with v2 imports, resolving merged Modal and Select owners through the compatibility map. The custom Login OTP comparison has an explicit, documented API adapter. Typography's comparison is on Foundations; SelectField shares Select's family selector.

Components without an original public UI counterpart show their genuine saved **Earlier v2** implementation and **Current v2**, using the same saved example. Brand-new MetricCard and EmptyStates have one current preview. Saved snapshots are never described as v1. Comparison frames use the full hero viewport width and safe centering, so responsive calendars and large compositions follow the same layout rules as the hero.

The story runner compiles both unprefixed and legacy `tw-` utilities. Version/mode loaders are explicit whitelists. Messages require the exact iframe window, origin, version, component and current story; selection and reset keep the iframe element. Reset restarts the isolated document at the selected story to clear module-level stores such as Toast.

User-opened modal dialogs expand the existing iframe over the page, preserving the native portal, state and keyboard focus. The page stays in place and the frame returns inline on close. The same protocol serves hero, examples and comparison frames. Initially-open static samples remain inline, measured around their actual dialog, with an explicit Open fullscreen control; nonmodal calendars and menus stay anchored. Fullscreen removes mobile frame margins/borders and frame size transitions.

`apps/docs` contains the Next 16 / React 19.2 application. The custom shell uses local Geist/Inter fonts and Tailwind 4. An isolated Vite iframe compiles the library's Tailwind 3, tokens and unchanged v2 stories. Canonical components, all 56 current story modules, v1 and CLI distribution remain owned by the library.

- `components/library-shell.tsx`: header, grouped/filterable sidebar, native search dialog, mobile drawer and appearance settings.
- `app/globals.css`: reference-driven geometry, typography, responsive shell and preview framing.
- `components/component-playground.tsx`: editable Controls, synchronized values, preview/code views, Fit/Mobile, expansion, source copy and live table of contents.
- `lib/featured-examples.ts`: current hero mappings, using interactive product examples for the refreshed pages; hidden compatibility entries have no promotion.
- `preview/src`: original CSF story rendering with local useArgs/action compatibility. Original play hooks are not automatically executed.

Controls optimistically update the host field. Pending edits survive stale preview replies and clear when acknowledged, preventing rapid typing from losing characters across the iframe message boundary.

## Local operation

Run `npm run docs` for Next on 6009 and the preview runtime on 6011. Run `npm run docs:build`, then `npm run docs:start` for a single production server on 6009 with same-origin previews. Stop that server before rebuilding because Next registers public assets at startup. `npm run docs:check` validates docs types, catalog parity, all source responses and search.

Storybook remains available with its original commands, play functions and add-on tooling.

## Verification

October 5, 2026: all 56 component pages fit the observed 1280px browser viewport without outer horizontal overflow or missing table-of-contents targets. All 789 distinct story exports rendered without preview errors in the custom canvas. The build, docs/preview typechecks, eight model tests and two React/registry tests passed. Catalog checks cover 56 components, six categories, 58 pages, 112 source responses and rejection of eight invalid source requests.

Computer use in Chrome reviewed the reference and the Button, Breadcrumbs and Input pages. Search filtering and Enter navigation worked. Browser checks established a 390px component frame, expanded preview/Escape dismissal and actual source viewing. The Controls typing fix was verified with real keyboard input after rebuilding.

Evidence: `apps/docs/verification/custom-library-report.json` and the custom preview screenshot. Earlier Fumadocs proof is retained as prototype history, not evidence of this shell.

Limitations: render sweeps do not execute every play function; full mobile-page and reduced-motion browser behavior were not established. No deployment, Git publication or dashboard synchronization was performed.

## Docs shell polish following screenshot review

Native Example, source and enum Controls selectors were replaced with styled Radix Select primitives; Appearance uses Radix Dropdown Menu radio items with checkmarks. These primitives have shell-owned CSS, keyboard navigation, portal positioning and collision handling. Keyboard focus uses a soft rounded ring; search input focus stays within the dialog without an inner browser outline. A bare `outline` class that collided with Tailwind's outline utility was replaced with an explicit bordered-button class.

Previews follow natural content height. Closed modal launchers use a compact frame, open dialogs reserve 640px and menus reserve space only while open. A MutationObserver detects portal lifecycle changes. Large initial EmptyState, UI Card, PageHeader and OTP comparisons now start with Overview; their original comparisons remain available in Example. Search prioritizes exact names and prefixes and tolerates one-letter misspellings.

## Documentation motion polish - October 6

Persistent Motion spring markers connect Preview/Code, header navigation and the right-side reading guide. Marker positions are measured from the selected element; velocity survives interrupted selections. The spring uses stiffness 380, damping 38 and mass 0.85, with no movement on first measurement or under reduced motion. Component navigation uses a stationary selected background with a 160ms colour fade rather than travelling between unrelated items. The sidebar scrolls a selected component into view when necessary.

Routes enter with a 220ms opacity fade (no wrapper transform, so the fixed reading guide remains anchored), panels fade for 180ms, and preview dimensions settle over 240ms. Menus fade out over 110ms and the search dialog uses native discrete transitions. Section links use smooth anchor scrolling with one header offset. Passive, animation-frame-coalesced scroll tracking keeps the reading marker attached to the actual current section instead of jumping ahead to a clicked destination. Reduced motion removes spring movement, spatial entrances and smooth scrolling. Canonical components and stories remain unchanged.

### Preview controls experiment — 2026-10-06

The Customize button beside Preview/Code opens a non-modal inspector. The example picker, live properties and reset action live together inside it. There is no backdrop, blur, focus trap or scroll lock, so the preview remains interactive. At desktop widths the article reserves 368px and the reading guide is hidden; below 900px the inspector becomes a compact bottom panel. Escape and the close button restore focus to Customize. Existing iframe message synchronization and story selection remain unchanged. The inspector is portalled outside the route wrapper to avoid fixed-position containing-block regressions.

The inspector is 360px wide and sits 16px from the viewport edge. While open, the shell extends to the right while preserving its existing left alignment, keeping a 32px gap beside the article without an unused outer gutter. Control labels and fields use 13px type, supporting descriptions use 12px. Button size comparisons are centred in three columns in the preview adapter. Compact previews have a 200px minimum; open dialogs measure their actual panel plus 80px padding with a 320px minimum, rather than a fixed 640px canvas. Full-height panel previews retain a stable 480px viewport. These presentation rules do not alter the canonical components or stories.

### Persistent customize workspace

Opening Customize fixes the existing playground beside the controls, with independent preview and controls scrolling. The iframe stays mounted, preserving interaction state. A measured placeholder preserves document height; the background document keeps its layout and scroll position while scrolling is locked. Closing restores normal flow and focus without scrolling to the trigger. On phones, the preview occupies the upper area and the controls use the lower panel. Tall previews align safely inside their scrolling canvas.

## Examples: a heading, a live preview and code (HeroUI-style)

Below the hero preview, a component page can carry an **Anatomy** block and an **Examples** section. Each example has a heading, a sentence of description, a live interactive preview in its own iframe and an expandable, copyable code block, and each is listed in the reading guide under "Examples". The hero preview, Customize and the Code tab are unchanged, and a component with no examples folder renders exactly as before.

Examples now cover Button, Action button, Split button, Button group, Modal, Checkbox (including Radio), Creatable multi-select, both date pickers, File upload, Input, Multi-select, Number step field, Phone input, Select (including SelectField), Switch, Text field, Textarea, Breadcrumbs, Dropdown menu, Pagination, Stepper and Tabs.

The October 13 pass adds 101 live examples across ten canonical pages. Every example has an Expand/Collapse code control, including short sources. Select and SelectField share one implementation and one documentation page; `/components/select-field` redirects to `/components/select`, while the old source and CLI entry remain available for migration. Catalog compatibility aliases stay in source/registry integrity checks and are omitted from sidebar navigation.

### How an example works

An example is a real consumer file, not a snippet. `apps/docs/examples/<slug>/<id>.tsx` default-exports a component that imports from `@/components/ui/v2/...`. The iframe renders that file and the page prints the same file's source, highlighted by shiki on the server, so the code on screen cannot drift from the demo above it.

```
apps/docs/examples/<slug>/
  examples.json      { "anatomy": true?, "examples": [{ "id", "title", "description", "minHeight"? }] }
  <id>.tsx           one file per listed example
  anatomy.txt        optional, shown as the Anatomy block
```

- `description` is one or two sentences; wrap code in backticks. `minHeight` sets the total iframe viewport a popup needs; the card keeps its natural content height and the popup overflows it. A modal grows the frame by itself.
- `apps/docs/lib/examples.ts` reads and highlights the files (ids are checked against a strict pattern before any file is read). `components/examples-section.tsx` renders them, loading each iframe only when it is within about 800px of the viewport.
- The iframe is a second Vite entry, `preview/example.html` (`preview/src/example.tsx`). It loads exactly the files that exist under `apps/docs/examples` and reports its height to the page. In dev a small plugin in `preview/vite.config.mjs` watches the folder, so a new example or component folder appears without restarting the server.
- `apps/docs/examples/tsconfig.json` type-checks the files against the real components (`npm run typecheck` in `apps/docs`), and `src/components/ui/__tests__/v2/docs-examples.test.tsx` mounts every example and checks that folders, manifests and files agree.

### Adding a component's examples

1. Create `apps/docs/examples/<slug>/` with `examples.json` and one `.tsx` per example.
2. Run `npm run typecheck` in `apps/docs` and `npx vitest run src/components/ui/__tests__/v2/docs-examples.test.tsx`. The test lists the components that have examples; add the new slug to it.
3. Open the page and scroll: every example should load, the reading guide should list them, and Expand code should work.

Not covered: a props/API table (the written documentation still carries the design notes and tokens) and dark mode, since the docs site is light only.

## Blocks

A **block** is ready-made product UI built for one job (Arc UI does the same: a Blocks tab beside Components). It is installed and adapted rather than composed from, so it does not sit with the building blocks.

Today a block differs from a component in the documentation only:

- `apps/docs/lib/catalog.ts`: set `kind: "block"` on the entry (optionally `related: [...]` slugs for the Related section). `entryHref(entry)` gives its address, `/blocks/<slug>` instead of `/components/<slug>`; `uiComponents` and `blocks` are the two lists.
- Pages: `app/blocks/[slug]/page.tsx` and `app/components/[slug]/page.tsx` both render `components/entry-page.tsx`. The old `/components/<slug>` address of a block answers with a permanent redirect, so existing links keep working.
- Navigation: a Blocks top tab, a Blocks section in the sidebar, a Blocks section on the overview, and a "Block" label above the title.
- Unchanged on purpose: the source file (`src/components/ui/v2/<slug>.tsx`), its story and its title (`V2/Components/...`), the CLI key (`npx myoperator-ui add v2-<slug>`) and the v1 mapping. `check-catalog.mjs` requires the `V2/Components/` story title and the `v2-<slug>` CLI key, and consumers' install commands use that key, so moving a block does not touch them.
- `apps/docs/scripts/check-catalog.mjs` spells out the list of blocks, so moving one is a reviewed decision. Run `npm run docs:check` after changing it.

Blocks today (13): the six `Custom/Chat/*` components (Contact list item, Date divider, Image media, Reply quote, System message, Unread separator), Creatable multi-select, Creatable select, Search filter, Readable field, Page header, Page footer and Empty states. The rule: a block is product-shaped or a composition (chat, product form patterns, page chrome) that Arc, HeroUI and shadcn would ship as a block or pattern rather than a primitive; the v1 Storybook's `Custom/*` titles were the starting evidence. Two judgement calls kept as components although v1 files them under Custom: OTP input and File upload (shadcn, HeroUI and Arc ship both as components). Not done: Arc's "When to use / When not to use" and "Built from" sections.

### Storybook

v2 is no longer in Storybook: `.storybook/main.ts` lists the v1 story directories explicitly and leaves out `src/components/ui/v2` and `src/docs/v2`, and `preview.ts` has no v2 container, CSS or decorator. The v2 story files stay in the repo because the docs site's preview runner renders them. If you add a new v1 story directory, add it to the list in `main.ts`.

## The preview frame and open popups

A popup (menu, listbox, calendar, time list) overflows the preview card instead of leaving blank canvas for it. The hero preview and every example are iframes, and an iframe cannot draw outside its own box, so the card and the iframe are two different sizes:

- The **card** is as tall as the content (at least 240px for the hero). The **iframe** is taller by `room` pixels, absolutely positioned over the card with a transparent background.
- While no popup is open the iframe is clipped to the card with `clip-path: inset(0 0 <room>px 0)`. A clipped region neither paints nor takes pointer events (checked in Chrome), so the page content under it stays clickable. When the iframe reports `open: true` the clip is removed and the iframe goes above the page (`z-index: 30`), so the popup shows over whatever is below the card.
- The iframe is already tall before anything opens, so a popup positions itself against a tall viewport and never flips upward for lack of space. Content centres inside the card, not the iframe: `preview.css` sets the body's `min-height` to `--preview-card`, which `main.tsx` writes from the same height it reports.
- `main.tsx` and `example.tsx` send `{ height, room, open }` in the `resize` message (`height` is the card without the room). `open` is any element matching `POPUP_SELECTOR` (menus, listboxes, Radix popper content, non-modal dialogs). A popup taller than its room (more options through Customize, or a narrow column that stacks the layout) raises the room to the popup's full scroll height while it is open.
- Clicking elsewhere on the page blurs the iframe window; both runtimes answer by sending Escape, so an open popup closes and the clip returns, as a click outside does everywhere else.
- A modal or panel opened through native interaction expands its existing iframe over the page viewport, retaining the actual portal, state and keyboard behavior. Closing restores the inline frame and the page's prior scroll setting. An initially-open demonstration stays inline, sized around its actual dialog, with an explicit Open fullscreen action; that action focuses the retained iframe so Escape reaches the dialog. Toasts remain within their existing preview layout.
- The phone frame (Mobile) and the Customize workspace use `height + room` and remain fully visible for anchored popups, because their canvas scrolls. User-opened modal dialogs use the same full-page presentation as other previews.

Rooms for the hero preview live in `popupRoom` in `apps/docs/preview/src/main.tsx`. The numbers are measured, not guessed: open the hero story in a 893px-wide frame, open the trigger nearest the bottom, and take the popup's bottom edge minus the card's bottom edge, plus 24px of slack, rounded up to 8. A component that is not in the table gets room only while a popup is open. For examples the manifest's `minHeight` is the total viewport the demo needs; the card is the content, and the room is `minHeight` minus it.

Rules that still apply:

- Do not reserve space in a story for its popup (no `min-h-[520px]` wrappers): the card would grow to include it. The two picker stories had such wrappers and lost them.
- Story galleries must not pin a field to a pixel width: use `width: 100%; max-width: <width>` and `min-w-0` on grid cells. A grid column sizes itself to its widest child, so a fixed 420px made the whole preview wider than the phone-width frame (the Mobile preview toggle is 390px).
- When testing for horizontal overflow, do not use Chrome's `mobile` emulation: it widens the layout viewport to fit the content and hides the overflow. Fix the viewport width and compare `scrollWidth` with `innerWidth`.

## October 13 feedback and layout documentation

The feedback/layout pass adds 109 runnable `.tsx` examples across 18 visible canonical pages. Each page has its dedicated live hero, Preview/Code, the existing Customize workflow, meaningful variant/state/size examples and an Expand/Collapse control for every example source. Example sources are the files the iframe actually renders.

| Page                 | Examples | Main story       |
| -------------------- | -------: | ---------------- |
| Alert                |        7 | Overview         |
| Badge                |        6 | ReviewWorkflow   |
| Bouncing loader      |        5 | Overview         |
| Empty state          |        6 | Overview         |
| Empty states (block) |        6 | Overview         |
| Metric card          |        7 | Overview         |
| Progress indicator   |        5 | Overview         |
| Skeleton             |        5 | Overview         |
| Spinner              |        5 | Overview         |
| Tag                  |        7 | Dismissible      |
| Toast                |        7 | InteractiveStack |
| Tooltip              |        7 | Overview         |
| Accordion            |        5 | Overview         |
| Avatar               |        7 | Overview         |
| Panel                |        6 | Overview         |
| Scrollbar            |        5 | Overview         |
| Table                |        7 | Overview         |
| Card (`ui-card`)     |        6 | Overview         |

Catalog inventory is exactly 56 source/story/CLI entries: 40 visible components, 13 blocks, one compatibility alias and two hidden entries, across eight categories. Card, Metric card and Empty state sit in Cards. Empty states is a distinct App shell block. UI card is displayed as Card while retaining `ui-card`, `UiCard` and its existing install path. Hidden and alias entries are excluded from navigation, both search implementations and related suggestions. Full source/CLI parity is retained; `check-catalog.mjs` explicitly verifies these counts and all 112 component/story source responses.

Typography's existing URL redirects to `/foundations#typography`; both Typography source/CLI versions remain. Shimmering text is a v2-only addition retained for existing installs and direct links, with accurate install/import instructions. It is omitted from discovery. Progress indicator is also v2-only; the page leads with linear progress and retains circle/semi-circle in an explicit compatibility example.

The refreshed token tables are read from actual source variable references and resolved against `src/index.css`. This local documentation path does not rewrite semantic text colors as optional neutral variables. The shared source helper only received an accurate generic additive-component provenance sentence. Existing font files and values are untouched.

When v1 and v2 coexist, retain the existing `tw-` CSS output and compile the v2 component paths without a Tailwind prefix. Both CSS outputs and semantic tokens are needed. Imports and installation do not rebuild a host's CSS.

Avatar examples use the three verified public Arc portrait URLs directly, with explicit names and failure fallback. No image assets were downloaded or redistributed. Toast examples keep their contained viewport in measured normal flow, so expansion grows the demo and leaves the trigger and controls reachable. Tables sort actual records and keep stable row keys; row motion is explicitly opt-in.

The final Tooltip follow-up adds a Light surface example with TooltipArrow. `variant="light"` is an additive v2 Content prop; the default remains dark. Provider retains the v1 700ms hover delay and 300ms skip window, and Content retains its 4px side offset.

The final Tag hero is Dismissible. Its removal example keeps parent-owned cancellation and moves keyboard focus to the next, previous or Reset control after removal. Alert retains immediate DOM dismissal by default; animateExit is optional and is explicitly enabled only in the fade demonstrations. Avatar retains the identity aria-label and reports presence separately through aria-description. Table Overview is the actual sortable campaign renderer, not a static table. Example totals remain109 new /380 curated.
