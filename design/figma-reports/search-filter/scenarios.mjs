// SearchFilter: input "open" hold (aria-expanded), row radius, keyboard ring, check pop, origin-aware panel (flip).
const TRIG = ["background-color", "border-top-color", "border-top-width", "border-radius", "box-shadow", "height", "transition-duration"];
const PANEL = ["border-radius", "box-shadow", "transform-origin"];
const ROW = ["background-color", "color", "border-radius", "box-shadow", "padding-left", "padding-right", "min-height", "font-weight"];
const CHECK = ["opacity", "color", "animation-name", "animation-duration", "animation-timing-function"];
const CLEAR = ["width", "height", "color", "border-radius", "background-color"];
const IN = "input[role=searchbox]";
const measure = {
  "Search input": { sel: IN, props: TRIG },
  Panel: { sel: "div[role=presentation][aria-labelledby]", props: PANEL },
  "Row (first)": { sel: "[role=option]", props: ROW },
  "Row (selected)": { sel: "[role=option][aria-selected=true]", props: ROW },
  "Row (focused)": { sel: "[role=option]:focus", props: ROW },
  "Check icon (selected row)": { sel: "[role=option][aria-selected=true] svg", props: CHECK },
  "Clear button": { sel: "button[aria-label='Clear search']", props: CLEAR },
};
const lowTrigger = { eval: "document.querySelector('#storybook-root').style.paddingTop='520px'; 0" };
const side = { eval: "(() => { const p = document.querySelector('div[role=presentation][aria-labelledby]'); return p && [p.getAttribute('data-side'), p.style.transformOrigin, getComputedStyle(p).transformOrigin].join(' | '); })()" };
const open = [{ click: IN }];
export default [
  { name: "01-closed", story: "v2-components-searchfilter--overview", measure },
  { name: "02-open", story: "v2-components-searchfilter--overview", steps: open, measure },
  { name: "03-hover-row", story: "v2-components-searchfilter--overview", steps: [...open, { hoverText: "+91 11 4000 3453", within: "[role=listbox]" }, { eval: "(() => { const r = document.querySelector('[role=option]:hover'); return r && ['hovered row:', r.textContent.trim().slice(0, 24), 'box-shadow=' + getComputedStyle(r).boxShadow.slice(-40), 'bg=' + getComputedStyle(r).backgroundColor].join(' | '); })()" }], measure },
  { name: "04-keyboard-row", story: "v2-components-searchfilter--overview", steps: [...open, { key: "Tab" }], measure },
  { name: "05-selected-row", story: "v2-components-searchfilter--selected", steps: open, measure },
  { name: "06-empty-results", story: "v2-components-searchfilter--empty-results", steps: open, measure },
  { name: "07-long-labels", story: "v2-components-searchfilter--long-labels", steps: open, measure },
  { name: "08-disabled", story: "v2-components-searchfilter--disabled", measure },
  { name: "09-disabled-row", story: "v2-components-searchfilter--overview", steps: [...open, { hoverText: "+91 11 4000 6789", within: "[role=listbox]" }], measure },
  { name: "10-small", story: "v2-components-searchfilter--small", steps: open, measure },
  { name: "11-narrow", story: "v2-components-searchfilter--long-labels", width: 340, height: 700, steps: open, measure },
  { name: "12-flipped-top", story: "v2-components-searchfilter--overview", width: 700, height: 800, steps: [lowTrigger, ...open, { wait: 400 }, side], measure },
  { name: "13-typed-query", story: "v2-components-searchfilter--overview", steps: [...open, { type: "40003" }], measure },
];
