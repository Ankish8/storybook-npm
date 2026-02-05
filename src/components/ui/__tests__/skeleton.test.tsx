import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "../skeleton";

describe("Skeleton", () => {
  it("renders correctly", () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it("applies default variant classes", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("bg-semantic-bg-grey");
  });

  it("applies default shape classes", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("h-4");
    expect(container.firstChild).toHaveClass("w-full");
    expect(container.firstChild).toHaveClass("rounded");
  });

  it("applies animate-pulse class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it.each([
    ["default", "bg-semantic-bg-grey"],
    ["subtle", "bg-semantic-bg-ui"],
  ] as const)(
    "renders %s variant with correct classes",
    (variant, expectedClass) => {
      const { container } = render(<Skeleton variant={variant} />);
      expect(container.firstChild).toHaveClass(expectedClass);
    }
  );

  it.each([
    ["line", ["h-4", "w-full", "rounded"]],
    ["circle", ["rounded-full"]],
    ["rectangle", ["rounded"]],
  ] as const)(
    "renders %s shape with correct classes",
    (shape, expectedClasses) => {
      const { container } = render(<Skeleton shape={shape} />);
      for (const cls of expectedClasses) {
        expect(container.firstChild).toHaveClass(cls);
      }
    }
  );

  it("applies width as number (px)", () => {
    const { container } = render(<Skeleton width={200} />);
    expect(container.firstChild).toHaveStyle({ width: "200px" });
  });

  it("applies width as string", () => {
    const { container } = render(<Skeleton width="50%" />);
    expect(container.firstChild).toHaveStyle({ width: "50%" });
  });

  it("applies height as number (px)", () => {
    const { container } = render(<Skeleton height={100} />);
    expect(container.firstChild).toHaveStyle({ height: "100px" });
  });

  it("applies height as string", () => {
    const { container } = render(<Skeleton height="10rem" />);
    expect(container.firstChild).toHaveStyle({ height: "10rem" });
  });

  it("applies both width and height", () => {
    const { container } = render(<Skeleton width={40} height={40} />);
    expect(container.firstChild).toHaveStyle({ width: "40px", height: "40px" });
  });

  it("merges inline style with dimension props", () => {
    const { container } = render(
      <Skeleton width={100} style={{ opacity: 0.5 }} />
    );
    expect(container.firstChild).toHaveStyle({
      width: "100px",
      opacity: "0.5",
    });
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes through additional props", () => {
    render(<Skeleton data-testid="my-skeleton" />);
    expect(screen.getByTestId("my-skeleton")).toBeInTheDocument();
  });

  describe("Accessibility", () => {
    it('has aria-hidden="true"', () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Type Compatibility", () => {
    it("accepts combined variant and shape props", () => {
      const { container } = render(
        <Skeleton variant="subtle" shape="circle" width={40} height={40} />
      );
      expect(container.firstChild).toHaveClass("bg-semantic-bg-ui");
      expect(container.firstChild).toHaveClass("rounded-full");
      expect(container.firstChild).toHaveStyle({
        width: "40px",
        height: "40px",
      });
    });
  });
});
