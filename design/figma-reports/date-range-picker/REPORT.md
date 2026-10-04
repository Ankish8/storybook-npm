# DateRangePicker: UI change report for Figma

Figma source: [https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=3217-27914](https://www.figma.com/design/q84boKV4Bly9HKXzdtBj2K/New-Design-System---MyO?node-id=3217-27914)  
Storybook: `V2/Components/DateRangePicker`  
Date: 2026-10-04

## Summary

The range now reads as one continuous pill instead of squared bars per week row, and choosing the end date shows a lighter dashed preview that follows the pointer or keyboard focus. The preset that equals the current range is highlighted. The calendar header is easier to hit (32px arrows, 32px pills with a turning chevron), hover fills no longer stick after a tap, every control shows a keyboard focus ring, and paging months slides the grid 8px with a fade. Props, aria-labels, callbacks and DOM structure are unchanged.

### Why (what the research found)

- Verified in the BEFORE screenshots: the range band was drawn per week row with squared ends and no caps, so a range crossing a row looked like two unrelated bars (02-open-range, 07-preset-last7-reopened).
- Verified in the BEFORE screenshots: after the first click nothing showed the span about to be committed (03-preview-forward); the presets column gave no feedback about the current value (06, 07); the arrows were 24px, the smallest target in the popover; the month pill had no chevron while the year pill did.
- Verified in the BEFORE screenshots: days showed only the browser's default blue auto outline on keyboard focus (09-focus-day), and every hover fill was ungated, so a tap on touch leaves the fill stuck.
- Design direction named in the brief's research set (HeroUI, Mantine, shadcn/ui, React Aria, Untitled UI): one continuous capped range band, a provisional range while the end date is chosen, a visible selected state, hover gated on (hover: hover), a 2px offset focus outline and a short directional slide on month change. These library behaviours were NOT re-checked in this run; treat them as the brief's inspiration, not as verified citations.
- Motion follows design/V2-MOTION.md: 200ms spring for panels, reduced motion removes movement and keeps a 120ms fade.

### API / compatibility

No prop, callback, aria-label or DOM-contract changes. v2 remains a drop-in for v1 (`npm run verify:v1-v2-compat` passes).

## Before and after

### Closed trigger (unchanged)

| Before | After |
| --- | --- |
| ![before](01-closed.before.png) | ![after](01-closed.after.png) |

### Open, range 1-7 Oct committed (band wraps a week row)

| Before | After |
| --- | --- |
| ![before](02-open-range.before.png) | ![after](02-open-range.after.png) |

### Range partly selected: first click on 12, pointer hovering 20 (preview, two rows)

| Before | After |
| --- | --- |
| ![before](03-preview-forward.before.png) | ![after](03-preview-forward.after.png) |

### Range partly selected: first click on 20, pointer hovering earlier day 12

| Before | After |
| --- | --- |
| ![before](04-preview-backward.before.png) | ![after](04-preview-backward.after.png) |

### First click only, pointer not over another day (no preview)

| Before | After |
| --- | --- |
| ![before](05-first-click-only.before.png) | ![after](05-first-click-only.after.png) |

### Preset selected: custom presets, value equals 'October launch'

| Before | After |
| --- | --- |
| ![before](06-preset-selected-custom.before.png) | ![after](06-preset-selected-custom.after.png) |

### Preset selected: 'Last 7 days' picked, popover reopened (band crosses a month boundary)

| Before | After |
| --- | --- |
| ![before](07-preset-last7-reopened.before.png) | ![after](07-preset-last7-reopened.after.png) |

### Day cell hover

| Before | After |
| --- | --- |
| ![before](08-day-hover.before.png) | ![after](08-day-hover.after.png) |

### Keyboard focus on a day

| Before | After |
| --- | --- |
| ![before](09-focus-day.before.png) | ![after](09-focus-day.after.png) |

### Keyboard focus on the Next month arrow

| Before | After |
| --- | --- |
| ![before](10-focus-next.before.png) | ![after](10-focus-next.after.png) |

### Keyboard focus on a preset

| Before | After |
| --- | --- |
| ![before](11-focus-preset.before.png) | ![after](11-focus-preset.after.png) |

### Month menu open (chevron turned)

| Before | After |
| --- | --- |
| ![before](12-month-menu-open.before.png) | ![after](12-month-menu-open.after.png) |

### Year menu open (chevron turned)

| Before | After |
| --- | --- |
| ![before](13-year-menu-open.before.png) | ![after](13-year-menu-open.after.png) |

### Narrow 360px viewport (36px days and arrows)

| Before | After |
| --- | --- |
| ![before](14-narrow-360.before.png) | ![after](14-narrow-360.after.png) |

### Narrow 360px viewport with the preview band

| Before | After |
| --- | --- |
| ![before](15-narrow-360-preview.before.png) | ![after](15-narrow-360-preview.after.png) |

### Error trigger (unchanged)

| Before | After |
| --- | --- |
| ![before](16-error-closed.before.png) | ![after](16-error-closed.after.png) |

### Disabled trigger (unchanged)

| Before | After |
| --- | --- |
| ![before](17-disabled-closed.before.png) | ![after](17-disabled-closed.after.png) |

### Empty value, open

| Before | After |
| --- | --- |
| ![before](18-empty-open.before.png) | ![after](18-empty-open.after.png) |

### Partial range (start only), open

| Before | After |
| --- | --- |
| ![before](19-partial-range-open.before.png) | ![after](19-partial-range-open.after.png) |

### No presets, open

| Before | After |
| --- | --- |
| ![before](20-no-presets-open.before.png) | ![after](20-no-presets-open.after.png) |

## Measured changes (copy these into Figma)

_Source: computed styles of the rendered component; px, hex colours, ms. Only properties that changed are listed._

### Open, range 1-7 Oct committed (band wraps a week row)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Popover | width | 418 | **446** |
| Popover | height | 296 | **318** |
| Presets column | height | 294 | **316** |
| Prev month button | width | 24 | **32** |
| Prev month button | height | 24 | **32** |
| Prev month button | border-radius | 4px | **8px** |
| Prev month button | padding | 4px | **0px** |
| Next month button | width | 24 | **32** |
| Next month button | height | 24 | **32** |
| Next month button | border-radius | 4px | **8px** |
| Next month button | padding | 4px | **0px** |
| Month pill | width | 73.22 | **91.22** |
| Month pill | height | 34 | **32** |
| Month pill | border-radius | 4px | **8px** |
| Month pill | padding | 6px 12px | **0px 12px** |
| Month pill | gap | normal | **4px** |
| Month pill | display | block | **flex** |
| Month pill chevron | _(new element)_ | — | present |
| Year pill | height | 34 | **32** |
| Year pill | border-radius | 4px | **8px** |
| Year pill | padding | 6px 12px | **0px 12px** |
| Weekday label (SU) | width | 35.42 | **39.42** |
| Day grid | width | 248 | **276** |
| Day grid | height | 224px | **216px** |
| Cell Oct 1 (range start, Thu) | width | 35.43px | **39.43px** |
| Cell Oct 1 (range start, Thu) | height | 32px | **36px** |
| Cell Oct 1 (range start, Thu) | background-color | #ECF1FB | **transparent** |
| Cell Oct 1 (range start, Thu) | border-radius | 9999px 0px 0px 9999px | **0px** |
| Cell Oct 1 ::before (band) | content | none | **""** |
| Cell Oct 1 ::before (band) | position | static | **absolute** |
| Cell Oct 1 ::before (band) | top | auto | **2px** |
| Cell Oct 1 ::before (band) | bottom | auto | **2px** |
| Cell Oct 1 ::before (band) | left | auto | **3.71px** |
| Cell Oct 1 ::before (band) | right | auto | **0px** |
| Cell Oct 1 ::before (band) | height | auto | **32px** |
| Cell Oct 1 ::before (band) | background-color | transparent | **#ECF1FB** |
| Cell Oct 1 ::before (band) | border-top-left-radius | 0px | **9999px** |
| Circle Oct 1 (range start) | z-index | auto | **1** |
| Cell Oct 2 (in range) | width | 35.42 | **39.42** |
| Cell Oct 2 (in range) | height | 32px | **36px** |
| Cell Oct 2 (in range) | background-color | #ECF1FB | **transparent** |
| Cell Oct 2 ::before (band) | content | none | **""** |
| Cell Oct 2 ::before (band) | position | static | **absolute** |
| Cell Oct 2 ::before (band) | top | auto | **2px** |
| Cell Oct 2 ::before (band) | bottom | auto | **2px** |
| Cell Oct 2 ::before (band) | left | auto | **0px** |
| Cell Oct 2 ::before (band) | right | auto | **0px** |
| Cell Oct 2 ::before (band) | height | auto | **32px** |
| Cell Oct 2 ::before (band) | background-color | transparent | **#ECF1FB** |
| Cell Oct 3 (in range, Sat = row end) | width | 35.42 | **39.42** |
| Cell Oct 3 (in range, Sat = row end) | height | 32px | **36px** |
| Cell Oct 3 (in range, Sat = row end) | background-color | #ECF1FB | **transparent** |
| Cell Oct 3 ::before (band) | content | none | **""** |
| Cell Oct 3 ::before (band) | position | static | **absolute** |
| Cell Oct 3 ::before (band) | top | auto | **2px** |
| Cell Oct 3 ::before (band) | bottom | auto | **2px** |
| Cell Oct 3 ::before (band) | left | auto | **0px** |
| Cell Oct 3 ::before (band) | right | auto | **0px** |
| Cell Oct 3 ::before (band) | height | auto | **32px** |
| Cell Oct 3 ::before (band) | background-color | transparent | **#ECF1FB** |
| Cell Oct 3 ::before (band) | border-top-right-radius | 0px | **9999px** |
| Cell Oct 4 (in range, Sun = row start, today) | width | 35.42 | **39.42** |
| Cell Oct 4 (in range, Sun = row start, today) | height | 32px | **36px** |
| Cell Oct 4 (in range, Sun = row start, today) | background-color | #ECF1FB | **transparent** |
| Cell Oct 4 ::before (band) | content | none | **""** |
| Cell Oct 4 ::before (band) | position | static | **absolute** |
| Cell Oct 4 ::before (band) | top | auto | **2px** |
| Cell Oct 4 ::before (band) | bottom | auto | **2px** |
| Cell Oct 4 ::before (band) | left | auto | **0px** |
| Cell Oct 4 ::before (band) | right | auto | **0px** |
| Cell Oct 4 ::before (band) | height | auto | **32px** |
| Cell Oct 4 ::before (band) | background-color | transparent | **#ECF1FB** |
| Cell Oct 4 ::before (band) | border-top-left-radius | 0px | **9999px** |
| Circle Oct 4 (today, in range) | z-index | auto | **1** |
| Cell Oct 7 ::before (band, range end) | content | none | **""** |
| Cell Oct 7 ::before (band, range end) | position | static | **absolute** |
| Cell Oct 7 ::before (band, range end) | top | auto | **2px** |
| Cell Oct 7 ::before (band, range end) | bottom | auto | **2px** |
| Cell Oct 7 ::before (band, range end) | left | auto | **0px** |
| Cell Oct 7 ::before (band, range end) | right | auto | **3.70px** |
| Cell Oct 7 ::before (band, range end) | height | auto | **32px** |
| Cell Oct 7 ::before (band, range end) | background-color | transparent | **#ECF1FB** |
| Cell Oct 7 ::before (band, range end) | border-top-right-radius | 0px | **9999px** |
| Circle Oct 7 (range end) | z-index | auto | **1** |
| Circle Oct 20 (outside range) | z-index | auto | **1** |

### Range partly selected: first click on 12, pointer hovering 20 (preview, two rows)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Cell Oct 12 (preview start, Mon) ::before | content | none | **""** |
| Cell Oct 12 (preview start, Mon) ::before | position | static | **absolute** |
| Cell Oct 12 (preview start, Mon) ::before | top | auto | **2px** |
| Cell Oct 12 (preview start, Mon) ::before | bottom | auto | **2px** |
| Cell Oct 12 (preview start, Mon) ::before | left | auto | **3.70px** |
| Cell Oct 12 (preview start, Mon) ::before | right | auto | **0px** |
| Cell Oct 12 (preview start, Mon) ::before | height | auto | **32px** |
| Cell Oct 12 (preview start, Mon) ::before | background-color | transparent | **#F6F8FD** |
| Cell Oct 12 (preview start, Mon) ::before | border-top-left-radius | 0px | **9999px** |
| Cell Oct 12 (preview start, Mon) ::before | border-top-width | 0px | **1px** |
| Cell Oct 12 (preview start, Mon) ::before | border-top-style | solid | **dashed** |
| Cell Oct 12 (preview start, Mon) ::before | border-top-color | #E5E7EB | **#C4D4F2** |
| Cell Oct 12 (preview start, Mon) ::before | border-bottom-style | solid | **dashed** |
| Circle Oct 12 (first click) | z-index | auto | **1** |
| Cell Oct 14 (preview middle) ::before | content | none | **""** |
| Cell Oct 14 (preview middle) ::before | position | static | **absolute** |
| Cell Oct 14 (preview middle) ::before | top | auto | **2px** |
| Cell Oct 14 (preview middle) ::before | bottom | auto | **2px** |
| Cell Oct 14 (preview middle) ::before | left | auto | **0px** |
| Cell Oct 14 (preview middle) ::before | right | auto | **0px** |
| Cell Oct 14 (preview middle) ::before | height | auto | **32px** |
| Cell Oct 14 (preview middle) ::before | background-color | transparent | **#F6F8FD** |
| Cell Oct 14 (preview middle) ::before | border-top-width | 0px | **1px** |
| Cell Oct 14 (preview middle) ::before | border-top-style | solid | **dashed** |
| Cell Oct 14 (preview middle) ::before | border-top-color | #E5E7EB | **#C4D4F2** |
| Cell Oct 14 (preview middle) ::before | border-bottom-style | solid | **dashed** |
| Cell Oct 17 (preview, Sat = row end) ::before | content | none | **""** |
| Cell Oct 17 (preview, Sat = row end) ::before | position | static | **absolute** |
| Cell Oct 17 (preview, Sat = row end) ::before | top | auto | **2px** |
| Cell Oct 17 (preview, Sat = row end) ::before | bottom | auto | **2px** |
| Cell Oct 17 (preview, Sat = row end) ::before | left | auto | **0px** |
| Cell Oct 17 (preview, Sat = row end) ::before | right | auto | **0px** |
| Cell Oct 17 (preview, Sat = row end) ::before | height | auto | **32px** |
| Cell Oct 17 (preview, Sat = row end) ::before | background-color | transparent | **#F6F8FD** |
| Cell Oct 17 (preview, Sat = row end) ::before | border-top-right-radius | 0px | **9999px** |
| Cell Oct 17 (preview, Sat = row end) ::before | border-top-width | 0px | **1px** |
| Cell Oct 17 (preview, Sat = row end) ::before | border-top-style | solid | **dashed** |
| Cell Oct 17 (preview, Sat = row end) ::before | border-top-color | #E5E7EB | **#C4D4F2** |
| Cell Oct 17 (preview, Sat = row end) ::before | border-bottom-style | solid | **dashed** |
| Cell Oct 18 (preview, Sun = row start) ::before | content | none | **""** |
| Cell Oct 18 (preview, Sun = row start) ::before | position | static | **absolute** |
| Cell Oct 18 (preview, Sun = row start) ::before | top | auto | **2px** |
| Cell Oct 18 (preview, Sun = row start) ::before | bottom | auto | **2px** |
| Cell Oct 18 (preview, Sun = row start) ::before | left | auto | **0px** |
| Cell Oct 18 (preview, Sun = row start) ::before | right | auto | **0px** |
| Cell Oct 18 (preview, Sun = row start) ::before | height | auto | **32px** |
| Cell Oct 18 (preview, Sun = row start) ::before | background-color | transparent | **#F6F8FD** |
| Cell Oct 18 (preview, Sun = row start) ::before | border-top-left-radius | 0px | **9999px** |
| Cell Oct 18 (preview, Sun = row start) ::before | border-top-width | 0px | **1px** |
| Cell Oct 18 (preview, Sun = row start) ::before | border-top-style | solid | **dashed** |
| Cell Oct 18 (preview, Sun = row start) ::before | border-top-color | #E5E7EB | **#C4D4F2** |
| Cell Oct 18 (preview, Sun = row start) ::before | border-bottom-style | solid | **dashed** |
| Cell Oct 20 (hovered end) ::before | content | none | **""** |
| Cell Oct 20 (hovered end) ::before | position | static | **absolute** |
| Cell Oct 20 (hovered end) ::before | top | auto | **2px** |
| Cell Oct 20 (hovered end) ::before | bottom | auto | **2px** |
| Cell Oct 20 (hovered end) ::before | left | auto | **0px** |
| Cell Oct 20 (hovered end) ::before | right | auto | **3.71px** |
| Cell Oct 20 (hovered end) ::before | height | auto | **32px** |
| Cell Oct 20 (hovered end) ::before | background-color | transparent | **#F6F8FD** |
| Cell Oct 20 (hovered end) ::before | border-top-right-radius | 0px | **9999px** |
| Cell Oct 20 (hovered end) ::before | border-top-width | 0px | **1px** |
| Cell Oct 20 (hovered end) ::before | border-top-style | solid | **dashed** |
| Cell Oct 20 (hovered end) ::before | border-top-color | #E5E7EB | **#C4D4F2** |
| Cell Oct 20 (hovered end) ::before | border-bottom-style | solid | **dashed** |
| Circle Oct 20 (hovered end) | background-color | #F5F5F5 | **transparent** |
| Circle Oct 20 (hovered end) | box-shadow | none | **#FFFFFF 0 inset, #343E55 0px 0px 0px 1px inset, transparent 0** |
| Circle Oct 20 (hovered end) | z-index | auto | **1** |

### Range partly selected: first click on 20, pointer hovering earlier day 12

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Cell Oct 12 (hovered start) ::before | content | none | **""** |
| Cell Oct 12 (hovered start) ::before | position | static | **absolute** |
| Cell Oct 12 (hovered start) ::before | top | auto | **2px** |
| Cell Oct 12 (hovered start) ::before | bottom | auto | **2px** |
| Cell Oct 12 (hovered start) ::before | left | auto | **3.70px** |
| Cell Oct 12 (hovered start) ::before | right | auto | **0px** |
| Cell Oct 12 (hovered start) ::before | height | auto | **32px** |
| Cell Oct 12 (hovered start) ::before | background-color | transparent | **#F6F8FD** |
| Cell Oct 12 (hovered start) ::before | border-top-left-radius | 0px | **9999px** |
| Cell Oct 12 (hovered start) ::before | border-top-width | 0px | **1px** |
| Cell Oct 12 (hovered start) ::before | border-top-style | solid | **dashed** |
| Cell Oct 12 (hovered start) ::before | border-top-color | #E5E7EB | **#C4D4F2** |
| Cell Oct 12 (hovered start) ::before | border-bottom-style | solid | **dashed** |
| Circle Oct 12 (hovered, earlier) | background-color | #F5F5F5 | **transparent** |
| Circle Oct 12 (hovered, earlier) | box-shadow | none | **#FFFFFF 0 inset, #343E55 0px 0px 0px 1px inset, transparent 0** |
| Circle Oct 12 (hovered, earlier) | z-index | auto | **1** |
| Circle Oct 20 (first click) | z-index | auto | **1** |
| Cell Oct 20 ::before | content | none | **""** |
| Cell Oct 20 ::before | position | static | **absolute** |
| Cell Oct 20 ::before | top | auto | **2px** |
| Cell Oct 20 ::before | bottom | auto | **2px** |
| Cell Oct 20 ::before | left | auto | **0px** |
| Cell Oct 20 ::before | right | auto | **3.71px** |
| Cell Oct 20 ::before | height | auto | **32px** |
| Cell Oct 20 ::before | background-color | transparent | **#F6F8FD** |
| Cell Oct 20 ::before | border-top-right-radius | 0px | **9999px** |
| Cell Oct 20 ::before | border-top-width | 0px | **1px** |
| Cell Oct 20 ::before | border-top-style | solid | **dashed** |
| Cell Oct 20 ::before | border-top-color | #E5E7EB | **#C4D4F2** |
| Cell Oct 20 ::before | border-bottom-style | solid | **dashed** |

### First click only, pointer not over another day (no preview)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Circle Oct 12 (first click) | z-index | auto | **1** |

### Preset selected: custom presets, value equals 'October launch'

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Preset: October launch (matches value) | background-color | transparent | **#ECF1FB** |
| Preset: October launch (matches value) | color | #5E5E5E | **#484848** |
| Preset: October launch (matches value) | font-weight | 400 | **500** |

### Preset selected: 'Last 7 days' picked, popover reopened (band crosses a month boundary)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Cell Sep 28 (range start, Mon) ::before | content | none | **""** |
| Cell Sep 28 (range start, Mon) ::before | position | static | **absolute** |
| Cell Sep 28 (range start, Mon) ::before | top | auto | **2px** |
| Cell Sep 28 (range start, Mon) ::before | bottom | auto | **2px** |
| Cell Sep 28 (range start, Mon) ::before | left | auto | **3.70px** |
| Cell Sep 28 (range start, Mon) ::before | right | auto | **0px** |
| Cell Sep 28 (range start, Mon) ::before | height | auto | **32px** |
| Cell Sep 28 (range start, Mon) ::before | background-color | transparent | **#ECF1FB** |
| Cell Sep 28 (range start, Mon) ::before | border-top-left-radius | 0px | **9999px** |
| Cell Oct 3 (Sat = row end) ::before | content | none | **""** |
| Cell Oct 3 (Sat = row end) ::before | position | static | **absolute** |
| Cell Oct 3 (Sat = row end) ::before | top | auto | **2px** |
| Cell Oct 3 (Sat = row end) ::before | bottom | auto | **2px** |
| Cell Oct 3 (Sat = row end) ::before | left | auto | **0px** |
| Cell Oct 3 (Sat = row end) ::before | right | auto | **0px** |
| Cell Oct 3 (Sat = row end) ::before | height | auto | **32px** |
| Cell Oct 3 (Sat = row end) ::before | background-color | transparent | **#ECF1FB** |
| Cell Oct 3 (Sat = row end) ::before | border-top-right-radius | 0px | **9999px** |
| Cell Oct 4 (range end, Sun = row start) ::before | content | none | **""** |
| Cell Oct 4 (range end, Sun = row start) ::before | position | static | **absolute** |
| Cell Oct 4 (range end, Sun = row start) ::before | top | auto | **2px** |
| Cell Oct 4 (range end, Sun = row start) ::before | bottom | auto | **2px** |
| Cell Oct 4 (range end, Sun = row start) ::before | left | auto | **0px** |
| Cell Oct 4 (range end, Sun = row start) ::before | right | auto | **3.70px** |
| Cell Oct 4 (range end, Sun = row start) ::before | height | auto | **32px** |
| Cell Oct 4 (range end, Sun = row start) ::before | background-color | transparent | **#ECF1FB** |
| Cell Oct 4 (range end, Sun = row start) ::before | border-top-left-radius | 0px | **9999px** |
| Cell Oct 4 (range end, Sun = row start) ::before | border-top-right-radius | 0px | **9999px** |
| Preset: Last 7 days (selected) | background-color | transparent | **#ECF1FB** |
| Preset: Last 7 days (selected) | color | #5E5E5E | **#484848** |
| Preset: Last 7 days (selected) | font-weight | 400 | **500** |

### Day cell hover

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Circle Oct 20 (hovered) | z-index | auto | **1** |

### Keyboard focus on a day

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Circle Oct 14 (keyboard focus) | outline-style | auto | **solid** |
| Circle Oct 14 (keyboard focus) | outline-width | 1px | **2px** |
| Circle Oct 14 (keyboard focus) | outline-offset | 0px | **1px** |
| Circle Oct 14 (keyboard focus) | outline-color | #005FCC | **#343E55** |
| Circle Oct 14 (keyboard focus) | z-index | auto | **10** |

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

### Keyboard focus on a preset

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Preset: Yesterday (keyboard focus) | outline-style | auto | **solid** |
| Preset: Yesterday (keyboard focus) | outline-width | 1px | **2px** |
| Preset: Yesterday (keyboard focus) | outline-offset | 0px | **1px** |
| Preset: Yesterday (keyboard focus) | outline-color | #005FCC | **#343E55** |

### Month menu open (chevron turned)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Month pill (menu open) | width | 73.22 | **91.22** |
| Month pill (menu open) | height | 34 | **32** |
| Month pill (menu open) | border-radius | 4px | **8px** |
| Month pill (menu open) | padding | 6px 12px | **0px 12px** |
| Month pill (menu open) | gap | normal | **4px** |
| Month pill chevron (menu open) | _(new element)_ | — | present |

### Narrow 360px viewport (36px days and arrows)

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Prev month button (mobile) | width | 24px | **36px** |
| Prev month button (mobile) | height | 24px | **36px** |
| Prev month button (mobile) | border-radius | 4px | **8px** |
| Month pill (mobile) | width | 73.22 | **91.22** |
| Month pill (mobile) | height | 34px | **32px** |
| Month pill (mobile) | border-radius | 4px | **8px** |
| Cell Oct 1 ::before (mobile band) | top | auto | **0px** |
| Cell Oct 1 ::before (mobile band) | bottom | auto | **0px** |
| Cell Oct 1 ::before (mobile band) | height | auto | **36px** |
| Cell Oct 1 ::before (mobile band) | border-top-left-radius | 0px | **9999px** |
| Cell Oct 1 ::before (mobile band) | background-color | transparent | **#ECF1FB** |

### Narrow 360px viewport with the preview band

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Cell Oct 14 ::before (mobile preview) | top | auto | **1px** |
| Cell Oct 14 ::before (mobile preview) | bottom | auto | **1px** |
| Cell Oct 14 ::before (mobile preview) | height | auto | **34px** |
| Cell Oct 14 ::before (mobile preview) | border-top-style | solid | **dashed** |
| Cell Oct 14 ::before (mobile preview) | border-top-width | 0px | **1px** |
| Cell Oct 14 ::before (mobile preview) | background-color | transparent | **#F6F8FD** |

### Partial range (start only), open

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Circle Oct 1 (start only) | z-index | auto | **1** |

### No presets, open

| Element | Property | Before | After |
| --- | --- | --- | --- |
| Popover | width | 274px | **302px** |
| Popover | height | 296 | **318** |

## Motion

| What | Before | After |
| --- | --- | --- |
| Month change (Next/Previous/month or year menu) | none (instant swap) | **Day grid re-mounts and slides 8px in from the right (Next) or left (Previous) with fade 0 to 1, 200ms, spring ease (var(--v2-ease-spring), fallback cubic-bezier(0.22,1,0.36,1)). Weekday header stays still.** |
| Month change, reduced motion | none | **No movement; 120ms opacity fade (v2-fade-in)** |
| Opening the popover | popover fade + scale 98% (200ms) | **Unchanged. The month grid does NOT also animate on open, even though opening resets the visible month.** |
| Month / year chevron | year chevron turned 180deg; month had none | **Both turn 180deg while their menu is open, 200ms spring; no transition under reduced motion** |
| Hover fill on days, arrows, pills, presets | 150ms colour fade, also on touch | **Same 150ms fade, only where (hover: hover) is true** |
| Preview band | none | **Instant (no transition): it tracks the pointer, so any fade would lag behind it** |

## States to update in Figma

- Day cell wrapper: 39.4 x 36 (width = 276 / 7), same height at every breakpoint (was 36 below sm, 32 from sm)
- Day circle: 32 x 32 from sm, 36 x 36 below sm, radius 9999, text 12/16 #5E5E5E (muted #707070 outside the visible month)
- Day cell / in range (middle): band rectangle, fill #ECF1FB (--semantic-info-surface), 32 tall, no caps
- Day cell / range start: band starts at the circle's left edge, left cap radius 9999; circle filled #343E55, text white, 500
- Day cell / range end: band ends at the circle's right edge, right cap radius 9999; circle filled #343E55
- Day cell / in range / first column (Sunday): left cap radius 9999, flush with the grid's left edge
- Day cell / in range / last column (Saturday): right cap radius 9999, flush with the grid's right edge
- Day cell / preview (middle): band fill #F6F8FD (--semantic-info-surface-subtle) + 1px dashed top and bottom stroke #C4D4F2 (--color-info-100), no side strokes
- Day cell / preview / start, end, Sunday, Saturday: same cap rules as the committed band
- Day circle / preview end (hovered or focused): no fill, 1px inside stroke #343E55
- Day circle / preview anchor (first click): filled, as a selected edge
- Day circle / keyboard focus: 2px solid #343E55 outline, 1px offset, drawn above neighbours
- Preset / selected: fill #ECF1FB, text #484848, weight 500 (aria-current)
- Preset / keyboard focus: 2px solid #343E55 outline, 1px offset
- Calendar arrow: 32 x 32 (36 x 36 below sm), radius 8, 16px icon centred (was 24 x 24, radius 4)
- Calendar arrow / keyboard focus: 2px solid #343E55 outline, 1px offset
- Month pill and year pill: height 32, radius 8, padding 0 / 12, gap 4, border 1px #E9EAEB, 14/20 Medium #484848 (was radius 4, height 34), both with a 14px chevron #707070
- Month / year pill / menu open: chevron rotated 180deg
- Month / year pill / keyboard focus: 2px solid #343E55 outline, 1px offset
- Popover: calendar column min width 300 (276 content + 12 padding each side), popover 446 wide with the 144 presets column (was 418)
- Hover state on days, arrows, pills, presets: only for devices that can hover

## How to apply in Figma

1. 1. Calendar column frame: auto-layout vertical, padding 12 all sides, minimum width 300 so the content width is 276 (7 columns x 39.4375). The whole popover is therefore 446 wide next to the 144 presets column (it was 418). Do not let it shrink: the header needs about 268 and a narrower column resizes the popover as users page between months.
2. 2. Header row: auto-layout horizontal, space-between, gap 8, margin-bottom 12, height 32 (36 on the mobile variant, below 640 wide). Children in order: Previous arrow, a centre group (auto-layout horizontal, gap 8) holding the month pill and the year pill, Next arrow.
3. 3. Arrow button (Previous / Next): frame 32 x 32 (36 x 36 on mobile), corner radius 8, no fill, no stroke. 16 x 16 chevron icon, colour #5E5E5E (--v2-text-secondary), centred. Hover variant (pointer devices only): fill #F5F5F5 (--semantic-bg-hover). Focus variant: 2px #343E55 outline, offset 1 outside the frame.
4. 4. Month pill and year pill (one component, two instances): auto-layout horizontal, height 32, padding 0 / 12, item spacing 4, corner radius 8, stroke 1px inside #E9EAEB, no fill. Label Inter Medium 14 / 20 #484848. After the label add a ChevronDown icon 14 x 14, colour #707070. Variants: default, hover (fill #F5F5F5, pointer devices only), menu open (chevron rotated 180 degrees), focus (2px #343E55 outline, offset 1). The month pill now has a chevron too.
5. 5. Weekday row (separate from the days; it does not animate): 7 cells of 39.4375 x 32 (36 tall on mobile), text SU MO TU WE TH FR SA in capitals, Inter Medium 12 / 16, #707070, centred.
6. 6. Day grid: 7 columns x 6 rows. Each day cell is a 39.4375 x 36 frame (36 high at every breakpoint, so the row pitch is 36). Inside it centre a 32 x 32 circle (36 x 36 on mobile), corner radius 9999, Inter Regular 12 / 16, #5E5E5E (days from the neighbouring month #707070). Hover variant: circle fill #F5F5F5 (pointer devices only).
7. 7. Range band, one rectangle layer behind the circle in every in-range cell: width = the cell width, height 32 (36 on mobile), centred vertically (2px inset top and bottom on desktop, none on mobile), fill #ECF1FB (--semantic-info-surface). Make a variant property Cap = none / left / right / both. Left cap = top-left and bottom-left radius 9999; right cap = top-right and bottom-right radius 9999.
8. 8. Cap rules (apply per cell): left cap when the cell is the range start OR the first column (Sunday); right cap when it is the range end OR the last column (Saturday). At the range start the band begins at the circle's left edge (inset 3.72 from the cell's left edge, i.e. cell width / 2 minus 16; 18 on mobile) so the pill emerges from the circle; at the range end it stops at the circle's right edge (same inset). At a Sunday or Saturday that is not a range end the band is flush with the cell edge, so the rounded cap sits on the grid edge. A one-day range shows only the filled circle, no band.
9. 9. Selected start and end circles sit on top of the band: fill #343E55 (--semantic-primary), text white Inter Medium 12. Today's dot (4 x 4, #343E55, 2px above the circle bottom, centred) shows only on today when it is not a selected edge.
10. 10. Preview band (after the first click, from the first-click day to the day under the pointer or keyboard focus, whichever order they fall in): same rectangle and cap rules as step 7 and 8, but fill #F6F8FD (--semantic-info-surface-subtle) and a 1px DASHED inside stroke #C4D4F2 (--color-info-100) on the TOP and BOTTOM edges only (no left or right stroke); dash 3 / gap 3 as the browser draws a 1px dashed border. On mobile the preview is inset 1px top and bottom (34 tall) so two stacked rows do not double their dashed edge.
11. 11. Preview end circle (the hovered or focused day): no fill, 1px INSIDE stroke #343E55. The first-click day stays a normal filled selected circle. Nothing is selected until the second click, which commits and closes as before. There is no preview on touch and no preview before the first click.
12. 12. Presets column: width 144, padding 12, item spacing 2, right stroke 1px #E9EAEB. Each preset 119 x 32, radius 4 (unchanged), padding 6 / 8, Inter Regular 14 / 20 #5E5E5E. Add a Selected variant: fill #ECF1FB, text #484848, Inter Medium 500 (aria-current). Hover variant (pointer devices only) #F5F5F5; disabled stays 40% opacity. Focus variant: 2px #343E55 outline, offset 1.
13. 13. Focus ring (one style for every control in the popover): outline 2px solid #343E55 (--semantic-primary), offset 1px outside the shape, not a drop shadow; the focused day is drawn above its neighbours.
14. 14. Motion for the prototype: month change = the day grid frame moves 8px from the travel side (from the right for Next, from the left for Previous) while opacity goes 0 to 100, 200ms, spring ease (smart-animate 'ease out', or cubic-bezier 0.22, 1, 0.36, 1). Weekday row does not move. Reduced-motion variant: 120ms opacity fade only. Chevron rotation: 180 degrees, 200ms same easing. Opening the popover keeps its existing 200ms fade + 98% scale and the grid does NOT animate on open.
15. 15. Mobile variant (below 640 wide): presets become a horizontal scroll row above the calendar (unchanged); arrows 36 x 36; day circles 36 x 36; band 36 tall with no vertical inset; preview band 34 tall (1px inset).

