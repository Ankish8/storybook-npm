// Compile the real iframe stylesheet, including Bootstrap, so a reserved icon
// slot cannot silently disappear through utility ordering or missing CSS output.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import postcss from "postcss";
import config from "../vite.config.mjs";

test("field text and search icon slots override Bootstrap and shared input padding", async () => {
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
    assert(
      declarations[index].important,
      `${selector} must override Bootstrap`
    );
    return index;
  }
  assert(
    rule(".pl-10", "padding-left", "2.5rem") >
      rule(".px-3", "padding-left", "0.75rem")
  );
  assert(
    rule(".pr-11", "padding-right", "2.75rem") >
      rule(".px-3", "padding-right", "0.75rem")
  );
  rule(".font-normal", "font-weight", "400");
  rule(".font-medium", "font-weight", "500");
  rule(
    ".bg-semantic-bg-primary",
    "background-color",
    "var(--semantic-bg-primary)"
  );
  rule(".rounded-none", "border-radius", "0px");
});
