import { expect, test } from "vitest";
import { components } from "../../lib/catalog";
import {
  controlArgTypes,
  exportedStories,
  mapArgs,
  prepareStory,
  serializable,
} from "./model.mjs";

const modules = import.meta.glob(
  "../../../../src/components/ui/v2/*.stories.tsx",
  { eager: true }
);
test("every catalogued CSF module imports and all stories expose JSON-safe args and Controls", () => {
  // Tied to the catalog, not a literal: merging or adding a component changes the count.
  expect(Object.keys(modules)).toHaveLength(components.length);
  let stories = 0;
  for (const [path, module] of Object.entries(modules)) {
    const component = path.split("/").at(-1)!.replace(".stories.tsx", "");
    const entries = exportedStories(module);
    expect(
      entries.some((entry) => entry.id === "Overview"),
      component
    ).toBe(true);
    for (const entry of entries) {
      const prepared = prepareStory(module, entry.id, component);
      expect(() =>
        JSON.stringify({
          args: serializable(prepared.initialArgs),
          argTypes: controlArgTypes(prepared, prepared.initialArgs),
          description: prepared.parameters.docs?.description,
        })
      ).not.toThrow();
      expect(() =>
        mapArgs(prepared.initialArgs, prepared.argTypes)
      ).not.toThrow();
      stories++;
    }
  }
  expect(stories).toBeGreaterThanOrEqual(components.length);
});
