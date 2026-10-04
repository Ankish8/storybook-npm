/**
 * Checkbox before/after scenarios (design/verify/capture.mjs).
 * `toggle-*` scenarios click the box and record every animation frame for 450ms:
 *   boxScale  scale of the box (matrix a) -> the fill pop        tickOffset / tickDash  stroke of the check path -> the draw-in
 * Pseudo-element measurement patch: see date-range-picker/scenarios.mjs (the capture tool reads getComputedStyle(el) only).
 */
const PSEUDO = {
  eval: `(() => { const base = window.__measure; window.__measure = (sel, props) => { const i = sel.indexOf("::"); if (i < 0) return base(sel, props); const e = document.querySelector(sel.slice(0, i)); if (!e) return null; const s = getComputedStyle(e, sel.slice(i)); const o = {}; for (const p of props) o[p] = s.getPropertyValue(p); return o; }; return true; })()`,
};
const S = (n) => `v2-components-checkbox--${n}`;
const BOX = "button[role=checkbox]";

const BOXP = ["background-color", "border-top-color", "border-top-width", "border-radius", "box-shadow", "transform", "outline-style", "transition-property", "transition-duration", "transition-timing-function", "cursor"];
const IND = ["animation-name", "animation-duration", "animation-delay", "animation-timing-function", "opacity", "transform"];
const TICK = ["stroke", "stroke-width", "stroke-dasharray", "stroke-dashoffset", "animation-name", "animation-duration", "animation-delay", "animation-timing-function", "transition-property", "transition-duration"];
const HIT = ["position", "top", "right", "bottom", "left", "width", "height", "content"];
const LABEL = ["font-size", "line-height", "color", "font-weight", "opacity"];

const m = (extra = {}) => ({
  "Box": { sel: BOX, props: BOXP },
  "Hit area (::before)": { sel: `${BOX}::before`, props: HIT },
  "Tick wrapper": { sel: `${BOX} > span`, props: IND },
  "Tick path": { sel: `${BOX} svg path`, props: TICK },
  "Label": { sel: "label > span", props: LABEL },
  ...extra,
});

const sample = (target) => ({
  eval: `(async () => {
    const b = document.querySelector(${JSON.stringify(target)}), rows = [], t0 = performance.now();
    b.click();
    await new Promise((done) => { const f = () => { const t = Math.round(performance.now() - t0), p = b.querySelector("svg path"), ps = p && getComputedStyle(p), w = b.querySelector(":scope > span"), ws = w && getComputedStyle(w), bs = getComputedStyle(b);
      const mx = (s) => { const mm = s.transform.match(/matrix(?:3d)?\\(([^,]+)/); return mm ? +(+mm[1]).toFixed(3) : 1; };
      rows.push({ t, state: b.dataset.state, boxScale: mx(bs), boxBg: bs.backgroundColor, wrapOpacity: ws ? +(+ws.opacity).toFixed(2) : null, wrapScale: ws ? mx(ws) : null, tickOffset: ps ? ps.strokeDashoffset : null, tickDash: ps ? ps.strokeDasharray : null }); t < 450 ? requestAnimationFrame(f) : done(); }; f(); });
    return rows;
  })()`,
  after: 100,
});

const desc = () => ({
  "Control": { sel: BOX, props: BOXP },
  "Hit area (::before)": { sel: `${BOX}::before`, props: HIT },
  "Label": { sel: "label", props: LABEL },
  "Description": { sel: '[id$="-description"]', props: ["font-size", "line-height", "color", "margin-top", "opacity"] },
  "Row (wrapper)": { sel: 'label:has(> button[role=checkbox]), div:has(> button[role=checkbox])', props: ["display", "align-items", "gap"] },
});

export default [
  { name: "gallery-states", story: S("states"), width: 1100, height: 700 },
  { name: "unchecked", story: S("with-label"), steps: [PSEUDO], measure: m() },
  { name: "unchecked-hover", story: S("with-label"), steps: [PSEUDO, { hover: BOX }], measure: m() },
  { name: "unchecked-focus", story: S("with-label"), steps: [PSEUDO, { key: "Tab" }], measure: m() },
  { name: "checked", story: S("checked"), steps: [PSEUDO], measure: m() },
  { name: "checked-hover", story: S("checked"), steps: [PSEUDO, { hover: BOX }], measure: m() },
  { name: "checked-focus", story: S("checked"), steps: [PSEUDO, { key: "Tab" }], measure: m() },
  { name: "indeterminate", story: S("indeterminate"), steps: [PSEUDO], measure: m() },
  { name: "disabled-checked", story: S("disabled"), steps: [PSEUDO], measure: m() },
  { name: "disabled-unchecked", story: S("disabled-unchecked"), steps: [PSEUDO], measure: m() },
  { name: "toggle-check", story: S("with-label"), steps: [PSEUDO, sample(BOX)], measure: m() },
  // new in this pass: optional description under the label (before = the story with the prop ignored)
  { name: "with-description", story: S("with-description"), steps: [PSEUDO], measure: desc() },
  { name: "with-description-narrow", story: S("with-description"), width: 220, steps: [PSEUDO], measure: desc() },
  { name: "narrow-label", story: S("with-label"), width: 180, steps: [PSEUDO], measure: m() },
];
