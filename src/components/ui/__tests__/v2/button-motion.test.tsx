import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "../../v2/button";

describe("v2 Button content motion", () => {
  let time = 0;
  let nextFrame = 0;
  let reduced = false;
  let frames: Map<number, FrameRequestCallback>;
  let preferenceListeners: Set<() => void>;
  let resize: (() => void) | undefined;
  let disconnect: ReturnType<typeof vi.fn>;
  let animations: {
    cancel: ReturnType<typeof vi.fn>;
    onfinish: (() => void) | null;
    duration: number;
    keyframes: Keyframe[];
  }[];
  let originalAnimate: PropertyDescriptor | undefined;

  beforeEach(() => {
    time = 0;
    nextFrame = 0;
    reduced = false;
    frames = new Map();
    preferenceListeners = new Set();
    animations = [];
    disconnect = vi.fn();
    vi.spyOn(performance, "now").mockImplementation(() => time);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
      frames.delete(id);
    });
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(
      function (this: HTMLElement) {
        return this.hasAttribute("data-v2-button-label")
          ? (this.textContent?.length ?? 0) * 8 +
              this.querySelectorAll("svg").length * 26
          : 0;
      }
    );
    vi.stubGlobal("matchMedia", () => ({
      get matches() {
        return reduced;
      },
      addEventListener: (_name: string, listener: () => void) => {
        preferenceListeners.add(listener);
      },
      removeEventListener: (_name: string, listener: () => void) => {
        preferenceListeners.delete(listener);
      },
    }));
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
        disconnect() {
          disconnect();
        }
      }
    );
    originalAnimate = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "animate"
    );
    Object.defineProperty(HTMLElement.prototype, "animate", {
      configurable: true,
      value: vi.fn((keyframes, options) => {
        const animation = {
          cancel: vi.fn(),
          onfinish: null,
          duration: options.duration,
          keyframes,
        };
        animations.push(animation);
        return animation;
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    if (originalAnimate)
      Object.defineProperty(HTMLElement.prototype, "animate", originalAnimate);
    else
      delete (HTMLElement.prototype as unknown as { animate?: unknown })
        .animate;
  });

  function step(milliseconds = 16) {
    time += milliseconds;
    const scheduled = Array.from(frames.values());
    frames.clear();
    act(() => {
      scheduled.forEach((callback) => callback(time));
    });
  }

  const width = (container: HTMLElement) =>
    parseFloat(
      container.querySelector<HTMLElement>("[data-v2-button-content]")!.style
        .width
    );

  it("measures the initial label without an entrance animation", () => {
    const { container } = render(<Button>Save</Button>);
    expect(width(container)).toBe(32);
    expect(frames.size).toBe(0);
    expect(animations).toHaveLength(0);
  });

  it("springs between actual label widths and settles without overshooting", async () => {
    const { container, rerender } = render(<Button>Save</Button>);
    await act(async () => rerender(<Button>Save changes</Button>));
    expect(width(container)).toBe(32);
    step();
    expect(width(container)).toBeGreaterThan(32);
    expect(width(container)).toBeLessThan(96);
    for (let i = 0; i < 40; i++) step();
    expect(width(container)).toBe(96);
    expect(frames.size).toBe(0);
  });

  it("retargets an interrupted spring from its current width", async () => {
    const { container, rerender } = render(<Button>Save</Button>);
    await act(async () => rerender(<Button>Saving your changes</Button>));
    step(32);
    const interrupted = width(container);
    await act(async () => rerender(<Button>Saved</Button>));
    expect(width(container)).toBe(interrupted);
    expect(frames.size).toBe(1);
    for (let i = 0; i < 45; i++) step();
    expect(width(container)).toBe(40);
  });

  it("keeps the outgoing label inert and out of the accessible name", async () => {
    const { container, rerender } = render(<Button>Save</Button>);
    await act(async () => rerender(<Button>Saved</Button>));
    const previous = container.querySelector<HTMLElement>(
      '[aria-hidden="true"][inert]'
    )!;
    expect(previous).toHaveTextContent("Save");
    expect(screen.getByRole("button")).toHaveAccessibleName("Saved");
    expect(animations.map((animation) => animation.duration)).toEqual([
      160, 240,
    ]);
    animations[0].onfinish?.();
    expect(previous).toBeEmptyDOMElement();
  });

  it("snaps size changes under reduced motion while retaining short fades", async () => {
    reduced = true;
    const { container, rerender } = render(<Button>Save</Button>);
    await act(async () =>
      rerender(
        <Button loading loadingText="Saving…">
          Save
        </Button>
      )
    );
    expect(width(container)).toBe(82);
    expect(frames.size).toBe(0);
    expect(animations.map((animation) => animation.duration)).toEqual([
      120, 120,
    ]);
    expect(animations[0].keyframes).toEqual([{ opacity: 1 }, { opacity: 0 }]);
    expect(animations[1].keyframes).toEqual([{ opacity: 0 }, { opacity: 1 }]);
  });

  it("keeps the original measured width during centered loading", async () => {
    const { container, rerender } = render(<Button>Upload file</Button>);
    const initial = width(container);
    await act(async () => rerender(<Button loading>Upload file</Button>));
    expect(width(container)).toBe(initial);
    expect(frames.size).toBe(0);
    expect(animations).toHaveLength(0);
    expect(screen.getByRole("button")).toHaveAccessibleName("Upload file");
    expect(container.querySelector("[data-v2-button-content]")).toHaveAttribute(
      "data-concealed",
      "true"
    );
    await act(async () => rerender(<Button>Upload file</Button>));
    expect(width(container)).toBe(initial);
    expect(
      container.querySelector("[data-v2-button-content]")
    ).not.toHaveAttribute("data-concealed");
  });

  it("adds a short vertical blur transition to changing text", async () => {
    const { rerender } = render(<Button>Save</Button>);
    await act(async () => rerender(<Button>Saved</Button>));
    expect(animations[0].keyframes[1]).toMatchObject({
      transform: "translateY(-3px)",
      filter: "blur(4px)",
    });
    expect(animations[1].keyframes[0]).toMatchObject({
      transform: "translateY(4px)",
      filter: "blur(4px)",
    });
  });

  it("respects a reduced-motion preference changed during the spring", async () => {
    const { container, rerender } = render(<Button>Save</Button>);
    await act(async () => rerender(<Button>Save changes</Button>));
    step();
    reduced = true;
    act(() => preferenceListeners.forEach((listener) => listener()));
    expect(width(container)).toBe(96);
    expect(frames.size).toBe(0);
  });

  it("does not snap an active spring when ResizeObserver reports the same target", async () => {
    const { container, rerender } = render(<Button>Save</Button>);
    await act(async () => rerender(<Button>Save changes</Button>));
    step();
    const intermediate = width(container);
    act(() => resize?.());
    expect(width(container)).toBe(intermediate);
    expect(frames.size).toBe(1);
  });

  it("leaves fixed and full-width sizing on the outer button", async () => {
    const { container, rerender } = render(
      <Button className="w-full" style={{ width: 240 }}>
        Save
      </Button>
    );
    await act(async () =>
      rerender(
        <Button className="w-full" style={{ width: 240 }}>
          Save changes
        </Button>
      )
    );
    step();
    expect(screen.getByRole("button")).toHaveClass("w-full");
    expect(screen.getByRole("button").style.width).toBe("240px");
    expect(width(container)).toBeLessThan(96);
  });

  it("cancels frames, fades and observers when unmounted", async () => {
    const { rerender, unmount } = render(<Button>Save</Button>);
    await act(async () => rerender(<Button>Save changes</Button>));
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
    expect(disconnect).toHaveBeenCalled();
    expect(preferenceListeners.size).toBe(0);
    animations.forEach((animation) =>
      expect(animation.cancel).toHaveBeenCalled()
    );
  });

  function rippleTarget(element: HTMLElement) {
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
      x: 10,
      y: 20,
      left: 10,
      top: 20,
      width: 120,
      height: 44,
      right: 130,
      bottom: 64,
      toJSON: () => ({}),
    });
    return element.querySelector<HTMLElement>("[data-v2-button-ripple]")!;
  }

  it("ripples from pointer coordinates without changing the label, ref or click callbacks", () => {
    const onClick = vi.fn();
    const onCapture = vi.fn();
    const ref = { current: null as HTMLButtonElement | null };
    render(
      <Button ref={ref} onClick={onClick} onClickCapture={onCapture}>
        Save
      </Button>
    );
    const button = screen.getByRole("button", { name: "Save" });
    const ripple = rippleTarget(button);
    fireEvent.click(button, { detail: 1, clientX: 30, clientY: 32 });
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onCapture).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(button);
    expect(screen.getByRole("button")).toHaveAccessibleName("Save");
    expect(animations).toHaveLength(1);
    expect(animations[0].duration).toBe(420);
    const radius = parseFloat(ripple.style.width) / 2;
    expect(parseFloat(ripple.style.left) + radius).toBeCloseTo(20);
    expect(parseFloat(ripple.style.top) + radius).toBeCloseTo(12);
    expect(ripple.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(ripple.parentElement).toHaveClass(
      "pointer-events-none",
      "overflow-hidden"
    );
  });

  it("centers keyboard activation and keeps native form submission once", () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Submit</Button>
      </form>
    );
    const button = screen.getByRole("button");
    const ripple = rippleTarget(button);
    fireEvent.click(button, { detail: 0 });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const radius = parseFloat(ripple.style.width) / 2;
    expect(parseFloat(ripple.style.left) + radius).toBeCloseTo(60);
    expect(parseFloat(ripple.style.top) + radius).toBeCloseTo(22);
  });

  it("preserves slotted anchor semantics and both child and parent callbacks once", () => {
    const parentClick = vi.fn();
    const childClick = vi.fn();
    render(
      <Button asChild onClick={parentClick}>
        <a href="#details" onClick={childClick}>
          Details
        </a>
      </Button>
    );
    const link = screen.getByRole("link", { name: "Details" });
    rippleTarget(link);
    fireEvent.click(link);
    expect(link).toHaveAttribute("href", "#details");
    expect(parentClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(animations).toHaveLength(1);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("skips ripple for canceled activation and unavailable actions", () => {
    const childClick = vi.fn((event) => event.preventDefault());
    const { rerender } = render(
      <Button asChild>
        <a href="#details" onClick={childClick}>
          Details
        </a>
      </Button>
    );
    rippleTarget(screen.getByRole("link"));
    fireEvent.click(screen.getByRole("link"));
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(animations).toHaveLength(0);
    rerender(<Button loading>Details</Button>);
    rippleTarget(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    expect(animations).toHaveLength(0);
  });

  it("restarts a rapid ripple and cancels it on reduced motion and unmount", () => {
    const { unmount } = render(<Button>Save</Button>);
    const button = screen.getByRole("button");
    rippleTarget(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(animations).toHaveLength(2);
    expect(animations[0].cancel).toHaveBeenCalledTimes(1);
    reduced = true;
    act(() => preferenceListeners.forEach((listener) => listener()));
    expect(animations[1].cancel).toHaveBeenCalledTimes(1);
    fireEvent.click(button);
    expect(animations).toHaveLength(2);
    reduced = false;
    fireEvent.click(button);
    expect(animations).toHaveLength(3);
    unmount();
    expect(animations[2].cancel).toHaveBeenCalledTimes(1);
    expect(preferenceListeners.size).toBe(0);
  });
});
