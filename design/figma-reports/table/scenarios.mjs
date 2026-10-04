// Table before/after scenarios. Selectors avoid class names so the same file measures both versions.
const ROW = ["background-color", "height", "border-bottom-width", "border-bottom-color", "transition-duration", "transition-property", "cursor"];
const HEAD = ["background-color", "color", "height", "padding-left", "padding-right", "font-size", "font-weight", "position", "top", "z-index", "box-shadow", "cursor", "outline-style", "outline-width"];
const CELL = ["color", "padding-left", "padding-top", "font-size", "background-color", "outline-style"];
const GLYPH = ["color", "opacity", "width", "height", "font-size", "transform", "transition-duration", "transition-property"];

const measure = (extra = {}) => ({
  "Header cell (th)": { sel: "#storybook-root thead th:nth-child(2)", props: HEAD },
  "Body row 2 (tr)": { sel: "#storybook-root tbody tr:nth-child(2)", props: ROW },
  "Body cell (td)": { sel: "#storybook-root tbody tr:nth-child(2) td:nth-child(2)", props: CELL },
  ...extra,
});

export default [
  { name: "01-default", story: "v2-components-table--overview", measure: measure({
    "Info icon (th)": { sel: "#storybook-root thead th:nth-child(4) div > span", props: GLYPH },
  }) },
  { name: "02-hover-row", story: "v2-components-table--overview", steps: [{ hover: "#storybook-root tbody tr:nth-child(2) td:nth-child(2)" }], measure: measure() },
  { name: "03-selected-row", story: "v2-components-table--usage", steps: [
    { click: "#storybook-root tbody tr:nth-child(2) [role=checkbox]" }, { hover: "#storybook-root h3" },
  ], measure: measure() },
  { name: "04-selected-row-hover", story: "v2-components-table--usage", steps: [
    { click: "#storybook-root tbody tr:nth-child(2) [role=checkbox]" }, { hover: "#storybook-root tbody tr:nth-child(2) td:nth-child(3)" },
  ], measure: measure() },
  { name: "05-sorted-column-asc", story: "v2-components-table--usage", measure: measure({
    "Sorted header (th)": { sel: "#storybook-root thead th:nth-child(2)", props: HEAD },
    "Sort glyph": { sel: "#storybook-root thead th:nth-child(2) div > span", props: GLYPH },
    "Sort arrow icon": { sel: "#storybook-root thead th:nth-child(2) div > span svg", props: GLYPH },
  }) },
  { name: "06-sorted-column-hover", story: "v2-components-table--usage", steps: [{ hover: "#storybook-root thead th:nth-child(2) button" }], measure: measure({
    "Sort glyph": { sel: "#storybook-root thead th:nth-child(2) div > span", props: GLYPH },
    "Sort arrow icon": { sel: "#storybook-root thead th:nth-child(2) div > span svg", props: GLYPH },
  }) },
  { name: "07-sorted-column-desc", story: "v2-components-table--usage", steps: [
    { click: "#storybook-root thead th:nth-child(2) button" }, { hover: "#storybook-root h3" }, { wait: 300 },
  ], measure: measure({
    "Sort glyph": { sel: "#storybook-root thead th:nth-child(2) div > span", props: GLYPH },
    "Sort arrow icon": { sel: "#storybook-root thead th:nth-child(2) div > span svg", props: GLYPH },
  }) },
  { name: "08-loading-skeleton", story: "v2-components-table--loading", measure: measure({
    "Skeleton bar": { sel: "#storybook-root tbody tr:nth-child(2) td:nth-child(2) div", props: ["background-color", "height", "border-radius", "animation-name", "animation-duration", "animation-delay"] },
  }) },
  { name: "09-empty", story: "v2-components-table--empty-state", measure: { "Empty cell": { sel: "#storybook-root tbody td", props: ["color", "padding-top", "text-align", "font-size"] } } },
  { name: "10-narrow-360", story: "v2-components-table--usage", width: 360, height: 900, measure: measure() },
  { name: "11-sortable-headers", story: "v2-components-table--sortable-headers", steps: [
    { eval: "[...document.querySelectorAll('#storybook-root thead th')].map(t=>t.getAttribute('aria-sort'))" },
  ], measure: {
    "Sorted arrow icon": { sel: "#storybook-root thead th:nth-child(1) div > span svg", props: GLYPH },
    "Sorted header (th)": { sel: "#storybook-root thead th:nth-child(1)", props: HEAD },
    "Sorted glyph": { sel: "#storybook-root thead th:nth-child(1) div > span", props: GLYPH },
    "Unsorted sortable header (th)": { sel: "#storybook-root thead th:nth-child(3)", props: HEAD },
    "Unsorted sortable glyph": { sel: "#storybook-root thead th:nth-child(3) div > :not(button)", props: GLYPH },
    "Plain header (th)": { sel: "#storybook-root thead th:nth-child(2)", props: HEAD },
  } },
  { name: "12-sortable-idle-hover", story: "v2-components-table--sortable-headers", steps: [{ hover: "#storybook-root thead th:nth-child(3) button" }], measure: {
    "Unsorted sortable header (th)": { sel: "#storybook-root thead th:nth-child(3)", props: HEAD },
    "Unsorted sortable glyph": { sel: "#storybook-root thead th:nth-child(3) div > :not(button)", props: GLYPH },
  } },
  { name: "13-sortable-toggle-desc", story: "v2-components-table--sortable-headers", steps: [{ click: "#storybook-root thead th:nth-child(1) button" }, { hover: "#storybook-root tbody" }, { wait: 300 },
    { eval: "[...document.querySelectorAll('#storybook-root thead th')].map(t=>t.getAttribute('aria-sort'))" },
  ], measure: {
    "Sorted glyph": { sel: "#storybook-root thead th:nth-child(1) div > span", props: GLYPH },
    "Sorted arrow icon": { sel: "#storybook-root thead th:nth-child(1) div > span svg", props: GLYPH },
  } },
  { name: "14-header-cell-focus", story: "v2-components-table--sortable-headers", steps: [
    { eval: "document.querySelector('#storybook-root thead th:nth-child(2)').tabIndex=0" }, { key: "Tab", repeat: 2 },
    { eval: "document.activeElement.tagName+':'+document.activeElement.textContent.trim()" },
  ], measure: { "Focused header cell (th)": { sel: "#storybook-root thead th:nth-child(2)", props: HEAD } } },
  { name: "15-row-focus", story: "v2-components-table--overview", steps: [
    { eval: "document.querySelector('#storybook-root tbody tr:nth-child(2)').tabIndex=0" },
    { key: "Tab", repeat: 2 }, { eval: "document.activeElement.tagName" },
  ], measure: { "Body row 2 (tr)": { sel: "#storybook-root tbody tr:nth-child(2)", props: [...ROW, "outline-style", "outline-width", "outline-offset"] } } },
  { name: "16-scroll-no-sticky-top", story: "v2-components-table--sticky-header", height: 520, measure: { "Header cell (th)": { sel: "#storybook-root thead th:nth-child(2)", props: HEAD } } },
  { name: "17-scroll-sticky-scrolled", story: "v2-components-table--sticky-header", height: 520, steps: [
    { eval: "(()=>{const e=[...document.querySelectorAll('#storybook-root *')].find(n=>n.scrollHeight>n.clientHeight+10&&getComputedStyle(n).overflowY!=='visible'&&n.querySelector('table'));if(!e)return 'no scroller';e.scrollTop=200;return [e.tagName,e.className.slice(0,40),e.scrollTop,e.clientHeight,e.scrollHeight]})()", after: 500 },
  ], measure: {
    "Header cell (th)": { sel: "#storybook-root thead th:nth-child(2)", props: [...HEAD, "inset-block-start"] },
  } },
  { name: "18-skeleton-rows", story: "v2-components-table--loading", measure: {
    "Skeleton bar row 1": { sel: "#storybook-root tbody tr:nth-child(1) td:nth-child(2) div", props: ["animation-name", "animation-duration", "animation-delay"] },
    "Skeleton bar row 3": { sel: "#storybook-root tbody tr:nth-child(3) td:nth-child(2) div", props: ["animation-name", "animation-duration", "animation-delay"] },
  } },
];
