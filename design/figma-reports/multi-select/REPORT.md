# MultiSelect: UI change report for Figma

Figma source: [https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2118-22190](https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2118-22190)  
Storybook: `V2/Components/MultiSelect`  
Date: 2026-10-04

## Summary

The trigger keeps its focused look while the list is open, even when focus moves into the search field or a row. The panel now grows out of the side it actually opens from (above the field when it flips). Chip remove and Clear all got a neutral hover plate and a 24px hit area instead of a red hover. Rows show a teal ring for keyboard focus only, and checks and new chips animate in.

### Why (what the research found)

- Task brief research summary (HeroUI, Mantine, shadcn/ui, Untitled UI, React Aria, Fluent): 'modern' here comes from connectedness and polish, not flashy motion. (Not re-researched in this pass.)
- Connectedness: the trigger should read as part of its open panel. Measured before: while the list was open the Select trigger border was #E9EAEB with no glow, because Radix moves focus into the list and the focused look is keyed to `focus:`.
- Measured before: with the panel flipped above the field, its transform-origin was still 0 0 (top-left), so it grew away from the field instead of out of it.
- WCAG 2.2 SC 2.5.8 (Target Size, Minimum) asks for a 24 x 24 CSS px target; the chip x was 12 x 12 and Clear all 20 x 20. The glyph stays small, only the hit area grows.
- Measured before: the chip x hover turned the glyph red #F04438; the Clear all hover had no visible effect (its icon carried its own grey class).
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

### Tab to a row (keyboard ring)

| Before | After |
| --- | --- |
| ![before](04-keyboard-row.before.png) | ![after](04-keyboard-row.after.png) |

### Chips + open list with checks

| Before | After |
| --- | --- |
| ![before](05-chips-open-selected.before.png) | ![after](05-chips-open-selected.after.png) |

### Hover on a chip's remove x

| Before | After |
| --- | --- |
| ![before](06-chips-hover-remove.before.png) | ![after](06-chips-hover-remove.after.png) |

### Hover on Clear all

| Before | After |
| --- | --- |
| ![before](07-chips-hover-clear.before.png) | ![after](07-chips-hover-clear.after.png) |

### Six chips

| Before | After |
| --- | --- |
| ![before](08-many-chips.before.png) | ![after](08-many-chips.after.png) |

### Six chips, 280px field

| Before | After |
| --- | --- |
| ![before](09-many-chips-narrow.before.png) | ![after](09-many-chips-narrow.after.png) |

### Open, long labels

| Before | After |
| --- | --- |
| ![before](10-long-labels.before.png) | ![after](10-long-labels.after.png) |

### Error, closed

| Before | After |
| --- | --- |
| ![before](11-error.before.png) | ![after](11-error.after.png) |

### Error, open (stays red)

| Before | After |
| --- | --- |
| ![before](12-error-open.before.png) | ![after](12-error-open.after.png) |

### Disabled

| Before | After |
| --- | --- |
| ![before](13-disabled.before.png) | ![after](13-disabled.after.png) |

### Search, no results

| Before | After |
| --- | --- |
| ![before](14-search-empty-result.before.png) | ![after](14-search-empty-result.after.png) |

### Detailed (checkbox) rows

| Before | After |
| --- | --- |
| ![before](15-detailed-rows.before.png) | ![after](15-detailed-rows.after.png) |

### Open, 340px viewport

| Before | After |
| --- | --- |
| ![before](16-narrow.before.png) | ![after](16-narrow.after.png) |

### Opens above the field (flipped)

| Before | After |
| --- | --- |
| ![before](17-flipped-top.before.png) | ![after](17-flipped-top.after.png) |

## Measured changes (copy these into Figma)

_Source: computed styles of the rendered component; px, hex colours, ms. Only properties that changed are listed._

### Open

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Trigger | border-top-color | #C0C3CA | **#27ABB8** |

### Tab to a row (keyboard ring)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Trigger | border-top-color | #E9EAEB | **#27ABB8** |
| Trigger | box-shadow | none | **transparent 0, transparent 0, #27ABB8 @ 40% 0px 0px 4px 0px** |
| Row (first) | box-shadow | none | **#FFFFFF 0 inset, #27ABB8 0px 0px 0px 1px inset, transparent 0** |

