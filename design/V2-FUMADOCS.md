> Superseded: the user rejected the Fumadocs shell. The current custom Next.js implementation is documented in [V2-DOCS.md](./V2-DOCS.md). The record below describes the earlier prototype.

# V2 Fumadocs migration

## Purpose

Provide a focused documentation site for the existing 56 v2 components with navigation, source examples, practical guidance and editable previews. This changes the documentation surface; the canonical component files, original stories, v1 compatibility and consumer installation ownership remain in the existing library.

## Architecture

The Next 16 / React 19.2 / Fumadocs 16.16.1 application lives in `apps/docs`. It serves the catalog, Foundations and `/components/<slug>` pages on 6009. An isolated Vite runtime on 6011 renders the original `src/components/ui/v2/*.stories.tsx` modules. A local useArgs compatibility layer connects interactive stories to the docs Controls.

Implementation paths: `apps/docs/preview/src/main.tsx` loads the stories; `model.mjs` prepares CSF metadata and filters the message boundary; `preview-api.tsx` supplies local useArgs context; `storybook-test.ts` preserves action-spy rendering support; `pseudo-states.mjs` preserves forced-state CSS. `apps/docs/components/component-playground.tsx` owns host Controls/Code/guidance.

The iframe isolates two style stacks: Tailwind 4/Fumadocs in the documentation shell, and the library's Tailwind 3, Bootstrap, semantic tokens and existing story CSS in the preview. No component recreation or consumer `tw-` prefix conversion belongs in the docs app. Storybook stays available for the full add-on and interaction-test workflow.

## Runtime audit

Read-only audit of the current source recorded:

| Pattern                                        | Count | Requirement                                                                       |
| ---------------------------------------------- | ----- | --------------------------------------------------------------------------------- |
| Existing story modules                         | 56    | Load the actual CSF modules, not replacement demos                                |
| Exported story declarations, including aliases | 789   | Use actual export names and explicit display names                                |
| Modules using `storybook/preview-api`          | 45    | Provide synchronized useArgs context                                              |
| Modules using `storybook/test`                 | 44    | Keep module-load spies compatible, including `.mockName()`                        |
| ArgTypes mapping definitions                   | 6     | Apply mapping inside the iframe; do not serialize JSX                             |
| Decorator definitions                          | 21    | Preserve meta/story decorators and their context                                  |
| Play functions                                 | 25    | Keep separate from normal browsing                                                |
| beforeEach hooks                               | 1     | Do not run automatically; ReadableField replaces navigator.clipboard for its test |

Inventory: `/tmp/v2-fumadocs-story-runtime-audit.json`. These are static source counts, not proof that every example rendered correctly.

### Preserve story semantics

- Merge meta args with the selected story's overrides. Reset between story selections while preserving in-story updates. Key the render boundary by story so React hook ordering and local state do not leak between different examples.
- Merge nested parameters, including `controls.include`, `controls.exclude` and `docs.description.story`. `gallery()` sets these exclusions for fixed comparison axes.
- Preserve `control:false`, relevant table metadata, options, boolean defaults and `argTypes.mapping`. Raw editable values cross the boundary; mapped React nodes and original callbacks remain in the preview.
- Run decorators with the current story context. Reuse the global data-v2-preview wrapper, stylesheet order, fonts, automatic JSX transform and `@` import alias.
- Keep independent sample/gallery state independent. Usage stories can use local form state as well as useArgs.
- Keep the original stylesheet processing for forced hover, pressed and focus samples. A pseudo class on JSX is insufficient unless its matching CSS is generated.
- Handle padded/centered/fullscreen layouts. Fixed-position dialogs and toast portals need a deliberate iframe viewport; normal body ResizeObserver height does not capture their full geometry.

### Preview message boundary

The host and iframe must check message origin, sender window, channel/type and selected story ID. Transport only structured safe metadata and argument patches; omit functions, React elements and cyclic objects. Keep callbacks privately in the iframe and apply mappings there. Reject unknown controls and stale story updates, and avoid echo loops between local interactions and host patches. If iframe sizing is reported, bound it and keep galleries contained.

This is a narrowly scoped compatibility bridge, not a reimplementation of Storybook's testing, accessibility or add-on runtime. Play functions and beforeEach hooks should not execute when a reader opens a page; use Storybook for those checks.

### Documentation rendering

