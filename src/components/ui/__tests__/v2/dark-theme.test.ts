import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import loadConfig from "tailwindcss/loadConfig";
import { describe, expect, it } from "vitest";
import { V2_THEME_CSS } from "../../../../../packages/cli/src/utils/v2-theme";

const root = process.cwd();
const config = loadConfig(resolve(root, "tailwind.config.js"));
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const theme = read("src/styles/v2-theme.css");
const themeAst = postcss.parse(theme);
const indexAst = postcss.parse(read("src/index.css"));
const darkValues = new Map<string, string>();
const lightValues = new Map<string, string>();
themeAst.walkDecls((decl) => {
  darkValues.set(decl.prop, decl.value);
});
indexAst.walkRules((rule) => {
  if (rule.selector !== ":root") return;
  rule.walkDecls((decl) => {
    lightValues.set(decl.prop, decl.value);
  });
});

const colors = (config.theme?.extend?.colors ?? {}) as Record<string, unknown>;
type AliasColor = (options?: { opacityValue?: string }) => string;
const aliases = Object.entries(colors).filter(([name]) =>
  name.startsWith("v2-semantic-")
) as [string, AliasColor][];
const sources = readdirSync(resolve(root, "src/components/ui/v2/"))
  .filter((name) => name.endsWith(".tsx") && !name.includes(".stories."))
  .map((name) => [name, read(`src/components/ui/v2/${name}`)] as const);

function colorOf(variable: string, dark: boolean): string {
  let value = (dark && darkValues.get(variable)) || lightValues.get(variable);
  for (let depth = 0; value?.startsWith("var(") && depth < 10; depth++) {
    const next = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
    if (!next) throw new Error(`Cannot resolve ${variable}: ${value}`);
    value = (dark && darkValues.get(next)) || lightValues.get(next);
  }
  if (!value || !/^#[\da-f]{6}$/i.test(value)) {
    throw new Error(`Missing concrete theme color for ${variable}: ${value}`);
  }
  return value;
}

