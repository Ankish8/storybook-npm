# Button compatibility and docs-shell repair

The user approved repairing the remaining Button compatibility failures and four shared-shell lint errors on October 13, 2026. Preserve v1 source, frozen snapshots, compatibility waivers, existing page structure and all earlier component work.

Button loading will use native `disabled` and a Lucide loading SVG, matching the v1 behavior and markup contracts. Retain v2 palettes, label transitions and centered loading presentation. Busy slotted links still block navigation and callbacks. No new public mode or prop is needed.

For the docs shell, reconcile JSON drafts and navigation state when their inputs change, derive the preview URL from an SSR-safe browser-origin snapshot, and associate source results with their component/mode request. Keep focus, deep-linked stories, iframe origin validation, controls and mobile navigation behavior. Do not suppress lint rules or defer state updates merely to evade them.

Verify native loading and form/tab behavior, external JSON resets without input remounting, route/category changes, preview messaging and stale source responses. Run full root and CLI tests, all four compatibility gates, lint, API checks, docs type/build/catalog checks, source/package integrity and actual React 18/Bootstrap CLI installation. Recheck live previews and preserve unrelated working-tree files.

## Implemented and verified

Button restores native disabled behavior while loading, including slotted native buttons. The loading spinner uses the legacy Lucide SVG contract; normal buttons gain no extra hidden SVG. Busy links still prevent navigation and callbacks. Loading labels and v2 presentation remain.

The shared shell reconciles external JSON and route changes without remounting focused inputs. Preview URLs use an SSR-safe origin snapshot, and source responses are associated with their request so a late response cannot replace the current source. Mobile navigation returns focus after the header's inert state clears. Independent browser QA reproduced and closed the original Escape focus defect.

The four shell lint errors are resolved without suppressing hooks rules. Generated Next output is ignored; actual preview helpers and replay fixtures have typed values and commit-safe state synchronization.

The Storybook token addon was scanning generated CSS and screenshot assets on every module transform. Its glob now matches the single token file already selected in preview.ts. This preserves the token panel, TypeScript prop extraction and Merlin component manifest. The full build succeeds; preview compilation took 20.14 seconds and the manifest contains 136 component records.

- Full component suite: 203 files, 5,900 passed, 5 existing skips.
- CLI suite: 190 passed; complete registry/prefix/source/import/build verification passes.
- Migration: 4/4 gates pass, comparing 45 components, 249 v1 exports, 430 stories and 382 declared props. Existing waivers are unchanged; no new behavior failure or ignored prop.
- Full lint: zero errors and five existing warnings. All modified source passes scoped lint and formatting.
- API check, source types, library build, MCP build/types, docs preview types and actual React 18/Bootstrap consumer types/build pass.
- All 211 installed consumer examples mount at 390px with no runtime exceptions, outer horizontal overflow or paragraph margin bleed. Plain v2 and prefixed v1 class overrides both work; consumer helpers remain intact.
- SHA verification preserves all 748 legacy component/frozen/token/API/waiver files selected for the final audit. Legacy integrity reports 45 unchanged primitives; HEAD is unchanged.

Aggregate `npm run build` still reports the same 85 TypeScript diagnostics as before this repair, in existing test/story typing. No production source diagnostic was introduced. `format:check` still lists 398 untouched files. These broad baseline failures are recorded, not suppressed or represented as passing.

Evidence: `/tmp/myoperator-button-shell/` and `/tmp/myoperator-visual-polish/`. The newer visual comparison work is tracked separately in `design/VISUAL-POLISH.md`. Nothing was committed, pushed, versioned or published.
