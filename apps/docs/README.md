# MyOperator v2 docs

A custom Next.js site for exploring the existing MyOperator v2 library, with a documentation shell closely matching the UIArc reference. The navigation and documentation live in Next.js; the live examples run in an isolated Vite iframe using the original stories.

## Open locally

Install both dependency sets when setting up a fresh checkout, then start from the repository root:

```sh
npm ci
npm --prefix apps/docs ci
npm run docs
```

- Docs: `http://localhost:6009`
- Preview runtime: `http://localhost:6011`
- Component example: `http://localhost:6009/components/button`
- Shared visual guidance: `http://localhost:6009/foundations`

The repository command starts both servers. `apps/docs/scripts/dev.mjs` stops its companion process when either server exits. The direct Next command, `npm --prefix apps/docs run dev`, starts only the docs shell; use the repository command for development previews.

## Explore a component

1. Open a component from the sidebar or catalog.
2. Start with the curated compact example, or choose any original story: Overview, a variant/state, a comparison or Usage.
3. Edit the exposed Controls. In synchronized examples, typing or toggling also updates the Controls.
4. Use the styled Example/Controls menus; Appearance offers checked width and density options. Preview height follows the content and reserves overlay space only while open.
5. Use Fit/Mobile for a 390px preview, Expand for a larger canvas, and Escape to exit. Use Preview to exercise the component and Code to inspect the component source or original example definitions. Read the component guidance for installation, imports, changes and tokens.

Wide comparison grids scroll inside their preview. Interactive galleries can intentionally keep samples independent; a gallery is not expected to force every sample to share one value. Controls for fixed comparison axes are hidden by the story itself.

Interaction-test stories are examples, not an automatically executed test runner. Keep Storybook for its play functions, Interactions panel and add-on tooling.

## Build and run

```sh
# Build iframe assets, then Next, from the repository root
npm run docs:build

# Run the built site, including bundled /preview/ assets, on 6009
npm run docs:start

# Check docs shell types, catalog parity, source routes and search
npm run docs:check
```

To work on the isolated preview runtime directly:

```sh
node apps/docs/scripts/generate-preview.mjs --dev
node apps/docs/scripts/generate-preview.mjs
```

The build first emits Vite assets to `apps/docs/public/preview`, then builds Next with the preview origin unset for same-origin delivery. Stop the production server before rebuilding, then restart it: Next registers public asset paths at startup. The build and served previews were verified; see `design/V2-DOCS.md` for the evidence and limits.

## How it is organized

| Layer                                                 | Responsibility                                                                                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `apps/docs/app`                                       | Next 16 routes, custom navigation, catalog, Foundations and documentation styling                                               |
| `apps/docs/preview`                                   | Vite/React rendering of unchanged original stories; local useArgs/action shims, CSF preparation and pseudo-state CSS processing |
| `apps/docs/scripts`                                   | Paired development servers, preview-first production build and source/catalog/search checks                                     |
| `apps/docs/components` and `apps/docs/lib/catalog.ts` | Controls, preview bridge, rendered guidance and the 56-component page tree                                                      |
| `src/components/ui/v2`                                | Canonical unprefixed shipped components and their original stories                                                              |
| `src/storybook` and `.storybook`                      | Original preview helpers, typography/tokens and Storybook configuration                                                         |
| `packages/cli`                                        | Component registry and consumer installation; unchanged by this docs migration                                                  |

The docs shell uses its own Tailwind 4/custom styles. The iframe uses the library's Tailwind 3, semantic tokens, Bootstrap compatibility rules, fonts and v2 preview defaults. Keeping those styles in separate documents prevents the docs framework from changing component geometry or the component resets from changing the docs shell.

Storybook remains available:

```sh
npm run storybook
```

Its default port is 6006. Another existing local instance may use a different port.

## Source ownership

- Edit a component in `src/components/ui/v2/<name>.tsx` and its story alongside it. The docs preview should consume those files; do not maintain a second component implementation under `apps/docs`.
- Follow `design/V2-STORY-STANDARD.md`: real Controls, synchronized interactions, distinct text roles, contained galleries and working Usage.
- Canonical v2 stays unprefixed. Legacy v1 components and `tw-` consumer distribution stay unchanged. The Bootstrap frontend's consumer-only adaptation is a separate integration.
- Docs runtime compatibility shims belong to the preview layer. They must not alter the public component API or the original story source.
- Preserve callbacks, local story state and v1 comparison styling. Keep React elements/functions inside the iframe; send only safe metadata and editable values to the docs shell.

## Troubleshooting

- **Docs load but preview does not:** verify that the preview server is running on 6011. The dev command sets `NEXT_PUBLIC_PREVIEW_ORIGIN=http://localhost:6011`; the production build unsets it for bundled previews. The Next app uses this value for the preview origin when configured; restart/rebuild after changing this build-time setting.
- **Controls change but the example does not:** check the selected story's renderer, useArgs shim, inherited args/parameters and argTypes mapping. Boolean icon Controls often map to JSX within the iframe.
- **Variant grids lose hover/focus styles:** forced pseudo-state samples need the same CSS processing as the original Storybook preview.
- **Dialogs are clipped:** fixed portal overlays need a sufficient iframe viewport; document content height alone does not measure them.
- **Preview differs from Storybook:** compare fonts, stylesheet order, Tailwind config, decorators, layout and mapped arguments before changing canonical component styling.

## Verification status

The custom shell was compared with UIArc through computer use in Chrome. All 56 featured component pages loaded without page overflow at the observed 1280px browser width, and all 789 original examples rendered without preview errors. Search navigation, a 390px component viewport, expansion/Escape, and source viewing were checked. A real keyboard check exposed a Controls round-trip typing issue; the host now updates immediately and preserves edits until the preview acknowledges them.

Catalog/source/search checks, both typechecks, ten adapter tests and the production build passed. See `verification/custom-library-report.json` for the recorded sweep. This is a render and selected interaction review, not a rerun of every Storybook play function. Full mobile-page and reduced-motion browser emulation were not established. Nothing has been committed, deployed or published by this docs task.

## Production mount

The `myoperator-design-system` Vercel project builds `apps/docs` with `NEXT_PUBLIC_DOCS_BASE_PATH=/design-system`. Its isolated Vite previews use the same prefix; Next links and redirects prefix navigation, while the docs helper prefixes assets, source requests and iframe URLs. Local `npm run docs` retains its root paths. `apps/docs/vercel.json` installs both package sets and runs the preview-first production build. Source files outside the app root are enabled for the library and traced source endpoint.

The existing `myoperator-ai-builders` project owns `design.myoperator.com`; a project routing rule mounts only `/design-system` and its descendants to `myoperator-design-system.vercel.app`. The builder homepage remains served by its existing deployment. Storybook stays in `shadcn-react-app` and excludes v2 stories; canonical v2 story files remain available to the docs runtime.
