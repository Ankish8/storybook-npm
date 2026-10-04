// Select (Radix): trigger "open" hold, row radius, keyboard ring, check pop.
const TRIG = ["background-color", "border-top-color", "border-top-width", "border-radius", "box-shadow", "height", "transition-property", "transition-duration"];
const CHEV = ["transform", "transition-duration", "transition-timing-function"];
const PANEL = ["border-radius", "padding", "box-shadow", "transform-origin"];
const VIEWPORT = ["padding"];
const ROW = ["background-color", "color", "border-radius", "box-shadow", "padding-left", "padding-right", "min-height", "font-weight"];
const CHECK = ["opacity", "color", "animation-name", "animation-duration", "animation-timing-function"];
const T = "button[role=combobox]";
const measure = {
  Trigger: { sel: T, props: TRIG },
  Chevron: { sel: `${T} svg`, props: CHEV },
  Panel: { sel: "[role=listbox]", props: PANEL },
  "Panel padding (viewport)": { sel: "[data-select-viewport]", props: VIEWPORT },
  "Row (first)": { sel: "[role=option]", props: ROW },
  "Row (highlighted)": { sel: "[role=option][data-highlighted]", props: ROW },
  "Row (selected)": { sel: "[role=option][data-state=checked]", props: ROW },
  "Check icon (selected row)": { sel: "[role=option][data-state=checked] svg", props: CHECK },
};
const open = [{ click: T }];
export default [
  { name: "01-closed", story: "v2-components-select--overview", measure },
  { name: "02-open", story: "v2-components-select--overview", steps: open, measure },
  { name: "03-hover-row", story: "v2-components-select--overview", steps: [...open, { hoverText: "Bearer Token", within: "[role=listbox]" }], measure },
  { name: "04-keyboard-row", story: "v2-components-select--overview", steps: [{ key: "Tab" }, { key: "ArrowDown" }, { key: "ArrowDown" }], measure },
  { name: "05-keyboard-open-then-hover", story: "v2-components-select--overview", steps: [{ key: "Tab" }, { key: "ArrowDown" }, { hoverText: "OAuth 2.0", within: "[role=listbox]" }], measure },
  { name: "06-selected-row", story: "v2-components-select--with-selected-value", steps: open, measure },
  { name: "07-error", story: "v2-components-select--error", measure },
  { name: "08-error-open", story: "v2-components-select--error", steps: open, measure },
  { name: "09-disabled", story: "v2-components-select--disabled", measure },
  { name: "10-long-labels", story: "v2-components-select--long-option", steps: open, measure },
  { name: "11-empty", story: "v2-components-select--empty-options", steps: open, measure },
  { name: "12-narrow", story: "v2-components-select--long-option", width: 340, height: 700, steps: open, measure },
  { name: "13-groups", story: "v2-components-select--with-groups", steps: open, measure },
];
