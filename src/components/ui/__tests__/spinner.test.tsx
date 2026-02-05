import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "../spinner";

describe("Spinner", () => {
  it("renders correctly", () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders an SVG element", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders two circle elements (track + arc)", () => {
    const { container } = render(<Spinner />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(2);
  });

  it("applies default variant classes to SVG", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("text-semantic-primary");
  });

  it("applies default size class to SVG", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("size-6");
  });

  it.each([
    ["default", "text-semantic-primary"],
    ["secondary", "text-semantic-text-secondary"],
    ["muted", "text-semantic-text-muted"],
    ["inverted", "text-white"],
    ["current", "text-current"],
  ] as const)(
    "renders %s variant with correct classes",
    (variant, expectedClass) => {
      const { container } = render(<Spinner variant={variant} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass(expectedClass);
    }
  );

  it.each([
    ["sm", "size-4"],
    ["default", "size-6"],
    ["lg", "size-8"],
    ["xl", "size-12"],
  ] as const)("renders %s size with correct classes", (size, expectedClass) => {
    const { container } = render(<Spinner size={size} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass(expectedClass);
  });

  it("applies animate-spin class to SVG", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("animate-spin");
  });

  it("applies custom className to wrapper", () => {
    const { container } = render(<Spinner className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes through additional props", () => {
    render(<Spinner data-testid="my-spinner" />);
    expect(screen.getByTestId("my-spinner")).toBeInTheDocument();
  });

  describe("Accessibility", () => {
    it('has role="status"', () => {
      render(<Spinner />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it('has default aria-label of "Loading"', () => {
      render(<Spinner />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Loading"
      );
    });

    it("accepts custom aria-label", () => {
      render(<Spinner aria-label="Saving changes" />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Saving changes"
      );
    });

    it("renders sr-only text with the label", () => {
      const { container } = render(<Spinner aria-label="Processing" />);
      const srOnly = container.querySelector(".sr-only");
      expect(srOnly).toBeInTheDocument();
      expect(srOnly).toHaveTextContent("Processing");
    });
  });

  describe("SVG structure", () => {
    it("track circle has 0.25 opacity", () => {
      const { container } = render(<Spinner />);
      const circles = container.querySelectorAll("circle");
      expect(circles[0]).toHaveAttribute("opacity", "0.25");
    });

    it("active arc has strokeDasharray", () => {
      const { container } = render(<Spinner />);
      const circles = container.querySelectorAll("circle");
      expect(circles[1]).toHaveAttribute("stroke-dasharray");
    });

    it("active arc has strokeLinecap round", () => {
      const { container } = render(<Spinner />);
      const circles = container.querySelectorAll("circle");
      expect(circles[1]).toHaveAttribute("stroke-linecap", "round");
    });
  });

  describe("Type Compatibility", () => {
    it("accepts combined variant and size props", () => {
      const { container } = render(
        <Spinner variant="muted" size="lg" data-testid="spinner" />
      );
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("text-semantic-text-muted");
      expect(svg).toHaveClass("size-8");
    });
  });
});
