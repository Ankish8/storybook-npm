/**
 * TextField (+ Textarea and PhoneInput message reveal) before/after scenarios (design/verify/capture.mjs).
 * The validation message reveal is one change shared by TextField, Textarea and PhoneInput, so all three live in this
 * folder. PhoneInput's country button and the clear-button changes are TextField-only.
 *
 * `reveal-*` scenarios click the Save button of each Usage story and record, on every animation frame for 500ms,
 *   shift  growth of the space between the field and the Save row (px)  -> a glide is a ramp, a pop is one jump
 *   msgH   height of the message element (px)
 *   opacity / transform of the message
 * Pseudo-element measurement patch: see date-range-picker/scenarios.mjs (the capture tool reads getComputedStyle(el) only).
 */
const PSEUDO = {
  eval: `(() => { const base = window.__measure; window.__measure = (sel, props) => { const i = sel.indexOf("::"); if (i < 0) return base(sel, props); const e = document.querySelector(sel.slice(0, i)); if (!e) return null; const s = getComputedStyle(e, sel.slice(i)); const o = {}; for (const p of props) o[p] = s.getPropertyValue(p); return o; }; return true; })()`,
};

const TF = (n) => `v2-components-textfield--${n}`;
const TA = (n) => `v2-components-textarea--${n}`;
const PI = (n) => `v2-components-phone-input--${n}`;

const BOX = ["background-color", "color", "border-top-color", "border-top-width", "border-radius", "box-shadow", "padding", "font-size", "line-height", "transition-duration"];
const MSG = ["color", "font-size", "line-height", "margin-top", "display", "grid-template-rows", "opacity", "transform", "transition-property", "transition-duration", "transition-timing-function", "animation-name", "animation-duration"];
const CLEAR = ["opacity", "transform", "visibility", "margin-left", "width", "height", "color", "transition-property", "transition-duration", "cursor"];
const HIT = ["position", "top", "right", "bottom", "left", "width", "height", "content"];

const sample = (click, anchor, below, msg) => ({
  eval: `(async () => {
    const c = document.querySelector(${JSON.stringify(click)}), a = () => document.querySelector(${JSON.stringify(anchor)}), b = () => document.querySelector(${JSON.stringify(below)});
    // re-queried each frame: PhoneInput remounts its controls when the message appears (see notes)
    const gap = () => b().getBoundingClientRect().top - a().getBoundingClientRect().bottom, g0 = gap(), t0 = performance.now(), rows = [];
    c.click();
    await new Promise((done) => { const f = () => { const t = performance.now() - t0, m = document.querySelector(${JSON.stringify(msg)}), cs = m && getComputedStyle(m); rows.push({ t: Math.round(t), shift: +(gap() - g0).toFixed(1), msgH: m ? +m.getBoundingClientRect().height.toFixed(1) : null, opacity: cs ? +(+cs.opacity).toFixed(2) : null, transform: cs ? cs.transform : null }); t < 500 ? requestAnimationFrame(f) : done(); }; f(); });
    return rows;
  })()`,
  after: 200,
});

const tfMeasure = {
  "Input": { sel: "input", props: BOX },
  "Label": { sel: "label", props: ["color", "font-size", "line-height", "font-weight"] },
  "Message row (container)": { sel: 'div:has(> [id$="-helper"]), div:has(> [id$="-error"])', props: ["display", "grid-template-rows", "margin-top", "transition-property", "transition-duration"] },
  "Helper text": { sel: '[id$="-helper"]', props: MSG },
  "Error message": { sel: '[id$="-error"]', props: MSG },
};

// The Usage stories ship helper text and a counter, which already reserve the message row, so nothing would move. Remove them.
const NOROW = "&args=helperText:!undefined;showCount:!false";
const SAVE = "form button[type=submit]";
const MSGSEL = '[id$="-error"]';

