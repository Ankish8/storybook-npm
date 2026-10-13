import { readFile } from "node:fs/promises";
import { join } from "node:path";

const refreshed = new Set([
  "alert",
  "badge",
  "bouncing-loader",
  "empty-state",
  "empty-states",
  "metric-card",
  "progress-indicator",
  "skeleton",
  "spinner",
  "tag",
  "toast",
  "tooltip",
  "accordion",
  "avatar",
  "panel",
  "scrollbar",
  "table",
  "ui-card",
]);

/** Report the variables used by the actual source, without rewriting semantic text colors. */
export async function componentTokenDocumentation(slug: string) {
  if (!refreshed.has(slug)) return undefined;
  for (const root of [process.cwd(), join(process.cwd(), "../..")]) {
    let source: string;
    let css: string;
    try {
      [source, css] = await Promise.all([
        readFile(join(root, "src/components/ui/v2", `${slug}.tsx`), "utf8"),
        readFile(join(root, "src/index.css"), "utf8"),
      ]);
    } catch {
      continue;
    }
    const variables = new Map(
      [...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [
        match[1],
        match[2].trim(),
      ])
    );
    const used = new Set<string>();
    for (const match of source.matchAll(
      /var\((--(?:semantic|v2-text|color)-[\w-]+)/g
    ))
      used.add(match[1]);
    for (const match of source.matchAll(
      /(?:bg|text|border|outline|ring|fill|stroke)-semantic-([\w-]+)/g
    ))
      used.add(`--semantic-${match[1]}`);
    function resolve(variable: string, seen = new Set<string>()): string {
      if (seen.has(variable)) return variable;
      seen.add(variable);
      const value = variables.get(variable) ?? "Defined by the theme";
      const alias = /^var\((--[\w-]+)\)$/.exec(value);
      return alias ? resolve(alias[1], seen) : value;
    }
    const rows = [...used].sort().map((variable) => {
      const value = resolve(variable);
      const swatch = /^#[0-9a-f]{3,8}$/i.test(value)
        ? `<span data-swatch="${value}"></span>`
        : "—";
      return `| \`${variable}\` | ${value.replace(/\|/g, "\\|")} | ${swatch} |`;
    });
    const neutral = [...used].some((variable) =>
      variable.startsWith("--v2-text-")
    );
    return (
      "## Design Tokens\n\n" +
      (neutral
        ? "The source uses the optional v2 text variables listed below, with its semantic or literal fallback. Semantic status and surface colors keep their theme values."
        : "The source uses semantic theme colors directly. It does not require the optional v2 neutral text variables.") +
      "\n\n| CSS variable used in source | Current theme value | Preview |\n| --- | --- | --- |\n" +
      rows.join("\n")
    );
  }
  throw new Error(`Cannot read component tokens for ${slug}.`);
}
