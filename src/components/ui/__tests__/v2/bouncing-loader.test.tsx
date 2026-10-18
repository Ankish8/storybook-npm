import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { BouncingLoader as V1 } from "../../bouncing-loader";
import {
  BouncingLoader,
  bouncingLoaderVariants,
} from "../../v2/bouncing-loader";

function getDots(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>("[data-v2-bounce-dot]")
  );
}

function mockIntersectionObserver() {
  const instances: {
    callback: IntersectionObserverCallback;
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  }[] = [];
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function (callback: IntersectionObserverCallback) {
      const observer = { callback, observe: vi.fn(), disconnect: vi.fn() };
      instances.push(observer);
      return observer;
    })
  );
  return instances;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("BouncingLoader", () => {
  it("renders three decorative dots inside one named loading status", () => {
    const { container } = render(<BouncingLoader />);
    expect(screen.getByRole("status", { name: "Loading" })).toHaveAttribute(
      "aria-live",
      "polite"
    );
    const dots = getDots(container);
    expect(dots).toHaveLength(3);
    dots.forEach((dot) => expect(dot).toHaveAttribute("aria-hidden", "true"));
  });

  it("ships its own keyframes without changing v1 animation names", () => {
    const { container } = render(
      <>
        <V1 />
        <BouncingLoader />
      </>
    );
    const styles = Array.from(container.querySelectorAll("style"));
    expect(styles[0].textContent).toContain("@keyframes bouncing-typing-wave");
    expect(styles[1].textContent).toContain(
      "@keyframes myoperator-v2-bouncing-typing-wave"
    );
    expect(styles[1].textContent).not.toContain(
      "@keyframes bouncing-typing-wave"
    );
    expect(styles[1].textContent).toContain("prefers-reduced-motion: reduce");
    expect(styles[1].textContent).toContain("animation: none !important");
    expect(styles[1].textContent).toContain("transform: none !important");
  });

  it("keeps the default diameter, spacing and CSS hooks from v1", () => {
    const { container } = render(<BouncingLoader />);
    expect(container.firstElementChild).toHaveClass("bouncing-loader");
    expect(bouncingLoaderVariants()).toContain(
      "gap-[var(--bouncing-loader-spacing,0.375rem)]"
    );
    expect(container.querySelectorAll(".bouncing-loader__dot")).toHaveLength(3);
    getDots(container).forEach((dot) => {
      expect(dot.className).toContain("h-[var(--bouncing-loader-size,8px)]");
      expect(dot.className).toContain("w-[var(--bouncing-loader-size,8px)]");
    });
  });

  it("staggered dots keep their own delays", () => {
    const { container } = render(<BouncingLoader />);
    expect(
      getDots(container).map((dot) =>
        dot.style.getPropertyValue("--v2-bouncing-loader-delay")
      )
    ).toEqual(["0s", "0.16s", "0.32s"]);
  });

  it("accepts numeric size and spacing with a semantic color", () => {
    const { container } = render(
      <BouncingLoader
        className="custom-loader"
        size={10}
        spacing={4}
        color="var(--v2-semantic-text-muted,var(--semantic-text-muted))"
      />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("custom-loader");
    expect(root.style.getPropertyValue("--bouncing-loader-size")).toBe("10px");
    expect(root.style.getPropertyValue("--bouncing-loader-spacing")).toBe(
      "4px"
    );
    expect(root.style.getPropertyValue("--bouncing-loader-color")).toBe(
      "var(--v2-semantic-text-muted,var(--semantic-text-muted))"
    );
  });

  it("preserves CSS length strings and zero spacing", () => {
    const { container, rerender } = render(
      <BouncingLoader size="0.75rem" spacing="0.5em" />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--bouncing-loader-size")).toBe(
      "0.75rem"
    );
    expect(root.style.getPropertyValue("--bouncing-loader-spacing")).toBe(
      "0.5em"
    );
    rerender(<BouncingLoader size={0} spacing={0} />);
    expect(root.style.getPropertyValue("--bouncing-loader-size")).toBe("0px");
    expect(root.style.getPropertyValue("--bouncing-loader-spacing")).toBe(
      "0px"
    );
  });

  it("keeps native styles and explicit prop precedence over matching CSS variables", () => {
    const { container } = render(
      <BouncingLoader
        size={12}
        spacing={8}
        style={
          {
            padding: "12px",
            opacity: 0.8,
            animationDuration: "1.8s",
            "--bouncing-loader-size": "4px",
            "--bouncing-loader-spacing": "2px",
          } as React.CSSProperties
        }
      />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.padding).toBe("12px");
    expect(root.style.opacity).toBe("0.8");
    expect(root.style.animationDuration).toBe("1.8s");
    expect(root.style.getPropertyValue("--bouncing-loader-size")).toBe("12px");
    expect(root.style.getPropertyValue("--bouncing-loader-spacing")).toBe(
      "8px"
    );
  });

  it("keeps caller CSS variables when matching props are absent", () => {
    const { container } = render(
      <BouncingLoader
        style={
          {
            "--bouncing-loader-size": "1rem",
            "--bouncing-loader-spacing": "0.75rem",
            "--bouncing-loader-color": "currentColor",
          } as React.CSSProperties
        }
      />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--bouncing-loader-size")).toBe("1rem");
    expect(root.style.getPropertyValue("--bouncing-loader-spacing")).toBe(
      "0.75rem"
    );
    expect(root.style.getPropertyValue("--bouncing-loader-color")).toBe(
      "currentColor"
    );
  });

  it("forwards the actual span to object and callback refs", () => {
    const ref = React.createRef<HTMLSpanElement>();
    const callbackRef = vi.fn();
    const { container, rerender, unmount } = render(
      <BouncingLoader ref={ref} />
    );
    const root = container.firstElementChild;
    expect(ref.current).toBe(root);
    rerender(<BouncingLoader ref={callbackRef} />);
    expect(ref.current).toBeNull();
    expect(callbackRef).toHaveBeenLastCalledWith(root);
    unmount();
    expect(callbackRef).toHaveBeenLastCalledWith(null);
  });

  it("forwards native attributes and event handlers", () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <BouncingLoader
        id="sending-state"
        title="Sending a reply"
        data-testid="sending-state"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
      />
    );
    const root = screen.getByTestId("sending-state");
    expect(root).toHaveAttribute("id", "sending-state");
    expect(root).toHaveAttribute("title", "Sending a reply");
    expect(root).toHaveAttribute("tabindex", "0");
    fireEvent.click(root);
    fireEvent.keyDown(root, { key: "Enter" });
    expect(onClick).toHaveBeenCalledOnce();
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it("lets the operation supply its accessible name and live behavior", () => {
    render(<BouncingLoader aria-label="Sending message" aria-live="off" />);
    expect(
      screen.getByRole("status", { name: "Sending message" })
    ).toHaveAttribute("aria-live", "off");
  });

  it("supports an external label without the default Loading label", () => {
    render(
      <>
        <span id="operation">Checking availability</span>
        <BouncingLoader aria-labelledby="operation" />
      </>
    );
    expect(
      screen.getByRole("status", { name: "Checking availability" })
    ).not.toHaveAttribute("aria-label");
  });

  it.each([true, "true"] as const)(
    "does not create a default live status for aria-hidden=%s",
    (ariaHidden) => {
      const { container } = render(<BouncingLoader aria-hidden={ariaHidden} />);
      const root = container.firstElementChild as HTMLElement;
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(root).toHaveAttribute("aria-hidden", "true");
      expect(root).not.toHaveAttribute("role");
      expect(root).not.toHaveAttribute("aria-live");
      expect(root).not.toHaveAttribute("aria-label");
    }
  );

  it.each(["presentation", "none"])(
    "keeps a caller's decorative role %s without default announcements",
    (role) => {
      const { container } = render(<BouncingLoader role={role} />);
      const root = container.firstElementChild as HTMLElement;
      expect(root).toHaveAttribute("role", role);
      expect(root).not.toHaveAttribute("aria-live");
      expect(root).not.toHaveAttribute("aria-label");
    }
  );

  it("preserves explicit ARIA attributes even on a decorative instance", () => {
    const { container } = render(
      <BouncingLoader
        aria-hidden="true"
        role="img"
        aria-label="Consumer label"
        aria-live="off"
      />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("role", "img");
    expect(root).toHaveAttribute("aria-label", "Consumer label");
    expect(root).toHaveAttribute("aria-live", "off");
  });

  it("keeps the button name when dots are decorative", () => {
    render(
      <button type="button" disabled aria-busy="true">
        <BouncingLoader color="currentColor" aria-hidden="true" />
        Sending draft
      </button>
    );
    const button = screen.getByRole("button", { name: "Sending draft" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("pauses offscreen dots and resumes when visible again", () => {
    const observers = mockIntersectionObserver();
    const { container } = render(<BouncingLoader />);
    const root = container.firstElementChild as HTMLElement;
    const observer = observers[0];
    expect(observer.observe).toHaveBeenCalledWith(root);
    act(() =>
      observer.callback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    );
    expect(root.style.getPropertyValue("--v2-bouncing-loader-play-state")).toBe(
      "paused"
    );
    act(() =>
      observer.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    );
    expect(root.style.getPropertyValue("--v2-bouncing-loader-play-state")).toBe(
      "running"
    );
  });

  it("pauses on hidden pages and respects caller paused styles", () => {
    const visibility = vi.spyOn(document, "visibilityState", "get");
    visibility.mockReturnValue("visible");
    const { container, rerender } = render(<BouncingLoader />);
    const root = container.firstElementChild as HTMLElement;
    visibility.mockReturnValue("hidden");
    fireEvent(document, new Event("visibilitychange"));
    expect(root.style.getPropertyValue("--v2-bouncing-loader-play-state")).toBe(
      "paused"
    );
    visibility.mockReturnValue("visible");
    fireEvent(document, new Event("visibilitychange"));
    expect(root.style.getPropertyValue("--v2-bouncing-loader-play-state")).toBe(
      "running"
    );
    rerender(<BouncingLoader style={{ animationPlayState: "paused" }} />);
    expect(root.style.animationPlayState).toBe("paused");
    expect(root.style.getPropertyValue("--v2-bouncing-loader-play-state")).toBe(
      "paused"
    );
  });

  it("honors hidden and caller visibility attributes", () => {
    const { container, rerender } = render(<BouncingLoader hidden />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("hidden");
    expect(root.style.getPropertyValue("--v2-bouncing-loader-play-state")).toBe(
      "paused"
    );
    rerender(<BouncingLoader style={{ visibility: "hidden" }} />);
    expect(root.style.visibility).toBe("hidden");
    expect(root.style.getPropertyValue("--v2-bouncing-loader-play-state")).toBe(
      "paused"
    );
  });

  it("disconnects observers and visibility listeners on unmount", () => {
    const observers = mockIntersectionObserver();
    const removeEventListener = vi.spyOn(document, "removeEventListener");
    const { unmount } = render(<BouncingLoader />);
    unmount();
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(removeEventListener).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function)
    );
  });
});
