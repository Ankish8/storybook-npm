// SelectField (Select + label/search/helper): trigger "open" hold, row radius, keyboard ring, check pop.
const TRIG = ["background-color", "border-top-color", "border-top-width", "border-radius", "box-shadow", "height", "transition-duration"];
const CHEV = ["transform", "transition-duration", "transition-timing-function"];
const PANEL = ["border-radius", "box-shadow", "transform-origin"];
const ROW = ["background-color", "color", "border-radius", "box-shadow", "padding-left", "padding-right", "min-height", "font-weight"];
const CHECK = ["opacity", "animation-name", "animation-duration", "animation-timing-function"];
const GROUP_LABEL = ["font-size", "font-weight", "color", "padding-left", "padding-top"];
const T = "button[role=combobox]";
const measure = {
  Trigger: { sel: T, props: TRIG },
  Chevron: { sel: `${T} svg`, props: CHEV },
  Panel: { sel: "[role=listbox]", props: PANEL },
  "Row (first)": { sel: "[role=option]", props: ROW },
  "Row (highlighted)": { sel: "[role=option][data-highlighted]", props: ROW },
  "Row (selected)": { sel: "[role=option][data-state=checked]", props: ROW },
  "Check icon (selected row)": { sel: "[role=option][data-state=checked] svg", props: CHECK },
  "Group label": { sel: "[role=listbox] [role=group] > div", props: GROUP_LABEL },
};
const open = [{ click: T }];
export default [
  { name: "01-closed", story: "v2-components-selectfield--default", measure },
  { name: "02-open", story: "v2-components-selectfield--default", steps: open, measure },
  { name: "03-hover-row", story: "v2-components-selectfield--default", steps: [...open, { hoverText: "Bearer Token", within: "[role=listbox]" }], measure },
  { name: "04-keyboard-row", story: "v2-components-selectfield--default", steps: [{ key: "Tab" }, { key: "ArrowDown" }, { key: "ArrowDown" }], measure },
  { name: "05-selected-row", story: "v2-components-selectfield--default", steps: [...open, { clickText: "Bearer Token", within: "[role=listbox]" }, ...open], measure },
  { name: "06-error", story: "v2-components-selectfield--error", measure },
  { name: "07-error-open", story: "v2-components-selectfield--error", steps: open, measure },
  { name: "08-disabled", story: "v2-components-selectfield--disabled", measure },
  { name: "09-searchable-open", story: "v2-components-selectfield--searchable", steps: open, measure },
  { name: "10-search-empty-result", story: "v2-components-selectfield--searchable", steps: [...open, { click: "[role=listbox] input" }, { type: "zzzz" }], measure },
  { name: "11-long-labels", story: "v2-components-selectfield--long-option", steps: open, measure },
  { name: "12-empty-options", story: "v2-components-selectfield--empty-state", steps: open, measure },
  { name: "13-groups", story: "v2-components-selectfield--with-groups", steps: open, measure },
  { name: "14-narrow", story: "v2-components-selectfield--long-option", width: 340, height: 700, steps: open, measure },
];
