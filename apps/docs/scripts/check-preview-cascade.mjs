#!/usr/bin/env node
// Check the files the browser actually receives. Compiling Bootstrap followed
// by Tailwind in a test misses production CSS chunks being linked in reverse.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const output = path.resolve(
  process.argv[2] ??
    path.join(path.dirname(fileURLToPath(import.meta.url)), "../public/preview")
);

function attributes(tag) {
  return Object.fromEntries(
    Array.from(tag.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/g), (match) => [
      match[1].toLowerCase(),
      match[3],
    ])
  );
}

async function stylesheets(entry) {
  const html = await readFile(path.join(output, `${entry}.html`), "utf8");
  const files = [];
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const { rel, href } = attributes(match[0]);
    if (rel !== "stylesheet" || !href) continue;
    const url = new URL(href, "http://preview.test/preview/");
    if (url.origin !== "http://preview.test") continue;
    const asset = url.pathname.match(/\/(assets\/.*\.css)$/)?.[1];
    assert(asset, `${entry}: unexpected built stylesheet ${href}`);
    const filename = path.resolve(output, decodeURIComponent(asset));
    assert(
      filename.startsWith(`${output}${path.sep}`),
      `${entry}: stylesheet escapes the preview output`
    );
    files.push(filename);
  }
  assert(files.length > 0, `${entry}: no built stylesheets found`);
  return Promise.all(files.map((filename) => readFile(filename, "utf8")));
}

// These plain class selectors have equal specificity. Track importance and
// source order, expanding Bootstrap's border shorthand so a late .border rule
// cannot silently replace a component's semantic border color.
function cascade(styles, classes) {
  const selectors = new Set(classes.map((name) => `.${name}`));
  const properties = new Map();
  const set = (property, declaration) => {
    const previous = properties.get(property);
    if (!previous?.important || declaration.important)
      properties.set(property, declaration);
  };
  for (const source of styles) {
    postcss.parse(source).walkRules((rule) => {
      if (!rule.selectors.some((selector) => selectors.has(selector))) return;
      rule.walkDecls((declaration) => {
        const value = {
          value: declaration.value,
          important: Boolean(declaration.important),
        };
        if (declaration.prop === "border") {
          set("border-color", value);
          set("border-width", value);
        } else {
          set(declaration.prop, value);
        }
      });
    });
  }
  return properties;
}

for (const entry of ["index", "example"]) {
  const styles = await stylesheets(entry);
  const padding = cascade(styles, ["px-4"]);
  for (const property of ["padding-left", "padding-right"])
    assert.equal(
      padding.get(property)?.value,
      "1rem",
      `${entry}: Bootstrap overrides Tailwind ${property} for px-4`
    );
  const border = cascade(styles, ["border", "border-v2-semantic-border-input"]);
  assert(
    border.get("border-color")?.value.includes("--v2-semantic-border-input"),
    `${entry}: Bootstrap overrides the v2 semantic input border color`
  );
  for (const [classes, property, expected] of [
    [["opacity-0"], "opacity", "0"],
    [["opacity-100"], "opacity", "1"],
    [["inline-flex"], "display", "inline-flex"],
  ]) {
    const actual = cascade(styles, classes).get(property);
    assert.equal(
      actual?.value,
      expected,
      `${entry}: missing ${classes[0]} rule`
    );
    assert(
      actual.important,
      `${entry}: ${classes[0]} cannot outrank Bootstrap`
    );
  }
  console.log(
    `Preview CSS cascade verified: ${entry} (${styles.length} assets)`
  );
}
