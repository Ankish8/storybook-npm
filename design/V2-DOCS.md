# V2 custom documentation site

## Direction

Replace the rejected Fumadocs presentation with a custom Next.js shell closely matching the UIArc component reference. The reference was opened and inspected through computer use in Chrome: header, sidebar, main article, table of contents, rounded gray preview canvas, installation/usage sections and page actions.

The implementation uses original MyOperator names, content and components. Fumadocs and its direct dependencies have been removed. Navigation includes working component and Foundations destinations; no placeholder pricing, premium filters or external-account actions were introduced.

## Architecture

`apps/docs` contains the Next 16 / React 19.2 application. The custom shell uses local Geist/Inter fonts and Tailwind 4. An isolated Vite iframe compiles the library's Tailwind 3, tokens and unchanged v2 stories. Canonical components, all 58 story modules, v1 and CLI distribution remain owned by the library.

- `components/library-shell.tsx`: header, grouped/filterable sidebar, native search dialog, mobile drawer and appearance settings.
- `app/globals.css`: reference-driven geometry, typography, responsive shell and preview framing.
- `components/component-playground.tsx`: editable Controls, synchronized values, preview/code views, Fit/Mobile, expansion, source copy and live table of contents.
- `lib/featured-examples.ts`: all 58 initial examples, using compact galleries where appropriate and Overview where the comparison is too large.
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

Done so far: Button, Action button, Split button, Button group, Modal, Checkbox (which also covers Radio) and Creatable multi-select. Add the rest one component at a time.

### How an example works

An example is a real consumer file, not a snippet. `apps/docs/examples/<slug>/<id>.tsx` default-exports a component that imports from `@/components/ui/v2/...`. The iframe renders that file and the page prints the same file's source, highlighted by shiki on the server, so the code on screen cannot drift from the demo above it.

```
apps/docs/examples/<slug>/
  examples.json      { "anatomy": true?, "examples": [{ "id", "title", "description", "minHeight"? }] }
  <id>.tsx           one file per listed example
  anatomy.txt        optional, shown as the Anatomy block
```

- `description` is one or two sentences; wrap code in backticks. `minHeight` reserves room up front for demos whose menu opens inside the frame (a modal grows the frame by itself).
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

Blocks today: Creatable multi-select. Not done: Arc's "When to use / When not to use" and "Built from" sections.

## The preview frame and open menus

The hero preview is an iframe that reports its own height. A component whose menu opens inside the frame (Select, Select field, Creatable select, Multi-select, Creatable multi-select, Search filter, Dropdown menu) has to be tall enough for that menu before it opens, or opening it resizes the card, moves the content and clips the menu.

- `apps/docs/preview/src/main.tsx` holds `popupRoom`: pixels the open menu reaches below the story's content. The frame is `content + room` from the start, and `preview.css` (`html[data-popup]`) keeps the content at the top instead of centred. If a menu is ever taller than the reserve (for example after adding options in Customize) the frame grows to the document's height.
- The numbers are measured, not guessed: open the hero story in a tall frame, open the trigger nearest the bottom, and take the menu's bottom edge minus the content's bottom edge, plus 24px of slack. Add the new component to `popupRoom` and to the `popup` list in the same file.
- Split button and Button group keep a fixed 420px reserve. Tooltip opens inside its content and needs none.
- Story galleries must not pin a field to a pixel width: use `width: 100%; max-width: <width>` and `min-w-0` on grid cells. A grid column sizes itself to its widest child, so a fixed 420px made the whole preview wider than the phone-width frame (the Mobile preview toggle is 390px).
- When testing for horizontal overflow, do not use Chrome's `mobile` emulation: it widens the layout viewport to fit the content and hides the overflow. Fix the viewport width and compare `scrollWidth` with `innerWidth`.
