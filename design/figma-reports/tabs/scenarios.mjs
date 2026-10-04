// Tabs: underline (default, must not change) and the new "pill" variant.
// The pill scenarios append `&args=variant:pill` to the story id. Before the change Storybook ignores the unknown
// arg, so the "before" screenshot is what the same story rendered with the only style that existed (underline).
const TAB = [
  "background-color", "color", "border-radius", "border-bottom-width", "border-bottom-color", "border-left-width",
  "border-left-color", "border-top-color", "padding-top", "padding-left", "font-size", "font-weight", "line-height",
  "letter-spacing", "box-shadow", "outline-width", "outline-style", "outline-color", "outline-offset", "transition-duration",
];
const LIST = ["background-color", "border-radius", "border-bottom-width", "border-bottom-color", "padding-top", "padding-left", "isolation", "display"];
const COUNT = ["width", "height", "border-radius", "background-color", "color", "font-size", "border-top-width", "border-top-color"];
const measure = (extra = {}) => ({
  "Tab list": { sel: "[role=tablist]", props: LIST },
  "Tab (active)": { sel: "[role=tab][data-state=active]", props: TAB },
  "Tab (inactive)": { sel: "[role=tab][data-state=inactive]", props: TAB },
  ...extra,
});
// Computed style of the moving cursor (the list's ::after) plus the list markup; capture.mjs cannot measure pseudo-elements.
const CURSOR = `(() => {
  const l = document.querySelector('[role=tablist]');
  const s = getComputedStyle(l, '::after');
  const keys = ['position','left','top','bottom','width','height','background-color','border-top-width','border-top-style','border-top-color','border-radius','box-shadow','transform','opacity','z-index'];
  return { cursor: Object.fromEntries(keys.map((k) => [k, s.getPropertyValue(k)])), vars: ['x','y','width','height'].map((a) => l.style.getPropertyValue('--v2-tab-' + a)), markup: l.outerHTML };
})()`;
const HOVER = { hoverText: "Assigned", within: "[role=tablist]" };
const PILL = "&args=variant:pill";
const sc = (name, story, steps = [], extraMeasure = {}) => ({
  name, story, width: 760, height: 420,
  steps: [...steps, { eval: CURSOR }],
  measure: measure(extraMeasure),
});

export default [
  sc("horizontal", "v2-components-tabs--horizontal"),
  sc("horizontal-hover", "v2-components-tabs--horizontal", [HOVER]),
  sc("horizontal-focus", "v2-components-tabs--horizontal", [{ key: "Tab" }]),
  sc("horizontal-counts", "v2-components-tabs--with-counts", [], { "Count (first)": { sel: "[role=tab] > span", props: COUNT } }),
  sc("horizontal-full-width-counts", "v2-components-tabs--full-width-with-badges"),
  sc("horizontal-disabled", "v2-components-tabs--with-disabled-tab", [], { "Tab (disabled)": { sel: "[role=tab][disabled]", props: TAB } }),
  sc("vertical", "v2-components-tabs--vertical"),
  sc("vertical-hover", "v2-components-tabs--vertical", [HOVER]),
  sc("vertical-focus", "v2-components-tabs--vertical", [{ key: "Tab" }]),

  sc("pill", "v2-components-tabs--horizontal" + PILL),
  sc("pill-hover", "v2-components-tabs--horizontal" + PILL, [HOVER]),
  sc("pill-focus", "v2-components-tabs--horizontal" + PILL, [{ key: "Tab" }]),
  sc("pill-switched", "v2-components-tabs--horizontal" + PILL, [{ clickText: "Resolved", within: "[role=tablist]" }, { wait: 700 }]),
  sc("pill-counts", "v2-components-tabs--with-counts" + PILL, [], { "Count (first)": { sel: "[role=tab] > span", props: COUNT } }),
  sc("pill-full-width-counts", "v2-components-tabs--full-width-with-badges" + PILL),
  sc("pill-disabled", "v2-components-tabs--with-disabled-tab" + PILL, [], { "Tab (disabled)": { sel: "[role=tab][disabled]", props: TAB } }),
  sc("pill-vertical", "v2-components-tabs--vertical" + PILL),
];
