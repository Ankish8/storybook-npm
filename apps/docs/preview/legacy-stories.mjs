import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import postcss from "postcss";
import { earlierV2Slugs } from "../lib/migration-history.mjs";

const manifest = "virtual:docs-legacy-stories";
const storyPrefix = "virtual:docs-legacy-story/";
const earlierPrefix = "virtual:docs-earlier-story/";
const css = "virtual:docs-legacy-preview.css";

/** Rebase only real import/export declarations; example strings in documentation stay untouched. */
export function rewriteLegacyStory(
  source,
  filename,
  repository,
  merged,
  earlier = false
) {
  const ui = path.join(repository, "src/components/ui");
  const fromDirectory = earlier
    ? path.join(repository, "apps/docs/preview/before")
    : ui;
  const parsed = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const edits = [];
  for (const statement of parsed.statements) {
    const specifier =
      (ts.isImportDeclaration(statement) ||
        ts.isExportDeclaration(statement)) &&
      statement.moduleSpecifier;
    if (
      !specifier ||
      !ts.isStringLiteral(specifier) ||
      !specifier.text.startsWith(".")
    )
      continue;
    const original = path.resolve(path.dirname(filename), specifier.text);
    let replacement = original;
    if (
      path.dirname(original) === fromDirectory &&
      path.basename(original) !== "story-docs"
    ) {
      const name = path.basename(original).replace(/\.tsx?$/, "");
      replacement = path.join(ui, "v2", `${merged[name] ?? name}.tsx`);
    } else if (
      original ===
      path.join(repository, "src/components/custom/login/otp-input")
    ) {
      replacement = path.join(
        repository,
        "apps/docs/preview/src/legacy-otp-adapter.tsx"
      );
    }
    edits.push({
      start: specifier.getStart(parsed),
      end: specifier.end,
      text: JSON.stringify(replacement),
    });
  }
  return edits
    .reverse()
    .reduce(
      (text, edit) =>
        text.slice(0, edit.start) + edit.text + text.slice(edit.end),
      source
    );
}

/** Exact unchanged legacy sources plus an import-remapped replay of those same stories. */
export default function legacyStories({
  repository,
  tailwindcss,
  rootTailwind,
}) {
  const ui = path.join(repository, "src/components/ui");
  let sources;
  let snapshots;
  let merged;
  async function inventory() {
    if (sources) return sources;
    merged = JSON.parse(
      await fs.readFile(
        path.join(repository, "design/verify/merged-components.json"),
        "utf8"
      )
    );
    sources = Object.fromEntries(
      (await fs.readdir(ui))
        .filter((file) => file.endsWith(".stories.tsx"))
        .map((file) => [file.replace(".stories.tsx", ""), path.join(ui, file)])
    );
    sources["login-otp-input"] = path.join(
      repository,
      "src/components/custom/login/otp-input.stories.tsx"
    );
    const before = path.join(repository, "apps/docs/preview/before");
    snapshots = Object.fromEntries(
      (await fs.readdir(before))
        .filter(
          (file) =>
            file.endsWith(".review.tsx") &&
            earlierV2Slugs.includes(file.replace(".review.tsx", ""))
        )
        .map((file) => [
          file.replace(".review.tsx", ""),
          path.join(before, file),
        ])
    );
    return sources;
  }
  return {
    name: "docs-live-legacy-stories",
    enforce: "pre",
    resolveId(id) {
      if (
        id === manifest ||
        id === css ||
        id.startsWith(storyPrefix) ||
        id.startsWith(earlierPrefix)
      )
        return `\0${id}`;
    },
    async load(id) {
      if (id === `\0${manifest}`) {
        const entries = Object.entries(await inventory());
        const old = Object.entries(snapshots);
        return `export const v1 = {${entries.map(([name, file]) => `${JSON.stringify(name)}: () => import(${JSON.stringify(file)})`).join(",")}};\nexport const v2 = {${entries.map(([name]) => `${JSON.stringify(name)}: () => import(${JSON.stringify(`${storyPrefix}${name}.tsx`)})`).join(",")}};\nexport const earlier = {${old.map(([name, file]) => `${JSON.stringify(name)}: () => import(${JSON.stringify(file)})`).join(",")}};\nexport const refreshed = {${old.map(([name]) => `${JSON.stringify(name)}: () => import(${JSON.stringify(`${earlierPrefix}${name}.tsx`)})`).join(",")}};`;
      }
      if (
        id.startsWith(`\0${storyPrefix}`) ||
        id.startsWith(`\0${earlierPrefix}`)
      ) {
        const isEarlier = id.startsWith(`\0${earlierPrefix}`);
        const prefix = isEarlier ? earlierPrefix : storyPrefix;
        const name = id.slice(prefix.length + 1).replace(/\.tsx$/, "");
        await inventory();
        const entries = isEarlier ? snapshots : sources;
        const file = Object.hasOwn(entries, name) ? entries[name] : undefined;
        if (!file) throw new Error("Unknown legacy comparison.");
        this.addWatchFile(file);
        // Vite's default esbuild filter skips null-prefixed virtual files. Compile this unchanged story ourselves.
        return ts.transpileModule(
          rewriteLegacyStory(
            await fs.readFile(file, "utf8"),
            file,
            repository,
            merged,
            isEarlier
          ),
          {
            fileName: file,
            compilerOptions: {
              jsx: ts.JsxEmit.ReactJSX,
              module: ts.ModuleKind.ESNext,
              target: ts.ScriptTarget.ES2022,
            },
          }
        ).outputText;
      }
      if (id === `\0${css}`) {
        // Some unchanged v1 sources already contain tw- utilities. Both distributions need their real CSS.
        return (
          await postcss([
            tailwindcss({
              ...rootTailwind,
              prefix: "tw-",
              important: true,
              content: [path.join(repository, "src/**/*.{js,ts,jsx,tsx}")],
            }),
          ]).process("@tailwind components;\n@tailwind utilities;", {
            from: undefined,
          })
        ).css;
      }
    },
  };
}
