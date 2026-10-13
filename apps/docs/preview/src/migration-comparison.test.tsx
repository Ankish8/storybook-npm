import * as React from "react";
import { afterEach, expect, test, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { migrationComparisons } from "../../lib/migration-comparisons";
import { MigrationSection } from "../../components/migration-comparison";

// Exercise the iframe boundary in isolation; the actual Radix shell control is checked in the browser matrix.
vi.mock("../../components/docs-select", () => ({
  DocsSelect: ({
    label,
    disabled,
    value,
    options,
    onValueChange,
  }: {
    label: string;
    disabled?: boolean;
    value: string;
    options: { value: string; label: string }[];
    onValueChange: (value: string) => void;
  }) => (
    <select
      aria-label={label}
      disabled={disabled}
      data-disabled={disabled ? "" : undefined}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

afterEach(cleanup);

test("a real pair uses isolated actual-v1 and import-remapped-v2 frames and rejects foreign metadata", async () => {
  render(<MigrationSection slug="button" title="Button" />);
  const before = await screen.findByTitle<HTMLIFrameElement>(
    "Button v1 live comparison"
  );
  const after = screen.getByTitle<HTMLIFrameElement>(
    "Button v2 live comparison"
  );
  expect(new URL(before.src).searchParams.get("version")).toBe("v1");
  expect(new URL(after.src).searchParams.get("version")).toBe("v2");
  expect(new URL(before.src).searchParams.get("comparison")).toBe("legacy");
  expect(new URL(before.src).searchParams.has("review")).toBe(false);
  expect(screen.getByText("v1")).toBeTruthy();
  expect(screen.getByText("v2")).toBeTruthy();
  expect(screen.queryByText("Current v2")).toBeNull();
  const data = {
    channel: "myoperator-v2-docs",
    version: "v1",
    type: "metadata",
    component: "button",
    story: "Overview",
    stories: [{ id: "Overview", name: "Original example" }],
  };
  fireEvent(
    window,
    new MessageEvent("message", {
      source: after.contentWindow,
      origin: location.origin,
      data,
    })
  );
  expect(
    screen
      .getByRole("combobox", { name: "Comparison example" })
      .getAttribute("data-disabled")
  ).not.toBeNull();
  fireEvent(
    window,
    new MessageEvent("message", {
      source: before.contentWindow,
      origin: "https://foreign.test",
      data,
    })
  );
  expect(screen.queryByText("Original example")).toBeNull();
  fireEvent(
    window,
    new MessageEvent("message", {
      source: before.contentWindow,
      origin: location.origin,
      data,
    })
  );
  await screen.findByText("Original example");
  const post = vi.spyOn(before.contentWindow!, "postMessage");
  fireEvent.click(screen.getByRole("button", { name: "Reset both" }));
  await waitFor(() =>
    expect(post).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "reset",
        component: "button",
        story: "Overview",
      }),
      new URL(before.src).origin
    )
  );
  expect(screen.getByTitle("Button v1 live comparison")).toBe(before);
});

test.each(
  Object.entries(migrationComparisons)
    .filter(([, info]) => !info.counterparts.length)
    .map(([slug]) => slug)
)(
  "%s states there was no v1 without showing earlier/current v2 frames",
  (slug) => {
    const { container } = render(<MigrationSection slug={slug} title={slug} />);
    expect(
      screen.getByText("Added in v2. There was no version 1 of this component.")
    ).toBeTruthy();
    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(screen.queryByRole("button", { name: /Reset/ })).toBeNull();
    expect(screen.queryByText("Earlier v2")).toBeNull();
    expect(screen.queryByText("Current v2")).toBeNull();
  }
);

test("explicit fullscreen focuses the retained frame so its native dialog receives keyboard input", async () => {
  render(<MigrationSection slug="modal" title="Modal" />);
  const frame = await screen.findByTitle<HTMLIFrameElement>(
    "Modal v1 live comparison"
  );
  const origin = new URL(frame.src).origin;
  fireEvent(
    window,
    new MessageEvent("message", {
      source: frame.contentWindow,
      origin,
      data: {
        channel: "myoperator-v2-docs",
        component: "dialog",
        version: "v1",
        type: "resize",
        height: 480,
        dialogOpen: true,
        fullscreen: false,
      },
    })
  );
  const focus = vi.spyOn(frame, "focus");
  const post = vi.spyOn(frame.contentWindow!, "postMessage");
  fireEvent.click(screen.getByRole("button", { name: "Open fullscreen" }));
  expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  expect(document.activeElement).toBe(frame);
  expect(post).toHaveBeenCalledWith(
    {
      channel: "myoperator-v2-docs",
      type: "show-fullscreen",
      component: "dialog",
      story: "Default",
    },
    origin
  );
  expect(screen.getByTitle("Modal v1 live comparison")).toBe(frame);
});
