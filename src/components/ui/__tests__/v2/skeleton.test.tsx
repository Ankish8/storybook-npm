import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "../../v2/skeleton";

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

describe("Skeleton animation", () => {
  it("keeps the pulse as the default behaviour", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass(
      "animate-pulse",
      "motion-reduce:animate-none"
    );
    expect(container.firstChild).not.toHaveClass("overflow-hidden");
  });

  it("pulses like Arc: 1.8s in-out, 11 beats, then rests", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass(
      "[animation-duration:1.8s]",
      "[animation-timing-function:cubic-bezier(0.65,0,0.35,1)]",
      "[animation-iteration-count:11]",
      "[animation-fill-mode:both]"
    );
  });

  it("accepts animation=pulse explicitly with the same classes as the default", () => {
    const { container: a } = render(<Skeleton />);
    const { container: b } = render(<Skeleton animation="pulse" />);
    expect((b.firstChild as HTMLElement).className).toBe(
      (a.firstChild as HTMLElement).className
    );
  });

  it("sweeps a highlight band for shimmer, gated to motion-safe", () => {
    const { container } = render(<Skeleton animation="shimmer" />);
    const el = container.firstChild as HTMLElement;
    expect(el).not.toHaveClass("animate-pulse");
    expect(el).toHaveClass("relative", "overflow-hidden");
    expect(el.className).toContain("motion-safe:after:animate-in");
    expect(el.className).toContain(
      "motion-safe:after:[animation-duration:1.6s]"
    );
    expect(el.className).toContain(
      "motion-safe:after:[animation-timing-function:linear]"
    );
    expect(el.className).toContain(
      "motion-safe:after:[animation-iteration-count:infinite]"
    );
    expect(el.className).toContain(
      "linear-gradient(90deg,transparent,color-mix(in_srgb,var(--semantic-bg-primary,#FFFFFF)_50%,transparent),transparent)"
    );
    // the band rests off-canvas, so reduced motion shows the plain fill
    expect(el).toHaveClass("after:left-full", "after:w-full");
    expect(el).toHaveClass("bg-semantic-bg-grey");
  });

  it("renders a static fill for animation=none", () => {
    const { container } = render(<Skeleton animation="none" />);
    const el = container.firstChild as HTMLElement;
    expect(el).not.toHaveClass("animate-pulse");
    expect(el.className).not.toContain("animate-in");
    expect(el).toHaveClass("bg-semantic-bg-grey");
  });

  it("keeps the placeholder hidden from assistive technology in every mode", () => {
    for (const animation of ["pulse", "shimmer", "none"] as const) {
      const { container, unmount } = render(<Skeleton animation={animation} />);
      expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
      unmount();
    }
  });
});