function luminance(hex: string): number {
  const rgb = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.04045
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

function contrast(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe("v2 theme installation and production CSS", () => {
  it("isolates every dark declaration from native v1 theme variables", () => {
    themeAst.walkDecls((decl) => {
      expect(decl.prop, `${decl.prop} would override a v1 token`).toMatch(
        /^--v2-/
      );
    });
    themeAst.walkRules((rule) => {
      expect(rule.selectors).toEqual([":root.dark", ".dark"]);
    });
    expect(read("src/index.css")).toContain('@import "./styles/v2-theme.css"');
  });

  it("ships each alias with its unchanged light fallback and a dark color", () => {
    expect(aliases.length).toBeGreaterThan(50);
    for (const [name, value] of aliases) {
      const legacyName = name.replace(/^v2-/, "");
      expect(value({}), name).toBe(`var(--${name}, var(--${legacyName}))`);
      expect(darkValues.has(`--${name}`), `${name} is missing in dark`).toBe(
        true
      );
      expect(
        lightValues.has(`--${legacyName}`),
        `${name} has no light fallback`
      ).toBe(true);
      expect(colors[legacyName], `${legacyName} must remain a v1 alias`).toBe(
        `var(--${legacyName})`
      );
    }
  });

  it("keeps generated CLI theme CSS and Tailwind aliases identical to the source", () => {
    expect(V2_THEME_CSS).toBe(theme);
    const init = read("packages/cli/src/commands/init.ts");
    expect(init).toContain(
      "export const MYOPERATOR_THEME_CSS = V2_THEME_CSS + `"
    );
    for (const [name, value] of aliases) {
      const line = init
        .split("\n")
        .find((entry) => entry.includes(`"${name}":`));
      expect(line, `${name} must work in CLI-installed components`).toContain(
        `"${value({})}"`
      );
      expect(
        line,
        `${name} must support slash opacity after installation`
      ).toContain(`"color-mix(in srgb, ${value({})} calc("`);
    }
  });

  it("compiles actual component classes and all aliased surfaces, text, and borders", async () => {
    const raw = [
      ...aliases.flatMap(([name]) => [
        `bg-${name}`,
        `text-${name}`,
        `border-${name}`,
        `bg-${name}/40`,
        `text-${name}/40`,
        `border-${name}/40`,
      ]),
      ...sources.map(([, source]) => source),
    ].join("\n");
    const result = await postcss([
      tailwindcss({
        ...config,
        content: [{ raw, extension: "tsx" }],
      }),
    ]).process("@tailwind utilities;", {
      from: resolve(root, "src/styles/theme-regression.css"),
    });
    const rules = new Map<string, Map<string, string>>();
    result.root.walkRules((rule) => {
      const declarations = new Map<string, string>();
      rule.walkDecls((decl) => {
        declarations.set(decl.prop, decl.value);
      });
      rules.set(rule.selector, declarations);
    });
    for (const [name, value] of aliases) {
      for (const [utility, property] of [
        ["bg", "background-color"],
        ["text", "color"],
        ["border", "border-color"],
      ]) {
        expect(rules.get(`.${utility}-${name}`)?.get(property), name).toContain(
          value({})
        );
        expect(
          rules.get(`.${utility}-${name}\\/40`)?.get(property),
          `${name}/40`
        ).toBe(value({ opacityValue: "0.4" }));
      }
    }
    const declarationsFor = (property: string) =>
      [...rules.values()].map((declarations) => declarations.get(property));
    expect(declarationsFor("border-color")).toContain(
      "var(--v2-semantic-border-focus,var(--semantic-primary))"
    );
    expect(declarationsFor("border-color")).toContain(
      "var(--v2-semantic-border-primary,var(--semantic-primary))"
    );
    expect(declarationsFor("color")).toContain(
      "var(--v2-selection-accent,var(--semantic-primary))"
    );
    expect(declarationsFor("color")).toContain(
      "var(--v2-on-status,var(--semantic-text-inverted))"
    );
    expect(declarationsFor("outline")).toContain(
      "2px solid var(--v2-semantic-border-focus)"
    );
  });

  it("does not leave v2 components bound directly to light semantic utilities", () => {
    for (const [name, source] of sources) {
      const directLegacyUtilities = source.match(
        /(?<!v2-)\b(?:bg|text|border(?:-[tblrxysie])?|outline|ring(?:-offset)?|fill|stroke|caret|divide|accent|decoration|from|via|to|shadow)-semantic-[\w-]+/g
      );
      expect(directLegacyUtilities, name).toBeNull();
    }
  });
});

describe("v2 theme contrast", () => {
  for (const dark of [false, true]) {
    const mode = dark ? "dark" : "light";
    for (const surface of ["bg-primary", "bg-ui", "bg-subtle", "bg-hover"]) {
      for (const text of ["primary", "secondary", "muted", "placeholder"]) {
        it(`${mode}: ${text} text meets 4.5:1 on ${surface}`, () => {
          const background = colorOf(
            `--${dark ? "v2-" : ""}semantic-${surface}`,
            dark
          );
          expect(
            contrast(colorOf(`--v2-text-${text}`, dark), background)
          ).toBeGreaterThanOrEqual(4.5);
        });
      }
    }
  }

  it("keeps filled primary button labels readable in every primary state", () => {
    for (const state of ["primary", "primary-hover", "primary-selected"]) {
      expect(
        contrast(
          colorOf("--v2-semantic-text-inverted", true),
          colorOf(`--v2-semantic-${state}`, true)
        ),
        state
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("keeps field focus rings and selection checks above 3:1 across raised surfaces", () => {
    for (const surface of [
      "bg-primary",
      "bg-ui",
      "bg-hover",
      "primary-surface",
    ]) {
      for (const indicator of [
        "--v2-semantic-border-focus",
        "--v2-semantic-border-primary",
        "--v2-selection-accent",
      ]) {
        expect(
          contrast(
            colorOf(indicator, true),
            colorOf(`--v2-semantic-${surface}`, true)
          ),
          `${indicator} on ${surface}`
        ).toBeGreaterThanOrEqual(3);
      }
    }
    expect(
      contrast(
        colorOf("--v2-semantic-border-input", true),
        colorOf("--v2-semantic-bg-primary", true)
      )
    ).toBeGreaterThanOrEqual(3);
  });

  it("keeps status text and filled status indicators legible", () => {
    for (const status of ["success", "error", "warning", "info"]) {
      for (const surface of ["surface", "surface-subtle"]) {
        expect(
          contrast(
            colorOf(`--v2-semantic-${status}-text`, true),
            colorOf(`--v2-semantic-${status}-${surface}`, true)
          ),
          `${status} text on ${surface}`
        ).toBeGreaterThanOrEqual(4.5);
      }
      expect(
        contrast(
          colorOf("--v2-on-status", true),
          colorOf(`--v2-semantic-${status}-primary`, true)
        ),
        `${status} filled icon`
      ).toBeGreaterThanOrEqual(3);
    }
    expect(
      contrast(
        colorOf("--v2-semantic-text-inverted", true),
        colorOf("--v2-button-success", true)
      )
    ).toBeGreaterThanOrEqual(4.5);
  });
});
