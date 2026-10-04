// CreatableSelect: trigger "open" hold, chevron, row radius, keyboard ring, check pop. Panel is CSS-anchored (no flip) so origin stays top-left.
const TRIG = ["background-color", "border-top-color", "border-top-width", "border-radius", "box-shadow", "height", "transition-duration"];
const CHEV = ["transform", "transition-duration", "transition-timing-function"];
const PANEL = ["border-radius", "box-shadow", "transform-origin"];
const ROW = ["background-color", "color", "border-radius", "box-shadow", "padding-left", "padding-right", "font-weight"];
const CHECK = ["opacity", "animation-name", "animation-duration", "animation-timing-function"];
const CLOSED = "button[aria-haspopup=listbox]";
const OPEN = "div:has(> input[role=combobox])";
const measure = {
  "Trigger (closed)": { sel: CLOSED, props: TRIG },
  "Trigger (open)": { sel: OPEN, props: TRIG },
  "Chevron (closed)": { sel: `${CLOSED} svg`, props: CHEV },
  "Chevron (open)": { sel: `${OPEN} svg`, props: CHEV },
  Panel: { sel: "div.top-full", props: PANEL },
  "Row (first)": { sel: "[role=option]", props: ROW },
  "Row (second)": { sel: "[role=option]:nth-child(2)", props: ROW },
  "Row (selected)": { sel: "[role=option][aria-selected=true]", props: ROW },
  "Check icon (selected row)": { sel: "[role=option][aria-selected=true] svg", props: CHECK },
  "Create row": { sel: "[role=option]:last-child", props: ROW },
};
const open = [{ click: CLOSED }];
export default [
  { name: "01-closed", story: "v2-components-creatableselect--default", measure },
  { name: "02-open", story: "v2-components-creatableselect--default", steps: open, measure },
  { name: "03-hover-row", story: "v2-components-creatableselect--default", steps: [...open, { hoverText: "Technical Support", within: "[role=listbox]" }, { eval: "(() => { const r = document.querySelector('[role=option]:hover'); return r && ['hovered row:', r.textContent.trim().slice(0, 24), 'box-shadow=' + getComputedStyle(r).boxShadow.slice(-40), 'bg=' + getComputedStyle(r).backgroundColor].join(' | '); })()" }], measure },
  { name: "04-keyboard-row", story: "v2-components-creatableselect--default", steps: [...open, { key: "ArrowDown", repeat: 2 }], measure },
  { name: "04b-keyboard-then-hover", story: "v2-components-creatableselect--default", steps: [...open, { key: "ArrowDown", repeat: 2 }, { hoverText: "Billing Enquiry Agent", within: "[role=listbox]" }, { eval: "(() => { const r = document.querySelector('[role=option]:hover'); return r && ['hovered row:', r.textContent.trim().slice(0, 24), 'box-shadow=' + getComputedStyle(r).boxShadow.slice(-40), 'bg=' + getComputedStyle(r).backgroundColor].join(' | '); })()" }], measure },
  { name: "05-selected-row", story: "v2-components-creatableselect--with-preselected-value", steps: open, measure },
  { name: "06-create-row", story: "v2-components-creatableselect--default", steps: [...open, { type: "Chief" }, { key: "ArrowDown" }], measure },
  { name: "07-error", story: "v2-components-creatableselect--error-state", measure },
  { name: "08-error-open", story: "v2-components-creatableselect--error-state", steps: open, measure },
  { name: "09-disabled", story: "v2-components-creatableselect--disabled", measure },
  { name: "10-disabled-option", story: "v2-components-creatableselect--with-disabled-options", steps: open, measure },
  { name: "11-empty-options", story: "v2-components-creatableselect--empty-options", steps: open, measure },
  { name: "12-search-empty-result", story: "v2-components-creatableselect--default", steps: [...open, { type: "zzzz" }], measure },
  { name: "13-narrow", story: "v2-components-creatableselect--with-preselected-value", width: 340, height: 700, steps: [...open, { type: "Customer Support Agent" }], measure },
];
