// Alert: the close button (24px target, 16px icon, hover-gated colour). Everything else must stay identical.
const CLOSE = 'button[aria-label="Close alert"]';
const BTN = ["width", "height", "margin-top", "margin-left", "border-radius", "color", "background-color", "outline-width", "outline-style", "outline-color", "outline-offset", "transition-duration"];
const ICON = ["width", "height"];
const ROOT = ["height", "padding-top", "padding-left", "border-radius", "background-color", "border-top-color"];
const measure = {
  "Alert": { sel: "[role=alert]", props: ROOT },
  "Close button": { sel: CLOSE, props: BTN },
  "Close icon": { sel: CLOSE + " svg", props: ICON },
  "Status icon": { sel: "[role=alert] span.shrink-0 svg", props: ICON },
};
const W = { width: 900, height: 520 };
const sc = (name, story, steps = []) => ({ name, story, ...W, steps, measure });
export default [
  sc("inline-closable", "v2-components-alert--closable"),
  sc("inline-closable-hover", "v2-components-alert--closable", [{ hover: CLOSE }]),
  sc("inline-closable-focus", "v2-components-alert--closable", [{ key: "Tab" }]),
  sc("inline-closable-error", "v2-components-alert--error&args=closable:!true"),
  sc("header-closable", "v2-components-alert--header"),
  sc("overlay-closable", "v2-components-alert--overlay"),
  sc("inline-closable-actions", "v2-components-alert--complex-example"),
  sc("all-variants-closable", "v2-components-alert--all-variants&args=closable:!true"),
  sc("inline-not-closable", "v2-components-alert--default"),
];
