import { afterEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Skeleton, skeletonVariants } from "../../v2/skeleton";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

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

  it("keeps the v1 precedence of dimension props over caller styles", () => {
    const { container } = render(
      <Skeleton
        width={72}
        height="2rem"
        style={{ width: 240, height: 100, opacity: 0.75 }}
      />
    );
    expect(container.firstChild).toHaveStyle({
      width: "72px",
      height: "2rem",
      opacity: "0.75",
    });
    expect(container.firstChild).not.toHaveClass("w-full", "h-4");
  });

  it("accepts dimensions from style without competing default utilities", () => {
    const { container } = render(
      <Skeleton style={{ width: "65%", height: "1.5rem" }} />
    );
    expect(container.firstChild).toHaveStyle({
      width: "65%",
      height: "1.5rem",
    });
    expect(container.firstChild).not.toHaveClass("w-full", "h-4");
  });

  it("allows zero dimensions without falling back to a text line", () => {
    const { container } = render(<Skeleton width={0} height={0} />);
    expect(container.firstChild).toHaveStyle({ width: "0px", height: "0px" });
    expect(container.firstChild).not.toHaveClass("w-full", "h-4");
  });

  it("retains default line sizing in the exported variants helper", () => {
    expect(skeletonVariants().split(" ")).toEqual(
      expect.arrayContaining(["h-4", "w-full", "rounded"])
    );
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("lets caller utilities replace default text-line dimensions", () => {
    const { container } = render(<Skeleton className="h-8 w-32 rounded-lg" />);
    expect(container.firstChild).toHaveClass("h-8", "w-32", "rounded-lg");
    expect(container.firstChild).not.toHaveClass("h-4", "w-full", "rounded");
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

  it("passes native attributes and events through the same div", () => {
    const onClick = vi.fn();
    render(
      <Skeleton
        data-testid="native"
        title="Contact placeholder"
        aria-hidden={false}
        aria-label="Loading contact"
        role="status"
        tabIndex={0}
        onClick={onClick}
      />
    );
    const element = screen.getByTestId("native");
    expect(element).toHaveAttribute("title", "Contact placeholder");
    expect(element).toHaveAttribute("aria-hidden", "false");
    expect(element).toHaveAttribute("aria-label", "Loading contact");
    expect(element).toHaveAttribute("tabindex", "0");
    fireEvent.click(element);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards callback refs and clears them when unmounted", () => {
    const ref = vi.fn();
    const { container, unmount } = render(<Skeleton ref={ref} />);
    expect(ref).toHaveBeenLastCalledWith(container.firstChild);
    unmount();
    expect(ref).toHaveBeenLastCalledWith(null);
  });

  it("keeps caller children in the placeholder div", () => {
    const { container } = render(<Skeleton>Caller content</Skeleton>);
    expect(container.firstChild).toHaveTextContent("Caller content");
  });

  describe("Accessibility", () => {
    it('has aria-hidden="true"', () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
      expect(container.firstChild).not.toHaveAttribute("aria-busy");
      expect(container.firstChild).not.toHaveAttribute("role");
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
      "[animation-duration:var(--v2-skeleton-duration,1.8s)]",
      "[animation-timing-function:var(--v2-skeleton-timing,cubic-bezier(0.65,0,0.35,1))]",
      "[animation-iteration-count:var(--v2-skeleton-iterations,11)]",
      "[animation-fill-mode:var(--v2-skeleton-fill,both)]"
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
      "motion-safe:after:[animation-duration:var(--v2-skeleton-duration,1.6s)]"
    );
    expect(el.className).toContain(
      "motion-safe:after:[animation-timing-function:var(--v2-skeleton-timing,linear)]"
    );
    expect(el.className).toContain(
      "motion-safe:after:[animation-iteration-count:var(--v2-skeleton-iterations,12)]"
    );
    expect(el.className).toContain(
      "linear-gradient(90deg,transparent,color-mix(in_srgb,var(--semantic-bg-primary)_50%,transparent),transparent)"
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

  it.each(["pulse", "shimmer"] as const)(
    "retains native animation styles for %s",
    (animation) => {
      const { container } = render(
        <Skeleton
          animation={animation}
          style={{
            animationDelay: "120ms",
            animationDuration: "2.4s",
            animationPlayState: "paused",
            animationTimingFunction: "linear",
            animationIterationCount: 3,
            animationFillMode: "forwards",
            opacity: 0.8,
          }}
        />
      );
      const element = container.firstChild as HTMLDivElement;
      expect(element).toHaveStyle({
        animationDelay: "120ms",
        animationDuration: "2.4s",
        animationPlayState: "paused",
        animationTimingFunction: "linear",
        animationIterationCount: "3",
        animationFillMode: "forwards",
        opacity: "0.8",
      });
      expect(element.style.getPropertyValue("--v2-skeleton-play-state")).toBe(
        "paused"
      );
      expect(element.style.getPropertyValue("--v2-skeleton-delay")).toBe(
        "120ms"
      );
      expect(element.style.getPropertyValue("--v2-skeleton-duration")).toBe(
        "2.4s"
      );
      expect(element.style.getPropertyValue("--v2-skeleton-timing")).toBe(
        "linear"
      );
      expect(element.style.getPropertyValue("--v2-skeleton-iterations")).toBe(
        "3"
      );
      expect(element.style.getPropertyValue("--v2-skeleton-fill")).toBe(
        "forwards"
      );
    }
  );

  it.each(["pulse", "shimmer"] as const)(
    "pauses %s while offscreen or the page is hidden and resumes only when both are visible",
    (animation) => {
      let intersect: (visible: boolean) => void = () => {};
      const disconnect = vi.fn();
      const observe = vi.fn();
      vi.stubGlobal(
        "IntersectionObserver",
        class {
          constructor(callback: IntersectionObserverCallback) {
            intersect = (isIntersecting) =>
              callback(
                [{ isIntersecting } as IntersectionObserverEntry],
                this as unknown as IntersectionObserver
              );
          }
          observe = observe;
          disconnect = disconnect;
        }
      );
      const visibility = vi
        .spyOn(document, "visibilityState", "get")
        .mockReturnValue("visible");
      const { container, unmount } = render(
        <Skeleton
          animation={animation}
          style={{ animationPlayState: "running" }}
        />
      );
      const element = container.firstChild as HTMLDivElement;
      expect(observe).toHaveBeenCalledWith(element);
      act(() => intersect(false));
      expect(element.style.animationPlayState).toBe("paused");
      expect(element.style.getPropertyValue("--v2-skeleton-play-state")).toBe(
        "paused"
      );
      act(() => {
        visibility.mockReturnValue("hidden");
        document.dispatchEvent(new Event("visibilitychange"));
        intersect(true);
      });
      expect(element.style.animationPlayState).toBe("paused");
      act(() => {
        visibility.mockReturnValue("visible");
        document.dispatchEvent(new Event("visibilitychange"));
      });
      expect(element.style.animationPlayState).toBe("running");
      expect(element.style.getPropertyValue("--v2-skeleton-play-state")).toBe(
        "running"
      );
      unmount();
      expect(disconnect).toHaveBeenCalledTimes(1);
    }
  );

  it("starts paused when mounted in a hidden document", () => {
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveStyle({ animationPlayState: "paused" });
  });

  it("does not observe a static placeholder", () => {
    const observer = vi.fn();
    vi.stubGlobal("IntersectionObserver", observer);
    render(<Skeleton animation="none" />);
    expect(observer).not.toHaveBeenCalled();
  });
});
