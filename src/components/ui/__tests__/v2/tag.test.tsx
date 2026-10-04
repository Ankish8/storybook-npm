import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tag, TagGroup, tagVariants } from "../../v2/tag";
import { Tag as TagV1, TagGroup as TagGroupV1 } from "../../tag";
const variants = [
  "default",
  "primary",
  "secondary",
  "accent",
  "info",
  "success",
  "warning",
  "error",
  "destructive",
] as const;
const withoutClasses = (html: string) => html.replace(/ class="[^"]*"/g, "");
describe("Tag (v2)", () => {
  it.each(variants)("preserves the %s API and markup", (variant) => {
    const props = {
      variant,
      label: "Event:",
      children: "Started",
      onRemove: vi.fn(),
    };
    expect(withoutClasses(render(<Tag {...props} />).container.innerHTML)).toBe(
      withoutClasses(render(<TagV1 {...props} />).container.innerHTML)
    );
  });
  it.each([
    ["sm", "h-5"],
    ["default", "h-6"],
    ["lg", "h-[30px]"],
  ] as const)("uses the recorded %s size", (size, height) => {
    render(<Tag size={size}>Event</Tag>);
    expect(screen.getByText("Event").parentElement).toHaveClass(
      height,
      "rounded-lg"
    );
  });
  it("allows height overrides without losing font weight", () => {
    render(
      <Tag label="Event:" className="h-9">
        Started
      </Tag>
    );
    expect(screen.getByText("Started").parentElement).toHaveClass("h-9");
    expect(screen.getByText("Event:")).toHaveClass("font-medium");
    expect(screen.getByText("Started")).toHaveClass("font-normal");
  });
  it("forwards refs and native attributes", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(
      <Tag ref={ref} aria-label="Event tag">
        Event
      </Tag>
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveAttribute("aria-label", "Event tag");
  });
  it("calls onRemove with the native event", async () => {
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} removeAriaLabel="Remove event">
        Event
      </Tag>
    );
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Remove event" }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onRemove.mock.calls[0][0].type).toBe("click");
  });
  it("does not remove when the dismiss button is disabled", async () => {
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} removeDisabled>
        Event
      </Tag>
    );
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });
  it("retains the v1 overflow behavior", () => {
    const props = {
      tags: [
        { label: "A:", value: "One" },
        { value: "Two" },
        { value: "Three" },
      ],
      maxVisible: 2,
    };
    const v1 = render(<TagGroupV1 {...props} />).container;
    const v2 = render(<TagGroup {...props} />).container;
    expect(withoutClasses(v2.innerHTML)).toBe(withoutClasses(v1.innerHTML));
    expect(v2).toHaveTextContent("+1 more");
    expect(v2).not.toHaveTextContent("Three");
  });
  it("uses the recorded status border and text palettes", () => {
    expect(tagVariants({ variant: "info" })).toContain(
      "border-semantic-info-border"
    );
    expect(tagVariants({ variant: "error" })).toContain(
      "text-semantic-error-text"
    );
    expect(tagVariants({ variant: "accent" })).toContain(
      "bg-semantic-brand-surface"
    );
  });
  describe("dismiss button target", () => {
    const renderRemovable = (
      props: Partial<React.ComponentProps<typeof Tag>> = {}
    ) => {
      render(
        <Tag onRemove={vi.fn()} removeAriaLabel="Remove event" {...props}>
          Event
        </Tag>
      );
      return screen.getByRole("button", { name: "Remove event" });
    };
    it("has a 24px hit area around an unchanged 12px icon", () => {
      const button = renderRemovable();
      expect(button).toHaveClass("size-6");
      expect(button.querySelector("svg")).toHaveClass("size-3");
    });
    it("keeps the old 12px layout footprint so the tag does not grow", () => {
      const button = renderRemovable();
      // -6px on every side cancels the extra 12px of hit area (24 - 12).
      expect(button).toHaveClass("-m-1.5");
    });
    it("keeps its accessible name, type and click contract", async () => {
      const onRemove = vi.fn();
      render(
        <Tag onRemove={onRemove} removeAriaLabel="Remove event">
          Event
        </Tag>
      );
      const button = screen.getByRole("button", { name: "Remove event" });
      expect(button).toHaveAttribute("type", "button");
      await userEvent.setup().click(button);
      expect(onRemove).toHaveBeenCalledOnce();
    });
    it("shows a neutral black 8% hover plate only on hover-capable, enabled buttons", () => {
      const button = renderRemovable();
      expect(button).toHaveClass(
        "before:bg-[var(--color-black)]",
        "before:opacity-0",
        "enabled:[@media(hover:hover)]:hover:before:opacity-[0.08]"
      );
      expect(button).not.toHaveClass("hover:scale-[1.03]");
      expect(button).toHaveClass("[@media(hover:hover)]:hover:scale-[1.03]");
    });
    it("draws its own focus ring instead of the browser default", () => {
      const button = renderRemovable();
      expect(button).toHaveClass(
        "focus-visible:outline-none",
        "focus-visible:after:outline",
        "focus-visible:after:outline-semantic-primary"
      );
    });
    it("stays inert and flat when disabled", () => {
      const button = renderRemovable({ removeDisabled: true });
      expect(button).toBeDisabled();
      expect(button).toHaveClass(
        "cursor-not-allowed",
        "opacity-50",
        "[@media(hover:hover)]:hover:scale-100"
      );
      expect(button).toHaveClass("size-6");
    });
    it("does not add elements for the plate or hit area", () => {
      const button = renderRemovable();
      expect(button.children).toHaveLength(1);
      expect(button.firstElementChild?.tagName.toLowerCase()).toBe("svg");
    });
  });
});
