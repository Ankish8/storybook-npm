// CreatableMultiSelect: trigger "open" hold, chevron, chip remove hit area + hover plate, chip enter. Panel is CSS-anchored (no flip).
const TRIG = ["background-color", "border-top-color", "border-top-width", "border-radius", "box-shadow", "min-height", "transition-duration"];
const CHEV = ["transform", "transition-duration", "transition-timing-function"];
const PANEL = ["border-radius", "box-shadow", "transform-origin"];
const CHIP = ["background-color", "border-radius", "padding-left", "padding-right", "height"];
const X_BTN = ["background-color", "color", "border-radius", "cursor", "transition-property", "transition-duration"];
const X_ICON = ["width", "height", "color"];
const PRESET = ["background-color", "border-radius", "color", "box-shadow"];
const CREATE = ["background-color", "border-radius", "color"];
const CLOSED = "[role=combobox][aria-expanded=false]";
const OPEN = "div:has(> div > input[role=combobox])";
const measure = {
  "Trigger (closed)": { sel: CLOSED, props: TRIG },
  "Trigger (open)": { sel: OPEN, props: TRIG },
  "Chevron (closed)": { sel: `${CLOSED} > svg`, props: CHEV },
  "Chevron (open)": { sel: `${OPEN} > svg`, props: CHEV },
  Panel: { sel: "div.top-full", props: PANEL },
  "Chip (first)": { sel: "span.inline-flex:has(> button[data-chip-remove])", props: CHIP },
  "Chip remove (first)": { sel: "button[data-chip-remove]", props: X_BTN },
  "Chip remove icon": { sel: "button[data-chip-remove] svg", props: X_ICON },
  "Preset option (first)": { sel: "[role=listbox] button[role=option]", props: PRESET },
  "Create row": { sel: "button[role=option].text-semantic-text-link", props: CREATE },
};
const setArgs = (id, args) => ({ eval: `(window.__STORYBOOK_ADDONS_CHANNEL__.emit('updateStoryArgs', { storyId: '${id}', updatedArgs: ${JSON.stringify(args)} }), 1)`, after: 600 });
const PRE = "v2-components-creatablemultiselect--with-preselected-values";
const manyChips = setArgs(PRE, { value: ["professional", "friendly", "empathetic", "direct", "enthusiastic"] });
const manyChipsNarrow = setArgs(PRE, { value: ["professional", "friendly", "empathetic", "direct", "enthusiastic"], width: 280 });
// Click the chevron: the trigger centre can land on a chip remove button and delete a chip instead of opening.
const OPEN_CLICK = { click: `${CLOSED} > svg` };
const open = [OPEN_CLICK];
export default [
  { name: "01-closed-chips", story: PRE, measure },
  { name: "02-open", story: PRE, steps: open, measure },
  { name: "03-hover-remove", story: PRE, steps: [{ hover: "button[data-chip-remove]" }], measure },
  { name: "04-many-chips", story: PRE, steps: [manyChips], measure },
  { name: "05-many-chips-narrow", story: PRE, width: 340, height: 700, steps: [manyChipsNarrow], measure },
  { name: "06-open-hover-preset", story: "v2-components-creatablemultiselect--default", steps: [OPEN_CLICK, { hoverText: "Empathetic", within: "[role=listbox]" }], measure },
  { name: "07-open-create-row", story: "v2-components-creatablemultiselect--default", steps: [OPEN_CLICK, { type: "Witty" }, { hoverText: "Create", within: "div.top-full" }], measure },
  { name: "08-error", story: "v2-components-creatablemultiselect--error-state", measure },
  { name: "09-error-open", story: "v2-components-creatablemultiselect--error-state", steps: open, measure },
  { name: "10-disabled", story: "v2-components-creatablemultiselect--disabled", measure },
  { name: "11-empty-options-open", story: "v2-components-creatablemultiselect--empty-options", steps: open, measure },
  { name: "12-open-no-match", story: "v2-components-creatablemultiselect--selection-limit", steps: [...open, { type: "zzzz" }], measure },
  { name: "13-summary", story: "v2-components-creatablemultiselect--summary", measure },
  { name: "14-narrow-open", story: PRE, width: 340, height: 700, steps: [setArgs(PRE, { width: 280 }), ...open], measure },
];
