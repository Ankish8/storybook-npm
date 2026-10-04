/**
 * DateTimePicker before/after scenarios (design/verify/capture.mjs).
 * Today in the capture machine is 2026-10-04; the Overview value is 2026-10-07 10:30 AM, so the calendar opens on
 * October 2026 with the selected day (7) and the today marker (4) both visible.
 *
 * Pseudo-element measurement patch: see date-range-picker/scenarios.mjs (the capture tool reads getComputedStyle(el) only).
 */
const PSEUDO = {
  eval: `(() => { const base = window.__measure; window.__measure = (sel, props) => { const i = sel.indexOf("::"); if (i < 0) return base(sel, props); const e = document.querySelector(sel.slice(0, i)); if (!e) return null; const s = getComputedStyle(e, sel.slice(i)); const o = {}; for (const p of props) o[p] = s.getPropertyValue(p); return o; }; return true; })()`,
};

const S = (name) => `v2-components-datetimepicker--${name}`;
const CAL = 'button[aria-label="Open calendar"]';
const DIALOG = '[role="dialog"]';
const day = (d) => `${DIALOG} button[aria-label="October ${d}, 2026"]`;

const BOX = ["border-radius", "background-color", "color", "border-top-width", "border-top-color", "padding", "font-size", "font-weight", "line-height", "box-shadow", "opacity"];
const MOTION = ["transition-duration", "transition-property", "animation-name", "animation-duration"];
const FOCUS = ["outline-style", "outline-width", "outline-offset", "outline-color", "z-index"];
const LIST = ["max-height", "overflow-y", "padding-top", "padding-bottom", "-webkit-mask-image", "mask-image", "scroll-snap-type"];
const ROW = ["height", "min-height", "font-size", "font-weight", "background-color", "color", "border-top-color", "border-radius", "scroll-snap-align"];

const calendarMeasure = {
  "Popover": { sel: DIALOG, props: ["width", "border-radius", "box-shadow", "animation-name", "animation-duration"] },
  "Prev month button": { sel: `${DIALOG} button[aria-label="Previous month"]`, props: [...BOX, ...FOCUS, ...MOTION] },
  "Next month button": { sel: `${DIALOG} button[aria-label="Next month"]`, props: [...BOX, ...FOCUS, ...MOTION] },
  "Prev month icon": { sel: `${DIALOG} button[aria-label="Previous month"] svg`, props: ["width", "height"] },
  "Month pill": { sel: `${DIALOG} button[role="combobox"][aria-label="Month"]`, props: [...BOX, "height", "min-width", "display", "gap", ...MOTION] },
  "Month pill chevron": { sel: `${DIALOG} button[role="combobox"][aria-label="Month"] svg`, props: ["width", "height", "transform", "transition-duration", "transition-property"] },
  "Year pill": { sel: `${DIALOG} button[role="combobox"][aria-label="Year"]`, props: [...BOX, "height", "min-width", "display", "gap", ...MOTION] },
  "Year pill chevron": { sel: `${DIALOG} button[role="combobox"][aria-label="Year"] svg`, props: ["width", "height", "transform", "transition-duration", "transition-property"] },
  "Weekday label (first)": { sel: `${DIALOG} .grid-cols-7 > div:first-child`, props: ["width", "height", "font-size", "font-weight", "color", "text-transform"] },
  "Day grid": { sel: `${DIALOG} .grid-cols-7:last-child`, props: ["height", "animation-name", "animation-duration", "animation-timing-function"] },
  "Day Oct 7 (selected)": { sel: day(7), props: [...BOX, "width", "height", ...FOCUS] },
  "Day Oct 4 (today)": { sel: day(4), props: [...BOX, "width", "height", "--tw-ring-shadow", ...MOTION] },
  "Day Oct 4 today dot": { sel: `${day(4)} span`, props: ["width", "height", "background-color", "border-radius", "bottom", "position"] },
  "Day Oct 20 (plain)": { sel: day(20), props: [...BOX, "width", "height", ...MOTION] },
  "Day Oct 1 (Thu)": { sel: day(1), props: ["width", "height"] },
};

