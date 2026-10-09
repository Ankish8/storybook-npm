#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(appRoot, "../..");
const requireRoot = createRequire(join(repoRoot, "package.json"));
const { parse: parseYaml } = requireRoot("yaml");
const directory = join(repoRoot, "src/components/ui/v2");
const catalogPath = join(appRoot, "lib/catalog.ts");
const output = ts.transpileModule(await readFile(catalogPath, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const {
  components,
  categories,
  getComponent,
  pageTree,
  entryHref,
  blocks,
  uiComponents,
} = await import(
  `data:text/javascript;base64,${Buffer.from(output.outputText).toString("base64")}`
);

const slugs = components.map((component) => component.slug);
assert.equal(
  slugs.length,
  54,
  "Expected all 54 v2 components (v1 dialog, form-modal, confirmation-modal and delete-confirmation-modal are merged into modal; radio is part of checkbox)."
);
assert.equal(
  new Set(slugs).size,
  slugs.length,
  "Catalog slugs must be unique."
);
const files = await readdir(directory);
const sourceSlugs = files
  .filter((file) => file.endsWith(".tsx") && !file.endsWith(".stories.tsx"))
  .map((file) => file.slice(0, -4))
  .sort();
assert.deepEqual(
  [...slugs].sort(),
  sourceSlugs,
  "Catalog must match every current v2 source file."
);
const registry = parseYaml(
  await readFile(join(repoRoot, "packages/cli/components.yaml"), "utf8")
);
const registrySlugs = Object.keys(registry.components)
  .filter((key) => key.startsWith("v2-"))
  .map((key) => key.slice(3))
  .sort();
assert.deepEqual(
  [...slugs].sort(),
  registrySlugs,
  "Catalog must match the v2 CLI registry."
);

const categoryIds = new Set(categories.map((category) => category.id));
for (const component of components) {
  assert.match(component.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert(
    categoryIds.has(component.category),
    `Unknown category: ${component.slug}`
  );
  assert(
    component.title.trim() && component.description.trim(),
    `Missing text: ${component.slug}`
  );
  assert.equal(getComponent(component.slug), component);
  await access(join(directory, `${component.slug}.tsx`));
  const story = await readFile(
    join(directory, `${component.slug}.stories.tsx`),
    "utf8"
  );
  assert.match(
    story,
    /title:\s*['"]V2\/Components\//,
    `Missing v2 story metadata: ${component.slug}`
  );
}
assert.equal(
  getComponent("../button"),
  undefined,
  "Traversal is not a valid catalog slug."
);
assert.equal(
  getComponent("button.stories"),
  undefined,
  "A filename is not a valid catalog slug."
);
assert.equal(
  getComponent("v1-button"),
  undefined,
  "v1 is not part of this catalog."
);

const urls = [];
function collect(nodes) {
  for (const node of nodes) {
    if (node.type === "page") urls.push(node.url);
    if (node.type === "folder") collect(node.children);
  }
}
collect(pageTree.children);
assert.equal(
  new Set(urls).size,
  urls.length,
  "The component library cannot have duplicate page URLs."
);
assert.deepEqual(
  [...urls].sort(),
  [
    "/",
    "/foundations",
    ...uiComponents.map((component) => `/components/${component.slug}`),
    ...blocks.map((block) => `/blocks/${block.slug}`),
  ].sort()
);
// Blocks are ready-made product UI. Moving one is a deliberate, reviewed decision, so the list is spelled out.
assert.deepEqual(
  blocks.map((block) => block.slug).sort(),
  [
    // Chat: Custom/Chat/* in the v1 Storybook.
    "contact-list-item",
    "date-divider",
    "image-media",
    "reply-quote",
    "system-message",
    "unread-separator",
    // Product form patterns.
    "creatable-multi-select",
    "creatable-select",
    "readable-field",
    "search-filter",
    // Page chrome.
    "page-footer",
    "page-header",
  ].sort(),
  "Unexpected set of blocks."
);
assert.equal(uiComponents.length + blocks.length, components.length);
for (const block of blocks) {
  assert.equal(entryHref(block), `/blocks/${block.slug}`);
  for (const related of block.related ?? [])
    assert(
      getComponent(related),
      `Unknown related slug on ${block.slug}: ${related}`
    );
}
for (const component of uiComponents)
  assert.equal(entryHref(component), `/components/${component.slug}`);
assert.deepEqual(
  JSON.parse(JSON.stringify({ components, pageTree })),
  { components, pageTree },
  "Catalog and page tree must stay serializable."
);
// Exercise the real route handlers; no server or browser harness is needed.
const catalogModule = `data:text/javascript;base64,${Buffer.from(output.outputText).toString("base64")}`;
async function routeHandler(file) {
  let source = await readFile(join(appRoot, file), "utf8");
  source = source.replace("@docs/lib/catalog", catalogModule);
  const js = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  return (
    await import(
      `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`
    )
  ).GET;
}
const sourceGET = await routeHandler("app/api/source/route.ts");
let sourceChecks = 0;
for (const slug of slugs) {
  for (const mode of ["component", "story"]) {
    const response = await sourceGET(
      new Request(`http://localhost/api/source?slug=${slug}&mode=${mode}`)
    );
    assert.equal(response.status, 200, `Source handler: ${slug} ${mode}`);
    const actual = await response.json();
    const file = `${slug}${mode === "story" ? ".stories" : ""}.tsx`;
    assert.deepEqual(actual, {
      slug,
      mode,
      filename: `src/components/ui/v2/${file}`,
      source: await readFile(join(directory, file), "utf8"),
    });
    sourceChecks++;
  }
}
for (const slug of [
  "../button",
  "../../package.json",
  "/etc/passwd",
  "button.stories",
  "v1-button",
]) {
  const response = await sourceGET(
    new Request(`http://localhost/api/source?slug=${encodeURIComponent(slug)}`)
  );
  assert.equal(response.status, 404, `Reject unknown slug: ${slug}`);
  assert.deepEqual(await response.json(), { error: "Unknown component." });
}
for (const mode of ["raw", "../button", ""]) {
  const response = await sourceGET(
    new Request(
      `http://localhost/api/source?slug=button&mode=${encodeURIComponent(mode)}`
    )
  );
  assert.equal(response.status, 400, `Reject unknown mode: ${mode}`);
}
const searchGET = await routeHandler("app/api/search/route.ts");
const queries = [
  ["tabs", "/components/tabs"],
  ["date range picker", "/components/date-range-picker"],
  ["button", "/components/button"],
  ["foundations", "/foundations"],
  ["creatable multi", "/blocks/creatable-multi-select"],
  ["blocks", "/blocks/creatable-multi-select"],
];
for (const [query, url] of queries) {
  const response = await searchGET(
    new Request(
      `http://localhost/api/search?query=${encodeURIComponent(query)}`
    )
  );
  assert.equal(response.status, 200, `Search handler: ${query}`);
  const results = await response.json();
  assert(
    Array.isArray(results) &&
      results.some((result) => result.type === "page" && result.url === url),
    `Search must find ${url}`
  );
}

console.log(
  JSON.stringify(
    {
      components: uiComponents.length,
      blocks: blocks.length,
      stories: components.length,
      cliEntries: registrySlugs.length,
      categories: categories.length,
      pages: urls.length,
      sourceChecks,
      rejectedSourceInputs: 8,
      searchQueries: queries.length,
      serializable: true,
      complete: true,
    },
    null,
    2
  )
);