## Notes

- DECISION NEEDED: the popover is now 446px wide (was 418) because the 32px arrows and the extra month chevron make the header about 268px, wider than the old 248px content area. Measured across all 12 months: before the min-width fix the popover swung 418 to 438px (September widest); it is now a constant 446. Alternatives: shrink pill padding to 8px (fits 418 but only about 4px of slack, so fragile across font fallbacks) or drop the month chevron. I chose the stable wider popover.
- Row pitch is now 36px at all breakpoints (was 32px from sm), so the calendar is 24px taller on desktop (216 vs 192).
- If two presets describe the same days (for example 'This month' on the 1st equals 'Today'), only the first one in list order is marked selected, because the component does not remember which one was clicked.
- The preview is computed from pointer-enter and focus only; it never changes the draft value, adds no aria attributes and announces nothing. Touch pointers are ignored on purpose.
- The trigger's own hover border is unchanged (it belongs to the shared input family and is gated by 'enabled:' only); only the popover's controls were gated for touch.
- The month and year menus are the shared dropdown-menu component, owned elsewhere; their open/close styling is not part of this change.
- Measured by script: motion-probe.mjs in this folder (16 checks, normal and reduced motion, Chrome only). The render-phase guard that keeps the grid from animating on open is proven necessary in DateTimePicker (removing it fails the probe). In DateRangePicker an effect-time reset also clears a stale direction, and React 18 flushes that before paint for click-driven opens, so the render-phase guard there only matters for programmatic opens, which the probe does not exercise.
- Dashed top and bottom strokes on a fully rounded cap taper to zero where the cap meets the straight edge (CSS border behaviour). In Figma use a stroke on the band shape with top and bottom only, or an open path; check it in Safari and Firefox, which were not captured.
- No new hex colours. #C4D4F2 is --color-info-100, which has no Tailwind colour alias, so it is applied as an arbitrary value var(--color-info-100). All other colours use existing semantic tokens.
- The library names in 'Why' come from the brief's research list and were not re-verified in this run; only the BEFORE-screenshot findings were checked directly.
