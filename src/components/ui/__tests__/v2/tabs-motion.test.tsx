import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../v2/tabs";

type Box = { left: number; top: number; width: number; height: number };
type PreferenceListener = (event: MediaQueryListEvent) => void;

function rect(box: Box): DOMRect {
  return {
    ...box,
    x: box.left,
    y: box.top,
    right: box.left + box.width,
    bottom: box.top + box.height,
    toJSON: () => box,
  } as DOMRect;
}

function Example({
  variant,
  value,
  orientation = "horizontal",
  activationMode = "automatic",
  dir = "ltr",
  secondDisabled = false,
  onValueChange,
}: {
  variant?: "underline" | "pill";
  value?: string;
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  dir?: "ltr" | "rtl";
  secondDisabled?: boolean;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Tabs
      defaultValue="first"
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      activationMode={activationMode}
      dir={dir}
    >
      <TabsList aria-label="Status" variant={variant}>
        <TabsTrigger value="first">First</TabsTrigger>
        <TabsTrigger value="second" disabled={secondDisabled}>
          Second
        </TabsTrigger>
        <TabsTrigger value="third">Third</TabsTrigger>
      </TabsList>
      <TabsContent value="first">First panel</TabsContent>
      <TabsContent value="second">Second panel</TabsContent>
      <TabsContent value="third">Third panel</TabsContent>
    </Tabs>
  );
}

