// EmptyState. Selectors avoid class names so the same file measures both versions.
const BOX = ["padding-top", "padding-left", "row-gap", "width", "height"];
const TILE = ["width", "height", "border-top-left-radius", "box-shadow", "background-color", "color"];
const TITLE = ["font-size", "line-height", "font-weight", "color"];
const DESC = ["font-size", "line-height", "color"];
const measure = () => ({
  "Root": { sel: "#storybook-root [data-slot=empty-state]", props: BOX },
  "Icon tile": { sel: "#storybook-root [data-slot=empty-state] > div:first-child", props: TILE },
  "Icon": { sel: "#storybook-root [data-slot=empty-state] > div:first-child svg", props: ["width", "height"] },
  "Title": { sel: "#storybook-root [data-slot=empty-state] p:first-of-type", props: TITLE },
  "Description": { sel: "#storybook-root [data-slot=empty-state] p:nth-of-type(2)", props: DESC },
  "Text group": { sel: "#storybook-root [data-slot=empty-state] > div:nth-child(2)", props: ["row-gap"] },
});
export default [
  { name: "01-default", story: "v2-components-emptystate--overview", measure: measure() },
  { name: "02-small", story: "v2-components-emptystate--small", measure: measure() },
  { name: "03-default-no-icon", story: "v2-components-emptystate--no-icon", measure: measure() },
  { name: "04-default-narrow-360", story: "v2-components-emptystate--overview", width: 360, height: 700, measure: measure() },
  { name: "05-small-narrow-360", story: "v2-components-emptystate--small", width: 360, height: 500, measure: measure() },
];
