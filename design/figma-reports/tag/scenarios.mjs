// Tag: the dismiss button gets a 24px hit area (icon stays 12px), a neutral hover plate and a focus ring.
const REMOVE = "#storybook-root button[aria-label^=Remove]";
const TAG = ["height", "width", "padding-left", "padding-right", "gap", "border-radius", "background-color", "color"];
const BTN = ["width", "height", "margin-top", "margin-left", "margin-right", "border-radius", "background-color", "transform", "outline-width", "outline-style", "outline-color", "outline-offset", "transition-duration", "transition-property", "opacity"];
const ICON = ["width", "height"];
// ::before of the button is the hover plate; capture.mjs cannot measure pseudo-elements, so eval it.
const PLATE = `(() => { const b = document.querySelector('${REMOVE}'); if (!b) return null; const s = getComputedStyle(b, '::before'); const r = b.getBoundingClientRect(); const keys = ['content','position','width','height','background-color','border-radius','opacity','transition-property','transition-duration']; return { hitArea: { width: r.width, height: r.height }, before: Object.fromEntries(keys.map((k) => [k, s.getPropertyValue(k)])) }; })()`;
const measure = {
  "Tag": { sel: "#storybook-root span.inline-flex.rounded-lg", props: TAG },
  "Remove button": { sel: REMOVE, props: BTN },
  "Remove icon": { sel: REMOVE + " svg", props: ICON },
};
const W = { width: 760, height: 360 };
const sc = (name, story, steps = []) => ({ name, story, ...W, measure, steps: [...steps, { eval: PLATE }] });
export default [
  sc("removable", "v2-components-tag--removable"),
  sc("removable-hover", "v2-components-tag--removable", [{ hover: REMOVE }]),
  sc("removable-focus", "v2-components-tag--removable", [{ key: "Tab" }]),
  sc("removable-disabled", "v2-components-tag--remove-disabled", [{ hover: REMOVE }]),
  sc("removable-all-sizes", "v2-components-tag--all-sizes&args=removable:!true"),
  sc("removable-all-variants", "v2-components-tag--all-variants&args=removable:!true"),
  sc("removable-with-label", "v2-components-tag--with-label&args=removable:!true"),
  sc("dismissible", "v2-components-tag--dismissible"),
];
