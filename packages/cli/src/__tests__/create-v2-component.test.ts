import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
// @ts-expect-error JavaScript scaffolder has no declaration file.
import { createV2Component } from "../../../../scripts/lib/create-v2-component.js";

const cliRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
let root: string;
const source =
  'import { Button } from "./button";\nimport { Input } from "./input";\nimport { cn } from "@/lib/utils";\nexport const Example = ({ label, ...props }) => <div {...props} className={cn("flex")}>{label}<Button /><Input /></div>;\n';
const original = `categories:
  core:
    components:
      - example
components:
  example:
    description: "Original v1"
    category: core
    dependencies:
      - "react"
    internalDependencies:
      - button
      - input
  v2-button:
    category: core
    path: "v2/button"
    unprefixed: true
`;
function write(relative: string, text: string) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "v2-scaffold-test-"));
  write("packages/cli/package.json", "{}");
  fs.symlinkSync(
    path.join(cliRoot, "node_modules"),
    path.join(root, "packages/cli/node_modules")
  );
  write("src/components/ui/example.tsx", source);
  write("packages/cli/components.yaml", original);
});
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

describe("v2 component scaffolding", () => {
  it("copies the current API, remaps existing siblings and preserves v1 bytes", () => {
    createV2Component(root, ["example", "Example: v2"]);
    const component = fs.readFileSync(
      path.join(root, "src/components/ui/v2/example.tsx"),
      "utf8"
    );
    expect(component).toBe(source.replace('from "./input"', 'from "../input"'));
    expect(
      fs.readFileSync(path.join(root, "src/components/ui/example.tsx"), "utf8")
    ).toBe(source);
    const yaml = fs.readFileSync(
      path.join(root, "packages/cli/components.yaml"),
      "utf8"
    );
    expect(yaml).toContain(
      original
        .replace("      - example", "      - example\n      - v2-example")
        .trimEnd()
    );
    expect(yaml).toContain('path: "v2/example"');
    expect(yaml).toContain("unprefixed: true");
    expect(yaml).toContain("      - v2-button");
    expect(yaml).toContain("      - input");
    expect(
      fs.existsSync(
        path.join(root, "src/components/ui/__tests__/v2/example.test.tsx")
      )
    ).toBe(true);
    expect(
      fs.readFileSync(
        path.join(root, "src/components/ui/v2/example.stories.tsx"),
        "utf8"
      )
    ).toContain("V2/Components/Example");
  });
  it("refuses to overwrite an existing component and leaves metadata untouched", () => {
    write("src/components/ui/v2/example.tsx", "existing work");
    expect(() => createV2Component(root, ["example"])).toThrow(
      "already exists"
    );
    expect(
      fs.readFileSync(
        path.join(root, "src/components/ui/v2/example.tsx"),
        "utf8"
      )
    ).toBe("existing work");
    expect(
      fs.readFileSync(path.join(root, "packages/cli/components.yaml"), "utf8")
    ).toBe(original);
  });
  it("refuses to overwrite an existing test or story", () => {
    write("src/components/ui/v2/example.stories.tsx", "existing story");
    expect(() => createV2Component(root, ["example"])).toThrow(
      "already exists"
    );
    expect(
      fs.existsSync(path.join(root, "src/components/ui/v2/example.tsx"))
    ).toBe(false);
  });
  it("rejects missing primitives before writing anything", () => {
    expect(() => createV2Component(root, ["unknown"])).toThrow(
      "existing single-file"
    );
    expect(fs.existsSync(path.join(root, "src/components/ui/v2"))).toBe(false);
    expect(() => createV2Component(root, ["../example"])).toThrow("Usage");
  });
  it("creates a new v2-only primitive without a v1 source", () => {
    createV2Component(root, ["new-primitive", "New primitive", "--new", "--category=core"]);
    const component=fs.readFileSync(path.join(root,"src/components/ui/v2/new-primitive.tsx"),"utf8");
    expect(component).toContain("export { NewPrimitive }");
    expect(component).toContain("@/lib/utils");
    expect(fs.existsSync(path.join(root,"src/components/ui/new-primitive.tsx"))).toBe(false);
    const yaml=fs.readFileSync(path.join(root,"packages/cli/components.yaml"),"utf8");
    expect(yaml).toContain('path: "v2/new-primitive"');
    expect(yaml).toContain("unprefixed: true");
    expect(yaml).toContain("      - example\n      - v2-new-primitive");
  });
  it("rejects an invalid category before writing a new primitive",()=>{
    expect(()=>createV2Component(root,["new-primitive","--new","--category=missing"])).toThrow("valid category");
    expect(fs.readFileSync(path.join(root,"packages/cli/components.yaml"),"utf8")).toBe(original);
    expect(fs.existsSync(path.join(root,"src/components/ui/v2"))).toBe(false);
  });
});
