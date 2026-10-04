// MultiSelect: trigger "open" hold, chevron, check pop, origin-aware panel (flip), chip remove / clear hit area + hover plate.
const TRIG = ["background-color", "border-top-color", "border-top-width", "border-radius", "box-shadow", "min-height", "transition-duration"];
const CHEV = ["transform", "transition-duration", "transition-timing-function"];
const PANEL = ["border-radius", "box-shadow", "transform-origin"];
const ROW = ["background-color", "color", "border-radius", "box-shadow", "padding-left", "padding-right", "font-weight"];
const CHECK = ["opacity", "animation-name", "animation-duration", "animation-timing-function"];
const CHIP = ["background-color", "border-radius", "padding-left", "padding-right", "height"];
const X_BTN = ["background-color", "color", "border-radius", "cursor", "transition-property", "transition-duration"];
const X_ICON = ["width", "height", "color"];
const T = "button[role=combobox]";
const measure = {
  Trigger: { sel: T, props: TRIG },
  Chevron: { sel: `${T} svg.lucide-chevron-down`, props: CHEV },
  Panel: { sel: "[role=listbox]", props: PANEL },
  "Row (first)": { sel: "[role=option]", props: ROW },
  "Row (selected)": { sel: "[role=option][aria-selected=true]", props: ROW },
  "Check icon (selected row)": { sel: "[role=option][aria-selected=true] svg", props: CHECK },
  "Chip (first)": { sel: `${T} > div:first-child > span`, props: CHIP },
  "Chip remove (first)": { sel: `${T} span[aria-label^="Remove"]`, props: X_BTN },
  "Chip remove icon": { sel: `${T} span[aria-label^="Remove"] svg`, props: X_ICON },
  "Clear all": { sel: `${T} span[aria-label="Clear all"]`, props: X_BTN },
  "Clear all icon": { sel: `${T} span[aria-label="Clear all"] svg`, props: X_ICON },
};
const open = [{ click: T }];
// Storybook URL args do not take arrays reliably; push them through the preview channel instead.
const setArgs = (id, args) => ({ eval: `(window.__STORYBOOK_ADDONS_CHANNEL__.emit('updateStoryArgs', { storyId: '${id}', updatedArgs: ${JSON.stringify(args)} }), 1)`, after: 600 });
const MANY_VALUES = ["react", "typescript", "node", "python", "design", "research"];
const manyChips = setArgs("v2-components-multiselect--with-tags", { value: MANY_VALUES });
const manyChipsNarrow = setArgs("v2-components-multiselect--with-tags", { value: MANY_VALUES, width: 280 });
const lowTrigger = { eval: "document.querySelector('#storybook-root').style.paddingTop='520px'; 0" };
const side = { eval: "document.querySelector('[role=listbox]') && [document.querySelector('[role=listbox]').getAttribute('data-side'), document.querySelector('[role=listbox]').style.transformOrigin, getComputedStyle(document.querySelector('[role=listbox]')).transformOrigin].join(' | ')" };
export default [
  { name: "01-closed", story: "v2-components-multiselect--default", measure },
  { name: "02-open", story: "v2-components-multiselect--default", steps: open, measure },
  { name: "03-hover-row", story: "v2-components-multiselect--default", steps: [...open, { hoverText: "Node.js", within: "[role=listbox]" }, { eval: "(() => { const r = document.querySelector('[role=option]:hover'); return r && ['hovered row:', r.textContent.trim().slice(0, 24), 'box-shadow=' + getComputedStyle(r).boxShadow.slice(-40), 'bg=' + getComputedStyle(r).backgroundColor].join(' | '); })()" }], measure },
  { name: "04-keyboard-row", story: "v2-components-multiselect--default", steps: [{ key: "Tab" }, { key: "Enter" }, { key: "Tab" }], measure },
  { name: "05-chips-open-selected", story: "v2-components-multiselect--with-tags", steps: open, measure },
  { name: "06-chips-hover-remove", story: "v2-components-multiselect--with-tags", steps: [{ hover: `${T} span[aria-label="Remove React"]` }], measure },
  { name: "07-chips-hover-clear", story: "v2-components-multiselect--with-tags", steps: [{ hover: `${T} span[aria-label="Clear all"]` }], measure },
  { name: "08-many-chips", story: "v2-components-multiselect--with-tags", width: 420, steps: [manyChips], measure },
  { name: "09-many-chips-narrow", story: "v2-components-multiselect--with-tags", width: 340, height: 700, steps: [manyChipsNarrow], measure },
  { name: "10-long-labels", story: "v2-components-multiselect--long-option-labels", steps: open, measure },
  { name: "11-error", story: "v2-components-multiselect--error", measure },
  { name: "12-error-open", story: "v2-components-multiselect--error", steps: open, measure },
  { name: "13-disabled", story: "v2-components-multiselect--disabled", measure },
  { name: "14-search-empty-result", story: "v2-components-multiselect--searchable", steps: [...open, { click: "[role=listbox] input" }, { type: "zzzz" }], measure },
  { name: "15-detailed-rows", story: "v2-components-multiselect--detailed-whats-app-style", steps: open, measure },
  { name: "16-narrow", story: "v2-components-multiselect--long-option-labels", width: 340, height: 700, steps: open, measure },
  { name: "17-flipped-top", story: "v2-components-multiselect--default", width: 700, height: 800, steps: [lowTrigger, ...open, { wait: 400 }, side], measure },
];