### Chips + open list with checks

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Trigger | border-top-color | #C0C3CA | **#27ABB8** |
| Check icon (selected row) | animation-name | none | **enter** |
| Check icon (selected row) | animation-duration | 0s | **0.18s** |
| Check icon (selected row) | animation-timing-function | ease | **linear(0 0%, 0.06174 5%, 0.19179 10%, 0.33839 15%, 0.47651 20%, 0.59579 25%, 0.69365 30%, 0.77125 35%, 0.83131 40%, 0.87696 45%, 0.91117 50%, 0.93653 55%, 0.955** |
| Chip remove (first) | width | 12 | **16** |
| Chip remove (first) | height | 12 | **16** |
| Chip remove (first) | border-radius | 0px | **4px** |
| Clear all | width | 20 | **24** |
| Clear all | height | 20 | **24** |
| Clear all | color | #5E5E5E | **#707070** |
| Clear all | border-radius | 0px | **4px** |

### Hover on a chip's remove x

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Chip remove (first) | width | 12 | **16** |
| Chip remove (first) | height | 12 | **16** |
| Chip remove (first) | background-color | transparent | **#E9EAEB** |
| Chip remove (first) | color | #F04438 | **#484848** |
| Chip remove (first) | border-radius | 0px | **4px** |
| Chip remove icon | color | #F04438 | **#484848** |
| Clear all | width | 20 | **24** |
| Clear all | height | 20 | **24** |
| Clear all | color | #5E5E5E | **#707070** |
| Clear all | border-radius | 0px | **4px** |

### Hover on Clear all

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Chip remove (first) | width | 12 | **16** |
| Chip remove (first) | height | 12 | **16** |
| Chip remove (first) | border-radius | 0px | **4px** |
| Clear all | width | 20 | **24** |
| Clear all | height | 20 | **24** |
| Clear all | background-color | transparent | **#F5F5F5** |
| Clear all | color | #F04438 | **#484848** |
| Clear all | border-radius | 0px | **4px** |
| Clear all icon | color | #707070 | **#484848** |

### Six chips

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Chip remove (first) | width | 12 | **16** |
| Chip remove (first) | height | 12 | **16** |
| Chip remove (first) | border-radius | 0px | **4px** |
| Clear all | width | 20 | **24** |
| Clear all | height | 20 | **24** |
| Clear all | color | #5E5E5E | **#707070** |
| Clear all | border-radius | 0px | **4px** |

### Six chips, 280px field

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Chip remove (first) | width | 12 | **16** |
| Chip remove (first) | height | 12 | **16** |
| Chip remove (first) | border-radius | 0px | **4px** |
| Clear all | width | 20 | **24** |
| Clear all | height | 20 | **24** |
| Clear all | color | #5E5E5E | **#707070** |
| Clear all | border-radius | 0px | **4px** |

### Open, long labels

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Trigger | border-top-color | #C0C3CA | **#27ABB8** |

### Disabled

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Chip remove (first) | width | 12 | **16** |
| Chip remove (first) | height | 12 | **16** |
| Chip remove (first) | border-radius | 0px | **4px** |
| Clear all | width | 20 | **24** |
| Clear all | height | 20 | **24** |
| Clear all | color | #5E5E5E | **#707070** |
| Clear all | border-radius | 0px | **4px** |

### Search, no results

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Trigger | border-top-color | #E9EAEB | **#27ABB8** |
| Trigger | box-shadow | none | **transparent 0, transparent 0, #27ABB8 @ 40% 0px 0px 4px 0px** |

### Detailed (checkbox) rows

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Trigger | border-top-color | #C0C3CA | **#27ABB8** |
| Chip remove (first) | width | 12 | **16** |
| Chip remove (first) | height | 12 | **16** |
| Chip remove (first) | border-radius | 0px | **4px** |

### Open, 340px viewport

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Trigger | border-top-color | #C0C3CA | **#27ABB8** |

### Opens above the field (flipped)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Trigger | border-top-color | #C0C3CA | **#27ABB8** |
| Panel | transform-origin | 0px 0px | **0px 279px** |

## Motion

| What | Before | After |
| --- | --- | --- |
| Panel enter (below the field) | no visible motion (fade/zoom cancelled by a utility-order bug) | **200ms: opacity 0 to 100%, scale 98% to 100%, 4px slide down, origin top left, spring ease (--v2-ease-spring; sampled critically damped curve, fallback cubic-bezier(0.22, 1, 0.36, 1))** |
| Panel enter (flipped above) | same, origin top left | **origin bottom left, slides up 4px (data-side=top); end-aligned placements use the right corner** |
| Selected check | appears instantly | **180ms opacity 0 to 100% + scale 85% to 100%, spring ease (--v2-ease-spring; sampled critically damped curve, fallback cubic-bezier(0.22, 1, 0.36, 1))** |
| New chip | appears instantly | **150ms opacity 0 to 100% + scale 90% to 100%, spring ease (--v2-ease-spring; sampled critically damped curve, fallback cubic-bezier(0.22, 1, 0.36, 1)); only the newly added chip, existing chips keep their DOM node and do not replay** |
| Chip remove / Clear all hover | red text (chip x) / no visible change (Clear all icon kept its own grey) | **150ms colour fade to #484848 + neutral plate** |
| Validation message | appeared instantly | **150ms fade + 2px slide, ease-out** |
| Reduced motion | opacity fade 120ms on the panel | **unchanged: panel 120ms opacity fade; check, chip and slide are off** |

## States to update in Figma

- Trigger / default / open: focused look held while open (also under hover)
- Trigger / error / open: unchanged, stays red
- Option row / keyboard-focused: NEW 1px inset ring #27ABB8; mouse hover stays fill-only #F5F5F5
- Select-all row / keyboard-focused: fill #F5F5F5 + the same ring
- Chip / remove x / hover: NEW plate, icon #484848
- Clear all / hover: NEW plate
- Chip / remove x and Clear all / keyboard focus: NEW ring (they had no visible focus)
- Chip / remove x / disabled: no hover plate
- Panel / flipped above: origin bottom

## How to apply in Figma

1. Trigger State=Open: fill #FFFFFF, border 1px #27ABB8 (--color-secondary-600) + drop shadow x0 y0 blur 4 spread 0 #27ABB8 @ 40%, radius 8, min-height 40, padding 6 / 16, gap 8. Same as Focus; Open + hover stays #27ABB8 (not #C0C3CA). Error + Open stays #F04438 + 0 0 4 0 #F04438 @ 40%.
2. Chevron in State=Open: rotate 180 degrees, 16px, #707070; prototype Smart animate 200ms, ease cubic-bezier(0.22, 1, 0.36, 1) (unchanged).
3. Panel: unchanged geometry (fill #FFFFFF, border 1px #E9EAEB, radius 8, shadow 0 4 8 -2 rgba(16,24,40,0.10) + 0 2 4 -2 rgba(16,24,40,0.06), list padding 4, max 240px). Add a Position=Above variant: same panel, 4px above the trigger, transform origin bottom-left.
4. Option row: corner radius 4 (already 4), padding 8 top/bottom, 16 left, 32 right, 16/400 #5E5E5E; selected 16/500 #484848 with a 16px #343E55 check 8px from the right. Hover fill #F5F5F5. Add variant Keyboard focus: same fill #F5F5F5 plus an INSIDE stroke 1px #27ABB8 (corner radius 4).
5. Detailed rows (checkbox variant): same ring on keyboard focus: inside stroke 1px #27ABB8, radius 4.
6. Chip (unchanged): fill #F5F5F5, border 0.4px #E9EAEB, radius 8, padding 2 / 8, gap 4, label 14/500 #484848, height 26. Remove button: icon 12px #484848. Default: no plate. Hover: 16 x 16 rounded rectangle, radius 4, fill #E9EAEB (semantic-bg-grey), icon #484848 (was red #F04438). Hit area is 24 x 24, invisible: 4px outside the plate on every side (no layout change: the plate overlaps the chip padding). Keyboard focus: inside stroke 1px #27ABB8 on the plate.
7. Clear all: icon 16px #707070. Hover: 24 x 24 plate, radius 4, fill #F5F5F5, icon #484848. The 24 x 24 plate is also the hit area. Keyboard focus: inside stroke 1px #27ABB8.
8. Disabled trigger: unchanged (fill #F5F5F5, border #E9EAEB); chips and Clear all inert, no hover plate.
9. Prototype: new chip enters with opacity 0 to 100% and scale 90% to 100%, 150ms, ease cubic-bezier(0.22, 1, 0.36, 1). Check enters with opacity 0 to 100% and scale 85% to 100%, 180ms. Panel: 200ms, opacity 0 to 100%, scale 98% to 100%, 4px move away from the trigger, transform origin at the corner touching the trigger.

## Notes

- The chip hover plate uses #E9EAEB (semantic-bg-grey), NOT the #F5F5F5 (semantic-bg-ui) named in the brief: the chip itself is filled #F5F5F5, so a #F5F5F5 plate is invisible (the same mistake already existed in CreatableMultiSelect, whose plate measured #F5F5F5 on #F5F5F5). Clear all sits on white, so it uses #F5F5F5 as briefed.
- 'Keep the 120ms exit': MultiSelect has no exit animation. Its custom panel unmounts immediately (V2-MOTION.md: 'custom panels still close immediately'), so there was nothing to keep, and none was added (a delayed unmount risks tests and focus handling).
- The brief assumed rows were 6px; MultiSelect rows were already 4px (rounded-sm), so only the ring and check changed.
- Origin follows floating-ui's reported placement. In jsdom nothing can flip, so the unit tests force the placement through a mock; the real browser flip is covered by scenario 17 (data-side=top, origin 'left bottom').
- Proposed follow-up, NOT implemented in this pass: a real keyboard model for MultiSelect and SearchFilter (ArrowUp/ArrowDown, Home/End, typeahead, aria-activedescendant). Today both are Tab-only, which is why the keyboard ring below uses a plain focus-visible rule.
- Observation, not changed: the selected check uses four different colours today: Select/CreatableSelect #2BBCCA (semantic-brand), Dropdown/SearchFilter #27ABB8 (semantic-border-accent), MultiSelect #343E55 (semantic-primary). Worth unifying in Figma.
- Found while verifying motion: `motion-safe:animate-in` is emitted after bare `fade-in-0`/`zoom-in-*` classes and resets --tw-enter-opacity/--tw-enter-scale to initial, so the panel fade and 98% zoom documented in V2-MOTION.md never ran in normal-motion mode (measured at t=0: opacity 1, no scale). Fixed here by prefixing those classes with `motion-safe:` (as Checkbox/TextField already do). The same bare pattern remains in dialog.tsx, toast.tsx, tabs.tsx, date-range-picker.tsx and date-time-picker.tsx (not in this task's files, not individually verified).
