# Preview and component polish — October 13, 2026

The user approved fixing contrast across documentation previews, Toast composition and width, Pagination hover/selection contrast, PhoneInput scrolling, matching Modal field/action geometry, source-audited migration notes and live comparisons for every catalog entry. Later visual feedback rejects blue canvases and narrow comparison frames that change responsive layouts.

## Component fixes

Toast primitives have padding and a correctly positioned close action. Managed notifications keep their own body padding through an explicit root override; their width grows to 448px. Story compositions use the same single-padding layout and width, with a mobile viewport anchor.

Modal confirmation fields and footer actions use matching 44px height and 8px corners. Exact-phrase gating, focus, single confirmation callbacks and close/reset behavior remain. Both component and compound-part tests reflect the new visual dimensions.

Pagination's selected plate uses the primary surface and inverted text; fine-pointer hover has a distinct primary-hover surface. Disabled and coarse-pointer behavior remains, along with the opt-in animated window and existing default ellipsis algorithm.

PhoneInput uses one list-coordinate highlight instead of reparenting a shared layout element while the list scrolls. Pointer movement does not auto-scroll the list. Explicit keyboard/search/open navigation still reveals the active country. Fast-wheel drift falls from 257.47px to 0px; unintended active-item changes fall from 19 to 0. All 73 scoped v1/v2 tests and 20 browser checks pass, including touch pan, keyboard focus, reduced motion and formatted paste.

## Documentation requirements

One coordinator owns the shared page/preview implementation. Comparisons use real original v1 source where it exists; both sides start with the same legacy example and props. Examples remain independently interactive, with selection and Reset controls. OTP's documentation-only API adapter is disclosed.

Use neutral preview surfaces and clear boundaries rather than the rejected blue tint. Center the control while retaining intended full-width examples. Comparisons need the same usable width as the primary preview so calendars do not change to mobile layout just because the page has two columns. Modal portals must display over the page at the actual viewport size, not inside a clipped preview card.

Stepper was first added in commit `8e21535`, the v2 namespace introduction. No standalone v1 Stepper source, public export, registry key or story exists in the local repository history. The saved earlier v2 Stepper is real; display it as Earlier v2 alongside Current v2. The same approach applies to other existing additions with frozen snapshots. Truly new entries use one current live preview and an accurate addition note.

## Integration status

The current component sources pass 5,900 root tests and all 190 CLI tests. All four migration gates pass with existing waivers unchanged. Installed React 18.3.1/Bootstrap 5.3.3 demos pass types/build and mount all 211 examples without runtime errors, outer overflow or paragraph margin bleed. Production source/library/MCP/Storybook builds and API/integrity checks pass. Full lint has zero errors and five existing warnings.

The neutral, centered, full-width comparisons now pass all 122 desktop/mobile entry and family checks. The final native set has 40 meaningful assertions: 34 interaction checks and six actual tall-content checks using the public Textarea rows=60 prop. Invalid earlier short-Table scroll checks are excluded. Mobile matrix readiness was rechecked with a visible foreground tab after a parallel test tab had suppressed the lazy observer.

Comparison controls are centered (Button center error under 0.01px), and both versions use the full hero width. At a 1,830px browser width, the DateRange comparison and hero each have an 892px viewport and the same 430px calendar with a vertical preset rail. At narrower shared viewports, both use the compact layout. The canvas is a warm near-white with neutral boundaries.

Actual user-opened dialogs expand the existing iframe over the page at the real viewport size. Escape restores the original preview and trigger. Initially-open samples offer an explicit Open fullscreen control; that control focuses the retained iframe with preventScroll so native Escape reaches the dialog. Hero, curated example and migration frames use the same protocol. Mobile-preview margins and borders are cleared while fullscreen so the iframe covers the header at x=0/y=0; closing releases the page scroll lock.

The final preview suite has 30 passing tests. Original v1 comparisons use actual unchanged source; eleven additions with saved implementations compare Earlier v2 and Current v2. MetricCard and EmptyStates are genuine new entries and use one centered current preview. An unused Radio snapshot exposed a production-only import error; the earlier/current virtual registry is restricted to the eleven displayed snapshot families, while the generic frozen review loader remains available.

Detailed evidence is retained under `/tmp/myoperator-visual-polish/`; independent QA evidence is under `/tmp/myoperator-button-shell/reports/`. Broad baseline limitations remain: the aggregate TypeScript build has the same 85 test/story diagnostics and the full formatting check lists 398 untouched files. No v1 source or waiver has been changed, and nothing is published.

The final release checks also pass: the production documentation build generates all 74 routes, the preview regression suite passes 30/30, and full lint exits zero with the same five existing warnings. Independent QA passes 31/31 source checks, 10/10 actual Toast story checks and 32/32 revised docs checks, including centered neutral canvases, matching DateRange layouts, Earlier v2 Stepper provenance, page-level modal expansion, focus and Escape restoration, and curated example triggers. No open product finding remains. Both local services remain available after the production build (6009 and 6011 return HTTP 200). Agent-owned verification browsers are cleaned up separately from the user preview.

## Final migration comparison scope — 14:51 feedback

The user removed Earlier v2 versus Current v2 comparisons from component documentation. Only components with audited v1 counterparts render live v1/v2 frames, labeled v1 and v2. All thirteen v2 additions show their migration notes and “Added in v2. There was no version 1 of this component.” No redundant current-only preview, snapshot selector or reset control is displayed there. Frozen review snapshots remain intact for the separate internal review tooling. The comparison regression covers every v2 addition and the real legacy pair, including fullscreen focus. Docs types/catalog and scoped lint pass. Localhost remains running. This supersedes the earlier comparison presentation described above.

## Approved removal and commit — 15:00 feedback

ButtonGroup is removed from the v2 source, Storybook stories, tests, copyable examples, docs catalog/search/navigation, migration/history choices, CLI category/registry and embedded MCP metadata. SplitButton guidance no longer recommends the removed control. Current inventory and catalog assertions reflect 55 source/CLI entries, 39 visible UI components and 13 blocks. Frozen audit snapshots are retained as history. The docs route returns 404 and the local library remains available. Other components, original v1 sources, tokens, API baselines and compatibility waivers remain untouched by this removal.

Fresh checks after removal: 201 root test files, 5,857 passed and five existing skips; 189 CLI tests; 35 preview tests; docs types/catalog; full CLI pipeline; MCP build/types; production docs build; Storybook build; API, CVA, component-test and Bootstrap checks pass. Full lint exits zero with five existing warnings. The aggregate TypeScript/format baseline limits reported above remain outside this scoped removal. All four v1 compatibility gates also pass: 45 components and 249 exports, 430 legacy stories, and 382 declared props, with existing waivers unchanged. This approved component and docs work is saved in a local commit; no publishing or push is requested.
