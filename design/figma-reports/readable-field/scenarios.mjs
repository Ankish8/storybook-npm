/**
 * ReadableField before/after scenarios (design/verify/capture.mjs).
 * Headless Chrome has no clipboard permission, so `copy-*` scenarios stub navigator.clipboard.writeText
 * (resolve for success, reject for failure) before clicking Copy.
 * `copy-frames` records every frame for 600ms after the click: the opacity/scale of each icon inside the Copy button,
 * the button's aria-label and the text of any role=status element; then again 2.3s later (the 2000ms hold must end).
 */
const OK = { eval: `Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.resolve() }, configurable: true })` };
const FAIL = { eval: `Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) }, configurable: true })` };
const S = (n) => `v2-components-readablefield--${n}`;
const COPY = 'button[aria-label="Copy to clipboard"], button[aria-label="Copied"], button[aria-label="Copy failed"]';

const BTN = ["color", "width", "height", "border-radius", "transform", "outline-style", "outline-width", "outline-offset", "outline-color", "transition-property", "transition-duration", "transition-timing-function", "cursor", "position"];
const ICON = ["width", "height", "opacity", "transform", "color", "animation-name", "animation-duration", "transition-property", "transition-duration"];
const m = () => ({
  "Field container": { sel: 'div:has(> span.truncate)', props: ["height", "background-color", "border-top-color", "border-radius", "box-shadow", "padding", "gap"] },
  "Value": { sel: "span.truncate", props: ["color", "font-size", "letter-spacing", "user-select", "-webkit-user-select"] },
  "Copy button": { sel: COPY, props: BTN },
  "Copy icon box": { sel: `${COPY} > span, ${COPY} > svg`, props: ICON },
  "Check icon (always mounted after)": { sel: `${COPY} svg.lucide-check`, props: ICON },
  "Failure X icon (always mounted after)": { sel: `${COPY} svg.lucide-x`, props: ICON },
  "Status (sr-only)": { sel: '[role="status"]', props: ["position", "width", "height", "overflow", "clip", "clip-path"] },
});

const frames = (ms2 = 2300) => ({
  eval: `(async () => {
    const b = document.querySelector(${JSON.stringify(COPY)}), rows = [], t0 = performance.now();
    const snap = (t) => ({ t, label: document.querySelector(${JSON.stringify(COPY)}).getAttribute("aria-label"), status: [...document.querySelectorAll('[role="status"]')].map((e) => e.textContent).join("|"), icons: [...document.querySelectorAll(${JSON.stringify(COPY)} + "")].length, svgs: [...document.querySelector(${JSON.stringify(COPY)}).querySelectorAll("svg")].map((s) => (s.getAttribute("class") || "").match(/lucide-[a-z-]+/)?.[0] + ":" + (+getComputedStyle(s).opacity).toFixed(2) + ":" + getComputedStyle(s).transform.replace("matrix", "m")) });
    b.click();
    await new Promise((done) => { const f = () => { const t = Math.round(performance.now() - t0); rows.push(snap(t)); t < 600 ? requestAnimationFrame(f) : done(); }; f(); });
    await new Promise((r) => setTimeout(r, ${ms2}));
    rows.push(snap(Math.round(performance.now() - t0)));
    return rows;
  })()`,
  after: 100,
});

export default [
  { name: "default", story: S("overview"), measure: m() },
  { name: "copy-hover", story: S("overview"), steps: [{ hover: COPY }], measure: m() },
  { name: "copy-focus", story: S("overview"), steps: [{ key: "Tab" }], measure: m() },
  { name: "secret", story: S("secret"), measure: m() },
  { name: "copy-frames", story: S("overview"), steps: [OK, frames()], measure: m() },
  { name: "copied", story: S("overview"), steps: [OK, { click: COPY }, { wait: 400 }], measure: m() },
  { name: "copy-failed", story: S("overview"), steps: [FAIL, { click: COPY }, { wait: 400 }], measure: m() },
  { name: "narrow-long-value", story: S("base-url"), width: 300, measure: m() },
];