describe("Tabs indicator motion", () => {
  let boxes: Map<string, Box>;
  let pendingFrames: Map<number, FrameRequestCallback>;
  let frameId: number;
  let time: number;
  let reduced: boolean;
  let preferenceListeners: Set<PreferenceListener>;
  let resizeObservers: Array<{
    callback: ResizeObserverCallback;
    observed: Set<Element>;
    disconnect: ReturnType<typeof vi.fn>;
  }>;
  let fontEvents: EventTarget;
  let originalFonts: PropertyDescriptor | undefined;

  beforeEach(() => {
    boxes = new Map([
      ["Status", { left: 40, top: 20, width: 380, height: 53 }],
      ["First", { left: 40, top: 20, width: 110, height: 52 }],
      ["Second", { left: 150, top: 20, width: 140, height: 52 }],
      ["Third", { left: 290, top: 20, width: 130, height: 52 }],
    ]);
    pendingFrames = new Map();
    frameId = 0;
    time = 0;
    reduced = false;
    preferenceListeners = new Set();
    resizeObservers = [];

    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function () {
        const key = this.getAttribute("aria-label") || this.textContent?.trim();
        return rect(
          boxes.get(key || "") || { left: 0, top: 0, width: 0, height: 0 }
        );
      }
    );
    vi.spyOn(performance, "now").mockImplementation(() => time);
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      const id = ++frameId;
      pendingFrames.set(id, callback);
      return id;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      pendingFrames.delete(id);
    });
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          media: query,
          get matches() {
            return query === "(prefers-reduced-motion: reduce)" && reduced;
          },
          addEventListener: (type: string, listener: PreferenceListener) => {
            if (type === "change") preferenceListeners.add(listener);
          },
          removeEventListener: (type: string, listener: PreferenceListener) => {
            if (type === "change") preferenceListeners.delete(listener);
          },
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => true,
          onchange: null,
        }) as MediaQueryList
    );
    vi.stubGlobal(
      "ResizeObserver",
      class {
        callback: ResizeObserverCallback;
        observed = new Set<Element>();
        disconnect = vi.fn(() => this.observed.clear());
        constructor(callback: ResizeObserverCallback) {
          this.callback = callback;
          resizeObservers.push(this);
        }
        observe(element: Element) {
          this.observed.add(element);
        }
        unobserve(element: Element) {
          this.observed.delete(element);
        }
      }
    );
    fontEvents = new EventTarget();
    originalFonts = Object.getOwnPropertyDescriptor(document, "fonts");
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: fontEvents,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    if (originalFonts) Object.defineProperty(document, "fonts", originalFonts);
    else Reflect.deleteProperty(document, "fonts");
  });

  const indicator = (list = screen.getByRole("tablist", { name: "Status" })) =>
    Object.fromEntries(
      ["x", "y", "width", "height"].map((axis) => [
        axis,
        parseFloat(list.style.getPropertyValue(`--v2-tab-${axis}`)),
      ])
    );

  const flushMutations = async () => {
    await act(async () => {
      await Promise.resolve();
    });
  };

  const advance = async (frames = 1, frameDuration = 16) => {
    await flushMutations();
    for (let i = 0; i < frames; i++) {
      act(() => {
        time += frameDuration;
        const scheduled = [...pendingFrames.values()];
        pendingFrames.clear();
        scheduled.forEach((callback) => callback(time));
      });
    }
  };

  const resize = () => {
    act(() => {
      resizeObservers.forEach((observer) =>
        observer.callback([], observer as unknown as ResizeObserver)
      );
    });
  };

  const preference = (matches: boolean) => {
    act(() => {
      reduced = matches;
      preferenceListeners.forEach((listener) =>
        listener({ matches } as MediaQueryListEvent)
      );
    });
  };

  it("snaps to real initial geometry without adding an indicator element", async () => {
    render(<Example />);
    // Radix panels use a one-frame mount guard; the decorative rail has no loop.
    await advance();
    const list = screen.getByRole("tablist");
    expect(list).toHaveAttribute("data-motion-indicator", "true");
    expect(indicator()).toEqual({ x: 0, y: 0, width: 110, height: 52 });
    expect(list.children).toHaveLength(3);
    expect(pendingFrames.size).toBe(0);
  });

  it("drives the pill cursor with the same measured spring and no extra element", async () => {
    const view = render(<Example variant="pill" value="first" />);
    await advance();
    const list = screen.getByRole("tablist");
    expect(list).toHaveAttribute("data-variant", "pill");
    // The cursor is live (it is the list's ::after), so the tabs stop painting their own fallback pill.
    expect(list).toHaveAttribute("data-motion-indicator", "true");
    expect(list.children).toHaveLength(3);
    expect(indicator()).toEqual({ x: 0, y: 0, width: 110, height: 52 });
    view.rerender(<Example variant="pill" value="third" />);
    await advance(4);
    expect(indicator().x).toBeGreaterThan(0);
    expect(indicator().x).toBeLessThan(250);
    await advance(60);
    expect(indicator()).toEqual({ x: 250, y: 0, width: 130, height: 52 });
    expect(pendingFrames.size).toBe(0);
  });

  it("snaps the pill cursor under reduced motion", async () => {
    reduced = true;
    const view = render(<Example variant="pill" value="first" />);
    view.rerender(<Example variant="pill" value="third" />);
    await flushMutations();
    expect(indicator()).toEqual({ x: 250, y: 0, width: 130, height: 52 });
    // Let Radix's one-frame panel mount guard run; the pill cursor itself schedules nothing.
    await advance();
    expect(pendingFrames.size).toBe(0);
  });

  it("moves and resizes toward a controlled selection while semantics update immediately", async () => {
    const view = render(<Example value="first" />);
    view.rerender(<Example value="second" />);
    await flushMutations();
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second panel");
    expect(indicator().x).toBe(0);
    await advance(5);
    expect(indicator().x).toBeGreaterThan(0);
    expect(indicator().x).toBeLessThan(110);
    expect(indicator().width).toBeGreaterThan(110);
    expect(indicator().width).toBeLessThan(140);
    await advance(60);
    expect(indicator()).toEqual({ x: 110, y: 0, width: 140, height: 52 });
    expect(pendingFrames.size).toBe(0);
  });

  it("settles monotonically without bouncing past the selected tab", async () => {
    const view = render(<Example value="first" />);
    view.rerender(<Example value="third" />);
    const positions = [indicator().x];
    for (let i = 0; i < 45; i++) {
      await advance();
      positions.push(indicator().x);
    }
    expect(positions.every(Number.isFinite)).toBe(true);
    expect(positions.every((x) => x >= 0 && x <= 250)).toBe(true);
    expect(positions.every((x, i) => i === 0 || x >= positions[i - 1])).toBe(
      true
    );
    expect(indicator().x).toBe(250);
  });

  it("retargets an interrupted spring from its live position with retained velocity", async () => {
    const view = render(<Example value="first" />);
    view.rerender(<Example value="third" />);
    await advance(2);
    const before = indicator().x;
    expect(before).toBeGreaterThan(0);
    expect(before).toBeLessThan(250);
    view.rerender(<Example value="first" />);
    await flushMutations();
    expect(indicator().x).toBe(before);
    await advance();
    // A spring retains the velocity from the interrupted trip for the next frame;
    // restarting a duration curve or resetting velocity would reverse instantly.
    expect(indicator().x).toBeGreaterThan(before);
    await advance(60);
    expect(indicator()).toEqual({ x: 0, y: 0, width: 110, height: 52 });
    expect(pendingFrames.size).toBe(0);
  });

  it("snaps resize measurements instead of animating a changed layout", async () => {
    const view = render(<Example value="first" />);
    view.rerender(<Example value="second" />);
    await advance(3);
    boxes.set("Second", { left: 185, top: 20, width: 175, height: 52 });
    resize();
    expect(indicator()).toEqual({ x: 145, y: 0, width: 175, height: 52 });
    expect(pendingFrames.size).toBe(0);
    expect(resizeObservers[0].observed.size).toBe(4);
  });

  it("remeasures font changes without sliding from obsolete text widths", async () => {
    render(<Example value="second" />);
    await advance();
    boxes.set("Second", { left: 158, top: 20, width: 164, height: 52 });
    act(() => fontEvents.dispatchEvent(new Event("loadingdone")));
    expect(indicator()).toEqual({ x: 118, y: 0, width: 164, height: 52 });
    expect(pendingFrames.size).toBe(0);
  });

  it("measures vertical tab height and offset independently", async () => {
    boxes.set("Status", { left: 40, top: 20, width: 200, height: 160 });
    boxes.set("First", { left: 40, top: 20, width: 200, height: 52 });
    boxes.set("Second", { left: 40, top: 72, width: 200, height: 60 });
    boxes.set("Third", { left: 40, top: 132, width: 200, height: 48 });
    const view = render(<Example orientation="vertical" value="first" />);
    view.rerender(<Example orientation="vertical" value="second" />);
    await advance(4);
    expect(indicator().y).toBeGreaterThan(0);
    expect(indicator().y).toBeLessThan(52);
    await advance(60);
    expect(indicator()).toEqual({ x: 0, y: 52, width: 200, height: 60 });
  });

  it("uses physical RTL geometry and preserves Radix keyboard direction", async () => {
    boxes.set("First", { left: 310, top: 20, width: 110, height: 52 });
    boxes.set("Second", { left: 170, top: 20, width: 140, height: 52 });
    boxes.set("Third", { left: 40, top: 20, width: 130, height: 52 });
    const user = userEvent.setup();
    render(<Example dir="rtl" />);
    expect(indicator().x).toBe(270);
    await user.click(screen.getByRole("tab", { name: "First" }));
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Second" })).toHaveFocus();
    await advance(60);
    expect(indicator().x).toBe(130);
    expect(indicator().width).toBe(140);
  });

  it("keeps the indicator on selection while manual activation only moves focus", async () => {
    const user = userEvent.setup();
    render(<Example activationMode="manual" />);
    await advance();
    await user.click(screen.getByRole("tab", { name: "First" }));
    await user.keyboard("{ArrowRight}");
    await flushMutations();
    expect(screen.getByRole("tab", { name: "Second" })).toHaveFocus();
    expect(indicator().x).toBe(0);
    expect(pendingFrames.size).toBe(0);
    await user.keyboard("{Enter}");
    await advance(60);
    expect(indicator().x).toBe(110);
  });

  it("skips disabled tabs without measuring their geometry as the target", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example secondDisabled onValueChange={onValueChange} />);
    await user.click(screen.getByRole("tab", { name: "First" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Third" })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("third");
    await advance(60);
    expect(indicator().x).toBe(250);
    fireEvent.click(screen.getByRole("tab", { name: "Second" }));
    await flushMutations();
    expect(indicator().x).toBe(250);
    expect(onValueChange).not.toHaveBeenCalledWith("second");
  });

  it("ignores active triggers owned by a nested tablist", async () => {
    boxes.set("Nested status", { left: 440, top: 20, width: 120, height: 52 });
    boxes.set("Nested first", { left: 445, top: 20, width: 50, height: 52 });
    boxes.set("Nested second", { left: 495, top: 20, width: 65, height: 52 });
    render(
      <Tabs defaultValue="first">
        <TabsList aria-label="Status">
          <div>
            <Tabs defaultValue="nested-first">
              <TabsList aria-label="Nested status">
                <TabsTrigger value="nested-first">Nested first</TabsTrigger>
                <TabsTrigger value="nested-second">Nested second</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(indicator().x).toBe(0);
    const user = userEvent.setup();
    await user.click(screen.getByRole("tab", { name: "Nested second" }));
    await advance(60);
    expect(indicator().x).toBe(0);
    expect(
      indicator(screen.getByRole("tablist", { name: "Nested status" })).x
    ).toBe(55);
  });

  it("snaps all selection changes when reduced motion is preferred", async () => {
    reduced = true;
    const view = render(<Example value="first" />);
    view.rerender(<Example value="third" />);
    await flushMutations();
    expect(indicator()).toEqual({ x: 250, y: 0, width: 130, height: 52 });
    await advance();
    expect(pendingFrames.size).toBe(0);
  });

  it("cancels an in-flight spring when reduced motion changes", async () => {
    const view = render(<Example value="first" />);
    view.rerender(<Example value="third" />);
    await advance(3);
    expect(indicator().x).toBeLessThan(250);
    preference(true);
    expect(indicator().x).toBe(250);
    expect(pendingFrames.size).toBe(0);
    view.rerender(<Example value="second" />);
    await flushMutations();
    expect(indicator().x).toBe(110);
    preference(false);
    view.rerender(<Example value="first" />);
    await advance(3);
    expect(indicator().x).toBeGreaterThan(0);
    expect(indicator().x).toBeLessThan(110);
  });

  it("keeps the original border fallback when a sample has no usable geometry", async () => {
    boxes.set("First", { left: 40, top: 20, width: 0, height: 0 });
    render(<Example />);
    await advance();
    expect(screen.getByRole("tablist")).not.toHaveAttribute(
      "data-motion-indicator"
    );
    expect(pendingFrames.size).toBe(0);
    boxes.set("First", { left: 40, top: 20, width: 110, height: 52 });
    resize();
    expect(indicator().width).toBe(110);
  });

  it("cleans observers, preference/font listeners and pending frames on unmount", async () => {
    const removeFontListener = vi.spyOn(fontEvents, "removeEventListener");
    const view = render(<Example value="first" />);
    view.rerender(<Example value="third" />);
    await advance(3);
    expect(pendingFrames.size).toBe(1);
    const list = screen.getByRole("tablist");
    view.unmount();
    expect(pendingFrames.size).toBe(0);
    expect(preferenceListeners.size).toBe(0);
    expect(resizeObservers[0].disconnect).toHaveBeenCalled();
    expect(resizeObservers[0].observed.size).toBe(0);
    expect(removeFontListener).toHaveBeenCalledWith(
      "loadingdone",
      expect.any(Function)
    );
    expect(list).not.toHaveAttribute("data-motion-indicator");
    expect(list.style.getPropertyValue("--v2-tab-x")).toBe("");
    await advance(60);
    expect(list.style.getPropertyValue("--v2-tab-x")).toBe("");
  });
});
