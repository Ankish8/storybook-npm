// Pagination. Selectors avoid class names so the same file measures both versions.
const LINK = ["height", "min-width", "padding-left", "padding-right", "font-size", "font-weight", "font-variant-numeric", "color", "background-color", "border-top-width", "border-top-color", "border-radius", "transform", "transition-duration", "transition-property", "outline-style", "outline-offset", "opacity"];
const ICON = ["width", "height"];
const measure = () => ({
  "Active page link": { sel: "#storybook-root a[aria-current=page]", props: LINK },
  "Inactive page link": { sel: "#storybook-root a[data-slot=pagination-link]:not([aria-current]):not([aria-label])", props: LINK },
  "Previous link": { sel: "#storybook-root a[aria-label='Go to previous page']", props: LINK },
  "Next link": { sel: "#storybook-root a[aria-label='Go to next page']", props: LINK },
  "Page list": { sel: "#storybook-root ul[data-slot=pagination-content]", props: ["gap", "column-gap"] },
});
const INACTIVE = "#storybook-root a[data-slot=pagination-link]:not([aria-current]):not([aria-label])";
export default [
  { name: "01-middle-page", story: "v2-components-pagination--with-more-pages", height: 300, measure: measure() },
  { name: "02-first-page", story: "v2-components-pagination--first-page-active", height: 300, measure: measure() },
  { name: "03-last-page", story: "v2-components-pagination--last-page-active", height: 300, measure: measure() },
  { name: "04-hover-inactive-page", story: "v2-components-pagination--with-more-pages", height: 300, steps: [{ hover: INACTIVE }], measure: measure() },
  { name: "05-hover-active-page", story: "v2-components-pagination--with-more-pages", height: 300, steps: [{ hover: "#storybook-root a[aria-current=page]" }], measure: measure() },
  { name: "06-focus-visible-first-tab", story: "v2-components-pagination--with-more-pages", height: 300, steps: [{ key: "Tab" }, { eval: "document.activeElement.getAttribute('aria-label')||document.activeElement.textContent" }], measure: measure() },
  { name: "07-widget-with-summary", story: "v2-components-pagination--widget", height: 300, measure: { ...measure(), "Summary text": { sel: "#storybook-root [data-slot=pagination-info]", props: ["font-size", "font-variant-numeric", "color"] } } },
  { name: "08-widget-narrow-360", story: "v2-components-pagination--with-item-count", width: 360, height: 400, measure: measure() },
  { name: "09-narrow-360", story: "v2-components-pagination--with-more-pages", width: 360, height: 300, measure: measure() },
];
