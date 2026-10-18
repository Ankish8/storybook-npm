import { beforeAll, describe, expect, it } from "vitest";
import postcss, { type Root } from "postcss";
import tailwindcss from "tailwindcss";
import loadConfig from "tailwindcss/loadConfig";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const tailwindConfig = loadConfig(resolve(process.cwd(), "tailwind.config.js"));
const componentDirectory = resolve(process.cwd(), "src/components/ui/v2");
const sources = readdirSync(componentDirectory)
  .filter((name) => name.endsWith(".tsx"))
  .map((name) => readFileSync(resolve(componentDirectory, name), "utf8"));

describe("v2 display theme CSS", () => {
  let css: Root;

  beforeAll(async () => {
    const result = await postcss([
      tailwindcss({
        ...tailwindConfig,
        content: [
          {
            raw: `${sources.join("\n")} bg-semantic-bg-primary text-semantic-text-primary bg-v2-semantic-primary-surface/40 border-v2-semantic-success-border/40`,
          },
        ],
      }),
    ]).process("@tailwind utilities;", { from: undefined });
    css = result.root;
  });

  const values = (property: string) => {
    const result: string[] = [];
    css.walkDecls(property, (declaration) => {
      result.push(declaration.value.replace(/\s+/g, ""));
    });
    return result;
  };

  it("emits themed SVG fills and strokes for the empty-state scenes", () => {
    expect(values("fill")).toContain(
      "var(--v2-semantic-bg-primary,var(--semantic-bg-primary))"
    );
    expect(values("stroke")).toContain(
      "var(--v2-semantic-text-secondary,var(--semantic-text-secondary))"
    );
  });

  it("compiles the nested skeleton sheen and the invalid checked switch thumb", () => {
    expect(
      values("background-image").some((value) =>
        value.includes("--v2-skeleton-highlight")
      )
    ).toBe(true);
    expect(values("background-color")).toContain(
      "var(--v2-on-status,var(--semantic-bg-primary))"
    );
  });

  it("emits status borders, visible focus colors and raised-surface shadows", () => {
    expect(values("border-color")).toContain(
      "var(--v2-semantic-success-border,var(--color-success-200))"
    );
    expect(values("outline-color")).toContain(
      "var(--v2-semantic-border-focus,var(--semantic-primary))"
    );
    expect(
      values("--tw-shadow").some((value) => value.includes("--v2-shadow-xl"))
    ).toBe(true);
  });

  it("preserves the original v1 semantic utility declarations alongside v2", () => {
    const legacy = new Map<string, string>();
    css.walkRules((rule) => {
      if (
        [".bg-semantic-bg-primary", ".text-semantic-text-primary"].includes(
          rule.selector
        )
      ) {
        rule.walkDecls((declaration) => {
          legacy.set(rule.selector, declaration.value);
        });
      }
    });
    expect(legacy.get(".bg-semantic-bg-primary")).toBe(
      "var(--semantic-bg-primary)"
    );
    expect(legacy.get(".text-semantic-text-primary")).toBe(
      "var(--semantic-text-primary)"
    );
  });

  it("retains opacity modifiers for table highlights and toast status borders", () => {
    const alphaRules = new Map<string, string>();
    css.walkRules((rule) => {
      if (rule.selector.includes("\\/40")) {
        rule.walkDecls((declaration) => {
          alphaRules.set(rule.selector, declaration.value.replace(/\s+/g, ""));
        });
      }
    });
    expect(alphaRules.get(".bg-v2-semantic-primary-surface\\/40")).toContain(
      "--v2-semantic-primary-surface"
    );
    expect(alphaRules.get(".border-v2-semantic-success-border\\/40")).toContain(
      "--v2-semantic-success-border"
    );
    for (const value of alphaRules.values()) {
      expect(value).toMatch(/(?:40%|0\.4)/);
    }
  });

  it("compiles thin indicators with a distinct color that clears 3:1 on dark surfaces", () => {
    for (const property of [
      "background-color",
      "border-color",
      "color",
      "--tw-shadow",
    ]) {
      expect(
        values(property).some((value) => value.includes("--v2-indicator")),
        property
      ).toBe(true);
    }
    const palette = new Map<string, string>();
    const themeCss = readFileSync(
      resolve(process.cwd(), "src/styles/v2-theme.css"),
      "utf8"
    );
    postcss.parse(themeCss).walkDecls((declaration) => {
      palette.set(declaration.prop, declaration.value);
    });
    const luminance = (hex: string) => {
      const rgb = [1, 3, 5].map((offset) => {
        const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });
      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    };
    const indicator = palette.get("--v2-indicator");
    expect(indicator).toMatch(/^#[\da-f]{6}$/i);
    const foreground = luminance(indicator!);
    for (const role of [
      "bg-primary",
      "bg-ui",
      "bg-hover",
      "primary-surface",
      "border-layout",
    ]) {
      const background = luminance(palette.get(`--v2-semantic-${role}`)!);
      const ratio =
        (Math.max(foreground, background) + 0.05) /
        (Math.min(foreground, background) + 0.05);
      expect(ratio, `indicator on ${role}`).toBeGreaterThanOrEqual(3);
    }
  });
});
