# DateTimePicker: UI change report for Figma

Figma source: [https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2185-14049](https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=2185-14049)  
Storybook: `V2/Components/DateTimePicker`  
Date: 2026-10-04

## Summary

The time dropdown no longer clips its first row: each Hours / Minutes / AM-PM list opens with the selected row centred (so the three selected rows line up across the panel), fades 12px at both edges, and lets the first and last row reach the centre. Arrow keys, Home and End now move the selection inside a focused time column. The calendar is brought in line with the date range picker: a 4px dot marks today (the ring is gone), 32px arrows and pills with a turning chevron, a visible keyboard focus ring, hover that no longer sticks on touch, 36px days on small screens, and a short slide when the month changes. Props, aria-labels, value formats and callbacks are unchanged.

### Why (what the research found)

- Verified in the BEFORE screenshots: the first visible row of the Hours list was cut half-way ('08' in 07-time-open-start) and, when the selected value sat at either end of a list, it could not reach the middle (12 sat at the bottom edge, 00 at the top in 08-time-open-empty-top-row). The old centring code also measured offsetTop against the popover instead of the list, so the selected row was never truly centred.
- Verified in the BEFORE screenshots: today was a ring while the date range picker used a dot; weekday labels were 'Su Mo' here and 'SU MO' there; the month and year pills had right-pointing chevrons and different heights and radii than the range picker's pills; arrows were 24px.
- Verified in the BEFORE screenshots and measurements: days showed only the browser's default blue auto outline on keyboard focus (04-focus-day) and every hover fill was ungated, so a tap on touch leaves the fill stuck.
- Design direction named in the brief's research set (HeroUI, Mantine, shadcn/ui, React Aria, Untitled UI): a centred selected row with edge fades in scrolling time columns, arrow-key stepping inside a listbox, a dot for today, hover gated on (hover: hover), a 2px offset focus outline and a short directional slide on month change. These library behaviours were NOT re-checked in this run; treat them as the brief's inspiration, not as verified citations.
- Motion follows design/V2-MOTION.md: 200ms spring for panels, reduced motion removes movement and keeps a 120ms fade.

### API / compatibility

No prop, callback, aria-label or DOM-contract changes. v2 remains a drop-in for v1 (`npm run verify:v1-v2-compat` passes).

## Before and after

### Closed field (unchanged; icon buttons gate hover)

| Before | After |
| --- | --- |
| ![before](01-closed.before.png) | ![after](01-closed.after.png) |

### Calendar open (header, weekday row, today dot, selected day)

| Before | After |
| --- | --- |
| ![before](02-calendar-open.before.png) | ![after](02-calendar-open.after.png) |

### Day cell hover

| Before | After |
| --- | --- |
| ![before](03-day-hover.before.png) | ![after](03-day-hover.after.png) |

### Keyboard focus on a day

| Before | After |
| --- | --- |
| ![before](04-focus-day.before.png) | ![after](04-focus-day.after.png) |

### Keyboard focus on the Next month arrow

| Before | After |
| --- | --- |
| ![before](05-focus-next.before.png) | ![after](05-focus-next.after.png) |

### Month list open (chevron turned)

| Before | After |
| --- | --- |
| ![before](06-month-menu-open.before.png) | ![after](06-month-menu-open.after.png) |

### Time dropdown open, 10:30 AM (selected rows centred in all three columns)

| Before | After |
| --- | --- |
| ![before](07-time-open-start.before.png) | ![after](07-time-open-start.after.png) |

### Time dropdown open, 12:00 AM (first and last rows reach the centre)

| Before | After |
| --- | --- |
| ![before](08-time-open-empty-top-row.before.png) | ![after](08-time-open-empty-top-row.after.png) |

### Time dropdown with seconds (four columns)

| Before | After |
| --- | --- |
| ![before](09-time-open-seconds.before.png) | ![after](09-time-open-seconds.after.png) |

### Time-only range, End Time list open

| Before | After |
| --- | --- |
| ![before](10-time-only-range-end-open.before.png) | ![after](10-time-only-range-end-open.after.png) |

### Time row hover

| Before | After |
| --- | --- |
| ![before](11-time-row-hover.before.png) | ![after](11-time-row-hover.after.png) |

### Keyboard focus on a time row

| Before | After |
| --- | --- |
| ![before](12-time-row-focus.before.png) | ![after](12-time-row-focus.after.png) |

### Narrow 360px viewport (36px days and arrows)

