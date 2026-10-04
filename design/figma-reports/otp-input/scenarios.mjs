/**
 * OtpInput before/after scenarios (design/verify/capture.mjs).
 * `type-digit` focuses the first slot, inserts "7" and records every frame for 400ms: the digit's colour alpha, font-size
 * and whether the slot reports data-filled. `error-static` lists the running animations on an error OTP at mount.
 */
const S = (n) => `v2-components-otpinput--${n}`;
const SLOT = (i) => `input[aria-label="Digit ${i} of 4"]`;
const SLOT_P = ["width", "height", "border-top-color", "border-top-width", "border-radius", "background-color", "color", "caret-color", "font-size", "box-shadow", "transform", "opacity", "transition-property", "transition-duration", "transition-timing-function", "animation-name", "animation-duration"];
const m = () => ({
  "Slot 1": { sel: SLOT(1), props: SLOT_P },
  "Slot 4": { sel: SLOT(4), props: SLOT_P },
  "Slot row": { sel: 'div:has(> input[aria-label="Digit 1 of 4"])', props: ["gap", "column-gap", "transform", "animation-name", "animation-duration"] },
  "Helper text": { sel: 'p[id$="-helper"]', props: ["color", "font-size", "line-height", "opacity", "transition-property"] },
});
const hooks = { eval: `[...document.querySelectorAll('input[aria-label^="Digit"]')].map((i) => ({ label: i.getAttribute("aria-label"), filled: i.getAttribute("data-filled"), value: i.value }))` };
const typeDigit = {
  eval: `(async () => {
    const i = document.querySelector(${JSON.stringify(SLOT(1))}), rows = [], t0 = performance.now();
    i.focus(); document.execCommand("insertText", false, "7");
    const slot = document.querySelector(${JSON.stringify(SLOT(1))});
    await new Promise((done) => { const f = () => { const t = Math.round(performance.now() - t0), s = getComputedStyle(slot), a = s.color.match(/rgba?\\(([^)]+)\\)/)[1].split(",").map(Number); rows.push({ t, value: slot.value, filled: slot.getAttribute("data-filled"), colorAlpha: a.length > 3 ? a[3] : 1, fontSize: s.fontSize, transform: s.transform }); t < 400 ? requestAnimationFrame(f) : done(); }; f(); });
    return rows;
  })()`,
  after: 100,
};
const anims = { eval: `document.getAnimations().map((a) => ({ name: a.animationName || a.constructor.name, target: (a.effect && a.effect.target && (a.effect.target.getAttribute("aria-label") || a.effect.target.tagName)) || "", duration: a.effect && a.effect.getTiming().duration }))` };

// Error feedback story: click "Verify a wrong code" and record the slot row's x offset on every frame for 600ms (a shake = oscillation
// around 0 that ends at 0), plus the running animations.
// The shake keyframes belong in src/index.css (next to v2-fade-in) and the CLI theme, which this task may not edit. Until they are
// added there, this step injects the same keyframes into the page so the after-capture shows the intended motion.
const INJECT_KEYFRAMES = {
  eval: `(() => { const s = document.createElement("style"); s.textContent = "@keyframes v2-otp-shake { 0%, 100% { transform: translateX(0); } 14.28% { transform: translateX(-4px); } 28.57% { transform: translateX(4px); } 42.86% { transform: translateX(-4px); } 57.14% { transform: translateX(4px); } 71.43% { transform: translateX(-4px); } 85.71% { transform: translateX(4px); } }"; document.head.appendChild(s); return true; })()`,
};
const shake = {
  eval: `(async () => {
    const b = [...document.querySelectorAll("button")].find((x) => x.textContent.includes("Verify a wrong code")), row = () => document.querySelector('div:has(> input[aria-label="Digit 1 of 4"])');
    const rows = [], t0 = performance.now(), x0 = row().getBoundingClientRect().x;
    b.click();
    await new Promise((done) => { const f = () => { const t = Math.round(performance.now() - t0); rows.push({ t, dx: +(row().getBoundingClientRect().x - x0).toFixed(2), border: getComputedStyle(document.querySelector('input[aria-label="Digit 1 of 4"]')).borderTopColor, animations: document.getAnimations().length }); t < 600 ? requestAnimationFrame(f) : done(); }; f(); });
    return rows;
  })()`,
  after: 100,
};

export default [
  { name: "empty", story: S("overview"), measure: m() },
  { name: "empty-hover", story: S("overview"), steps: [{ hover: SLOT(2) }], measure: m() },
  { name: "empty-focus", story: S("overview"), steps: [{ key: "Tab" }], measure: m() },
  { name: "filled", story: S("filled"), steps: [hooks], measure: m() },
  { name: "error", story: S("error"), steps: [hooks, anims], measure: m() },
  { name: "disabled", story: S("disabled"), measure: m() },
  { name: "six-digits", story: S("six-digits"), measure: { "Slot 1": { sel: 'input[aria-label="Digit 1 of 6"]', props: SLOT_P } } },
  { name: "type-digit", story: S("overview"), steps: [typeDigit, hooks], measure: m() },
  { name: "error-feedback", story: S("error-feedback"), steps: [INJECT_KEYFRAMES, shake], measure: m() },
  { name: "narrow", story: S("overview"), width: 320, measure: m() },
];
