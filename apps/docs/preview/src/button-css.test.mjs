// Compile the actual docs preview configuration: a class-presence audit alone
// cannot catch Bootstrap's !important utilities hiding the spinner or border.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import postcss from "postcss";
import config from "../vite.config.mjs";

test("docs Button state rules outrank Bootstrap utilities", async () => {
  const bootstrap = await readFile(
    new URL(
      "../../../../node_modules/bootstrap/dist/css/bootstrap.css",
      import.meta.url
    ),
    "utf8"
  );
  const result = await postcss(config.css.postcss.plugins).process(
    `${bootstrap}\n@tailwind utilities;`,
    { from: undefined }
  );
  const declarations = [];
  result.root.walkDecls((declaration) =>
    declarations.push({
      selector: declaration.parent.selector,
      property: declaration.prop,
      value: declaration.value,
      important: Boolean(declaration.important),
    })
  );
  function rule(selector, property, value) {
    const index = declarations.findLastIndex(
      (item) =>
        item.selector === selector &&
        item.property === property &&
        item.value === value
    );
    assert(index >= 0, `Missing ${selector} { ${property}: ${value} }`);
    assert(declarations[index].important, `${selector} must outrank Bootstrap`);
    return index;
  }
  const hidden = rule(".opacity-0", "opacity", "0");
  assert(
    rule(
      '.data-\\[active\\=true\\]\\:opacity-100[data-active="true"]',
      "opacity",
      "1"
    ) > hidden
  );
  rule(".border-transparent", "border-color", "transparent");
  rule(".border-0", "border-width", "0px");
  rule(".border-current", "border-color", "currentColor");
  rule(".border-r-transparent", "border-right-color", "transparent");
  rule(
    '.data-\\[loading\\=true\\]\\:\\[animation-play-state\\:running\\][data-loading="true"]',
    "animation-play-state",
    "running"
  );
  rule(".p-0", "padding", "0px");
  rule(".w-8", "width", "2rem");
  rule(".w-10", "width", "2.5rem");
  rule(".w-11", "width", "2.75rem");
  rule(".h-8", "height", "2rem");
  rule(".h-10", "height", "2.5rem");
  rule(".h-11", "height", "2.75rem");
});