| Before | After |
| --- | --- |
| ![before](13-narrow-360.before.png) | ![after](13-narrow-360.after.png) |

### Narrow 360px viewport with the time list open

| Before | After |
| --- | --- |
| ![before](14-narrow-360-time-open.before.png) | ![after](14-narrow-360-time-open.after.png) |

### Error field (unchanged)

| Before | After |
| --- | --- |
| ![before](15-error-closed.before.png) | ![after](15-error-closed.after.png) |

### Disabled field (unchanged)

| Before | After |
| --- | --- |
| ![before](16-disabled-closed.before.png) | ![after](16-disabled-closed.after.png) |

### Empty value, calendar open (today dot, nothing selected)

| Before | After |
| --- | --- |
| ![before](17-empty-open.before.png) | ![after](17-empty-open.after.png) |

### Date-only variant, open

| Before | After |
| --- | --- |
| ![before](18-date-only-open.before.png) | ![after](18-date-only-open.after.png) |

### Time-only variant, Start Time list open

| Before | After |
| --- | --- |
| ![before](19-time-only-open.before.png) | ![after](19-time-only-open.after.png) |

### Date bounds (disabled days)

| Before | After |
| --- | --- |
| ![before](20-date-bounds-open.before.png) | ![after](20-date-bounds-open.after.png) |

## Measured changes (copy these into Figma)

_Source: computed styles of the rendered component; px, hex colours, ms. Only properties that changed are listed._

### Calendar open (header, weekday row, today dot, selected day)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Popover | height | 391 | **387** |
| Prev month button | width | 24 | **32** |
| Prev month button | height | 24 | **32** |
| Prev month button | border-radius | 4px | **8px** |
| Prev month button | padding | 4px | **0px** |
| Next month button | width | 24 | **32** |
| Next month button | height | 24 | **32** |
| Next month button | border-radius | 4px | **8px** |
| Next month button | padding | 4px | **0px** |
| Month pill | height | 36px | **32px** |
| Month pill | border-radius | 6px | **8px** |
| Month pill chevron | width | 12px | **14px** |
| Month pill chevron | height | 12px | **14px** |
| Year pill | height | 36px | **32px** |
| Year pill | border-radius | 6px | **8px** |
| Year pill chevron | width | 12px | **14px** |
| Year pill chevron | height | 12px | **14px** |
| Weekday label (first) | width | 32px | **44.28px** |
| Weekday label (first) | text-transform | none | **uppercase** |
| Day grid | height | 224px | **192px** |
| Day Oct 4 (today) | box-shadow | #FFFFFF 0 inset, #777E8D 0px 0px 0px 1px inset, transparent 0 | **none** |
| Day Oct 4 (today) | --tw-ring-shadow | inset 0 0 0 calc(1px + 0px) #777E8D | **0 0 #0000** |
| Day Oct 4 today dot | _(new element)_ | — | present |

### Keyboard focus on a day

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Day Oct 14 (keyboard focus) | outline-style | auto | **solid** |
| Day Oct 14 (keyboard focus) | outline-width | 1px | **2px** |
| Day Oct 14 (keyboard focus) | outline-offset | 0px | **1px** |
| Day Oct 14 (keyboard focus) | outline-color | #005FCC | **#343E55** |
| Day Oct 14 (keyboard focus) | z-index | auto | **10** |

### Keyboard focus on the Next month arrow

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Next month button (keyboard focus) | width | 24 | **32** |
| Next month button (keyboard focus) | height | 24 | **32** |
| Next month button (keyboard focus) | border-radius | 4px | **8px** |
| Next month button (keyboard focus) | padding | 4px | **0px** |
| Next month button (keyboard focus) | outline-style | auto | **solid** |
| Next month button (keyboard focus) | outline-width | 1px | **2px** |
| Next month button (keyboard focus) | outline-offset | 0px | **1px** |
| Next month button (keyboard focus) | outline-color | #005FCC | **#343E55** |

### Month list open (chevron turned)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Month pill (menu open) | height | 36px | **32px** |
| Month pill (menu open) | border-radius | 6px | **8px** |
| Month pill (menu open) | background-color | #FFFFFF | **#F5F5F5** |
| Month pill (menu open) | border-top-color | #27ABB8 | **#E9EAEB** |
| Month pill (menu open) | box-shadow | transparent 0, transparent 0, #2BBCCA @ 15% 0px 0px 0px 1px | **none** |
| Month pill chevron (menu open) | width | 12px | **14px** |
| Month pill chevron (menu open) | height | 12 | **14** |
| Month pill chevron (menu open) | transform | matrix(0, -1, 1, 0, 0, 0) | **matrix(-1, 0, 0, -1, 0, 0)** |
| Year pill chevron | width | 12 | **14** |
| Year pill chevron | height | 12 | **14** |

