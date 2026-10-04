/**
 * PhoneInput before/after scenarios (design/verify/capture.mjs). The validation message reveal is shared with TextField and is
 * recorded in ../text-field (`reveal-phone`); this folder covers the country button and the static layout.
 */
const S = (n) => `v2-components-phone-input--${n}`;
const COUNTRY = '[data-testid="phone-input-country"]';
const INPUT = 'input[type="tel"]';
const BTN = ["width", "height", "border-radius", "background-color", "color", "outline-style", "outline-width", "outline-offset", "outline-color", "box-shadow", "transition-property", "transition-duration", "cursor"];
const m = () => ({
  "Container": { sel: `div:has(> ${COUNTRY})`, props: ["height", "border-top-color", "border-top-width", "border-radius", "box-shadow", "background-color"] },
  "Country button": { sel: COUNTRY, props: BTN },
  "Input": { sel: INPUT, props: ["height", "font-size", "color", "padding", "background-color"] },
  "Validation message": { sel: '[id$="-validation"]', props: ["color", "font-size", "line-height", "margin-top", "opacity", "transform"] },
  "Message wrapper": { sel: 'div:has(> div > [id$="-validation"]), div:has(> [id$="-validation"])', props: ["display", "gap", "row-gap"] },
});
const pressDigits = { type: "98765" };

export default [
  { name: "default", story: S("with-country-selector"), measure: m() },
  { name: "country-hover", story: S("with-country-selector"), steps: [{ hover: COUNTRY }], measure: m() },
  { name: "country-focus-visible", story: S("with-country-selector"), steps: [{ key: "Tab" }], measure: m() },
  { name: "country-click-focus", story: S("with-country-selector"), steps: [{ click: COUNTRY }, { key: "Escape" }], measure: m() },
  { name: "input-focus", story: S("with-country-selector"), steps: [{ key: "Tab", repeat: 2 }], measure: m() },
  { name: "filled", story: S("with-country-selector"), steps: [{ click: INPUT }, pressDigits], measure: m() },
  { name: "error", story: S("error"), measure: m() },
  { name: "disabled", story: S("disabled"), measure: m() },
  { name: "static-country (no button)", story: S("default"), measure: m() },
  { name: "narrow-error", story: S("error"), width: 320, measure: m() },
];