const timeListMeasure = (label) => ({
  "Time dropdown panel": { sel: `[role="listbox"][aria-label="${label} options"]`, props: ["width", "border-radius", "box-shadow", "animation-name"] },
  "Hours column list": { sel: `[role="listbox"][aria-label="${label} hours"]`, props: [...LIST, "height", "gap"] },
  "Hours selected row": { sel: `[role="listbox"][aria-label="${label} hours"] [aria-selected="true"]`, props: ROW },
  "Hours unselected row": { sel: `[role="listbox"][aria-label="${label} hours"] [aria-selected="false"]`, props: ROW },
  "Minutes column list": { sel: `[role="listbox"][aria-label="${label} minutes"]`, props: [...LIST, "height"] },
  "Minutes selected row": { sel: `[role="listbox"][aria-label="${label} minutes"] [aria-selected="true"]`, props: ROW },
  "AM/PM column list": { sel: `[role="listbox"][aria-label="${label} meridiem"]`, props: [...LIST, "height"] },
  "AM/PM selected row": { sel: `[role="listbox"][aria-label="${label} meridiem"] [aria-selected="true"]`, props: ROW },
});

// Distance between the selected row's centre and its list's centre (0 = centred) plus the first row's visible fraction.
const centreProbe = (label, col) => ({
  eval: `(() => { const l = document.querySelector('[role="listbox"][aria-label="${label} ${col}"]'); if (!l) return null; const s = l.querySelector('[aria-selected="true"]'); const f = l.querySelector('[role="option"]'); const lr = l.getBoundingClientRect(), sr = s.getBoundingClientRect(), fr = f.getBoundingClientRect(); const visibleTop = Math.max(fr.top, lr.top), visibleBottom = Math.min(fr.bottom, lr.bottom); return { col: "${col}", scrollTop: l.scrollTop, scrollHeight: l.scrollHeight, clientHeight: l.clientHeight, selectedCentreOffset: +((sr.top + sr.height / 2) - (lr.top + lr.height / 2)).toFixed(1), firstRowVisibleFraction: +(Math.max(0, visibleBottom - visibleTop) / fr.height).toFixed(2), selectedLabel: s.textContent }; })()`,
});

const openCal = [PSEUDO, { click: CAL }];
const keyboard = [...openCal, { key: "Tab" }];
const startTime = 'button[aria-label="Start Time"]';
const endTime = 'button[aria-label="End Time"]';

