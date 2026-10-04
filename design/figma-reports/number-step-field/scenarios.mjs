/**
 * NumberStepField before/after scenarios (design/verify/capture.mjs).
 * Steppers are the two chevron buttons right of the input. Their measured width/height IS the pointer target.
 * Hold-to-repeat is covered by the unit test (fake timers) and by the `hold-*` scenarios (after only).
 */
const S = (n) => `v2-components-numberstepfield--${n}`;
const UP = 'button[aria-label="Increase value"]';
const DOWN = 'button[aria-label="Decrease value"]';
const STEP = ["width", "height", "display", "color", "background-color", "border-radius", "transform", "opacity", "cursor", "transition-property", "transition-duration", "transition-timing-function"];
const m = () => ({
  "Increase button": { sel: UP, props: STEP },
  "Decrease button": { sel: DOWN, props: STEP },
  "Chevron up icon": { sel: `${UP} svg`, props: ["width", "height"] },
  "Stepper column": { sel: 'div:has(> button[aria-label="Increase value"])', props: ["width", "height", "gap", "padding", "background-color"] },
  "Field": { sel: 'div:has(> input[type=number])', props: ["height", "border-top-color", "border-radius", "box-shadow"] },
  "Input": { sel: "input[type=number]", props: ["width", "font-size", "color", "padding"] },
});
const valueProbe = { eval: `document.querySelector("input[type=number]").value` };

export default [
  { name: "default", story: S("overview"), measure: m() },
  { name: "hover-up", story: S("overview"), steps: [{ hover: UP }], measure: m() },
  { name: "hover-down", story: S("overview"), steps: [{ hover: DOWN }], measure: m() },
  { name: "focus-input", story: S("overview"), steps: [{ key: "Tab" }], measure: m() },
  { name: "click-up-once", story: S("overview"), steps: [valueProbe, { click: UP }, valueProbe], measure: m() },
  { name: "at-minimum", story: S("at-minimum"), measure: m() },
  { name: "at-maximum", story: S("at-maximum"), measure: m() },
  { name: "disabled", story: S("disabled"), measure: m() },
  { name: "narrow", story: S("overview"), width: 240, measure: m() },
];