### Time dropdown open, 10:30 AM (selected rows centred in all three columns)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Hours column list | padding-top | 4px | **68px** |
| Hours column list | padding-bottom | 4px | **68px** |
| Hours column list | -webkit-mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Hours column list | mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Hours column list | scroll-snap-type | none | **y** |
| Hours selected row | height | 34px | **32px** |
| Hours selected row | scroll-snap-align | none | **center** |
| Hours unselected row | height | 34px | **32px** |
| Hours unselected row | scroll-snap-align | none | **center** |
| Minutes column list | padding-top | 4px | **68px** |
| Minutes column list | padding-bottom | 4px | **68px** |
| Minutes column list | -webkit-mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Minutes column list | mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Minutes column list | scroll-snap-type | none | **y** |
| Minutes selected row | height | 34px | **32px** |
| Minutes selected row | scroll-snap-align | none | **center** |
| AM/PM column list | height | 78px | **168px** |
| AM/PM column list | padding-top | 4px | **68px** |
| AM/PM column list | padding-bottom | 4px | **68px** |
| AM/PM column list | -webkit-mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| AM/PM column list | mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| AM/PM column list | scroll-snap-type | none | **y** |
| AM/PM selected row | height | 34px | **32px** |
| AM/PM selected row | scroll-snap-align | none | **center** |

### Time dropdown open, 12:00 AM (first and last rows reach the centre)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Minutes column list | padding-top | 4px | **68px** |
| Minutes column list | padding-bottom | 4px | **68px** |
| Minutes column list | -webkit-mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Minutes column list | mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Minutes column list | scroll-snap-type | none | **y** |
| Minutes selected row (00) | height | 34px | **32px** |

### Time dropdown with seconds (four columns)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Seconds column list | padding-top | 4px | **68px** |
| Seconds column list | padding-bottom | 4px | **68px** |
| Seconds column list | -webkit-mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Seconds column list | mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Seconds column list | scroll-snap-type | none | **y** |

### Time-only range, End Time list open

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Hours column list | padding-top | 4px | **68px** |
| Hours column list | padding-bottom | 4px | **68px** |
| Hours column list | -webkit-mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Hours column list | mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Hours column list | scroll-snap-type | none | **y** |
| Hours selected row | height | 34px | **32px** |
| Hours selected row | scroll-snap-align | none | **center** |
| Hours unselected row | height | 34px | **32px** |
| Hours unselected row | scroll-snap-align | none | **center** |
| Minutes column list | padding-top | 4px | **68px** |
| Minutes column list | padding-bottom | 4px | **68px** |
| Minutes column list | -webkit-mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Minutes column list | mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Minutes column list | scroll-snap-type | none | **y** |
| Minutes selected row | height | 34px | **32px** |
| Minutes selected row | scroll-snap-align | none | **center** |
| AM/PM column list | height | 78px | **168px** |
| AM/PM column list | padding-top | 4px | **68px** |
| AM/PM column list | padding-bottom | 4px | **68px** |
| AM/PM column list | -webkit-mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| AM/PM column list | mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| AM/PM column list | scroll-snap-type | none | **y** |
| AM/PM selected row | height | 34px | **32px** |
| AM/PM selected row | scroll-snap-align | none | **center** |

### Time row hover

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Hours row (hovered) | height | 34px | **32px** |
| Hours row (hovered) | scroll-snap-align | none | **center** |

### Keyboard focus on a time row

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Hours row (keyboard focus) | height | 34px | **32px** |
| Hours row (keyboard focus) | scroll-snap-align | none | **center** |
| Hours row (keyboard focus) | outline-style | auto | **solid** |
| Hours row (keyboard focus) | outline-width | 1px | **2px** |
| Hours row (keyboard focus) | outline-offset | 0px | **-2px** |
| Hours row (keyboard focus) | outline-color | #005FCC | **#343E55** |