export default [
  { name: "01-closed", story: S("overview"), height: 320, steps: [PSEUDO], measure: { "Input row": { sel: '#storybook-root [aria-haspopup="dialog"]', props: ["height", "border-radius"] }, "Open calendar icon button": { sel: CAL, props: [...BOX, ...FOCUS, ...MOTION] } } },
  { name: "02-calendar-open", story: S("overview"), steps: [...openCal, { wait: 300 }], measure: calendarMeasure },
  { name: "03-day-hover", story: S("overview"), steps: [...openCal, { hover: day(20) }, { wait: 300 }], measure: { "Day Oct 20 (hovered)": { sel: day(20), props: [...BOX, ...MOTION] } } },
  { name: "04-focus-day", story: S("overview"), steps: [...keyboard, { focus: day(14) }, { wait: 250 }], measure: { "Day Oct 14 (keyboard focus)": { sel: day(14), props: [...BOX, ...FOCUS, "position"] } } },
  { name: "05-focus-next", story: S("overview"), steps: [...keyboard, { focus: `${DIALOG} button[aria-label="Next month"]` }, { wait: 250 }], measure: { "Next month button (keyboard focus)": { sel: `${DIALOG} button[aria-label="Next month"]`, props: [...BOX, ...FOCUS] } } },
  { name: "06-month-menu-open", story: S("overview"), steps: [...openCal, { click: `${DIALOG} button[role="combobox"][aria-label="Month"]` }, { wait: 400 }], measure: { "Month pill (menu open)": { sel: `${DIALOG} button[role="combobox"][aria-label="Month"]`, props: [...BOX, "height"] }, "Month pill chevron (menu open)": { sel: `${DIALOG} button[role="combobox"][aria-label="Month"] svg`, props: ["transform", "width", "transition-duration"] }, "Year pill chevron": { sel: `${DIALOG} button[role="combobox"][aria-label="Year"] svg`, props: ["transform"] } } },
  { name: "07-time-open-start", story: S("overview"), height: 900, steps: [...openCal, { click: startTime }, { wait: 500 }, centreProbe("Start Time", "hours"), centreProbe("Start Time", "minutes"), centreProbe("Start Time", "meridiem")], measure: timeListMeasure("Start Time") },
  { name: "08-time-open-empty-top-row", story: S("empty"), height: 900, steps: [...openCal, { click: startTime }, { wait: 500 }, centreProbe("Start Time", "hours"), centreProbe("Start Time", "minutes"), centreProbe("Start Time", "meridiem")], measure: { "Minutes column list": { sel: '[role="listbox"][aria-label="Start Time minutes"]', props: [...LIST, "height"] }, "Minutes selected row (00)": { sel: '[role="listbox"][aria-label="Start Time minutes"] [aria-selected="true"]', props: ["height", "background-color", "font-weight"] } } },
  { name: "09-time-open-seconds", story: S("with-seconds"), height: 900, steps: [...openCal, { click: startTime }, { wait: 500 }, centreProbe("Start Time", "seconds")], measure: { "Time dropdown panel (4 columns)": { sel: '[role="listbox"][aria-label="Start Time options"]', props: ["width", "grid-template-columns"] }, "Seconds column list": { sel: '[role="listbox"][aria-label="Start Time seconds"]', props: [...LIST, "height"] } } },
  { name: "10-time-only-range-end-open", story: S("time-range"), height: 700, steps: [PSEUDO, { click: 'button[aria-label="Open time picker"]' }, { click: endTime }, { wait: 500 }, centreProbe("End Time", "hours")], measure: timeListMeasure("End Time") },
  { name: "11-time-row-hover", story: S("overview"), height: 900, steps: [...openCal, { click: startTime }, { wait: 300 }, { hover: '[role="listbox"][aria-label="Start Time hours"] [role="option"]:nth-child(5)' }, { wait: 300 }], measure: { "Hours row (hovered)": { sel: '[role="listbox"][aria-label="Start Time hours"] [role="option"]:nth-child(5)', props: ROW } } },
  { name: "12-time-row-focus", story: S("overview"), height: 900, steps: [...keyboard, { click: startTime }, { key: "Tab" }, { focus: '[role="listbox"][aria-label="Start Time hours"] [role="option"]:nth-child(5)' }, { wait: 250 }], measure: { "Hours row (keyboard focus)": { sel: '[role="listbox"][aria-label="Start Time hours"] [role="option"]:nth-child(5)', props: [...ROW, ...FOCUS] } } },
  { name: "13-narrow-360", story: S("overview"), width: 360, height: 900, steps: [...openCal, { wait: 300 }], measure: { "Popover": { sel: DIALOG, props: ["width"] }, "Prev month button (mobile)": { sel: `${DIALOG} button[aria-label="Previous month"]`, props: ["width", "height", "border-radius"] }, "Month pill (mobile)": { sel: `${DIALOG} button[role="combobox"][aria-label="Month"]`, props: ["height", "border-radius"] }, "Day Oct 7 (mobile)": { sel: day(7), props: ["width", "height"] }, "Day Oct 20 (mobile)": { sel: day(20), props: ["width", "height"] }, "Weekday label (mobile)": { sel: `${DIALOG} .grid-cols-7 > div:first-child`, props: ["height", "width"] } } },
  { name: "14-narrow-360-time-open", story: S("overview"), width: 360, height: 900, steps: [...openCal, { click: startTime }, { wait: 500 }], measure: { "Time dropdown panel (mobile)": { sel: '[role="listbox"][aria-label="Start Time options"]', props: ["width"] } } },
  { name: "15-error-closed", story: S("error"), height: 320, steps: [PSEUDO], measure: { "Input row (error)": { sel: '#storybook-root [aria-haspopup="dialog"]', props: ["border-top-color"] } } },
  { name: "16-disabled-closed", story: S("disabled"), height: 320, steps: [PSEUDO], measure: { "Open calendar icon button (disabled)": { sel: CAL, props: [...BOX, "cursor"] } } },
  { name: "17-empty-open", story: S("empty"), steps: [...openCal, { wait: 300 }], measure: { "Day Oct 4 (today, none selected)": { sel: day(4), props: [...BOX] } } },
  { name: "18-date-only-open", story: S("date-only"), steps: [...openCal, { wait: 300 }], measure: { "Popover": { sel: DIALOG, props: ["width", "height"] } } },
  { name: "19-time-only-open", story: S("time-only"), height: 700, steps: [PSEUDO, { click: 'button[aria-label="Open time picker"]' }, { click: startTime }, { wait: 500 }], measure: timeListMeasure("Start Time") },
  { name: "20-date-bounds-open", story: S("date-bounds"), steps: [...openCal, { wait: 300 }], measure: { "Day Oct 2 (disabled, before min)": { sel: day(2), props: [...BOX, "cursor"] } } },
];
