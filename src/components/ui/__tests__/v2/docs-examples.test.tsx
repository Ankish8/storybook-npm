/// <reference types="vite/client" />
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, fireEvent, screen } from "@testing-library/react";
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
        "checkbox",
        "creatable-multi-select",
        "date-range-picker",
        "date-time-picker",
        "file-upload",
        "input",
        "multi-select",
        "number-step-field",
        "phone-input",
        "select",
        "switch",
        "text-field",
        "textarea",
        "breadcrumbs",
        "dropdown-menu",
        "pagination",
        "stepper",
        "tabs",
        "modal",
        "split-button",
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
      ].sort()
    );
  });

  it("only exists for components in the catalog", () => {
    const catalog = new Set(components.map((component) => component.slug));
    for (const slug of slugs) expect(catalog.has(slug)).toBe(true);
  });

  it("restores the contact list when an empty-state action clears its filter", () => {
    const Demo = demos[`${root}empty-state/clear-filters.tsx`].default;
    render(<Demo />);
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("Mira Shah")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Three contacts restored"
    );
    fireEvent.click(screen.getByRole("button", { name: "Apply filter again" }));
    expect(
      screen.getByRole("button", { name: "Clear filters" })
    ).toBeInTheDocument();
  });

  it("sorts the visible numeric table records and resets input order", () => {
    const Demo = demos[`${root}table/sorting.tsx`].default;
    const { container } = render(<Demo />);
    const firstName = () => container.querySelector("tbody tr td")?.textContent;
    expect(firstName()).toBe("Renewals");
    fireEvent.click(screen.getByRole("button", { name: "Contacts" }));
    expect(firstName()).toBe("Onboarding");
    fireEvent.click(screen.getByRole("button", { name: "Contacts" }));
    expect(firstName()).toBe("Renewals");
    fireEvent.click(screen.getByRole("button", { name: "Reset sort" }));
    expect(firstName()).toBe("Renewals");
  });

  it("removes and restores a local tag filter", () => {
    const Demo = demos[`${root}tag/removal.tsx`].default;
    render(<Demo />);
    fireEvent.click(
      screen.getByRole("button", { name: "Remove Support filter" })
    );
    expect(screen.getByRole("status")).toHaveTextContent("2 filters active");
    expect(
      screen.queryByRole("button", { name: "Remove Support filter" })
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getByRole("status")).toHaveTextContent("3 filters active");

    const support = screen.getByRole("button", {
      name: "Remove Support filter",
    });
    support.focus();
    fireEvent.keyDown(support, { key: "Delete" });
    expect(
      screen.getByRole("button", { name: "Remove Unassigned filter" })
    ).toHaveFocus();
    const today = screen.getByRole("button", { name: "Remove Today filter" });
    today.focus();
    fireEvent.keyDown(today, { key: "Backspace" });
    const unassigned = screen.getByRole("button", {
      name: "Remove Unassigned filter",
    });
    expect(unassigned).toHaveFocus();
    fireEvent.keyDown(unassigned, { key: "Delete" });
    expect(screen.getByRole("button", { name: "Reset filters" })).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Keep Support filter" })
    );
    const protectedSupport = screen.getByRole("button", {
      name: "Remove Support filter",
    });
    protectedSupport.focus();
    fireEvent.keyDown(protectedSupport, { key: "Delete" });
    expect(protectedSupport).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("3 filters active");
    expect(screen.getByRole("status")).toHaveTextContent("Removal canceled");
  });

  it("updates and resets the local metric count", () => {
    const Demo = demos[`${root}metric-card/value-update.tsx`].default;
    render(<Demo />);
    fireEvent.click(screen.getByRole("button", { name: "Resolve one" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "129 conversations resolved"
    );
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "128 conversations resolved"
    );
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