### Narrow 360px viewport (36px days and arrows)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Popover | height | 391 | **419** |
| Prev month button (mobile) | width | 24px | **36px** |
| Prev month button (mobile) | height | 24px | **36px** |
| Prev month button (mobile) | border-radius | 4px | **8px** |
| Month pill (mobile) | height | 36px | **32px** |
| Month pill (mobile) | border-radius | 6px | **8px** |
| Day Oct 7 (mobile) | width | 32px | **36px** |
| Day Oct 7 (mobile) | height | 32px | **36px** |
| Day Oct 20 (mobile) | width | 32px | **36px** |
| Day Oct 20 (mobile) | height | 32px | **36px** |
| Weekday label (mobile) | width | 32px | **43.14px** |
| Weekday label (mobile) | height | 32px | **36px** |

### Empty value, calendar open (today dot, nothing selected)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Day Oct 4 (today, none selected) | box-shadow | #FFFFFF 0 inset, #777E8D 0px 0px 0px 1px inset, transparent 0 | **none** |

### Date-only variant, open

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Popover | height | 298px | **294px** |

### Time-only variant, Start Time list open

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Hours column list | padding-top | 4px | **68px** |
| Hours column list | padding-bottom | 4px | **68px** |
| Hours column list | -webkit-mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Hours column list | mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Hours column list | scroll-snap-type | none | **y** |
| Hours selected row | height | 34px | **32px** |
| Hours selected row | scroll-snap-align | none | **center** |
| Hours unselected row | height | 34px | **32px** |
| Hours unselected row | scroll-snap-align | none | **center** |
| Minutes column list | padding-top | 4px | **68px** |
| Minutes column list | padding-bottom | 4px | **68px** |
| Minutes column list | -webkit-mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Minutes column list | mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| Minutes column list | scroll-snap-type | none | **y** |
| Minutes selected row | height | 34px | **32px** |
| Minutes selected row | scroll-snap-align | none | **center** |
| AM/PM column list | height | 78px | **168px** |
| AM/PM column list | padding-top | 4px | **68px** |
| AM/PM column list | padding-bottom | 4px | **68px** |
| AM/PM column list | -webkit-mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| AM/PM column list | mask-image | none | **linear-gradient(transparent, #000000 12px, #000000 calc(100% - 12px), transparent)** |
| AM/PM column list | scroll-snap-type | none | **y** |
| AM/PM selected row | height | 34px | **32px** |
| AM/PM selected row | scroll-snap-align | none | **center** |

## Motion

| What | Before | After |
| --- | --- | --- |
| Month change (arrows, month/year list, picking a day in an adjacent month) | none (instant swap) | **Day grid re-mounts and slides 8px in from the right (later month) or left (earlier month) with fade 0 to 1, 200ms, spring ease (var(--v2-ease-spring), fallback cubic-bezier(0.22,1,0.36,1)). Weekday row stays still.** |
| Month change, reduced motion | none | **No movement; 120ms opacity fade (v2-fade-in)** |
| Opening the popover | popover fade + scale 98% (200ms) | **Unchanged. The month grid does NOT also animate on open, even right after a previous session left a direction behind.** |
| Month / year chevron | right-pointing chevron, -90deg when open | **Down chevron, 180deg when open, 200ms spring; no transition under reduced motion** |
| Time list on open | scrollTop set once on mount (measured against the wrong parent), no snapping | **Selected row centred before first paint (instant, so reduced motion needs no case); scroll-snap-type y proximity with snap-align center on rows** |
| Keyboard in a time column | Tab and Enter/Space only | **ArrowUp/ArrowDown step the selection and move focus, Home/End jump to the first/last row; the list re-centres instantly** |
| Hover fill on days, arrows, pills, rows, icon buttons | 150ms colour fade, also on touch | **Same 150ms fade, only where (hover: hover) is true** |

## States to update in Figma

- Day cell: 32 x 32 circle from sm, 36 x 36 below sm, radius 9999, 12/16 text #5E5E5E (muted #707070 outside the visible month); row pitch equals the circle size (32, 36 on mobile)
- Day cell / today (not selected): 4 x 4 dot #343E55, 2px above the circle bottom, centred; the 1px ring is removed; aria-current kept
- Day cell / selected: filled #343E55 circle, text white, Medium 500 (unchanged)
- Day cell / keyboard focus: 2px solid #343E55 outline, 1px offset, drawn above neighbours
- Weekday label: capitals via CSS (text stays 'Su Mo ...'), Inter Medium 12/16 #707070, cell 44.3 x 32 (36 tall on mobile)
- Calendar arrow: 32 x 32 (36 x 36 below sm), radius 8, 16px icon (was 24 x 24, radius 4); keyboard focus: 2px #343E55 outline, 1px offset
- Month pill and year pill: the teal focus border (#27ABB8) and 1px halo that used to appear after a mouse click are removed; keyboard focus uses the 2px #343E55 outline instead, and the open list is signalled by the turned chevron
- Month pill and year pill: height 32 (was 36), radius 8 (was 6), min width 90, padding 0 / 12, border 1px #E9EAEB, 14/20 Medium #484848, chevron-down 14px #707070 (was chevron-right 12px) turning 180deg when the list is open; hover fill #F5F5F5 on pointer devices; keyboard focus 2px #343E55 outline
- Time list column: 168 tall (max), vertical padding 68 (66 for coarse pointers), horizontal padding 4, row gap 2, 12px edge fade top and bottom, scroll snap center
- Time list row: height 32 (was 34; 36 for coarse pointers), radius 6, padding 0 / 8, 14/20; default text #5E5E5E; hover fill #F5F5F5 on pointer devices; keyboard focus 2px #343E55 outline drawn inside the row
- Time list row / selected: unchanged look (fill #ECF1FB, 1px border #A8C0EC, text #484848, weight 500); now centred in its column on open
- Time field button (Start/End Time) and month/year list rows: hover gated for touch; keyboard focus ring added to the field button
- Clear (x) and calendar icon buttons: hover fill and colour gated for touch; sizes, labels and focus handling unchanged

## How to apply in Figma

1. 1. Calendar header: auto-layout horizontal, space-between, gap 8, margin-bottom 12, height 32 (36 on the mobile variant, below 640 wide). Previous arrow, centre group (auto-layout horizontal, gap 6) with the Month pill and Year pill, Next arrow.
2. 2. Arrow button: frame 32 x 32 (36 x 36 on mobile), corner radius 8, no fill or stroke, 16 x 16 chevron #5E5E5E centred. Hover variant (pointer devices only): fill #F5F5F5. Focus variant: 2px #343E55 outline, offset 1 outside the frame.
3. 3. Month pill and Year pill (same component as the DateRangePicker's pills, but here with a 90 minimum width and the chevron pushed to the right edge): auto-layout horizontal, space-between, item spacing 8, height 32, padding 0 / 12, corner radius 8, stroke 1px inside #E9EAEB, fill #FFFFFF. Label Inter Medium 14 / 20 #484848, ChevronDown icon 14 x 14 #707070. Variants: default, hover (fill #F5F5F5, pointer devices only), list open (chevron rotated 180 degrees), focus (2px #343E55 outline, offset 1). The old right-pointing 12px chevron is replaced.
4. 4. Weekday row: 7 cells of 44.28 x 32 (36 tall on mobile), Inter Medium 12 / 16 #707070, text shown in capitals (SU MO TU WE TH FR SA; the layer text can stay 'Su Mo' with the uppercase text-case setting). It does not animate.
5. 5. Day grid: 7 columns x 6 rows, each cell a 32 x 32 circle (36 x 36 on mobile) centred in a 44.28-wide column, no row gap, so row pitch = circle size (32; 36 on mobile). Radius 9999, Inter Regular 12 / 16 #5E5E5E (neighbouring-month days #707070). Hover variant fill #F5F5F5 (pointer devices only). Selected: fill #343E55, text white, Medium 500.
6. 6. Today marker: remove the 1px ring. Add a 4 x 4 circle, fill #343E55, centred horizontally, 2px above the bottom of the day circle. Shown only when today is not the selected day.
7. 7. Focus ring (one style for every control in the popover and the lists): outline 2px solid #343E55 (--semantic-primary), offset 1px outside the shape for days, arrows and pills, and offset -2px (drawn inside) for list rows.
8. 8. Time dropdown panel: same as before (width = the Start Time field, here 310; radius 8; stroke 1px #E9EAEB; shadow lg; header row HOURS / MINUTES / AM/PM unchanged, 3 columns, or 4 with seconds). Only the column lists change, as follows.
9. 9. Each column list: 168 high (clip), auto-layout vertical, item spacing 2, padding top and bottom 68 (66 on a coarse-pointer / mobile-touch variant), padding left and right 4. The top and bottom padding are spacers: they let the first and last row sit in the vertical centre of the 168 box. All three columns are 168 high, including AM/PM (2 rows), so the selected rows of Hours, Minutes and AM/PM share one horizontal band.
10. 10. Edge fade: apply a layer mask to each column list: a vertical gradient, fully transparent at the top edge to fully opaque at 12px from the top; opaque until 12px from the bottom, fully transparent at the bottom edge. The list still scrolls (overflow auto) and snaps (rows snap to the centre, proximity).
11. 11. Row: height 32 (36 on the coarse-pointer variant), radius 6, padding 0 / 8, centred 14 / 20 label, stroke 1px transparent. Default text #5E5E5E. Hover (pointer devices only) fill #F5F5F5. Selected: fill #ECF1FB, stroke 1px #A8C0EC, text #484848, Medium 500. Focus: 2px #343E55 outline drawn inside the row.
12. 12. Opening state to design: the selected row is vertically centred in each column (centre offset 0), e.g. 10 / 30 / AM on one line for 10:30 AM; for 12:00 AM the Hours list is scrolled to the end with 12 centred and Minutes sit at the start with 00 centred, so no row is half-clipped.
13. 13. Keyboard (document in the spec, not a visual): inside a focused time column ArrowDown / ArrowUp move the selection one row (no wrap) and move focus with it, Home / End jump to the first / last row, each change commits the time just like a click. Modified arrows (Shift, Ctrl, Alt, Cmd) are ignored. Tab order is unchanged.
14. 14. Motion for the prototype: month change = the day grid frame moves 8px from the travel side while opacity goes 0 to 100, 200ms, spring ease (cubic-bezier 0.22, 1, 0.36, 1). Weekday row does not move. Reduced-motion variant: 120ms opacity fade only. Chevron rotation 180 degrees, 200ms same easing. Opening the popover keeps its existing 200ms fade + 98% scale and the grid does NOT animate on open.
15. 15. Mobile variant (below 640 wide): popover 328 (clamped to the viewport); arrows 36 x 36; day circles 36 x 36 (row pitch 36); weekday cells 36 tall; time rows 36 only if the device is touch (coarse pointer), otherwise 32.

## Notes

- DECISION: the calendar's row pitch here stays equal to the circle size (32px, 36px below sm), whereas the DateRangePicker now uses a 36px pitch with 32px circles. Matching it would add 24px to a popover that is already close to its 420px max height once End Time is shown, which would make it scroll more often. Easy to align later by giving each cell a 2px vertical margin.
- DECISION: weekday labels are now capitals through CSS (text-transform: uppercase) so they match the range picker's 'SU MO'; the DOM text is still 'Su Mo', so v1 getByText('Su') keeps working. Revert by removing the 'uppercase' class if the design team prefers title case.
- DECISION: the month and year pills keep their 90px minimum width with the chevron at the right edge (the range picker's pills are content-sized with the chevron beside the text). They now share height, radius, border, chevron and hover, but this one visible difference remains.
- The time dropdown is still a floating panel that opens below the field and can extend past the popover's lower edge; that overlap is by design (it escapes the popover's clipping) and was not changed. The edge fade and spacer padding remove the clipped-row artefact, not the overlap.
- AM/PM has only two rows but now has the same 168px height and spacers, so there is blank space above AM and below PM and a small scroll range (34px). This is deliberate, so its selected row aligns with the other columns; mouse-wheel scrolling over it moves it slightly.
- Additive beyond the brief's list: the Start/End Time field button gets the same focus ring (it had outline-none and no focus indicator); the clear (x) and calendar icon buttons gate their hover fill for touch; month/year list rows get hover gating and an inset focus ring; aria-live="polite" was added to the existing screen-reader month heading so month changes are announced.
- The field's own hover border (input family) is unchanged, as are its labels and focus-within halo.
- Month motion also plays when the visible month changes because a day in an adjacent month is picked or a valid date is typed, since the visible month follows the value. It never plays on open: removing the render-time guard that prevents that fails the motion probe in design/figma-reports/date-range-picker/motion-probe.mjs (checked by temporarily removing it).
- Not verified: Safari and Firefox rendering of the mask-image fade and scroll snapping (unprefixed and -webkit- mask are both emitted); a physical touch device for the (pointer: coarse) 36px rows, which jsdom and headless Chrome cannot emulate here.
- The library names in 'Why' come from the brief's research list and were not re-verified in this run; only the BEFORE-screenshot findings were checked directly.
- No new hex colours. No components.yaml change needed: the component already used animate-in / tailwindcss-animate before this change.
- The edge-fade mask uses black (#000000 in the report) only as an alpha ramp; it is never painted, so it is not a new colour.
- Behaviour change to be aware of: a month/year pill clicked with the mouse no longer keeps a teal border and glow while focused (the old :focus style). Keyboard users get the new focus-visible outline; the open state is the rotated chevron.
