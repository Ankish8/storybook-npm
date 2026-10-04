/**
 * Switch before/after scenarios (design/verify/capture.mjs).
 * `toggle-*` scenarios click the switch and record every frame for 450ms: thumb translate-x and track colour.
 * Pseudo-element measurement patch: see date-range-picker/scenarios.mjs (the capture tool reads getComputedStyle(el) only).
 */
const PSEUDO = {
  eval: `(() => { const base = window.__measure; window.__measure = (sel, props) => { const i = sel.indexOf("::"); if (i < 0) return base(sel, props); const e = document.querySelector(sel.slice(0, i)); if (!e) return null; const s = getComputedStyle(e, sel.slice(i)); const o = {}; for (const p of props) o[p] = s.getPropertyValue(p); return o; }; return true; })()`,
};
const S = (n) => `v2-components-switch--${n}`;
const SW = "button[role=switch]";

const TRACK = ["background-color", "border-top-width", "border-radius", "outline-style", "outline-width", "outline-offset", "outline-color", "transform", "position", "transition-property", "transition-duration", "transition-timing-function", "cursor"];
const THUMB = ["background-color", "box-shadow", "transform", "transition-property", "transition-duration"];
const HIT = ["position", "top", "right", "bottom", "left", "width", "height", "content"];
const m = () => ({
  "Track": { sel: SW, props: TRACK },
  "Hit area (::before)": { sel: `${SW}::before`, props: HIT },
  "Thumb": { sel: `${SW} > span`, props: THUMB },
  "Label": { sel: "label > span", props: ["font-size", "line-height", "color", "font-weight", "opacity"] },
});

const sample = (target) => ({
  eval: `(async () => {
    const b = document.querySelector(${JSON.stringify(target)}), th = b.querySelector(":scope > span"), rows = [], t0 = performance.now();
    b.click();
    await new Promise((done) => { const f = () => { const t = Math.round(performance.now() - t0), ts = getComputedStyle(th), bs = getComputedStyle(b); const mm = ts.transform.match(/matrix\\(([^)]+)\\)/); const v = mm ? mm[1].split(",").map(Number) : [1, 0, 0, 1, 0, 0]; rows.push({ t, state: b.dataset.state, thumbX: +v[4].toFixed(2), thumbScaleX: +v[0].toFixed(3), track: bs.backgroundColor }); t < 450 ? requestAnimationFrame(f) : done(); }; f(); });
    return rows;
  })()`,
  after: 100,
});

const desc = () => ({
  "Control": { sel: SW, props: TRACK },
  "Hit area (::before)": { sel: `${SW}::before`, props: HIT },
  "Label": { sel: "label", props: ["font-size", "line-height", "color", "font-weight", "opacity"] },
  "Description": { sel: '[id$="-description"]', props: ["font-size", "line-height", "color", "margin-top", "opacity"] },
  "Row (wrapper)": { sel: 'label:has(> button[role=switch]), div:has(> button[role=switch])', props: ["display", "align-items", "gap"] },
});

export default [
  { name: "gallery-states", story: S("states"), width: 1100, height: 700 },
  { name: "off", story: S("with-label"), steps: [PSEUDO], measure: m() },
  { name: "off-hover", story: S("with-label"), steps: [PSEUDO, { hover: SW }], measure: m() },
  { name: "off-focus", story: S("with-label"), steps: [PSEUDO, { key: "Tab" }], measure: m() },
  { name: "on", story: S("on"), steps: [PSEUDO], measure: m() },
  { name: "on-hover", story: S("on"), steps: [PSEUDO, { hover: SW }], measure: m() },
  { name: "on-focus", story: S("on"), steps: [PSEUDO, { key: "Tab" }], measure: m() },
  { name: "disabled-on", story: S("disabled"), steps: [PSEUDO], measure: m() },
  { name: "disabled-off", story: S("disabled-off"), steps: [PSEUDO], measure: m() },
  { name: "small", story: S("small"), steps: [PSEUDO], measure: m() },
  { name: "large", story: S("large"), steps: [PSEUDO], measure: m() },
  { name: "toggle-on", story: S("with-label"), steps: [PSEUDO, sample(SW)], measure: m() },
  // new in this pass: optional description under the label (before = the story with the prop ignored)
  { name: "with-description", story: S("with-description"), steps: [PSEUDO], measure: desc() },
  { name: "with-description-narrow", story: S("with-description"), width: 220, steps: [PSEUDO], measure: desc() },
  { name: "narrow-label", story: S("with-label"), width: 180, steps: [PSEUDO], measure: m() },
];
