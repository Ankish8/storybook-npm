// ProgressIndicator: indeterminate bar slides across instead of pulsing; percentages use tabular figures.
const BAR = "#storybook-root [role=progressbar] > div";
const FILL = BAR + " > div";
const ANIM = `(() => document.getAnimations().map((a) => { const t = a.effect.getTiming(); return { name: a.animationName || a.transitionProperty, duration: t.duration, easing: t.easing, iterations: t.iterations, target: a.effect.target && a.effect.target.className && String(a.effect.target.className).slice(0, 60) }; }))()`;
const LABEL = ["font-variant-numeric", "font-size", "line-height", "font-weight", "letter-spacing"];
const FILLP = ["width", "height", "border-radius", "background-color", "opacity", "transform", "animation-name", "animation-duration", "animation-timing-function", "animation-iteration-count", "transition-duration"];
const measure = {
  "Progress track": { sel: BAR, props: ["width", "height", "border-radius", "background-color", "overflow"] },
  "Progress fill": { sel: FILL, props: FILLP },
  "Percentage": { sel: "#storybook-root [role=progressbar] > span", props: LABEL },
};
const W = { width: 640, height: 320 };
export default [
  { name: "bar-30", story: "v2-components-progressindicator--overview", ...W, measure },
  { name: "bar-bottom-label", story: "v2-components-progressindicator--bottom-label", ...W, measure },
  { name: "bar-indeterminate-start", story: "v2-components-progressindicator--indeterminate", ...W, measure, steps: [{ eval: ANIM }] },
  { name: "bar-indeterminate-mid", story: "v2-components-progressindicator--indeterminate", ...W, measure, steps: [{ wait: 560 }, { eval: ANIM }] },
  { name: "bar-indeterminate-late", story: "v2-components-progressindicator--indeterminate", ...W, measure, steps: [{ wait: 1000 }, { eval: ANIM }] },
  { name: "bar-100", story: "v2-components-progressindicator--overview&args=value:100", ...W, measure },
  { name: "circle-30", story: "v2-components-progressindicator--circle", ...W, measure: { "Percentage": { sel: "#storybook-root [role=progressbar] > span", props: LABEL } } },
  { name: "semi-circle-30", story: "v2-components-progressindicator--semi-circle", ...W, measure: { "Percentage": { sel: "#storybook-root [role=progressbar] > span", props: LABEL } } },
  { name: "circle-indeterminate", story: "v2-components-progressindicator--circle&args=indeterminate:!true", ...W, measure: {}, steps: [{ eval: ANIM }] },
  { name: "states", story: "v2-components-progressindicator--states", width: 760, height: 420, measure },
];
