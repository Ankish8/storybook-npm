import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Spinner, spinnerVariants } from "../../v2/spinner";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Spinner", () => {
  it("keeps a 24px primary status named Loading by default", () => {
    const { container } = render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveClass(
      "size-6",
      "text-semantic-primary"
    );
    expect(container.querySelector(".sr-only")).toHaveTextContent("Loading");
  });

  it.each([
    ["default", "text-semantic-primary"],
    ["secondary", "text-semantic-text-secondary"],
    ["muted", "text-semantic-text-muted"],
    ["inverted", "text-semantic-text-inverted"],
    ["current", "text-current"],
  ] as const)("keeps the %s color variant", (variant, expectedClass) => {
    const { container } = render(<Spinner variant={variant} />);
    expect(container.querySelector("svg")).toHaveClass(expectedClass);
  });

  it.each([
    ["sm", "size-4"],
    ["default", "size-6"],
    ["lg", "size-8"],
    ["xl", "size-12"],
  ] as const)("keeps the %s size", (size, expectedClass) => {
    const { container } = render(<Spinner size={size} />);
    expect(container.querySelector("svg")).toHaveClass(expectedClass);
  });

  it("keeps null size and variant values accepted by the v1 CVA API", () => {
    const { container } = render(<Spinner size={null} variant={null} />);
    expect(container.querySelector("svg")).not.toHaveClass(
      "size-6",
      "text-semantic-primary"
    );
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("keeps the exported variant helper and its animation utility", () => {
    expect(spinnerVariants({ size: "sm", variant: "current" })).toContain(
      "animate-spin"
    );
    expect(spinnerVariants({ size: "sm", variant: "current" })).toContain(
      "size-4"
    );
  });

  it("forwards native div props, events, className and styles", () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <Spinner
        id="request-spinner"
        data-testid="spinner"
        className="custom-spinner"
        role="img"
        title="Loading the inbox"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        style={{ marginTop: 8, width: 48, opacity: 0.75 }}
      />
    );
    const root = screen.getByTestId("spinner");
    expect(root).toHaveAttribute("id", "request-spinner");
    expect(root).toHaveAttribute("role", "img");
    expect(root).toHaveAttribute("title", "Loading the inbox");
    expect(root).toHaveAttribute("tabindex", "0");
    expect(root).toHaveClass("custom-spinner");
    expect(root).toHaveStyle({
      marginTop: "8px",
      width: "48px",
      opacity: "0.75",
    });
    fireEvent.click(root);
    fireEvent.keyDown(root, { key: "Enter" });
    expect(onClick).toHaveBeenCalledOnce();
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it("forwards object and callback refs and clears them on unmount", () => {
    const objectRef = React.createRef<HTMLDivElement>();
    const callbackRef = vi.fn();
    const { rerender, unmount } = render(<Spinner ref={objectRef} />);
    const root = objectRef.current;
    expect(root).toBeInstanceOf(HTMLDivElement);
    rerender(<Spinner ref={callbackRef} />);
    expect(objectRef.current).toBeNull();
    expect(callbackRef).toHaveBeenLastCalledWith(root);
    unmount();
    expect(callbackRef).toHaveBeenLastCalledWith(null);
  });

  it("uses a specific accessible loading label while hiding the SVG", () => {
    const { container } = render(<Spinner aria-label="Saving changes" />);
    expect(
      screen.getByRole("status", { name: "Saving changes" })
    ).toBeInTheDocument();
    expect(container.querySelector(".sr-only")).toHaveTextContent(
      "Saving changes"
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "focusable",
      "false"
    );
  });

  it.each([true, "true"] as const)(
    "removes the duplicate announcement for aria-hidden=%s",
    (ariaHidden) => {
      const { container } = render(
        <div role="status">
          <Spinner aria-hidden={ariaHidden} />
          <span>Saving draft</span>
        </div>
      );
      expect(screen.getAllByRole("status")).toHaveLength(1);
      const root = container.querySelector("[aria-hidden]");
      expect(root).not.toHaveAttribute("role");
      expect(root).not.toHaveAttribute("aria-label");
      expect(root?.querySelector(".sr-only")).toBeNull();
    }
  );

  it("keeps explicit caller roles and false aria-hidden values", () => {
    const { rerender } = render(<Spinner aria-hidden={false} />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    rerender(
      <Spinner aria-hidden="true" role="img" data-testid="decorative" />
    );
    expect(screen.getByTestId("decorative")).toHaveAttribute("role", "img");
  });

  it("supports an external label without repeating the default label in its content", () => {
    const { container } = render(
      <>
        <span id="request-label">Loading report</span>
        <Spinner aria-labelledby="request-label" />
      </>
    );
    expect(
      screen.getByRole("status", { name: "Loading report" })
    ).toBeInTheDocument();
    expect(container.querySelector(".sr-only")).toBeNull();
  });

  it("keeps both circle elements and an unclipped, readable open ring", () => {
    const { container } = render(<Spinner />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(2);
    expect(circles[0]).toHaveAttribute("opacity", "0");
    const ring = circles[1];
    const [dash, gap] = (ring.getAttribute("stroke-dasharray") ?? "")
      .split(" ")
      .map(Number);
    expect(dash / gap).toBeCloseTo(0.75, 5);
    expect(ring).toHaveAttribute("transform", "rotate(45 12 12)");
    const outerRadius =
      Number(ring.getAttribute("r")) +
      Number(ring.getAttribute("stroke-width")) / 2;
    expect(outerRadius).toBeLessThan(12);
  });

  it("maps caller timing into CSS variables while preserving native styles", () => {
    render(
      <Spinner
        data-testid="spinner"
        style={{
          animationDuration: "1.4s",
          animationPlayState: "paused",
          width: 32,
        }}
      />
    );
    const root = screen.getByTestId("spinner");
    expect(root).toHaveStyle({
      animationDuration: "1.4s",
      animationPlayState: "paused",
      width: "32px",
    });
    expect(root.style.getPropertyValue("--v2-spinner-duration")).toBe("1.4s");
    expect(root.style.getPropertyValue("--v2-spinner-play-state")).toBe(
      "paused"
    );
  });

  it("pauses offscreen and on hidden pages without resuming until both are visible", () => {
    let callback: IntersectionObserverCallback | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(next: IntersectionObserverCallback) {
          callback = next;
        }
        observe = observe;
        disconnect = disconnect;
      }
    );
    const visibility = vi.spyOn(document, "visibilityState", "get");
    visibility.mockReturnValue("visible");
    const { unmount } = render(<Spinner data-testid="spinner" />);
    const root = screen.getByTestId("spinner");
    const state = () => root.style.getPropertyValue("--v2-spinner-play-state");
    const intersect = (isIntersecting: boolean) =>
      act(() => {
        callback?.(
          [{ isIntersecting } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });
    expect(observe).toHaveBeenCalledWith(root);
    expect(state()).toBe("running");
    intersect(false);
    expect(state()).toBe("paused");
    visibility.mockReturnValue("hidden");
    fireEvent(document, new Event("visibilitychange"));
    intersect(true);
    expect(state()).toBe("paused");
    visibility.mockReturnValue("visible");
    fireEvent(document, new Event("visibilitychange"));
    expect(state()).toBe("running");
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("keeps a caller-paused spinner paused after it re-enters the viewport", () => {
    let callback: IntersectionObserverCallback | undefined;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(next: IntersectionObserverCallback) {
          callback = next;
        }
        observe() {}
        disconnect() {}
      }
    );
    render(
      <Spinner data-testid="spinner" style={{ animationPlayState: "paused" }} />
    );
    act(() => {
      callback?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
      callback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });
    expect(
      screen
        .getByTestId("spinner")
        .style.getPropertyValue("--v2-spinner-play-state")
    ).toBe("paused");
  });

  it("cleans up the page visibility listener and works without an observer", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const add = vi.spyOn(document, "addEventListener");
    const remove = vi.spyOn(document, "removeEventListener");
    const { unmount } = render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    const registration = add.mock.calls.find(
      ([type]) => type === "visibilitychange"
    );
    expect(registration).toBeDefined();
    unmount();
    expect(remove).toHaveBeenCalledWith("visibilitychange", registration?.[1]);
  });
});
