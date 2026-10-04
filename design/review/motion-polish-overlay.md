# V2 motion polish: overlay review

Reviewed in the actual Storybook development server at `http://localhost:6008` using isolated in-app browser tabs. Sources: `codex/v2-motion-polish`; changes remain local.

## Coverage

All 14 assigned components received a manual Docs, variants (or sizes), States and Usage review, plus a real Overview interaction in normal and reduced-motion modes. The 56 presentation pages and 14 interaction summaries are in [review.json](motion-polish-overlay/review.json). Screenshots were captured after the actual component rendered, not during the Storybook spinner.

Text hierarchy remains the reviewed neutral charcoal/gray treatment. Comparison grids retain contained horizontal scrolling. No document-level overflow was found in these pages. Header, supporting copy, labels, fields and actions were visually inspected; DOM render success alone was not the acceptance check.

## Live interaction results

| Component | Normal entrance | Reduced motion | Dismissal / reopening | Other exercised behavior |
| --- | --- | --- | --- | --- |
| Dialog | 220ms | opacity-only 120ms | pass; reopen pass | — |
| DropdownMenu | 200ms | opacity-only 120ms | pass; reopen pass | — |
| Tooltip | 160ms | opacity-only 120ms | pass; reopen via reload and keyboard focus | — |
| MultiSelect | 200ms | opacity-only 120ms | Default closeOnEscape=false intentionally does not dismiss; reopen pass | React chip synchronized |
| CreatableMultiSelect | 200ms | opacity-only 120ms; static chevron | pass; reopen pass | Calm creation synchronized without navigation |
| CreatableSelect | 200ms | opacity-only 120ms; static chevron | pass; reopen pass | Account manager creation synchronized |
| SelectField | 200ms | opacity-only 120ms | pass; reopen pass | Bearer Token synchronized |
| DateRangePicker | 200ms | opacity-only 120ms | pass; nested menu then calendar; reopen pass | Today preset synchronized; panel remains open by existing behavior |
| DateTimePicker | 200ms | opacity-only 120ms calendar and nested time | pass; first closes nested time, second calendar; reopen pass | 200ms spring |
| SearchFilter | 200ms | opacity-only 120ms | pass; reopen pass | numeric search and exact option synchronized |
| Toast | 200ms | opacity-only 120ms | pass from toast focus; reopen pass | — |
| ConfirmationModal | 220ms | opacity-only 120ms | pass; reopen pass | — |
| DeleteConfirmationModal | 220ms | opacity-only 120ms | pass; reopen pass; typed verification resets | exact DELETE enables action |
| FormModal | 220ms | opacity-only 120ms | pass; reopen pass | Name typing and notifications toggling synchronized |

## Motion checks and fixes

- Actual computed CSS showed the sampled spring `linear()` easing and the intended 200ms entrances (220ms for Dialog and its derived modals; 160ms for Tooltip). Tooltip's closed state was measured at 100ms.
- Browser review caught a real specificity bug: the generic duration property lost to state-qualified `animate-in`, leaving Radix overlays at 150ms. Duration overrides now use matching state and `motion-safe` qualifiers. Dialog's measured normal exit is 160ms, with its backdrop at 120ms.
- Reduced motion uses the shared opacity-only `v2-fade-in` keyframe at 120ms. Static placement transforms (Dialog centering and Select's existing 4px control gap) remain; they are not movement keyframes. Reduced Dialog dismissal completed before the immediate exit sample, so that sample is not a measured exit duration.
- The visible tooltip surface was inspected directly; Radix also renders an offscreen 1px accessible tooltip node whose computed animation is `none`.
- DateRangePicker year menu and DateTimePicker month/time panels also receive 200ms spring entrances. Escape dismisses an inner menu first, then the outer calendar.
- The creatable components preserve their current markup. The opening chevrons animate into their rotated state; with reduced motion their rotation is immediate.
- Menu and option highlights remain immediate for keyboard navigation. Spinners inside composed components use the same slower reduced-motion rotation as the foundation spinner.

## Evidence boundaries

The browser review exercised actual opening, closing, reopening, Escape where supported, selection, typed creation, field typing and toggles. MultiSelect's default `closeOnEscape=false` intentionally keeps its menu open on Escape; trigger dismissal worked. Date-range presets intentionally keep the panel open. The first SelectField opening was interrupted by a live style HMR reload; a stable retry and its selection/Escape/reduced-motion cycles passed.

Toast swipe was not manually exercised. This review checks rendered hierarchy and computed motion, not a frame-by-frame video judgment. The root agent's motion probe and full build/tests cover the broader regression gates. The earlier reported accessibility findings and interaction-story failures were not silently described as fixed by these class changes.

## Scoped gates

- 12 overlay test files: **410 tests passed** after the main source polish.
- Scoped ESLint passed after the final duration specificity correction.
- Formatting applied to all 12 owned source files.
- `git diff --check` passed.
- No v1 files, stories, API signatures or markup structure were changed by this agent.

## Research used

Apple describes springs as preserving velocity when interrupted, with non-bouncing motion common in iOS; its guidance asks for brief, purposeful and cancelable motion. These web timings and displacement values are our translation, not Apple constants. See [WWDC23 Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/) and [Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion).

Radix supports exit keyframes by holding unmount while an animation runs: [Animation guide](https://www.radix-ui.com/primitives/docs/guides/animation). A CSS `linear()` sampled spring suits fixed small transitions; true physics springs are useful for a repeatedly retargeted selection indicator: [Motion CSS](https://motion.dev/docs/css), [Motion spring values](https://motion.dev/docs/spring-value).

Official tab references do move their indicators: [Mantine FloatingIndicator](https://mantine.dev/core/floating-indicator/), [Adobe Spectrum Tabs](https://spectrum.adobe.com/web/swc/components/tabs), [HeroUI v3 tab styles](https://raw.githubusercontent.com/heroui-inc/heroui/v3/packages/styles/components/tabs.css). The prior motion brief's blanket claim about instant benchmark indicators was inaccurate.
