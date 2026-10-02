import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

/** Scaffold an additive v2 primitive from its current v1 API and metadata. */
export function createV2Component(root, argumentsList) {
  const [name, description] = argumentsList.filter(arg => !arg.startsWith("--"));
  const isNew = argumentsList.includes("--new");
  const requestedCategory = argumentsList.find(arg => arg.startsWith("--category="))?.split("=")[1] || "core";
  if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
    throw new Error(
      "Usage: node scripts/create-component.js <name> [description] --v2"
    );
  }
  const ui = path.join(root, "src/components/ui");
  const sourcePath = path.join(ui, `${name}.tsx`);
  const yamlPath = path.join(root, "packages/cli/components.yaml");
  const require = createRequire(path.join(root, "packages/cli/package.json"));
  const yaml = require("js-yaml");
  const originalYaml = fs.readFileSync(yamlPath, "utf8");
  const config = yaml.load(originalYaml);
  const sourceMeta = isNew ? {category: requestedCategory, dependencies: ["class-variance-authority", "clsx", "tailwind-merge"]} : config.components[name];
  if (!sourceMeta || sourceMeta.isMultiFile || (!isNew && !fs.existsSync(sourcePath))) {
    throw new Error("v2 mode requires an existing single-file v1 component");
  }
  const registryKey = `v2-${name}`;
  const componentName = name
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
  const outputs = {
    component: path.join(ui, "v2", `${name}.tsx`),
    test: path.join(ui, "__tests__/v2", `${name}.test.tsx`),
    story: path.join(ui, "v2", `${name}.stories.tsx`),
  };
  if (
    config.components[registryKey] ||
    Object.values(outputs).some((file) => fs.existsSync(file))
  ) {
    throw new Error(
      `${registryKey} already exists; existing work will not be overwritten`
    );
  }
  const category = sourceMeta.category;
  const members = config.categories[category]?.components;
  if (!members?.length) throw new Error(`${name} has no valid category`);
  // Older entries may exist in metadata without a category-list row.
  // Add only the new v2 member; do not repair or rewrite v1 metadata here.
  const anchor = members.includes(name) ? name : members.at(-1);
  const categoryMarker = new RegExp(`^(      - ${anchor})$`, "m");
  if (!categoryMarker.test(originalYaml)) throw new Error(`${category} has no insertion point`);
  const dependencies = sourceMeta.dependencies || [];
  const internalDependencies = (sourceMeta.internalDependencies || []).map(
    (dependency) =>
      config.components[`v2-${dependency}`] ? `v2-${dependency}` : dependency
  );
  const descriptionText =
    description || (isNew ? `${componentName} from the v2 design system` : `${componentName} (v2 design); same API as ${name}`);
  const entry = [
    `  ${registryKey}:`,
    `    description: ${JSON.stringify(descriptionText)}`,
    `    category: ${category}`,
    `    path: "v2/${name}"`,
    "    unprefixed: true",
    "    dependencies:",
    ...dependencies.map(
      (dependency) => `      - ${JSON.stringify(dependency)}`
    ),
    ...(internalDependencies.length
      ? [
          "    internalDependencies:",
          ...internalDependencies.map((dependency) => `      - ${dependency}`),
        ]
      : []),
  ].join("\n");
  // Keep all v1 source and YAML formatting intact. Only insert new entries.
  const nextYaml =
    originalYaml
      .replace(categoryMarker, `$1\n      - ${registryKey}`)
      .trimEnd() +
    "\n\n" +
    entry +
    "\n";
  let source = isNew ? `import * as React from "react";
import { cn } from "@/lib/utils";
export interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {}
const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(({className, ...props}, ref) => <div ref={ref} className={cn("font-[family-name:var(--font-v2,Inter,sans-serif)] text-semantic-text-primary", className)} {...props} />);
${componentName}.displayName = "${componentName}";
export { ${componentName} };
` : fs.readFileSync(sourcePath, "utf8");
  source = source.replace(
    /from (["'])\.\/(.*?)\1/g,
    (_match, quote, dependency) =>
      `from ${quote}${config.components[`v2-${dependency}`] ? "./" : "../"}${dependency}${quote}`
  );
  const test = `import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ${componentName} } from "../../v2/${name}";

it("renders ${componentName} with native attributes", () => {
  render(<${componentName} data-testid="${registryKey}" aria-label="Example" />);
  expect(screen.getByTestId("${registryKey}")).toHaveAttribute("aria-label", "Example");
});
`;
  const story = `import type { Meta, StoryObj } from "@storybook/react";
import { ${componentName} } from "./${name}";

const meta: Meta<typeof ${componentName}> = {
  title: "V2/Components/${componentName}",
  component: ${componentName},
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
`;
  for (const file of Object.values(outputs))
    fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(outputs.component, source);
  fs.writeFileSync(outputs.test, test);
  fs.writeFileSync(outputs.story, story);
  fs.writeFileSync(yamlPath, nextYaml);
  console.log(
    `Created ${registryKey}: component, test, story and unprefixed registry entry`
  );
}
