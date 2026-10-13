# Feedback and layout refresh — 2026-10-13

The user authorized both implementation phases and dedicated component agents. Work stays local. Existing source, frozen comparison snapshots and compatibility waivers remain protected.

## Phase 1: behavior and migration

Compare each component with the official Arc, HeroUI and shadcn references. Preserve v1 exports, accepted props, defaults, refs, callbacks, native attributes and consumer hooks. Repair concrete interaction defects and check keyboard, focus, controlled state and native form behavior where applicable.

Shimmering Text has no v1 counterpart and leaves the public gallery. Typography moves out of the standalone component gallery; foundation guidance remains. Both existing source and install paths remain available. Progress previews focus on linear progress while the existing circular and semicircular APIs remain available.

## Phase 2: presentation and motion

- Alert: compact recovery preview with reconnect and pause actions.
- Badge: no hover animation; approval state changes animate deliberately.
- Empty State: original illustrations for search, connectivity, completion and missing content. A separate Empty States block composes the reusable component into an interactive pattern.
- Toast: neutral surfaces with status accents, plus an optional stack sharing the existing notification API.
- Tooltip: a quiet neutral surface with reliable pointer and keyboard behavior.
- Table: accessible sorting, optional row reordering motion and actual data examples.
- Card: calm surfaces without hover lift; Metric Card is a distinct additive component. Existing `UiCard` imports and variants remain available.
- Loaders, Skeleton, Spinner, Tag, Accordion, Avatar, Panel and Scrollbar: focused fixes, responsive previews and restrained motion. Avatar previews use real portraits with initials as fallback.

All motion respects reduced-motion preferences. Noninteractive decoration does not gain pointer feedback. Colors use the library's semantic tokens, and every component paragraph resets Bootstrap margins.

## Documentation ownership

One designated docs agent owns the catalog organization, hero mappings and all new examples. Every displayed page has a live hero and examples with headings, descriptions, source code and Expand controls. Component workers own their component, stories and tests only.

## Verification

Separate feedback, layout and motion reviewers report to final QA assurance and the reporting coordinator. Main validates the complete root and CLI suites, docs catalog and examples, compatibility gates, protected files, and actual CLI installation in a React 18 consumer. The first batch inherited a 2/4 Button baseline; the subsequently approved Button repair closes it and the current gate passes 4/4.

Reference registry source was retrieved through real Chrome from `https://uiarc.dev/r/<name>.json` after direct HTTP requests returned 403. Reference ideas guide original implementations and token choices.

## Implemented result

All 20 dedicated component/block/audit tasks are complete. The gallery now has a Cards category containing Card (existing `UiCard` source/install names), Metric Card and Empty State. A separate Empty States block provides No results, Offline, Caught up and Not found views with app-owned recovery actions. Typography routes to Foundations; Shimmering Text is hidden from discovery because it has no v1 counterpart. Both source/install paths remain available.

The 17 component pages and one block page have 109 new copyable examples; the docs contain 380 curated examples overall. Heroes demonstrate real local actions: Alert reconnect/pause, Badge approval/reopen, Progress start/pause/resume, Skeleton replay/load, Spinner/Bouncing Loader start/finish, Tag removal/cancellation/focus return, Toast stack pin/expand/dismiss, Table sort/select/reset, and Metric Card period/value changes. Avatar uses real Arc sample portraits with tested fallback. Tooltip offers dark and light surfaces with matching arrows.

Phase 1 preserves v1 behavior and caller ownership. Alert dismisses immediately by default, with optional `animateExit` for an inert, finite exit. Avatar preserves its identity name and supplies presence through `aria-description`. Callback-ref proxies preserve React19 cleanup and remain typed for React18. The CLI helper now merges plain v2 and prefixed v1 classes independently, upgrading only known generated templates while retaining consumer helpers. Migration still requires the documented CSS setup for both namespaces in an existing prefixed app.

Phase 2 provides calm borders, finite content changes, original empty-state SVG illustrations, optional table row motion and a neutral toast stack. Tall fixed stacks stay within the screen and scroll; contained previews grow to the measured content. Live reduced-motion changes are observed; loader animation respects visibility and caller styles. Progress circle, bar and semicircle loading animations ship with their installed source. Passive Card and Badge surfaces have no hover movement.

## Final integration evidence

- Root: 202 test files, 5885 passed and 5 skipped. Docs example coverage: 509 passed, included in the root suite.
- CLI: 190 passed, including real generated-helper and installation/build checks. Full CLI pipeline and prefix/source-type/import/Bootstrap checks pass.
- Docs catalog/typecheck and production build pass. Local MCP metadata is synced; its build and typecheck pass.
- Actual built CLI installed 34 requested entries plus dependencies in React18.3.1, Bootstrap5.3.3 and tailwind-merge2.6.1. Generated Tailwind3.4 configurations compile both namespaces with `important:true`. All 211 examples mount at 390px with zero runtime exceptions, outer horizontal overflow or paragraph margin bleed. Consumer TypeScript and production build pass.
- Actual override readback: v2 Card padding 8px, legacy Button height 32px, and retained consumer helper sentinel 42. No manual replacement with repository utilities.
- All 280 protected SHA256 files and HEAD are unchanged; the legacy integrity checker confirms 45 unchanged components. No commits, push, package version changes or publishing.

After the subsequent Button repair, the full compatibility replay passes 4/4. Type compatibility accepts all 249 v1 exports across 45 components; the ignored-prop scan flags none. No compatibility waivers were added. The verifier correctly classifies the four unchanged Toast CVA background-class assertions as visual redesign checks; five targeted classifier tests preserve behavior-failure classification.

All changed component/story pairs pass scoped lint and formatting. The subsequently approved shared-shell repair resolves the four `set-state-in-effect` errors; current full lint has zero errors and five existing warnings. The CLI coverage validator skips its direct TypeScript registry import; final QA supplements it with a bundled-registry check that compares all unprefixed v2 source bytes. Its generic legacy class scanner has unrelated false positives, recorded separately. These limits are not hidden by waivers or reported as a whole-repository warning-free lint/coverage result.

Independent feedback, layout, motion and final assurance reviews are complete with zero open batch findings. Feedback QA passes 145 focused browser assertions; final assurance passes 35 independent docs, source and installed-package assertions. It also confirms 56 of 56 generated v2 registry entries and 20 of 20 embedded MCP sources match current source. All reproduced ref, motion, exit and tall-toast issues were repaired and independently rechecked. Detailed evidence and per-owner reports are retained under `/tmp/myoperator-feedback-layout/`.

Browser evidence uses current Chrome with keyboard and coarse-pointer/touch emulation, plus actual background visibility changes. It does not establish Safari, physical-device or screen-reader certification. The local preview remains at `http://localhost:6009`.

The later visual polish and live-comparison requests are tracked in `design/VISUAL-POLISH.md`. The latest component suite has 203 files, 5,900 passed and five existing skips, rather than the earlier batch counts above. The final neutral, centered comparisons pass all 122 desktop/mobile matrix checks and 40 meaningful native checks. The final preview suite passes 30 tests, and the production docs build succeeds. Detailed current evidence and remaining baseline limitations are recorded in the visual polish report.
