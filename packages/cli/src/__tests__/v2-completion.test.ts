import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { getRegistry } from "../utils/registry";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const sourceDir = path.join(root, "src/components/ui/v2");
const names = fs.readdirSync(sourceDir)
  .filter(file => file.endsWith(".tsx") && !file.includes(".stories."))
  .map(file => file.slice(0, -4)).sort();
const metadata = yaml.load(fs.readFileSync(path.join(root, "packages/cli/components.yaml"), "utf8")) as {
  categories: Record<string, { components: string[] }>;
  components: Record<string, { path: string; category: string; unprefixed: boolean; internalDependencies?: string[] }>;
};

describe("complete v2 registry", () => {
  it("covers the Figma inventory and every current v1 primitive", () => {
    const inventory = JSON.parse(fs.readFileSync(path.join(root, "design/v2-inventory.json"), "utf8"));
    const expected = new Set([
      ...inventory.map((item: { component: string }) => item.component),
      ...fs.readdirSync(path.join(root, "src/components/ui"))
        .filter(file => file.endsWith(".tsx") && !file.includes(".stories."))
        .map(file => file.slice(0, -4)),
    ]);
    expect(names).toEqual([...expected].sort());
  });

  it.each(names)("%s installs verbatim and resolves its v2 dependency graph", async name => {
    const source = fs.readFileSync(path.join(sourceDir, name + ".tsx"), "utf8");
    const key = "v2-" + name;
    const definition = metadata.components[key];
    expect(definition.path).toBe("v2/" + name);
    expect(definition.unprefixed).toBe(true);
    expect(metadata.categories[definition.category].components).toContain(key);
    const imports = [...source.matchAll(/from\s+["']\.\/([^"']+)["']/g)]
      .map(match => "v2-" + match[1]);
    expect([...(definition.internalDependencies || [])].sort()).toEqual([...new Set(imports)].sort());
    for (const dependency of imports) expect(metadata.components[dependency]).toBeDefined();
    const expected = source.replace('"@/lib/utils"', '"../../../lib/utils"');
    for (const prefix of ["", "tw-", "app-"]) {
      const registry = await getRegistry(prefix);
      const component = registry[key];
      expect(component.files).toHaveLength(1);
      expect(component.files[0].name).toBe("v2/" + name + ".tsx");
      expect(component.files[0].content).toBe(expected);
      expect(component.unprefixed).toBe(true);
    }
  });
});
