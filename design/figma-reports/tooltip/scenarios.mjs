// Tooltip: 1px inset edge, instant follow-up (keyboard focus opens in Radix "instant-open"), hover opens "delayed-open".
const BUBBLE = ["background-color", "border-radius", "box-shadow", "padding-left", "padding-top", "font-size", "color", "animation-duration", "animation-timing-function", "animation-name"];
const measure = {
  "Tooltip surface": { sel: "[data-radix-popper-content-wrapper] > [data-side]", props: BUBBLE },
};
const state = { eval: "(() => { const t = document.querySelector('[data-radix-popper-content-wrapper] > [data-side]'); return t && [t.getAttribute('data-state'), getComputedStyle(t).animationDuration, getComputedStyle(t).boxShadow].join(' | '); })()" };
const T = "[data-state=closed], [data-state=delayed-open], [data-state=instant-open]";
export default [
  { name: "01-closed", story: "v2-components-tooltip--overview", measure },
  { name: "02-hover-open", story: "v2-components-tooltip--overview", steps: [{ hover: "main button, #storybook-root button" }, { wait: 400 }, state], measure },
  { name: "03-focus-open-instant", story: "v2-components-tooltip--overview", steps: [{ key: "Tab" }, { wait: 150 }, state], measure },
  { name: "04-with-title", story: "v2-components-tooltip--with-title", steps: [{ hover: "#storybook-root button" }, { wait: 400 }], measure },
  { name: "05-bottom", story: "v2-components-tooltip--bottom", steps: [{ hover: "#storybook-root button" }, { wait: 400 }], measure },
  { name: "06-long-content", story: "v2-components-tooltip--long-content", steps: [{ hover: "#storybook-root button" }, { wait: 400 }], measure },
  { name: "07-no-arrow", story: "v2-components-tooltip--without-arrow", steps: [{ hover: "#storybook-root button" }, { wait: 400 }], measure },
  { name: "08-narrow", story: "v2-components-tooltip--long-content", width: 340, height: 500, steps: [{ hover: "#storybook-root button" }, { wait: 400 }], measure },
];
