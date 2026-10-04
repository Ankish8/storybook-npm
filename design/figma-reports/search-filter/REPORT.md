# SearchFilter: UI change report for Figma

Figma source: n/a  
Storybook: `V2/Components/SearchFilter`  
Date: 2026-10-04

## Summary

The search field keeps its teal focused look while the list is open, even when you Tab into a row. Rows are 4px-radius instead of square, show a teal ring for keyboard focus, and the selected check pops in. The panel grows from the corner that touches the field (bottom corner when it flips above).

### Why (what the research found)

- Task brief research summary (HeroUI, Mantine, shadcn/ui, Untitled UI, React Aria, Fluent): 'modern' here comes from connectedness and polish, not flashy motion. (Not re-researched in this pass.)
- Connectedness: measured before, Tab-ing from the field into a row removed the teal border and glow from the field while the list was still open.
- Concentric radii (inner radius = outer radius - padding): the panel is 8px with 4px padding, so rows should be 4px. Measured before: Select and Creatable rows 6px, Dropdown and SearchFilter rows 0px.
- Measured before: with the panel flipped above the field, its transform-origin was still 0 0 (top-left), so it grew away from the field instead of out of it.
- Selection feedback should be acknowledged briefly: the same fade + 85% to 100% scale as the v2 Checkbox tick, 180ms.

### API / compatibility

No prop, callback, aria-label or DOM-contract changes. v2 remains a drop-in for v1 (`npm run verify:v1-v2-compat` passes).

## Before and after

### Closed

| Before | After |
| --- | --- |
| ![before](01-closed.before.png) | ![after](01-closed.after.png) |

### Open

| Before | After |
| --- | --- |
| ![before](02-open.before.png) | ![after](02-open.after.png) |

### Open, mouse hover on a row

| Before | After |
| --- | --- |
| ![before](03-hover-row.before.png) | ![after](03-hover-row.after.png) |

### Tab from the field to the first row

| Before | After |
| --- | --- |
| ![before](04-keyboard-row.before.png) | ![after](04-keyboard-row.after.png) |

### Open with a selected value

| Before | After |
| --- | --- |
| ![before](05-selected-row.before.png) | ![after](05-selected-row.after.png) |

### No results

| Before | After |
| --- | --- |
| ![before](06-empty-results.before.png) | ![after](06-empty-results.after.png) |

### Open, long labels

| Before | After |
| --- | --- |
| ![before](07-long-labels.before.png) | ![after](07-long-labels.after.png) |

### Disabled

| Before | After |
| --- | --- |
| ![before](08-disabled.before.png) | ![after](08-disabled.after.png) |

### Hover on a disabled row

| Before | After |
| --- | --- |
| ![before](09-disabled-row.before.png) | ![after](09-disabled-row.after.png) |

### Small size

| Before | After |
| --- | --- |
| ![before](10-small.before.png) | ![after](10-small.after.png) |

### Open, 340px viewport

| Before | After |
| --- | --- |
| ![before](11-narrow.before.png) | ![after](11-narrow.after.png) |

### Opens above the field (flipped)

| Before | After |
| --- | --- |
| ![before](12-flipped-top.before.png) | ![after](12-flipped-top.after.png) |

### Typed a query

| Before | After |
| --- | --- |
| ![before](13-typed-query.before.png) | ![after](13-typed-query.after.png) |

## Measured changes (copy these into Figma)

_Source: computed styles of the rendered component; px, hex colours, ms. Only properties that changed are listed._

### Open

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Search input | border-top-color | #C0C3CA | **#27ABB8** |
| Row (first) | border-radius | 0px | **4px** |

### Open, mouse hover on a row

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Row (first) | border-radius | 0px | **4px** |

### Tab from the field to the first row

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Search input | border-top-color | #C0C3CA | **#27ABB8** |
| Search input | box-shadow | none | **transparent 0, transparent 0, #27ABB8 @ 40% 0px 0px 4px 0px** |
| Row (first) | border-radius | 0px | **4px** |
| Row (first) | box-shadow | none | **#FFFFFF 0 inset, #27ABB8 0px 0px 0px 1px inset, transparent 0** |
| Row (focused) | border-radius | 0px | **4px** |
| Row (focused) | box-shadow | none | **#FFFFFF 0 inset, #27ABB8 0px 0px 0px 1px inset, transparent 0** |

