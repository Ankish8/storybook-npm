import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const versions = {
  "2.6": require(process.argv[2]).twMerge,
  "3.4": require("tailwind-merge").twMerge,
};
const combinations = [
  "focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-semantic-primary",
  "border-[0.4px] border-solid border-semantic-border-layout",
  "font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal text-xs",
  "font-[family-name:var(--font-v2,Inter,sans-serif)] font-semibold text-sm tracking-[0.014px]",
  "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--semantic-primary-surface)]",
  "focus:outline-none focus:border-semantic-border-accent focus:shadow-[0_0_4px_rgba(39,171,184,0.4)]",
  "data-[state=checked]:bg-semantic-primary data-[state=checked]:enabled:hover:bg-semantic-primary-hover data-[state=checked]:disabled:bg-semantic-disabled-primary",
  "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[disabled]:data-[state=checked]:bg-semantic-primary-surface",
];
for (const [version, merge] of Object.entries(versions)) {
  for (const classes of combinations) assert.equal(merge(classes), classes, version + ": " + classes);
  assert(merge(combinations[0] + " focus-visible:outline-none").split(" ").includes("focus-visible:outline-none"));
  assert.equal(merge("h-6 px-2 h-10 px-4"), "h-10 px-4");
  console.log(version + ": " + (combinations.length + 2) + " merging checks passed");
}
