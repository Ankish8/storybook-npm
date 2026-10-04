// Badge: additive `dot` (7px leading status dot in the variant's text colour). Defaults must not change.
// `dot:!true` is ignored before the prop exists, so "before" shows the unchanged badge.
const B = ["height", "padding-left", "padding-right", "gap", "border-radius", "color", "background-color", "font-size", "line-height", "border-top-width", "border-top-color"];
const D = ["width", "height", "border-radius", "background-color", "margin-right", "margin-left"];
const first = (extra = {}) => ({ "Badge": { sel: "#storybook-root div.inline-flex.rounded-\\[25px\\]", props: B }, "Dot": { sel: "#storybook-root div.inline-flex.rounded-\\[25px\\] > span[aria-hidden=true]", props: D }, ...extra });
const W = { width: 900, height: 420 };
export default [
  { name: "all-variants", story: "v2-components-badge--all-variants", ...W, measure: first() },
  { name: "all-variants-dot", story: "v2-components-badge--all-variants&args=dot:!true", ...W, measure: first() },
  { name: "all-sizes-dot", story: "v2-components-badge--all-sizes&args=dot:!true", ...W, measure: first() },
  { name: "active-dot", story: "v2-components-badge--active&args=dot:!true", width: 500, height: 300, measure: first() },
  { name: "failed-dot", story: "v2-components-badge--failed&args=dot:!true", width: 500, height: 300, measure: first() },
  { name: "dot-with-icon", story: "v2-components-badge--with-icons&args=dot:!true", width: 500, height: 300, measure: first() },
  { name: "usage-dot", story: "v2-components-badge--usage", width: 700, height: 520, measure: first() },
];
