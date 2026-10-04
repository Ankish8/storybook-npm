/**
 * DateRangePicker before/after scenarios (design/verify/capture.mjs).
 * Today in the capture machine is 2026-10-04; stories use fixed October 2026 values
 * (Oct 1 is a Thursday, so the 1-7 range wraps a week row: Thu 1, Fri 2, Sat 3 | Sun 4 ... Wed 7).
 *
 * capture.mjs's __measure reads getComputedStyle(el) only, so the first step of every scenario patches it to also
 * accept "<selector>::before": the range band is a pseudo-element and would otherwise be invisible in the report.
 */
const PSEUDO = {
  eval: `(() => { const base = window.__measure; window.__measure = (sel, props) => { const i = sel.indexOf("::"); if (i < 0) return base(sel, props); const e = document.querySelector(sel.slice(0, i)); if (!e) return null; const s = getComputedStyle(e, sel.slice(i)); const o = {}; for (const p of props) o[p] = s.getPropertyValue(p); return o; }; return true; })()`,
};

const S = (name) => `v2-components-daterangepicker--${name}`;
const TRIGGER = '#storybook-root button[aria-haspopup="dialog"]';
const DIALOG = '[role="dialog"]';
const day = (d) => `button[aria-label="October ${d}, 2026"]`;
const cell = (d) => `div:has(> ${day(d)})`;
const sep = (d) => `${DIALOG} ${day(d)}`;

const BOX = ["border-radius", "background-color", "color", "border-top-width", "border-top-color", "padding", "gap", "font-size", "font-weight", "line-height", "box-shadow", "opacity"];
const MOTION = ["transition-duration", "transition-property", "animation-name", "animation-duration"];
const BAND = ["content", "position", "top", "bottom", "left", "right", "height", "background-color", "border-top-left-radius", "border-top-right-radius", "border-top-width", "border-top-style", "border-top-color", "border-bottom-style"];
const CIRCLE = ["background-color", "color", "font-weight", "border-radius", "box-shadow", "outline-style", "outline-width", "outline-offset", "outline-color", "z-index"];

const calendarMeasure = {
  "Popover": { sel: DIALOG, props: ["border-radius", "box-shadow", "background-color", "animation-name", "animation-duration"] },
  "Presets column": { sel: `${DIALOG} > div > div:first-child`, props: ["width", "padding", "gap", "border-right-width", "border-right-color"] },
  "Preset: Today": { sel: `${DIALOG} > div > div:first-child > button:nth-child(1)`, props: [...BOX, "outline-style", "outline-width", ...MOTION] },
  "Preset: Last 7 days": { sel: `${DIALOG} > div > div:first-child > button:nth-child(3)`, props: [...BOX, "outline-style", "outline-width", ...MOTION] },
  "Prev month button": { sel: `${DIALOG} button[aria-label="Previous month"]`, props: [...BOX, "outline-style", "outline-width", ...MOTION] },
  "Next month button": { sel: `${DIALOG} button[aria-label="Next month"]`, props: [...BOX, "outline-style", "outline-width", ...MOTION] },
  "Prev month icon": { sel: `${DIALOG} button[aria-label="Previous month"] svg`, props: ["width", "height"] },
  "Month pill": { sel: `${DIALOG} button[data-calendar-menu="month"]`, props: [...BOX, "display", "border-top-style", ...MOTION] },
  "Month pill chevron": { sel: `${DIALOG} button[data-calendar-menu="month"] svg`, props: ["width", "height", "transform", "transition-duration", "transition-property"] },
  "Year pill": { sel: `${DIALOG} button[data-calendar-menu="year"]`, props: [...BOX, "display", "border-top-style", ...MOTION] },
  "Year pill chevron": { sel: `${DIALOG} button[data-calendar-menu="year"] svg`, props: ["width", "height", "transform", "transition-duration", "transition-property"] },
  "Weekday label (SU)": { sel: `${DIALOG} .grid-cols-7 > div:first-child`, props: ["height", "font-size", "font-weight", "color", "text-transform"] },
  "Day grid": { sel: `${DIALOG} .grid-cols-7:last-child`, props: ["height", "animation-name", "animation-duration", "animation-timing-function"] },
};

