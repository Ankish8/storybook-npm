import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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

const SOLID = ["default", "primary", "destructive", "success"] as const;

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

  it.each([
    ["default", ["bg-semantic-primary", "border-2"]],
    ["primary", ["bg-semantic-primary", "border-2"]],
    ["destructive", ["bg-semantic-error-primary", "border"]],
    ["success", ["bg-semantic-success-primary", "border"]],
    ["outline", ["bg-semantic-bg-primary", "border-semantic-border-layout"]],
    ["secondary", ["bg-semantic-info-surface"]],
    ["ghost", ["text-semantic-text-link", "bg-transparent"]],
    ["link", ["text-semantic-text-secondary", "hover:underline"]],
    ["dashed", ["border-dashed", "bg-semantic-bg-primary"]],
  ] as const)("renders %s variant", (variant, expectedClasses) => {
    render(<Button variant={variant}>Test</Button>);
    const button = screen.getByRole("button");
    expectedClasses.forEach((cls) => expect(button).toHaveClass(cls));
  });

  it.each([
    ["default", ["h-10", "px-4"]],
    ["sm", ["h-8", "px-4", "text-xs"]],
    ["lg", ["h-12", "px-4"]],
    ["icon", ["h-10", "w-10", "p-0"]],
    ["icon-sm", ["h-8", "w-8", "p-0"]],
    ["icon-lg", ["h-12", "w-12", "p-0"]],
  ] as const)("renders %s size", (size, expectedClasses) => {
    render(<Button size={size}>Test</Button>);
    const button = screen.getByRole("button");
    expectedClasses.forEach((cls) => expect(button).toHaveClass(cls));
  });

  it.each(SIZES)("keeps the 8px radius and Inter label on %s", (size) => {
    render(<Button size={size}>Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-lg");
    expect(button).toHaveClass("font-semibold");
    expect(button).toHaveClass(
      "font-[family-name:var(--font-v2,Inter,sans-serif)]"
    );
  });

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

  describe("elevation", () => {
    it.each(SOLID)(
      "%s has the skeuomorphic shadow and drops it when pressed",
      (variant) => {
        render(<Button variant={variant}>Solid</Button>);
        const button = screen.getByRole("button");
        expect(button.className).toContain(
          "shadow-[0_1px_2px_0_rgba(12,15,18,0.05),inset_0_0_0_1px_rgba(10,13,18,0.18)"
        );
        expect(button).toHaveClass("active:shadow-none");
        expect(button.className).toContain(
          "active:bg-[linear-gradient(270deg,"
        );
      }
    );

    it.each(["outline", "secondary"] as const)(
      "%s has the soft shadow",
      (variant) => {
        render(<Button variant={variant}>Soft</Button>);
        expect(screen.getByRole("button")).toHaveClass(
          "shadow-[4px_4px_40px_0_rgba(0,0,0,0.02)]"
        );
      }
    );

    it.each(["ghost", "link", "dashed"] as const)(
      "%s has no shadow",
      (variant) => {
        render(<Button variant={variant}>Flat</Button>);
        expect(screen.getByRole("button").className).not.toMatch(
          /(^|\s)shadow-\[/
        );
      }
    );
  });

  describe("disabled and loading", () => {
    it("is disabled when the disabled prop is set, without aria-busy", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).not.toHaveAttribute("aria-busy");
      expect(button).toHaveClass("disabled:pointer-events-none");
    });

    it("is disabled and aria-busy when loading", () => {
      render(<Button loading>Submit</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
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

    // A loading button is also :disabled, so variants whose disabled look
    // differs from their loading look must restore it with aria-busy:.
    it.each([
      [
        "outline",
        [
          "aria-busy:bg-semantic-bg-primary",
          "aria-busy:text-semantic-text-secondary",
        ],
      ],
      [
        "secondary",
        [
          "aria-busy:bg-semantic-bg-ui",
          "aria-busy:text-semantic-text-secondary",
        ],
      ],
      ["success", ["aria-busy:bg-semantic-success-primary"]],
      ["ghost", ["aria-busy:text-semantic-text-link"]],
      ["link", ["aria-busy:text-semantic-text-secondary"]],
      ["dashed", ["aria-busy:opacity-100"]],
    ] as const)(
      "%s restores its normal look while loading",
      (variant, expectedClasses) => {
        render(<Button variant={variant}>Test</Button>);
        const button = screen.getByRole("button");
        expectedClasses.forEach((cls) => expect(button).toHaveClass(cls));
      }
    );

    it.each(["default", "primary", "destructive"] as const)(
      "%s uses the same look for disabled and loading",
      (variant) => {
        render(<Button variant={variant}>Test</Button>);
        expect(screen.getByRole("button").className).not.toContain(
          "aria-busy:"
        );
      }
    );

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

    it("sizes nested svg icons to 18px", () => {
      render(<Button>Icon</Button>);
      expect(screen.getByRole("button")).toHaveClass("[&_svg]:size-[18px]");
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

  const withoutClasses = (html: string) =>
    html.replace(/ class="[^"]*"/g, "").replace(/ aria-busy="true"/g, "");

  it("renders the same markup as v1 (classes aside) with icons", () => {
    const props = {
      leftIcon: <i data-testid="l" />,
      rightIcon: <i data-testid="r" />,
      children: "Label",
    };
    const v1 = render(<ButtonV1 {...props} />).container.innerHTML;
    const v2 = render(<Button {...props} />).container.innerHTML;
    expect(withoutClasses(v2)).toBe(withoutClasses(v1));
  });

  it("renders the same markup as v1 (classes aside) while loading", () => {
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
    expect(withoutClasses(v2)).toBe(withoutClasses(v1));
  });
});
