// Skeleton. Selectors avoid class names so the same file measures both versions.
const BAR = ["background-color", "border-top-left-radius", "height", "width", "opacity", "overflow", "position", "animation-name", "animation-duration", "animation-timing-function", "animation-iteration-count", "animation-delay"];
export default [
  { name: "01-default-pulse", story: "v2-components-skeleton--overview", measure: { "Skeleton line": { sel: "#storybook-root [aria-hidden=true]", props: BAR } } },
  { name: "02-subtle", story: "v2-components-skeleton--subtle", measure: { "Skeleton line": { sel: "#storybook-root [aria-hidden=true]", props: BAR } } },
  { name: "03-shapes", story: "v2-components-skeleton--all-shapes", measure: { "Circle": { sel: "#storybook-root section:nth-child(2) [aria-hidden=true]", props: BAR } } },
  // Shimmer/pulse frames are paused (shimmer 35% through its sweep, pulse at its 50% dip) so the still shows the effect.
  // capture.mjs measures elements only, so the pseudo-element band is read with an eval step (see "evals" in the .json).
  { name: "04-shimmer-line", story: "v2-components-skeleton--shimmer", steps: [{ wait: 400 }, { eval: "document.getAnimations().forEach(a=>{a.pause();a.currentTime=a.animationName==='enter'?560:1000});document.getAnimations().length" }, {
    eval: "(()=>{const e=document.querySelector('#storybook-root [aria-hidden=true]');const s=getComputedStyle(e,'::after');return Object.fromEntries(['content','position','background-image','transform','animation-name','animation-duration','animation-timing-function','animation-iteration-count','animation-delay'].map(p=>[p,s.getPropertyValue(p)]))})()",
  }], measure: { "Skeleton line": { sel: "#storybook-root [aria-hidden=true]", props: BAR } } },
  { name: "05-animations-compared", story: "v2-components-skeleton--animations", width: 920, height: 420, steps: [{ wait: 500 }, { eval: "document.getAnimations().forEach(a=>{a.pause();a.currentTime=a.animationName==='enter'?560:1000});document.getAnimations().length" }], measure: {
    "Pulse circle": { sel: "#storybook-root section:nth-child(1) [aria-hidden=true]", props: BAR },
    "Shimmer circle": { sel: "#storybook-root section:nth-child(2) [aria-hidden=true]", props: BAR },
    "None circle": { sel: "#storybook-root section:nth-child(3) [aria-hidden=true]", props: BAR },
  } },
  { name: "06-usage-loading", story: "v2-components-skeleton--usage", measure: { "Avatar placeholder": { sel: "#storybook-root [aria-hidden=true]", props: BAR } } },
];
