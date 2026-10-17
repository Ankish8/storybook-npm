import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, buttonVariants } from "../../v2/button";
import {
  Button as ButtonV1,
  buttonVariants as buttonVariantsV1,
} from "../../button";

const VARIANTS = [
  "default",
  "primary",
  "destructive",
  "success",
  "outline",
  "secondary",
  "ghost",
  "link",
  "dashed",
] as const;

const SIZES = ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"] as const;

describe("Button (v2)", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("applies default variant and size classes", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-semantic-primary");
    expect(button).toHaveClass("text-semantic-text-inverted");
    expect(button).toHaveClass("h-10");
  });

  it.each(VARIANTS)("renders %s with a flat surface", (variant) => {
    render(<Button variant={variant}>Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("shadow-none", "font-medium");
    expect(button.className).not.toMatch(
      /linear-gradient|skeuomorphic|inset_0/
    );
  });

  it.each([
    ["default", ["h-10", "px-4"]],
    ["sm", ["h-8", "px-3"]],
    ["lg", ["h-11", "px-5"]],
    ["icon", ["h-10", "w-10", "p-0"]],
    ["icon-sm", ["h-8", "w-8", "p-0"]],
    ["icon-lg", ["h-11", "w-11", "p-0"]],
  ] as const)("renders %s size", (size, expectedClasses) => {
    render(<Button size={size}>Test</Button>);
    const button = screen.getByRole("button");
    expectedClasses.forEach((cls) => expect(button).toHaveClass(cls));
  });

  it.each(SIZES)("keeps the 8px radius and Inter label on %s", (size) => {
    render(<Button size={size}>Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-lg");
    expect(button).toHaveClass("font-medium");
    expect(button).toHaveClass(
      "font-[family-name:var(--font-v2,Inter,sans-serif)]"
    );
  });

  it.each(["icon", "icon-sm", "icon-lg"] as const)(
    "keeps link buttons stationary at %s size",
    (size) => {
      render(<Button variant="link" size={size} aria-label="Open details" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("active:scale-100");
      expect(button).not.toHaveClass("active:scale-[0.97]");
    }
  );

  it("uses the Figma focus ring (1px outline, 3px offset)", () => {
    render(<Button>Focus</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("focus-visible:outline");
    // Arbitrary property so tailwind-merge 2.x (consumers) and 3.x (Storybook)
    // both keep the bare `outline` style class — see the note in button.tsx.
    expect(button).toHaveClass("focus-visible:[outline-width:1px]");
    expect(button).toHaveClass("focus-visible:outline-offset-[3px]");
    expect(button).toHaveClass("focus-visible:outline-semantic-primary");
  });

  it.each(["default", "primary"] as const)(
    "preserves the brand fill on %s",
    (variant) => {
      render(<Button variant={variant}>Save</Button>);
      expect(screen.getByRole("button")).toHaveClass(
        "bg-semantic-primary",
        "border-semantic-primary"
      );
    }
  );

  it("distinguishes neutral Secondary, white Outline and filled green Success", () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "bg-semantic-bg-ui",
      "border-transparent"
    );
    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "border-semantic-border-input"
    );
    expect(screen.getByRole("button")).not.toHaveClass("bg-semantic-bg-ui");
    rerender(<Button variant="success">Success</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "bg-semantic-success-text",
      "text-semantic-text-inverted"
    );
  });

  describe("disabled and loading", () => {
    it("is disabled when the disabled prop is set, without aria-busy", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).not.toHaveAttribute("aria-busy");
      expect(button).toHaveClass("disabled:opacity-[0.52]");
    });

    it("is natively disabled and aria-busy when loading", () => {
      render(<Button loading>Submit</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toHaveAttribute("aria-disabled", "true");
      button.focus();
      expect(button).not.toHaveFocus();
    });

    it("shows a spinner and the loading text when provided", () => {
      const { container } = render(
        <Button loading loadingText="Please wait...">
          Submit
        </Button>
      );
      expect(screen.getByRole("button")).toHaveTextContent("Please wait...");
      expect(container.querySelector("svg")).toHaveClass("animate-spin");
    });

    it("keeps the children as the label while loading without loadingText", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button")).toHaveTextContent("Loading");
    });

    it.each(["icon", "icon-sm", "icon-lg"] as const)(
      "keeps %s loading centered without a visible text label",
      (size) => {
        const { container } = render(
          <Button
            size={size}
            loading
            loadingText="Saving…"
            aria-label="Save changes"
          >
            <svg aria-hidden="true" />
          </Button>
        );
        const button = screen.getByRole("button");
        expect(button).toHaveAccessibleName("Save changes");
        expect(
          button.querySelector("[data-v2-button-content]")
        ).toHaveAttribute("data-concealed", "true");
        expect(container.querySelectorAll("svg")).toHaveLength(1);
      }
    );

    it("retains an accessible label for an icon-sized loading action with text children", () => {
      render(
        <Button size="icon" loading loadingText="Saving…">
          Save
        </Button>
      );
      expect(screen.getByRole("button")).toHaveAccessibleName("Saving…");
    });

    it.each(VARIANTS)("%s keeps its palette while loading", (variant) => {
      const { rerender } = render(<Button variant={variant}>Test</Button>);
      const before = screen.getByRole("button").className;
      rerender(
        <Button variant={variant} loading>
          Test
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.className).toBe(before);
      expect(button).toHaveClass("aria-busy:cursor-progress");
      expect(button.querySelector("[data-v2-button-spinner]")).toHaveAttribute(
        "data-loading",
        "true"
      );
      expect(button.querySelector("[data-v2-button-content]")).toHaveAttribute(
        "data-concealed",
        "true"
      );
    });

    it("does not trigger click when disabled or loading", () => {
      const handleClick = vi.fn();
      const { rerender } = render(
        <Button disabled onClick={handleClick}>
          Click
        </Button>
      );
      screen.getByRole("button").click();
      rerender(
        <Button loading onClick={handleClick}>
          Click
        </Button>
      );
      screen.getByRole("button").click();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("blocks pointer and keyboard activation and form submission while busy", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const onSubmit = vi.fn((event) => event.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Button loading type="submit" onClick={onClick}>
            Save
          </Button>
          <input aria-label="Next field" />
        </form>
      );
      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter} ");
      fireEvent.click(button);
      expect(button).toBeDisabled();
      expect(onClick).not.toHaveBeenCalled();
      expect(onSubmit).not.toHaveBeenCalled();
      await user.tab();
      expect(screen.getByRole("textbox")).toHaveFocus();
    });

    it("restores native availability after the loading cycle", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { rerender } = render(<Button onClick={onClick}>Save</Button>);
      const button = screen.getByRole("button");
      button.focus();
      rerender(
        <Button loading loadingText="Saving…" onClick={onClick}>
          Save
        </Button>
      );
      expect(button).toBeDisabled();
      expect(button).toHaveAccessibleName("Saving…");
      await user.click(button);
      expect(onClick).not.toHaveBeenCalled();
      rerender(<Button onClick={onClick}>Saved</Button>);
      expect(screen.getByRole("button")).toBe(button);
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveAttribute("aria-disabled");
      await user.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it.each([ButtonV1, Button])(
      "preserves the native v1 loading contract for %s",
      async (Component) => {
        const user = userEvent.setup();
        const onSubmit = vi.fn((event) => event.preventDefault());
        const { container, rerender } = render(
          <form onSubmit={onSubmit}>
            <Component type="submit" loading>
              Save
            </Component>
            <input aria-label="Next field" />
          </form>
        );
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
        expect(
          container.querySelector("svg.lucide-loader-circle")
        ).toBeInTheDocument();
        await user.tab();
        expect(screen.getByRole("textbox")).toHaveFocus();
        button.click();
        expect(onSubmit).not.toHaveBeenCalled();
        rerender(
          <form onSubmit={onSubmit}>
            <Component type="submit">Save</Component>
          </form>
        );
        expect(screen.getByRole("button")).not.toBeDisabled();
        await user.click(screen.getByRole("button"));
        expect(onSubmit).toHaveBeenCalledTimes(1);
      }
    );

    it("disables a slotted native button while loading", () => {
      const childClick = vi.fn();
      render(
        <Button asChild loading>
          <button onClick={childClick}>Save</button>
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      button.click();
      expect(childClick).not.toHaveBeenCalled();
    });

    it("replaces side icons with the same loading SVG as v1", () => {
      render(
        <Button
          loading
          leftIcon={<span>Before</span>}
          rightIcon={<span>After</span>}
        >
          Save
        </Button>
      );
      expect(screen.getByRole("button")).toHaveAccessibleName("Save");
      expect(screen.queryByText("Before")).not.toBeInTheDocument();
      expect(screen.queryByText("After")).not.toBeInTheDocument();
    });

    it("blocks child callbacks and link navigation when asChild is busy", () => {
      const onClick = vi.fn();
      const childClick = vi.fn();
      render(
        <Button asChild loading loadingText="Opening…" onClick={onClick}>
          <a href="#destination" onClick={childClick}>
            Open
          </a>
        </Button>
      );
      const link = screen.getByRole("link");
      expect(link).toHaveAccessibleName("Opening…");
      expect(link).toHaveAttribute("aria-disabled", "true");
      expect(fireEvent.click(link)).toBe(false);
      expect(onClick).not.toHaveBeenCalled();
      expect(childClick).not.toHaveBeenCalled();
    });

    it("honors aria-disabled supplied by a consumer", () => {
      const onClick = vi.fn();
      render(
        <Button aria-disabled="true" onClick={onClick}>
          Unavailable
        </Button>
      );
      fireEvent.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  it.each([true, "menu", "dialog", "listbox"] as const)(
    "marks %s popup anchors as stationary",
    (popup) => {
      render(<Button aria-haspopup={popup}>Open menu</Button>);
      expect(screen.getByRole("button")).toHaveAttribute(
        "data-popup-anchor",
        "true"
      );
    }
  );

  it("recognizes popup metadata on a slotted child", () => {
    render(
      <Button asChild>
        <button aria-haspopup="menu">Menu</button>
      </Button>
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-popup-anchor",
      "true"
    );
  });

  it.each([{ "data-state": "closed" }, { role: "combobox" }])(
    "keeps non-menu popup anchors stationary: %j",
    (props) => {
      render(<Button {...props}>Open</Button>);
      expect(screen.getByText("Open").closest("button")).toHaveAttribute(
        "data-popup-anchor",
        "true"
      );
    }
  );

  it.each([
    [44, "0.96"],
    [120, "0.97"],
    [280, "0.985"],
  ])("adjusts press depth to the rendered %ipx width", (width, expected) => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button");
    Object.defineProperty(button, "offsetWidth", { value: width });
    fireEvent.pointerDown(button);
    expect(button.style.getPropertyValue("--v2-button-press")).toBe(expected);
  });

  describe("icons", () => {
    it("renders a left icon", () => {
      render(
        <Button leftIcon={<span data-testid="left-icon">←</span>}>
          With Icon
        </Button>
      );
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
      expect(screen.getByText("With Icon")).toBeInTheDocument();
    });

    it("renders a right icon", () => {
      render(
        <Button rightIcon={<span data-testid="right-icon">→</span>}>
          With Icon
        </Button>
      );
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("sizes nested svg icons to 16px", () => {
      render(<Button>Icon</Button>);
      expect(screen.getByRole("button")).toHaveClass("[&_svg]:size-4");
    });
  });

  it("merges a custom className and lets it override size classes", () => {
    render(<Button className="custom-class h-14">Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
    expect(button).toHaveClass("h-14");
    expect(button).not.toHaveClass("h-10");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Button ref={ref}>Test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders as child component with asChild", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveTextContent("Link Button");
    expect(link).toHaveAttribute("href", "/test");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByRole("button").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("exposes buttonVariants for styling links as buttons", () => {
    expect(buttonVariants({ variant: "outline", size: "sm" })).toContain("h-8");
  });
});

// v2 must be a drop-in: moving a screen is an import-path change, so every
// variant, size and structural behaviour of v1 has to exist here too.
describe("Button (v2) — v1 parity", () => {
  // cva ignores unknown values, so a name v2 lacks returns the same classes as
  // a made-up one.
  const unknown = <T,>(value: string) => value as unknown as T;

  it.each(SIZES)(
    "preserves the primary alias and distinct secondary/outline styles at %s size",
    (size) => {
      const options = { size, className: "consumer-class" };
      expect(buttonVariants({ ...options, variant: "default" })).toBe(
        buttonVariants({ ...options, variant: "primary" })
      );
      expect(buttonVariants(options)).toBe(
        buttonVariants({ ...options, variant: "primary" })
      );
      expect(buttonVariants({ ...options, variant: "outline" })).not.toBe(
        buttonVariants({ ...options, variant: "secondary" })
      );
    }
  );

  it("keeps Link recognizable and Ghost unframed while retaining keyboard focus", () => {
    const view = render(<Button variant="link">Learn more</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "border-0",
      "underline",
      "text-semantic-text-link",
      "focus-visible:outline"
    );
    view.rerender(<Button variant="ghost">More</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "border-0",
      "bg-transparent",
      "focus-visible:outline"
    );
    expect(screen.getByRole("button")).not.toHaveClass("border");
  });

  it.each(VARIANTS)("accepts the v1 variant %s", (variant) => {
    expect(buttonVariants({ variant })).not.toBe(
      buttonVariants({ variant: unknown<"default">("__missing__") })
    );
    expect(buttonVariantsV1({ variant })).not.toBe(
      buttonVariantsV1({ variant: unknown<"default">("__missing__") })
    );
  });

  it.each(SIZES)("accepts the v1 size %s", (size) => {
    expect(buttonVariants({ size })).not.toBe(
      buttonVariants({ size: unknown<"default">("__missing__") })
    );
    expect(buttonVariantsV1({ size })).not.toBe(
      buttonVariantsV1({ size: unknown<"default">("__missing__") })
    );
  });

  it("preserves v1 content and icons with one accessible action", () => {
    const props = {
      leftIcon: <i data-testid="l" />,
      rightIcon: <i data-testid="r" />,
      children: "Label",
    };
    const v1 = render(<ButtonV1 {...props} />).container.innerHTML;
    const v2 = render(<Button {...props} />).container.innerHTML;
    expect(v1).toContain("Label");
    expect(v2).toContain("Label");
    expect(v2).toContain('data-v2-button-content=""');
    expect(v2.match(/<button/g)).toHaveLength(1);
  });

  it("preserves the loading label and native disabled state from v1", () => {
    const v1 = render(
      <ButtonV1 loading loadingText="Saving...">
        Save
      </ButtonV1>
    ).container.innerHTML;
    const v2 = render(
      <Button loading loadingText="Saving...">
        Save
      </Button>
    ).container.innerHTML;
    expect(v1).toContain('disabled=""');
    expect(v1).toContain("Saving...");
    expect(v2).toContain('disabled=""');
    expect(v2).toContain('aria-disabled="true"');
    expect(v2).toContain("Saving...");
  });
});
