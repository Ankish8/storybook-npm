import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { getRegistry } from "../utils/registry";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const sourceDir = path.join(root, "src/components/ui/v2");
const names = fs
  .readdirSync(sourceDir)
  .filter((file) => file.endsWith(".tsx") && !file.includes(".stories."))
  .map((file) => file.slice(0, -4))
  .sort();
// v1 components folded into another v2 component have no v2 file of their own.
const merged = JSON.parse(
  fs.readFileSync(
    path.join(root, "design/verify/merged-components.json"),
    "utf8"
  )
) as Record<string, string>;
const metadata = yaml.load(
  fs.readFileSync(path.join(root, "packages/cli/components.yaml"), "utf8")
) as {
  categories: Record<string, { components: string[] }>;
  components: Record<
    string,
    {
      path: string;
      category: string;
      unprefixed: boolean;
      dependencies?: string[];
      internalDependencies?: string[];
    }
  >;
};

describe("complete v2 registry", () => {
  it("covers the recorded inventory, new v2 components, and every current v1 primitive", () => {
    const inventory = JSON.parse(
      fs.readFileSync(path.join(root, "design/v2-inventory.json"), "utf8")
    );
    const expected = new Set([
      "split-button",
      "action-button", // New async control; there is no v1 or Figma equivalent.
      "metric-card", // Dedicated metric display beside the existing UiCard.
      "empty-states", // Illustrated product patterns composed from EmptyState.
      ...inventory.map((item: { component: string }) => item.component),
      ...fs
        .readdirSync(path.join(root, "src/components/ui"))
        .filter((file) => file.endsWith(".tsx") && !file.includes(".stories."))
        .map((file) => file.slice(0, -4))
        .filter((name) => !(name in merged)),
    ]);
    expect(names).toEqual([...expected].sort());
  });

  it("installs ActionButton with v2 Button and its animation dependency", async () => {
    const component = (await getRegistry("tw-"))["v2-action-button"];
    expect(component.internalDependencies).toEqual(["v2-button"]);
    expect(component.dependencies).toContain("motion@^14.0.0");
    expect(component.files[0].content).toContain('from "motion/react"');
    expect(component.files[0].name).toBe("v2/action-button.tsx");
    expect(metadata.components["action-button"]).toBeUndefined();
  });

  it.each(names)(
    "%s installs verbatim and resolves its v2 dependency graph",
    async (name) => {
      const source = fs.readFileSync(
        path.join(sourceDir, name + ".tsx"),
        "utf8"
      );
      const key = "v2-" + name;
      const definition = metadata.components[key];
      expect(definition.path).toBe("v2/" + name);
      expect(definition.unprefixed).toBe(true);
      expect(metadata.categories[definition.category].components).toContain(
        key
      );
      const imports = [...source.matchAll(/from\s+["']\.\/([^"']+)["']/g)].map(
        (match) => "v2-" + match[1]
      );
      expect([...(definition.internalDependencies || [])].sort()).toEqual(
        [...new Set(imports)].sort()
      );
      for (const dependency of imports)
        expect(metadata.components[dependency]).toBeDefined();
      const expected = source.replace('"@/lib/utils"', '"../../../lib/utils"');
      for (const prefix of ["", "tw-", "app-"]) {
        const registry = await getRegistry(prefix);
        const component = registry[key];
        expect(component.files).toHaveLength(1);
        expect(component.files[0].name).toBe("v2/" + name + ".tsx");
        expect(component.files[0].content).toBe(expected);
        expect(component.unprefixed).toBe(true);
      }
    }
  );
});