const rangeMeasure = {
  ...calendarMeasure,
  "Cell Oct 1 (range start, Thu)": { sel: cell(1), props: ["height", "width", "position", "background-color", "border-radius"] },
  "Cell Oct 1 ::before (band)": { sel: `${cell(1)}::before`, props: BAND },
  "Circle Oct 1 (range start)": { sel: sep(1), props: [...CIRCLE, "width", "height"] },
  "Cell Oct 2 (in range)": { sel: cell(2), props: ["height", "background-color", "border-radius"] },
  "Cell Oct 2 ::before (band)": { sel: `${cell(2)}::before`, props: BAND },
  "Cell Oct 3 (in range, Sat = row end)": { sel: cell(3), props: ["height", "background-color", "border-radius"] },
  "Cell Oct 3 ::before (band)": { sel: `${cell(3)}::before`, props: BAND },
  "Cell Oct 4 (in range, Sun = row start, today)": { sel: cell(4), props: ["height", "background-color", "border-radius"] },
  "Cell Oct 4 ::before (band)": { sel: `${cell(4)}::before`, props: BAND },
  "Circle Oct 4 (today, in range)": { sel: sep(4), props: [...CIRCLE, "width", "height"] },
  "Cell Oct 7 ::before (band, range end)": { sel: `${cell(7)}::before`, props: BAND },
  "Circle Oct 7 (range end)": { sel: sep(7), props: [...CIRCLE, "width", "height"] },
  "Circle Oct 20 (outside range)": { sel: sep(20), props: [...CIRCLE, "width", "height", ...MOTION] },
};

const previewMeasure = {
  "Cell Oct 12 (preview start, Mon) ::before": { sel: `${cell(12)}::before`, props: BAND },
  "Circle Oct 12 (first click)": { sel: sep(12), props: CIRCLE },
  "Cell Oct 14 (preview middle) ::before": { sel: `${cell(14)}::before`, props: BAND },
  "Cell Oct 17 (preview, Sat = row end) ::before": { sel: `${cell(17)}::before`, props: BAND },
  "Cell Oct 18 (preview, Sun = row start) ::before": { sel: `${cell(18)}::before`, props: BAND },
  "Cell Oct 20 (hovered end) ::before": { sel: `${cell(20)}::before`, props: BAND },
  "Circle Oct 20 (hovered end)": { sel: sep(20), props: CIRCLE },
  "Cell Oct 22 (beyond hover) ::before": { sel: `${cell(22)}::before`, props: BAND },
};

const open = [PSEUDO, { click: TRIGGER }];
// Presses Tab once so the page is in keyboard modality; script focus() afterwards then matches :focus-visible.
const keyboard = [...open, { key: "Tab" }];

