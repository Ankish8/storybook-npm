# Action Button review — 2026-10-07

## Added

- `src/components/ui/v2/action-button.tsx`: additive async action control. There is no v1 ActionButton and no existing call site is migrated.
- Uses the current v2 `buttonVariants` palette, radius, size, focus and press rules. Accepts canonical variants and existing compatibility aliases. Text sizes only; icon-only controls remain Button.
- Awaits a real `onAction` promise, blocks duplicate activation, preserves focus while pending, announces status, handles rejection and retry, supports a configurable success reset, and ignores late results after unmount.
- Motion animates changed letters, label width, arrow/spinner/check transitions and check drawing. Shared letter runs remain mounted. Reduced motion removes movement and width spring; the spinner slows down.
- Fifteen canonical stories, including five styles, three sizes, states, failure/retry, custom labels, retained success, Usage and keyboard interaction. Customize controls update the rendered examples.
- Docs Actions category, featured example, CLI definition, generated registries, root Motion dependency and metadata source updated. CLI installation of `v2-action-button` includes `v2-button` and Motion.

## Reference

https://uiarc.dev/components/action-button was inspected through the external browser, including its exposed code, computed styles, and actual pending/success/reset interaction. Motion implementation follows those observed interactions while retaining MyOperator primary color and 8px corners. No Figma values or v1 ActionButton equivalent are claimed.

## Checks

- 31 ActionButton tests pass: promises, same-tick duplicate clicks, keyboard, focus, errors/retry, timers, cleanup, live labels, all inherited styles/sizes, native attributes/ref and v1/v2 coexistence.
- Full v2 suite: 1,696 tests across 60 files pass.
- Docs preview: 8 tests pass, including 3 new ActionButton Controls/example integration tests. All 57 story modules and 801 exports import and expose serializable Controls.
- Both story and preview TypeScript checks pass; new TSX files pass ESLint and formatting. React review checked hooks, cleanup, callback refs, semantics and optional dependency boundaries.
- CLI coverage, registry, generator and consumer tests pass (183 total across the full run and the corrected dependency-allowlist rerun).
- CLI build, Storybook production build and docs production build pass. Docs generated the Action Button route. Storybook index includes its Docs entry and all 15 stories.
- CSS audit: all 27 new class tokens emit; the existing compiled Bootstrap/preview priority regression passes.
- Fresh React 18 consumer installation using only `v2-action-button` installed the namespaced action and Button dependency plus all six npm dependencies, including Motion. No v1 Button file was created.
- Plain and tw-prefixed consumer projects install all 57 v2 files verbatim; v1 Button and the unprefixed-build warning remain correct.
- All 306 pre-existing UI component/story/test files match the pre-task snapshot; all 181 existing CLI definitions are unchanged. Legacy integrity check: all 45 primitives unchanged.
- Existing generated public catalog/token source files were restored after building to avoid unrelated stale-metadata churn. Built Storybook output includes the freshly generated Action Button catalog entry. Metadata source is ready for future MCP generation; the existing v1-only MCP payload was not expanded.

## Remaining verification

The browser tool explicitly blocked localhost access earlier in this session. No alternate browser/transport workaround was used. Local visual review, timing feel, responsive geometry and Storybook play execution in a real browser remain unverified. Unit and compiled-output checks do not establish visual sign-off.

Everything remains local on `codex/v2-motion-polish`. No commits, pushes, publishing, Figma edits or product integration.
