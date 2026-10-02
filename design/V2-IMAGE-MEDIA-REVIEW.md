# ImageMedia v2 review

Reviewed on `feat/v2` at http://localhost:6008 on 2026-10-01. The existing current-v1 source API and image geometry are preserved; no new Figma dimensions are claimed for this primitive.

## Browser checks

- Overview height Control changed to 160px, measured 160px; alt changed to Receipt preview, reflected on the loaded image. A text Control originally hid numeric height defaults: individual/default args now use CSS-length strings, while numeric API support remains in tests and the fixed gallery.
- Compact height Control changed 140px to 220px and rendered 220px. Tall/CSS-height examples reviewed through Docs and the height gallery.
- All height caps measured 140px, 280px and 35vh. Alt Control updated all three images. Source Control changed every image to the warm receipt illustration. The enormous encoded-URL textarea was replaced with labelled source options; normal component src still accepts any URL.
- Content states verified meaningful native alt versus decorative empty alt. No simulated loading/error behavior was invented.
- Contained v1/v2 comparison measured the same 280px cap and 4px top radius in both current components.
- Usage Enter on the native preview button opened the local enlarged view and set expanded Controls true. Source changes applied to both images. Close preview restored false.
- Docs install/import, migration/token tables, examples and guidance visually inspected; no headings inside table cells.

9 focused tests passed; focused lint, repository formatting and story-inclusive typecheck passed. Root props/ref, alt default and numeric/string maxHeight are preserved.

Visually inspected screenshots: `/Users/ankish/.codex/visualizations/2026/10/01/v2-image-media/overview.png`, `compact.png`, `heights.png`, `states.png`, `comparison.png`, `usage.png`, `docs-top.png`, `docs-tables.png`. Earlier Overview/Compact captures retain the old source textarea; final gallery/states/Usage show the polished selector.

## Final action-log repair (2026-10-01)

Rechecked at http://localhost:6008 after a story-only repair. Overview: clicking the loaded illustration logs onClick: [] through the root callback adapter. Image dimensions and preview composition are unchanged. The adapter is shared by individual examples, galleries and comparison.

Component callback APIs and v1 source were not changed. Focused story ESLint, formatting and story-inclusive TypeScript checks pass. No Maximum call stack error occurred in the rechecks. Manually inspected screenshot: `/Users/ankish/.codex/visualizations/2026/10/01/v2-image-media/action-log-fixed.png`.
