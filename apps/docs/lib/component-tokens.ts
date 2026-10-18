import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Derive both palettes from the source; include composed v2 dependencies. */
export async function componentTokenDocumentation(slug: string) {
  for (const root of [process.cwd(), join(process.cwd(), "../..")]) {
    let css: string;
    let theme: string;
    let source: string;
    try {
      [css, theme] = await Promise.all([
        readFile(join(root, "src/index.css"), "utf8"),
        readFile(join(root, "src/styles/v2-theme.css"), "utf8"),
      ]);
      const seen = new Set<string>();
      const collect = async (name: string): Promise<string> => {
        if (seen.has(name)) return "";
        seen.add(name);
        const text = await readFile(
          join(root, "src/components/ui/v2", name + ".tsx"),
          "utf8"
        );
        const imports = [...text.matchAll(/from\s+["']\.\/([\w-]+)["']/g)].map(
          (m) => m[1]
        );
        return (
          text + "\n" + (await Promise.all(imports.map(collect))).join("\n")
        );
      };
      source = await collect(slug);
    } catch {
      continue;
    }
    const parse = (text: string) =>
      new Map(
        [...text.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [
          m[1],
          m[2].trim(),
        ])
      );
    const light = parse(css.split("\n  .dark {")[0]);
    const dark = parse(theme);
    const used = new Set<string>();
    for (const match of source.matchAll(
      /var\((--(?:v2|semantic|color|font)-[\w-]+)/g
    ))
      used.add(match[1]);
    if (source.includes("--font-v2")) used.add("--font-v2");
    for (const match of source.matchAll(
      /(?:bg|text|border|outline|ring|fill|stroke)-v2-semantic-([\w-]+)/g
    ))
      used.add("--v2-semantic-" + match[1]);
    for (const value of [...used])
      if (value.startsWith("--semantic-") && used.has("--v2-" + value.slice(2)))
        used.delete(value);
    function resolve(
      name: string,
      mode: "light" | "dark",
      seen = new Set<string>()
    ): string {
      if (seen.has(name)) return name;
      seen.add(name);
      const value =
        (mode === "dark" ? dark.get(name) : undefined) ?? light.get(name);
      if (!value && name.startsWith("--v2-semantic-"))
        return resolve(name.replace("--v2-", "--"), mode, seen);
      if (!value) return "Component fallback";
      const alias = /^var\((--[\w-]+)\)$/.exec(value);
      return alias ? resolve(alias[1], mode, seen) : value;
    }
    const rows = [...used].sort().map((variable) => {
      const l = resolve(variable, "light"),
        d = resolve(variable, "dark");
      const swatch = (v: string) =>
        /^#[0-9a-f]{3,8}$/i.test(v) ? `<span data-swatch="${v}"></span>` : "—";
      return `| \`${variable}\` | ${l.replace(/\|/g, "\\|")} ${swatch(l)} | ${d.replace(/\|/g, "\\|")} ${swatch(d)} |`;
    });
    return (
      "## Design Tokens\n\nV2 uses isolated color roles: light mode falls back to the existing semantic theme, and `.dark` supplies the v2 dark palette. V1 tokens are unchanged. Timeless Sans uses Inter and sans-serif fallbacks. Component-specific fallbacks remain visible in the source.\n\n| Variable | Light | Dark |\n| --- | --- | --- |\n" +
      rows.join("\n")
    );
  }
  throw new Error(`Cannot read component tokens for ${slug}.`);
}
