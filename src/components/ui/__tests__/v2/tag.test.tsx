import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tag, TagGroup, tagVariants } from "../../v2/tag";
import { Tag as TagV1, TagGroup as TagGroupV1 } from "../../tag";
import { Dismissible } from "../../v2/tag.stories";
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
const withoutClasses = (html: string) =>
  html.replace(/ class="[^"]*"| aria-hidden="true"/g, "");
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
    ["sm", "min-h-6"],
    ["default", "min-h-7"],
    ["lg", "min-h-8"],
  ] as const)(
    "keeps the %s minimum size while allowing wrapped content",
    (size, height) => {
      render(<Tag size={size}>Event</Tag>);
      expect(screen.getByText("Event").parentElement).toHaveClass(
        height,
        "rounded-lg"
      );
    }
  );
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
    const onClick = vi.fn();
    render(
      <Tag ref={ref} aria-label="Event tag">
        Event
      </Tag>
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveAttribute("aria-label", "Event tag");
    const { unmount } = render(
      <Tag
        ref={(node) => onClick(node)}
        style={{ padding: 12 }}
        title="Details"
        dir="rtl"
        data-event="123"
      >
        Native attributes
      </Tag>
    );
    const root = screen.getByText("Native attributes").parentElement;
    expect(root).toHaveStyle({ padding: "12px" });
    expect(root).toHaveAttribute("title", "Details");
    expect(root).toHaveAttribute("dir", "rtl");
    expect(root).toHaveAttribute("data-event", "123");
    expect(onClick).toHaveBeenLastCalledWith(root);
    unmount();
    expect(onClick).toHaveBeenLastCalledWith(null);
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
      "border-v2-semantic-info-border"
    );
    expect(tagVariants({ variant: "error" })).toContain(
      "text-v2-semantic-error-text"
    );
    expect(tagVariants({ variant: "accent" })).toContain(
      "bg-v2-semantic-brand-surface"
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
    it("has a 24px hit area around a 14px icon on a 22px plate", () => {
      const button = renderRemovable();
      expect(button).toHaveClass("size-6", "before:inset-px");
      expect(button.querySelector("svg")).toHaveClass("size-3.5");
      // Stroke weight is CSS, so the markup stays identical to v1.
      expect(button.querySelector("svg")).toHaveClass("[stroke-width:1.75]");
    });
    it("lays out as Arc's 22px circle, 3px from the label and 4px from the edge", () => {
      const button = renderRemovable();
      // 24px box with -1px on the trailing side and -4px leading (6px flex gap - 4px = 2px, +1px inset = 3px).
      expect(button).toHaveClass("-ml-1", "-mr-px");
      expect(screen.getByText("Event").parentElement).toHaveClass("pr-1");
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
    it("keeps the hover plate conditional on an enabled fine-pointer button", () => {
      const button = renderRemovable();
      expect(button).toHaveClass(
        "before:bg-v2-semantic-bg-inverted",
        "before:opacity-0",
        "enabled:[@media(hover:hover)_and_(pointer:fine)]:hover:before:opacity-[0.08]"
      );
    });
    it("limits press motion to the dismiss control and includes reduced-motion overrides", () => {
      const button = renderRemovable();
      expect(button).toHaveClass(
        "enabled:active:scale-[0.96]",
        "duration-200",
        "enabled:active:duration-100",
        "motion-reduce:enabled:active:scale-100",
        "motion-reduce:before:transition-none"
      );
      expect(button.className).not.toContain("hover:scale-");
      expect(screen.getByText("Event").parentElement?.className).not.toMatch(
        /hover:|transition|scale/
      );
    });
    it("draws its own focus ring instead of the browser default", () => {
      const button = renderRemovable();
      expect(button).toHaveClass(
        "focus-visible:outline-none",
        "focus-visible:after:outline",
        "focus-visible:after:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))]"
      );
    });
    it("stays inert and flat when disabled", () => {
      const button = renderRemovable({ removeDisabled: true });
      expect(button).toBeDisabled();
      expect(button).toHaveClass(
        "cursor-not-allowed",
        "opacity-50",
        "active:scale-100"
      );
      expect(button).toHaveClass("size-6");
    });
    it("does not add elements for the plate or hit area", () => {
      const button = renderRemovable();
      expect(button.children).toHaveLength(1);
      expect(button.firstElementChild?.tagName.toLowerCase()).toBe("svg");
    });
  });

  it("keeps passive tags outside the tab order", async () => {
    render(
      <>
        <Tag>Passive</Tag>
        <button>Continue</button>
      </>
    );
    const root = screen.getByText("Passive").parentElement;
    expect(root?.tagName).toBe("SPAN");
    expect(root).not.toHaveAttribute("role");
    expect(root).not.toHaveAttribute("tabindex");
    await userEvent.setup().tab();
    expect(screen.getByRole("button", { name: "Continue" })).toHaveFocus();
  });

  it("uses a real non-submit remove button for all keyboard removal keys", async () => {
    const onRemove = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Tag onRemove={onRemove}>Event</Tag>
      </form>
    );
    const button = screen.getByRole("button", { name: "Remove" });
    const user = userEvent.setup();
    await user.tab();
    expect(button).toHaveFocus();
    for (const key of ["{Enter}", " ", "{Backspace}", "{Delete}"]) {
      await user.keyboard(key);
    }
    expect(onRemove).toHaveBeenCalledTimes(4);
    expect(onRemove.mock.calls.every(([event]) => event.type === "click")).toBe(
      true
    );
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Event")).toBeInTheDocument();
  });

  it("lets the native keydown callback cancel Backspace/Delete", async () => {
    const onRemove = vi.fn();
    const onKeyDown = vi.fn((event: React.KeyboardEvent<HTMLSpanElement>) =>
      event.preventDefault()
    );
    render(
      <Tag onRemove={onRemove} onKeyDown={onKeyDown}>
        Event
      </Tag>
    );
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard("{Backspace}{Delete}");
    expect(onKeyDown).toHaveBeenCalledTimes(2);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("does not intercept modified, repeated or descendant editing keys", async () => {
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} tabIndex={0}>
        <input aria-label="Tag note" defaultValue="Notes" />
      </Tag>
    );
    const button = screen.getByRole("button", { name: "Remove" });
    fireEvent.keyDown(button, { key: "Delete", repeat: true });
    for (const modifier of ["altKey", "ctrlKey", "metaKey", "shiftKey"]) {
      fireEvent.keyDown(button, { key: "Delete", [modifier]: true });
    }
    fireEvent.keyDown(button.parentElement!, { key: "Backspace" });
    const user = userEvent.setup();
    await user.click(screen.getByRole("textbox", { name: "Tag note" }));
    await user.keyboard("{Backspace}");
    expect(screen.getByRole("textbox")).toHaveValue("Note");
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("preserves bubbling and click cancellation without removing itself", async () => {
    const onClick = vi.fn();
    const onRemove = vi.fn((event: React.MouseEvent<HTMLButtonElement>) =>
      event.preventDefault()
    );
    render(
      <Tag onRemove={onRemove} onClick={onClick}>
        Event
      </Tag>
    );
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0][0].defaultPrevented).toBe(true);
    expect(screen.getByText("Event")).toBeInTheDocument();
  });

  it("skips a disabled dismiss control when tabbing", async () => {
    render(
      <>
        <Tag onRemove={vi.fn()} removeDisabled>
          Event
        </Tag>
        <button>Next action</button>
      </>
    );
    await userEvent.setup().tab();
    expect(screen.getByRole("button", { name: "Next action" })).toHaveFocus();
  });
});

