// Avatar: (a) a failing image now falls back to initials/icon, (b) new AvatarGroup export.
// `src:broken-image` is a relative URL that 404s inside the Storybook iframe, which is how a dead avatar URL behaves.
// AvatarGroup did not exist before: the "before" run captures the closest existing story (individual, non-overlapping avatars).
const label = process.argv[process.argv.indexOf("--label") + 1];
const AV = ["width", "height", "border-radius", "background-color", "color", "font-size", "font-weight", "box-shadow", "margin-left", "margin-inline-start"];
const IMG = ["width", "height", "border-radius", "object-fit"];
const W = { width: 900, height: 480 };
const groupStory = label === "before" ? "v2-components-avatar--states" : "v2-components-avatar--group";
const groupSizesStory = label === "before" ? "v2-components-avatar--all-sizes" : "v2-components-avatar--group-sizes";
// Per group: every child's box and ring, to prove the +N tile matches its neighbours at each size and the overlap is 8px.
const GROUPS = `(() => [...document.querySelectorAll('[role=group]')].map((g) => { const kids = [...g.children].map((k) => { const r = k.getBoundingClientRect(); return { w: r.width, h: r.height, left: r.left, shadow: getComputedStyle(k).boxShadow, text: k.textContent.trim() }; }); return kids.map((k, i) => ({ ...k, overlapWithPrev: i ? +(kids[i - 1].left + kids[i - 1].w - k.left).toFixed(2) : null })); }))()`;
export default [
  { name: "sizes-initials", story: "v2-components-avatar--all-sizes", ...W, measure: { "Avatar (xs)": { sel: "#storybook-root [role=img]", props: AV } } },
  { name: "sizes-icon", story: "v2-components-avatar--all-sizes&args=customContent:person", ...W, measure: { "Avatar (xs)": { sel: "#storybook-root [role=img]", props: AV } } },
  { name: "states-image-initials-icon", story: "v2-components-avatar--states", ...W, measure: { "Avatar": { sel: "#storybook-root [role=img]", props: AV }, "Image": { sel: "#storybook-root img", props: IMG } } },
  { name: "with-image", story: "v2-components-avatar--with-image", ...W, measure: { "Avatar": { sel: "#storybook-root [role=img]", props: AV }, "Image": { sel: "#storybook-root img", props: IMG } } },
  { name: "status", story: "v2-components-avatar--with-status", ...W, measure: { "Avatar": { sel: "#storybook-root [role=img]", props: AV } } },
  // A dead URL: before = broken-image glyph / alt text, after = initials (identical to "no src").
  { name: "broken-image", story: "v2-components-avatar--overview&args=src:broken-image", width: 500, height: 300, measure: { "Avatar": { sel: "#storybook-root [role=img]", props: AV }, "Image": { sel: "#storybook-root img", props: IMG } }, steps: [{ wait: 600 }] },
  { name: "broken-image-icon-fallback", story: "v2-components-avatar--custom-content&args=src:broken-image", width: 500, height: 300, measure: { "Avatar": { sel: "#storybook-root [role=img]", props: AV }, "Image": { sel: "#storybook-root img", props: IMG } }, steps: [{ wait: 600 }] },
  { name: "group", story: groupStory, ...W, measure: { "Group": { sel: "#storybook-root [role=group]", props: ["display", "width", "height"] }, "Avatar (second)": { sel: "#storybook-root [role=group] > [role=img]:nth-child(2)", props: AV }, "Overflow tile": { sel: "#storybook-root [role=group] > [role=img]:last-child", props: AV } } },
  { name: "group-sizes", story: groupSizesStory, ...W, steps: [{ eval: GROUPS }], measure: {} },
];