### Open with a selected value

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Search input | border-top-color | #C0C3CA | **#27ABB8** |
| Row (first) | border-radius | 0px | **4px** |
| Row (selected) | border-radius | 0px | **4px** |
| Check icon (selected row) | animation-name | none | **enter** |
| Check icon (selected row) | animation-duration | 0s | **0.18s** |
| Check icon (selected row) | animation-timing-function | ease | **linear(0 0%, 0.06174 5%, 0.19179 10%, 0.33839 15%, 0.47651 20%, 0.59579 25%, 0.69365 30%, 0.77125 35%, 0.83131 40%, 0.87696 45%, 0.91117 50%, 0.93653 55%, 0.955** |

### No results

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Search input | border-top-color | #C0C3CA | **#27ABB8** |

### Open, long labels

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Search input | border-top-color | #C0C3CA | **#27ABB8** |
| Row (first) | border-radius | 0px | **4px** |

### Hover on a disabled row

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Row (first) | border-radius | 0px | **4px** |

### Small size

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Search input | border-top-color | #C0C3CA | **#27ABB8** |
| Row (first) | border-radius | 0px | **4px** |

### Open, 340px viewport

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Search input | border-top-color | #C0C3CA | **#27ABB8** |
| Panel | transform-origin | 0px 0px | **360px 0px** |
| Row (first) | border-radius | 0px | **4px** |

### Opens above the field (flipped)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Search input | border-top-color | #C0C3CA | **#27ABB8** |
| Panel | transform-origin | 0px 0px | **0px 242px** |
| Row (first) | border-radius | 0px | **4px** |

### Typed a query

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Search input | border-top-color | #C0C3CA | **#27ABB8** |
| Row (first) | border-radius | 0px | **4px** |

## Motion

| What | Before | After |
| --- | --- | --- |
| Panel enter (below) | no visible motion (fade/zoom cancelled by a utility-order bug) | **200ms: opacity 0 to 100%, scale 98% to 100%, 4px slide down, origin top left, spring ease (--v2-ease-spring; sampled critically damped curve, fallback cubic-bezier(0.22, 1, 0.36, 1))** |
| Panel enter (flipped above) | same, origin top left | **origin bottom left, 4px slide up** |
| Selected check | appears instantly | **180ms opacity 0 to 100% + scale 85% to 100%, spring ease (--v2-ease-spring; sampled critically damped curve, fallback cubic-bezier(0.22, 1, 0.36, 1))** |
| Reduced motion | 120ms opacity fade | **unchanged** |

## States to update in Figma

- Field / default / open: focused look held (also under hover and while a row has focus)
- Option row / default: radius 0 -> 4
- Option row / keyboard-focused: NEW fill #F5F5F5 + inside stroke 1px #27ABB8
- Option row / mouse hover: fill #F5F5F5 only
- Option row / selected: radius 4 + check enters with scale/fade; fill #F5F5F5
- Option row / disabled: unchanged text #A2A6B1
- Panel / flipped above

## How to apply in Figma

1. Field (Input) State=Open: fill #FFFFFF, border 1px #27ABB8 (--color-secondary-600) + drop shadow x0 y0 blur 4 spread 0 #27ABB8 @ 40%, radius 8, height 40. Same as Focus; stays teal under hover. Disabled unchanged.
2. Panel: unchanged (radius 8, border 1px #E9EAEB, shadow 0 4 8 -2 rgba(16,24,40,0.10) + 0 2 4 -2 rgba(16,24,40,0.06), 8px below the field, list padding 4, max-height 240px). Add a Position=Above variant: 8px above the field.
3. Option row: corner radius 4 (was 0). Geometry unchanged: min-height 48, padding 10 top/bottom, 6 left, 36 right, 16/400 #5E5E5E. Hover fill #F5F5F5. Selected: fill #F5F5F5, label #484848, check icon 16px #27ABB8, 12px from the right, vertically centred.
4. Add variant Keyboard focus: fill #F5F5F5 + inside stroke 1px #27ABB8 (radius 4). Mouse hover does not get the stroke.
5. Prototype: check enters with opacity 0 to 100% + scale 85% to 100%, 180ms, ease cubic-bezier(0.22, 1, 0.36, 1). Panel enters 200ms from opacity 0%, scale 98%, 4px offset toward the field, origin at the corner touching the field.

## Notes

- Check position fix: the old centring used a translate, which the pop keyframe would overwrite and shove the icon 8px down while it plays. It is now centred with auto margins; the resting position is identical.
- Origin follows floating-ui's reported placement; the unit tests force placement through a mock (jsdom cannot flip). The real flip is covered by scenario 12 (data-side=top, origin 'left bottom').
- 'Keep the 120ms exit': there is none. The panel unmounts immediately when closed (V2-MOTION.md); none was added.
- No figmaNode: the SearchFilter story has no design.url.
- Proposed follow-up, NOT implemented in this pass: a real keyboard model for MultiSelect and SearchFilter (ArrowUp/ArrowDown, Home/End, typeahead, aria-activedescendant). Today both are Tab-only, which is why the keyboard ring below uses a plain focus-visible rule.
- Observation, not changed: the selected check uses four different colours today: Select/CreatableSelect #2BBCCA (semantic-brand), Dropdown/SearchFilter #27ABB8 (semantic-border-accent), MultiSelect #343E55 (semantic-primary). Worth unifying in Figma.
- Found while verifying motion: `motion-safe:animate-in` is emitted after bare `fade-in-0`/`zoom-in-*` classes and resets --tw-enter-opacity/--tw-enter-scale to initial, so the panel fade and 98% zoom documented in V2-MOTION.md never ran in normal-motion mode (measured at t=0: opacity 1, no scale). Fixed here by prefixing those classes with `motion-safe:` (as Checkbox/TextField already do). The same bare pattern remains in dialog.tsx, toast.tsx, tabs.tsx, date-range-picker.tsx and date-time-picker.tsx (not in this task's files, not individually verified).