`v2ComponentDocs()` produces Markdown plus raw HTML tables and token swatches. Preserve escaped leading color hashes as text, not headings, and retain readable table containment and 500/400 text hierarchy. Render only repository-owned generated descriptions with a deliberate sanitize/allowlist policy. Default HTML sanitization can strip swatch styles. Do not inject library Bootstrap/index.css into the Fumadocs shell.

## Development

From the repo root, the commands are:

```sh
npm run docs
npm run docs:check
npm run docs:build
npm run docs:start
```

The dev command starts both 6009 and 6011 through `apps/docs/scripts/dev.mjs`. The build command runs Vite first, emitting `apps/docs/public/preview` with base `/preview/`, then builds Next with a blank preview origin for same-origin delivery. `docs:start` serves the built Next site on 6009. `docs:check` checks the docs shell types, catalog/source/CLI parity, source route rejection rules and search results. Direct Next-only commands are in `apps/docs/package.json`; building Next alone is not a complete preview build.

`NEXT_PUBLIC_PREVIEW_ORIGIN` selects a configured preview origin. It is a Next public/build-time setting, so restart or rebuild after changing it. Production builds use the bundled/same-origin preview. A future deployed source-code API will also need the original TSX files accessible or packaged: the current API reads them from the full checkout, and a local build alone is not deployment verification.

For the established development surface, `npm run storybook` remains unchanged (default 6006).

## Ownership and preservation

- Canonical components: `src/components/ui/v2/*.tsx`.
- Original story definitions: `src/components/ui/v2/*.stories.tsx`.
- Shared example helpers: `src/storybook/v2-preview.tsx`.
- Story writing and review rules: `design/V2-STORY-STANDARD.md`.
- Source motion rules: `design/V2-MOTION.md`.
- CLI registries, v1 files and Bootstrap-host consumer adaptation remain separate from this migration.

This task does not authorize Git publishing or a deployed site. Keep the migration local until the user explicitly requests publishing.

## Verification record

Verified locally on October 5, 2026. Production preview: `http://localhost:6009`. The browser render manifest is in `apps/docs/verification/browser-report.json`.

| Gate                                                          | Current evidence                                                                                                                                                                                                                    |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All 56 component routes/catalog entries                       | `npm run docs:check`: 56 source components, 56 story modules, 56 CLI entries, six categories and 58 documentation pages. All 56 component pages loaded in the browser.                                                              |
| Original components/stories and v1 preservation               | `git diff --exit-code -- src packages .storybook package-lock.json` passed. No canonical source, story, registry or root dependency changes. The pre-existing dirty `public/design-tokens.source.json` was preserved.               |
| Docs + preview type checking                                  | Docs TypeScript check and `tsc -p apps/docs/preview/tsconfig.json --noEmit` passed.                                                                                                                                                 |
| Complete production build and iframe asset delivery           | `npm run docs:build` passed; Vite preview assets and 61 Next routes generated. The source endpoint build trace includes all 112 component/story source files. The single production server delivered the actual examples.           |
| Overview Controls and interaction synchronization             | Browser: input typing → Controls, Controls → field, Reset, switch toggling in both directions, Tabs click → value, dialog open/Escape → open state, and select choice → value. Adapter focus test passed.                           |
| Variants, states, v1 comparisons and Usage                    | Browser sweep selected every one of 789 distinct exports across 56 components and waited for its rendered story marker. Zero preview render errors. This does not execute play functions or establish every possible interaction.   |
| Forced hover/focus and text/token tables                      | Existing pseudo-state CSS is compiled by the isolated preview transform. Documentation tables, hex labels and 32px color swatches rendered. All overview pages had no outer horizontal overflow at the actual 1280px viewport.      |
| Overlay viewport, Escape/reopen, focus and iframe containment | Browser: dialog 512 × 359px within its frame, Escape closes and synchronizes state. Select list ends at 319px inside a 480px frame; calendar panel 459 × 330px inside a 640px frame. Search result navigation and Copy code passed. |
| Adapter checks                                                | Eight model tests and two React/registry tests passed, including all 56 modules/789 story registrations and decorator input focus preservation.                                                                                     |
| Reduced motion / narrow screens                               | Existing canonical motion and responsive styles are reused. Browser viewport override did not change the observed 1280px viewport; no mobile or reduced-motion browser claim is made.                                               |

Storybook remains available for play functions and add-on tooling. This task created a separate local Fumadocs review site; no commit, push, publishing or dashboard synchronization was performed.
