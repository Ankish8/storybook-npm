/**
 * Radio before/after scenarios (design/verify/capture.mjs).
 * `select-*` scenarios click the radio and record every frame for 450ms: dotSize (background-size) and borderColor.
 * Pseudo-element measurement patch: see date-range-picker/scenarios.mjs (the capture tool reads getComputedStyle(el) only).
 */
const PSEUDO = {
  eval: `(() => { const base = window.__measure; window.__measure = (sel, props) => { const i = sel.indexOf("::"); if (i < 0) return base(sel, props); const e = document.querySelector(sel.slice(0, i)); if (!e) return null; const s = getComputedStyle(e, sel.slice(i)); const o = {}; for (const p of props) o[p] = s.getPropertyValue(p); return o; }; return true; })()`,
};
const S = (n) => `v2-components-radio--${n}`;
const R = "input[type=radio]";

const RP = ["background-color", "background-image", "background-size", "border-top-color", "border-top-width", "border-radius", "box-shadow", "transform", "position", "transition-property", "transition-duration", "transition-timing-function", "cursor"];
const HIT = ["position", "top", "right", "bottom", "left", "width", "height", "content"];
const m = () => ({
  "Radio": { sel: R, props: RP },
  "Hit area (::before)": { sel: `${R}::before`, props: HIT },
  "Row (wrapper)": { sel: 'div:has(> input[type=radio])', props: ["display", "gap", "padding", "border-top-width", "border-top-color", "border-radius", "background-color", "transition-property", "cursor"] },
  "Label": { sel: "label", props: ["font-size", "line-height", "color", "font-weight"] },
  "Description": { sel: 'p[id$="-description"]', props: ["font-size", "line-height", "color", "margin-top"] },
});

const sample = (target) => ({
  eval: `(async () => {
    const r = document.querySelector(${JSON.stringify(target)}), rows = [], t0 = performance.now();
    r.click();
    await new Promise((done) => { const f = () => { const t = Math.round(performance.now() - t0), s = getComputedStyle(r); rows.push({ t, checked: r.checked, dot: s.backgroundSize, border: s.borderTopColor }); t < 450 ? requestAnimationFrame(f) : done(); }; f(); });
    return rows;
  })()`,
  after: 100,
});

// Selectable cards (new `variant="card"`). Before = the same story with the prop ignored. [role=radiogroup] > :first-child is the
// option wrapper in both versions (a div row before, the clickable card label after).
const CARD = '[role="radiogroup"] > :nth-child(2)';
const cardM = () => ({
  "Option wrapper (card)": { sel: CARD, props: ["display", "padding", "gap", "border-top-width", "border-top-color", "border-top-style", "border-radius", "background-color", "cursor", "transition-property", "transition-duration"] },
  "Radio": { sel: `${CARD} input[type=radio]`, props: ["width", "height", "border-top-color", "background-size", "transform"] },
  "Label text": { sel: `${CARD} [id$="-label"], ${CARD} label`, props: ["font-size", "line-height", "color", "font-weight"] },
  "Description": { sel: `${CARD} p, ${CARD} [id$="-description"]`, props: ["font-size", "line-height", "color", "margin-top"] },
});

export default [
  { name: "gallery-states", story: S("states"), width: 1100, height: 260 },
  { name: "unselected", story: S("overview"), steps: [PSEUDO], measure: m() },
  { name: "unselected-hover", story: S("overview"), steps: [PSEUDO, { hover: R }], measure: m() },
  { name: "unselected-focus", story: S("overview"), steps: [PSEUDO, { key: "Tab" }], measure: m() },
  { name: "selected", story: S("selected"), steps: [PSEUDO], measure: m() },
  { name: "selected-hover", story: S("selected"), steps: [PSEUDO, { hover: R }], measure: m() },
  { name: "selected-focus", story: S("selected"), steps: [PSEUDO, { key: "Tab" }], measure: m() },
  { name: "disabled-selected", story: S("disabled"), steps: [PSEUDO], measure: m() },
  { name: "select-click", story: S("overview"), steps: [PSEUDO, sample(R)], measure: m() },
  { name: "cards", story: S("cards"), height: 420, measure: cardM() },
  { name: "cards-hover", story: S("cards"), height: 420, steps: [{ hover: '[role="radiogroup"] > :nth-child(1)' }], measure: { "Hovered card (Starter)": { sel: '[role="radiogroup"] > :nth-child(1)', props: ["border-top-color", "background-color"] }, "Selected card (Team)": { sel: CARD, props: ["border-top-color", "background-color"] } } },
  { name: "cards-focus", story: S("cards"), height: 420, steps: [{ key: "Tab" }], measure: cardM() },
  { name: "cards-select", story: S("cards"), height: 420, steps: [{ click: '[role="radiogroup"] > :nth-child(1)' }], measure: { "Starter card (now selected)": { sel: '[role="radiogroup"] > :nth-child(1)', props: ["border-top-color", "background-color"] }, "Team card (deselected)": { sel: CARD, props: ["border-top-color", "background-color"] } } },
  { name: "cards-disabled", story: S("cards"), height: 420, measure: { "Disabled card (Enterprise)": { sel: '[role="radiogroup"] > :nth-child(3)', props: ["background-color", "border-top-color", "cursor", "opacity"] } } },
  { name: "cards-narrow", story: S("cards"), width: 260, height: 520, measure: cardM() },
  { name: "narrow", story: S("overview"), width: 200, steps: [PSEUDO], measure: m() },
];