describe("TagGroup limits", () => {
  const tags = [
    { value: "One" },
    { value: "Two" },
    { value: "Three" },
    { value: "Four" },
  ];
  it.each([
    [0, 0, 4],
    [-3, 0, 4],
    [1.8, 1, 3],
    [2, 2, 2],
    [5, 4, 0],
    [NaN, 2, 2],
    [Infinity, 4, 0],
    [-Infinity, 0, 4],
  ])(
    "reports the actual hidden count for maxVisible=%s",
    (maxVisible, visible, hidden) => {
      render(<TagGroup tags={tags} maxVisible={maxVisible} />);
      tags.forEach(({ value }, index) => {
        if (index < visible)
          expect(screen.getByText(value)).toBeInTheDocument();
        else expect(screen.queryByText(value)).not.toBeInTheDocument();
      });
      if (hidden)
        expect(screen.getByText("+" + hidden + " more")).toBeInTheDocument();
      else expect(screen.queryByText(/more/)).not.toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    }
  );
  it("renders an empty array without an overflow counter", () => {
    const { container } = render(<TagGroup tags={[]} maxVisible={0} />);
    expect(container.textContent).toBe("");
  });
});

describe("Dismissible parent composition", () => {
  const Demo = Dismissible.render as React.ComponentType<
    React.ComponentProps<typeof Tag> & { removable: boolean }
  >;
  it("moves to the next tag, then the previous tag, then Reset after local removals", async () => {
    render(<Demo removable />);
    const user = userEvent.setup();
    await user.tab();
    expect(
      screen.getByRole("button", { name: "Remove Support" })
    ).toHaveFocus();
    await user.keyboard("{Delete}");
    expect(
      screen.queryByRole("button", { name: "Remove Support" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove VIP" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Remove Trial" })).toHaveFocus();
    await user.keyboard("{Backspace}");
    expect(screen.getByRole("button", { name: "Remove VIP" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Reset tags" })).toHaveFocus();
    expect(screen.getByText("No tags selected")).toBeInTheDocument();
    await user.keyboard(" ");
    expect(screen.getAllByRole("button", { name: /^Remove / })).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Reset tags" })).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent(
      "All three tags restored."
    );
  });
  it("keeps focus and content when a parent cancels removal", async () => {
    render(<Demo removable />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("checkbox", { name: "Keep VIP" }));
    const vip = screen.getByRole("button", { name: "Remove VIP" });
    await user.click(vip);
    expect(vip).toHaveFocus();
    await user.keyboard("{Delete}");
    expect(vip).toHaveFocus();
    expect(vip).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "VIP kept. Removal was cancelled."
    );
  });
});
