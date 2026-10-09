import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createHighlighter, type Highlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

/**
 * The curated, copy-paste examples on a component page. Each example is a real `.tsx` file in
 * `apps/docs/examples/<slug>/`: the preview iframe renders its default export and the page shows its source
 * verbatim, so the code on screen cannot drift from the demo above it.
 */
export type ExampleEntry = {
  id: string;
  title: string;
  description?: string;
  /** Reserve this much height up front, for demos whose menu or modal opens inside the frame. */
  minHeight?: number;
  code: string;
  html: string;
};
export type ExamplesData = {
  anatomy?: { code: string; html: string };
  examples: ExampleEntry[];
};

type Manifest = {
  anatomy?: boolean;
  examples: Array<{
    id: string;
    title: string;
    description?: string;
    minHeight?: number;
  }>;
};

const SAFE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let highlighter: Promise<Highlighter> | undefined;
function getHighlighter() {
  // The JavaScript regex engine keeps this free of WebAssembly, so it runs the same in dev, build and start.
  highlighter ??= createHighlighter({
    themes: ["github-light"],
    langs: ["tsx"],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}
async function highlight(code: string) {
  return (await getHighlighter()).codeToHtml(code, {
    lang: "tsx",
    theme: "github-light",
  });
}

// `next dev`/`next start` run from apps/docs; a root launch is also supported, as for the source route.
async function directoryFor(slug: string): Promise<string | undefined> {
  for (const root of [process.cwd(), join(process.cwd(), "apps/docs")]) {
    const directory = join(root, "examples", slug);
    try {
      await readFile(join(directory, "examples.json"), "utf8");
      return directory;
    } catch {
      // Try the other supported launch location.
    }
  }
}

/** @returns undefined for a component with no curated examples yet. */
export async function loadExamples(
  slug: string
): Promise<ExamplesData | undefined> {
  if (!SAFE_ID.test(slug)) return undefined;
  const directory = await directoryFor(slug);
  if (!directory) return undefined;
  const manifest = JSON.parse(
    await readFile(join(directory, "examples.json"), "utf8")
  ) as Manifest;

  const examples = await Promise.all(
    manifest.examples.map(async (entry) => {
      if (!SAFE_ID.test(entry.id))
        throw new Error(`Invalid example id "${entry.id}" for ${slug}.`);
      const code = (await readFile(join(directory, `${entry.id}.tsx`), "utf8"))
        .replace(/\s+$/, "")
        .concat("\n");
      return { ...entry, code, html: await highlight(code.trimEnd()) };
    })
  );
  let anatomy: ExamplesData["anatomy"];
  if (manifest.anatomy) {
    const code = (await readFile(join(directory, "anatomy.txt"), "utf8"))
      .replace(/\s+$/, "")
      .concat("\n");
    anatomy = { code, html: await highlight(code.trimEnd()) };
  }
  return { anatomy, examples };
}