export default [
  // --- TextField: static states
  { name: "tf-default", story: TF("default"), measure: tfMeasure },
  { name: "tf-hover", story: TF("default"), steps: [{ hover: "input" }], measure: { "Input": tfMeasure.Input } },
  { name: "tf-focus", story: TF("default"), steps: [{ key: "Tab" }], measure: { "Input": tfMeasure.Input } },
  { name: "tf-error", story: TF("error"), measure: tfMeasure },
  { name: "tf-error-narrow", story: TF("error"), width: 320, measure: tfMeasure },
  { name: "tf-disabled", story: TF("disabled"), measure: { "Input": tfMeasure.Input } },

  // --- TextField: clear button (filled -> hover -> emptied)
  { name: "tf-clearable-filled", story: TF("clearable"), steps: [PSEUDO], measure: { "Clear button": { sel: 'button[aria-label="Clear input"]', props: CLEAR }, "Clear button hit area (::before)": { sel: 'button[aria-label="Clear input"]::before', props: HIT }, "Input": { sel: "input", props: ["width"] } } },
  { name: "tf-clearable-hover", story: TF("clearable"), steps: [PSEUDO, { hover: 'button[aria-label="Clear input"]' }], measure: { "Clear button": { sel: 'button[aria-label="Clear input"]', props: CLEAR } } },
  {
    name: "tf-clearable-emptied", story: TF("clearable"),
    steps: [PSEUDO, { click: 'button[aria-label="Clear input"]' }, { wait: 400 }],
    measure: { "Clear button (hidden state)": { sel: 'div[class*="relative flex items-center"] > button', props: CLEAR }, "Input": { sel: "input", props: ["width"] } },
  },
  {
    // value 0 -> 1 characters: the button should appear with a fade, not pop
    name: "tf-clearable-appear", story: TF("clearable"),
    steps: [{ click: 'button[aria-label="Clear input"]' }, { wait: 400 }, { click: "input" }, {
      eval: `(async () => { const rows = []; const t0 = performance.now(); const inp = document.querySelector("input"); inp.focus(); document.execCommand("insertText", false, "a"); await new Promise((done) => { const f = () => { const b = document.querySelector('div[class*="relative flex items-center"] > button'); const cs = b && getComputedStyle(b); rows.push({ t: Math.round(performance.now() - t0), opacity: cs ? +(+cs.opacity).toFixed(2) : null, transform: cs ? cs.transform : null, inputW: +inp.getBoundingClientRect().width.toFixed(1) }); performance.now() - t0 < 400 ? requestAnimationFrame(f) : done(); }; f(); }); return rows; })()`,
      after: 100,
    }],
    measure: { "Clear button": { sel: 'div[class*="relative flex items-center"] > button', props: CLEAR } },
  },

  // --- TextField: message reveal
  { name: "reveal-textfield", story: TF("usage") + NOROW, steps: [{ click: 'button[aria-label="Clear input"]' }, { wait: 300 }, sample(SAVE, "input, textarea", SAVE, MSGSEL)], measure: tfMeasure },

  // --- Textarea
  { name: "ta-helper", story: TA("with-helper-text"), measure: { "Textarea": { sel: "textarea", props: BOX }, "Message row (container)": { sel: 'div:has(> [id$="-helper"])', props: ["display", "grid-template-rows", "margin-top", "transition-property"] }, "Helper text": { sel: '[id$="-helper"]', props: MSG } } },
  { name: "ta-error-icon", story: TA("with-error"), measure: { "Textarea": { sel: "textarea", props: BOX }, "Error (role=alert)": { sel: '[id$="-error"]', props: [...MSG, "gap"] } } },
  {
    name: "reveal-textarea", story: TA("usage") + NOROW,
    steps: [{ click: "textarea" }, { eval: 'document.querySelector("textarea").select()' }, { key: "Backspace" }, { wait: 300 }, sample(SAVE, "input, textarea", SAVE, MSGSEL)],
    measure: { "Textarea": { sel: "textarea", props: BOX }, "Message row (container)": { sel: 'div:has(> [id$="-error"])', props: ["display", "grid-template-rows", "margin-top", "transition-property"] }, "Error message": { sel: MSGSEL, props: MSG } },
  },

  // --- PhoneInput
  { name: "pi-error", story: PI("error"), measure: { "Message wrapper": { sel: 'div:has(> div > [id$="-validation"]), div:has(> [id$="-validation"])', props: ["display", "gap", "row-gap"] }, "Error message": { sel: '[id$="-validation"]', props: MSG } } },
  {
    name: "reveal-phone", story: PI("usage") + "&args=helperText:!undefined",
    steps: [{ clickText: "Clear", within: "form" }, { wait: 300 }, sample(SAVE, 'input[type="tel"]', SAVE, '[id$="-validation"]')],
    measure: { "Message wrapper": { sel: 'div:has(> div > [id$="-validation"]), div:has(> [id$="-validation"])', props: ["display", "gap", "row-gap"] }, "Error message": { sel: '[id$="-validation"]', props: MSG } },
  },
];
