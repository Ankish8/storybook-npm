import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import type { ComponentType } from "react";
import { components } from "../../../../../apps/docs/lib/catalog";

/**
 * The copy-paste examples on the docs pages are real files that the preview iframe renders and the page prints. They
 * are only worth showing if they keep working, so each one has to mount against the current components, and the
 * folders, manifests and files have to stay in step.
 */
type Manifest = {
  anatomy?: boolean;
  examples: Array<{
    id: string;
    title: string;
    description?: string;
    minHeight?: number;
  }>;
};
const root = "../../../../../apps/docs/examples/";
const demos = import.meta.glob("../../../../../apps/docs/examples/*/*.tsx", {
  eager: true,
}) as Record<string, { default: ComponentType }>;
const manifests = import.meta.glob(
  "../../../../../apps/docs/examples/*/examples.json",
  { eager: true, import: "default" }
) as Record<string, Manifest>;
const anatomies = import.meta.glob(
  "../../../../../apps/docs/examples/*/anatomy.txt",
  { eager: true, query: "?raw", import: "default" }
) as Record<string, string>;

const slugs = Object.keys(manifests).map((path) =>
  path.slice(root.length).replace("/examples.json", "")
);

afterEach(() => cleanup());

describe("docs examples", () => {
  it("covers the components that have been reworked", () => {
    expect(slugs.sort()).toEqual(
      [
        "action-button",
        "button",
        "button-group",
        "checkbox",
        "creatable-multi-select",
        "date-range-picker",
        "date-time-picker",
        "file-upload",
        "input",
        "multi-select",
        "number-step-field",
        "modal",
        "split-button",
      ].sort()
    );
  });

  it("only exists for components in the catalog", () => {
    const catalog = new Set(components.map((component) => component.slug));
    for (const slug of slugs) expect(catalog.has(slug)).toBe(true);
  });

  describe.each(slugs)("%s", (slug) => {
    const manifest = manifests[`${root}${slug}/examples.json`];

    it("lists each example once, with a title and a description", () => {
      const ids = manifest.examples.map((example) => example.id);
      expect(new Set(ids).size).toBe(ids.length);
      const titles = manifest.examples.map((example) => example.title);
      expect(new Set(titles).size).toBe(titles.length);
      for (const example of manifest.examples) {
        expect(example.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
        expect(example.title.trim()).not.toBe("");
        expect(example.description?.trim()).toBeTruthy();
      }
    });

    it("has a file for every listed example and lists every file", () => {
      const files = Object.keys(demos)
        .filter((path) => path.startsWith(`${root}${slug}/`))
        .map((path) => path.slice(`${root}${slug}/`.length, -".tsx".length))
        .sort();
      expect(files).toEqual(manifest.examples.map((e) => e.id).sort());
    });

    it("has an anatomy block exactly when it says it does", () => {
      expect(Boolean(anatomies[`${root}${slug}/anatomy.txt`])).toBe(
        Boolean(manifest.anatomy)
      );
    });

    it.each(manifest.examples.map((example) => example.id))(
      "%s mounts without errors",
      (id) => {
        const Demo = demos[`${root}${slug}/${id}.tsx`].default;
        expect(typeof Demo).toBe("function");
        const errors = vi.spyOn(console, "error").mockImplementation(() => {});
        const warnings = vi.spyOn(console, "warn").mockImplementation(() => {});
        try {
          const { container } = render(<Demo />);
          expect(container.innerHTML).not.toBe("");
          expect(errors.mock.calls.map((call) => String(call[0]))).toEqual([]);
          expect(warnings.mock.calls.map((call) => String(call[0]))).toEqual(
            []
          );
        } finally {
          errors.mockRestore();
          warnings.mockRestore();
        }
      }
    );
  });
});