export default [
  { name: "01-closed", story: S("overview"), height: 300, steps: [PSEUDO], measure: { "Trigger": { sel: TRIGGER, props: ["height", "border-radius", "background-color", "border-top-color", "box-shadow"] } } },
  { name: "02-open-range", story: S("overview"), steps: [...open, { wait: 300 }], measure: rangeMeasure },
  { name: "03-preview-forward", story: S("overview"), steps: [...open, { click: sep(12) }, { hover: sep(20) }, { wait: 300 }], measure: previewMeasure },
  { name: "04-preview-backward", story: S("overview"), steps: [...open, { click: sep(20) }, { hover: sep(12) }, { wait: 300 }], measure: { "Cell Oct 12 (hovered start) ::before": { sel: `${cell(12)}::before`, props: BAND }, "Circle Oct 12 (hovered, earlier)": { sel: sep(12), props: CIRCLE }, "Circle Oct 20 (first click)": { sel: sep(20), props: CIRCLE }, "Cell Oct 20 ::before": { sel: `${cell(20)}::before`, props: BAND } } },
  { name: "05-first-click-only", story: S("overview"), steps: [...open, { click: sep(12) }, { wait: 300 }], measure: { "Cell Oct 14 ::before (no preview without hover)": { sel: `${cell(14)}::before`, props: BAND }, "Circle Oct 12 (first click)": { sel: sep(12), props: CIRCLE } } },
  { name: "06-preset-selected-custom", story: S("custom-presets"), steps: [...open, { wait: 300 }], measure: { "Preset: October launch (matches value)": { sel: `${DIALOG} > div > div:first-child > button:nth-child(1)`, props: [...BOX, "outline-style"] }, "Preset: October review": { sel: `${DIALOG} > div > div:first-child > button:nth-child(2)`, props: [...BOX, "outline-style"] } } },
  { name: "07-preset-last7-reopened", story: S("overview"), steps: [PSEUDO, { click: TRIGGER }, { clickText: "Last 7 days", within: DIALOG }, { wait: 300 }, { click: TRIGGER }, { wait: 300 }], measure: { "Cell Sep 28 (range start, Mon) ::before": { sel: `div:has(> button[aria-label="September 28, 2026"])::before`, props: BAND }, "Cell Oct 3 (Sat = row end) ::before": { sel: `div:has(> button[aria-label="October 3, 2026"])::before`, props: BAND }, "Cell Oct 4 (range end, Sun = row start) ::before": { sel: `div:has(> button[aria-label="October 4, 2026"])::before`, props: BAND }, "Preset: Last 7 days (selected)": { sel: `${DIALOG} > div > div:first-child > button:nth-child(3)`, props: [...BOX, "outline-style", ...MOTION] }, "Preset: Today": { sel: `${DIALOG} > div > div:first-child > button:nth-child(1)`, props: BOX } } },
  { name: "08-day-hover", story: S("overview"), steps: [...open, { hover: sep(20) }, { wait: 300 }], measure: { "Circle Oct 20 (hovered)": { sel: sep(20), props: [...CIRCLE, ...MOTION] } } },
  { name: "09-focus-day", story: S("overview"), steps: [...keyboard, { focus: sep(14) }, { wait: 250 }], measure: { "Circle Oct 14 (keyboard focus)": { sel: sep(14), props: [...CIRCLE, "position"] } } },
  { name: "10-focus-next", story: S("overview"), steps: [...keyboard, { focus: `${DIALOG} button[aria-label="Next month"]` }, { wait: 250 }], measure: { "Next month button (keyboard focus)": { sel: `${DIALOG} button[aria-label="Next month"]`, props: [...BOX, "outline-style", "outline-width", "outline-offset", "outline-color"] } } },
  { name: "11-focus-preset", story: S("overview"), steps: [...keyboard, { focus: `${DIALOG} > div > div:first-child > button:nth-child(2)` }, { wait: 250 }], measure: { "Preset: Yesterday (keyboard focus)": { sel: `${DIALOG} > div > div:first-child > button:nth-child(2)`, props: [...BOX, "outline-style", "outline-width", "outline-offset", "outline-color"] } } },
  { name: "12-month-menu-open", story: S("overview"), steps: [...open, { click: `${DIALOG} button[data-calendar-menu="month"]` }, { wait: 400 }], measure: { "Month pill (menu open)": { sel: `${DIALOG} button[data-calendar-menu="month"]`, props: [...BOX, ...MOTION] }, "Month pill chevron (menu open)": { sel: `${DIALOG} button[data-calendar-menu="month"] svg`, props: ["transform", "transition-duration"] }, "Year pill chevron": { sel: `${DIALOG} button[data-calendar-menu="year"] svg`, props: ["transform"] } } },
  { name: "13-year-menu-open", story: S("overview"), steps: [...open, { click: `${DIALOG} button[data-calendar-menu="year"]` }, { wait: 400 }], measure: { "Year pill chevron (menu open)": { sel: `${DIALOG} button[data-calendar-menu="year"] svg`, props: ["transform", "transition-duration"] } } },
  { name: "14-narrow-360", story: S("overview"), width: 360, height: 900, steps: [...open, { wait: 300 }], measure: { "Presets column (mobile)": { sel: `${DIALOG} > div > div:first-child`, props: ["width", "padding", "gap", "border-bottom-width", "overflow-x"] }, "Prev month button (mobile)": { sel: `${DIALOG} button[aria-label="Previous month"]`, props: ["width", "height", "border-radius"] }, "Month pill (mobile)": { sel: `${DIALOG} button[data-calendar-menu="month"]`, props: ["height", "border-radius"] }, "Weekday label (mobile)": { sel: `${DIALOG} .grid-cols-7 > div:first-child`, props: ["height"] }, "Cell Oct 1 (mobile)": { sel: cell(1), props: ["width", "height"] }, "Cell Oct 1 ::before (mobile band)": { sel: `${cell(1)}::before`, props: ["top", "bottom", "height", "border-top-left-radius", "background-color"] }, "Circle Oct 1 (mobile)": { sel: sep(1), props: ["width", "height"] }, "Circle Oct 20 (mobile)": { sel: sep(20), props: ["width", "height"] } } },
  { name: "15-narrow-360-preview", story: S("overview"), width: 360, height: 900, steps: [...open, { click: sep(12) }, { hover: sep(21) }, { wait: 300 }], measure: { "Cell Oct 14 ::before (mobile preview)": { sel: `${cell(14)}::before`, props: ["top", "bottom", "height", "border-top-style", "border-top-width", "background-color"] } } },
  { name: "16-error-closed", story: S("error"), height: 300, steps: [PSEUDO], measure: { "Trigger (error)": { sel: TRIGGER, props: ["border-top-color", "box-shadow", "height"] } } },
  { name: "17-disabled-closed", story: S("disabled"), height: 300, steps: [PSEUDO], measure: { "Trigger (disabled)": { sel: TRIGGER, props: ["background-color", "border-top-color", "opacity"] } } },
  { name: "18-empty-open", story: S("empty"), steps: [...open, { wait: 300 }], measure: { "Preset: Today": { sel: `${DIALOG} > div > div:first-child > button:nth-child(1)`, props: BOX } } },
  { name: "19-partial-range-open", story: S("partial-range"), steps: [...open, { wait: 300 }], measure: { "Circle Oct 1 (start only)": { sel: sep(1), props: CIRCLE }, "Cell Oct 1 ::before (no band for a single day)": { sel: `${cell(1)}::before`, props: BAND } } },
  { name: "20-no-presets-open", story: S("no-presets"), steps: [...open, { wait: 300 }], measure: { "Popover": { sel: DIALOG, props: ["width", "border-radius"] } } },
];
