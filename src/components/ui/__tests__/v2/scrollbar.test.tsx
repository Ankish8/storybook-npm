import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { Scrollbar } from "../../v2/scrollbar";

const originalObserver = globalThis.ResizeObserver;
const originalMedia = window.matchMedia;
let resize: ResizeObserverCallback;
let observe: ReturnType<typeof vi.fn>;
let disconnect: ReturnType<typeof vi.fn>;
beforeEach(() => {
  window.matchMedia = vi.fn(
    (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList
  );
  observe = vi.fn();
  disconnect = vi.fn();
  globalThis.ResizeObserver = class {
    constructor(callback: ResizeObserverCallback) {
      resize = callback;
    }
    observe = observe;
    unobserve() {}
    disconnect = disconnect;
  } as unknown as typeof ResizeObserver;
});
afterEach(() => {
  globalThis.ResizeObserver = originalObserver;
  vi.restoreAllMocks();
  window.matchMedia = originalMedia;
});

function overflow(vertical = true, rtl = false) {
  const view = screen.getByRole("region");
  const rail = view.parentElement?.querySelector(
    '[data-slot="scrollbar-rail"]'
  ) as HTMLDivElement;
  const thumb = rail.firstElementChild as HTMLDivElement;
  Object.defineProperties(view, {
    clientHeight: { value: 200, configurable: true },
    scrollHeight: { value: vertical ? 1000 : 200, configurable: true },
    clientWidth: { value: 200, configurable: true },
    scrollWidth: { value: vertical ? 200 : 1000, configurable: true },
    scrollTop: { value: 0, writable: true, configurable: true },
    scrollLeft: { value: 0, writable: true, configurable: true },
  });
  Object.defineProperties(rail, {
    clientHeight: { value: 200, configurable: true },
    clientWidth: { value: 200, configurable: true },
  });
  if (rtl) view.style.direction = "rtl";
  view.scrollBy = vi.fn() as unknown as typeof view.scrollBy;
  rail.getBoundingClientRect = () => ({
    top: 0,
    bottom: 200,
    height: 200,
    left: 0,
    right: 200,
    width: 200,
    x: 0,
    y: 0,
    toJSON() {},
  });
  thumb.getBoundingClientRect = () => ({
    top: 0,
    bottom: 40,
    height: 40,
    left: rtl && !vertical ? 160 : 0,
    right: rtl && !vertical ? 200 : 40,
    width: 40,
    x: 0,
    y: 0,
    toJSON() {},
  });
  rail.setPointerCapture = vi.fn();
  rail.hasPointerCapture = () => true;
  rail.releasePointerCapture = vi.fn();
  fireEvent.scroll(view);
  return { view, rail, thumb, root: view.parentElement as HTMLDivElement };
}

function pointer(
  target: HTMLElement,
  type: string,
  options: MouseEventInit & { pointerId?: number } = {}
) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    ...options,
  });
  Object.defineProperty(event, "pointerId", { value: options.pointerId ?? 1 });
  fireEvent(target, event);
  return event;
}
function wheel(target: HTMLElement, options: WheelEventInit = {}) {
  const event = new WheelEvent("wheel", {
    bubbles: true,
    cancelable: true,
    deltaY: 100,
    ...options,
  });
  fireEvent(target, event);
  return event;
}

describe("Scrollbar contract", () => {
  it("keeps a named, keyboard-focusable native viewport and the existing defaults", () => {
    render(
      <Scrollbar aria-label="People">
        <span>Ada</span>
      </Scrollbar>
    );
    const view = screen.getByRole("region", { name: "People" });
    expect(view).toHaveAttribute("tabindex", "0");
    expect(view).toHaveClass("overflow-y-auto");
    expect(view.parentElement).toHaveAttribute("data-orientation", "vertical");
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { hidden: true })).toHaveLength(2);
  });
  it("forwards the outer div ref, style, className and native attributes", () => {
    const ref = React.createRef<HTMLDivElement>();
    const click = vi.fn();
    render(
      <Scrollbar
        ref={ref}
        className="consumer-class"
        style={{ height: 256, width: 340 }}
        id="activity"
        data-consumer="kept"
        tabIndex={-1}
        onClick={click}
      >
        <button>Inspect</button>
      </Scrollbar>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("consumer-class");
    expect(ref.current).toHaveStyle({ height: "256px", width: "340px" });
    expect(ref.current).toHaveAttribute("id", "activity");
    expect(ref.current).toHaveAttribute("data-consumer", "kept");
    expect(ref.current).toHaveAttribute("tabindex", "-1");
    expect(ref.current).not.toBe(screen.getByRole("region"));
    fireEvent.click(screen.getByRole("button", { name: "Inspect" }));
    expect(click).toHaveBeenCalledTimes(1);
  });
  it("applies labelledby and describedby to the native viewport", () => {
    render(
      <>
        <h2 id="title">Support activity</h2>
        <p id="help">Earlier updates are below.</p>
        <Scrollbar aria-labelledby="title" aria-describedby="help" />
      </>
    );
    expect(
      screen.getByRole("region", { name: "Support activity" })
    ).toHaveAccessibleDescription("Earlier updates are below.");
  });
  it("forwards one scroll event with the viewport as its current target", () => {
    let target: EventTarget | null = null;
    const onScroll = vi.fn((event: React.UIEvent<HTMLDivElement>) => {
      target = event.currentTarget;
    });
    render(<Scrollbar onScroll={onScroll} />);
    const { view } = overflow();
    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(target).toBe(view);
  });
  it("hides the empty subtle rail, disables controls and removes the rail from the tab order", () => {
    const { container } = render(
      <Scrollbar>
        <span>Fits</span>
      </Scrollbar>
    );
    const rail = screen.getByRole("scrollbar", { hidden: true });
    expect(rail).toHaveAttribute("tabindex", "-1");
    expect(rail.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(rail.parentElement).toHaveClass("invisible");
    expect(container.querySelectorAll("button:disabled")).toHaveLength(2);
  });
  it("keeps the dark rail layout and can omit arrow controls", () => {
    const { container } = render(
      <Scrollbar variant="dark" showControls={false} />
    );
    const track = container.querySelector('[data-slot="scrollbar-track"]');
    expect(track).toHaveClass("w-4", "border-l", "bg-semantic-bg-ui");
    expect(
      screen.queryByRole("button", { hidden: true })
    ).not.toBeInTheDocument();
  });
});

describe("Scrollbar keyboard and controls", () => {
  it("connects the rail to its viewport and updates accessible range and boundary controls", () => {
    render(<Scrollbar aria-label="People" />);
    const { view, rail } = overflow();
    expect(rail).toHaveAttribute("aria-controls", view.id);
    expect(rail).toHaveAttribute("aria-orientation", "vertical");
    expect(rail).toHaveAttribute("aria-valuemin", "0");
    expect(rail).toHaveAttribute("aria-valuemax", "800");
    expect(rail).toHaveAttribute("aria-valuenow", "0");
    expect(rail).toHaveAttribute("tabindex", "0");
    expect(
      screen.getByRole("button", { name: "Scroll backward" })
    ).toBeDisabled();
    view.scrollTop = 800;
    fireEvent.scroll(view);
    expect(rail).toHaveAttribute("aria-valuenow", "800");
    expect(
      screen.getByRole("button", { name: "Scroll forward" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Scroll backward" })
    ).toBeEnabled();
  });
  it("operates Home, End, Page and arrow keys from the native viewport and rail", () => {
    render(<Scrollbar />);
    const { view, rail } = overflow();
    fireEvent.keyDown(view, { key: "End" });
    expect(view.scrollTop).toBe(800);
    fireEvent.keyDown(rail, { key: "PageUp" });
    expect(view.scrollTop).toBe(620);
    fireEvent.keyDown(rail, { key: "Home" });
    expect(view.scrollTop).toBe(0);
    fireEvent.keyDown(view, { key: "PageDown" });
    expect(view.scrollTop).toBe(180);
    fireEvent.keyDown(rail, { key: "ArrowDown" });
    expect(view.scrollTop).toBe(220);
    fireEvent.keyDown(rail, { key: "ArrowUp" });
    expect(view.scrollTop).toBe(180);
    fireEvent.keyDown(view, { key: " ", shiftKey: true });
    expect(view.scrollTop).toBe(0);
  });
  it("preserves consumer key cancellation and descendant keyboard behavior", () => {
    const onKeyDown = vi.fn((event: React.KeyboardEvent<HTMLDivElement>) =>
      event.preventDefault()
    );
    const { rerender } = render(
      <Scrollbar onKeyDown={onKeyDown}>
        <input aria-label="Search" />
      </Scrollbar>
    );
    const { view } = overflow();
    fireEvent.keyDown(view, { key: "End" });
    expect(view.scrollTop).toBe(0);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    rerender(
      <Scrollbar>
        <input aria-label="Search" />
      </Scrollbar>
    );
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "End" });
    expect(view.scrollTop).toBe(0);
    fireEvent.keyDown(view, { key: "End", ctrlKey: true });
    expect(view.scrollTop).toBe(0);
  });
  it("does not consume keys at the scroll boundary", () => {
    render(<Scrollbar />);
    const { view } = overflow();
    const event = new KeyboardEvent("keydown", {
      key: "PageUp",
      bubbles: true,
      cancelable: true,
    });
    fireEvent(view, event);
    expect(event.defaultPrevented).toBe(false);
  });
  it("scrolls the chosen axis by the existing 70 percent control step", () => {
    render(<Scrollbar orientation="horizontal" />);
    const { view } = overflow(false);
    fireEvent.click(screen.getByRole("button", { name: "Scroll forward" }));
    expect(view.scrollBy).toHaveBeenCalledWith({
      top: 0,
      left: 140,
      behavior: "smooth",
    });
  });
  it("honors consumer click cancellation before moving a control", () => {
    let currentTarget: EventTarget | null = null;
    render(
      <Scrollbar
        onClick={(event) => {
          currentTarget = event.currentTarget;
          event.preventDefault();
        }}
      />
    );
    const { view, root } = overflow();
    fireEvent.click(screen.getByRole("button", { name: "Scroll forward" }));
    expect(currentTarget).toBe(root);
    expect(view.scrollBy).not.toHaveBeenCalled();
  });
  it("does not move a disabled boundary control on a dispatched click", () => {
    render(<Scrollbar />);
    const { view } = overflow();
    fireEvent.click(screen.getByRole("button", { name: "Scroll backward" }));
    expect(view.scrollBy).not.toHaveBeenCalled();
  });
  it("uses immediate control and track scrolling under reduced motion", () => {
    const media = vi
      .spyOn(window, "matchMedia")
      .mockReturnValue({ matches: true } as MediaQueryList);
    render(<Scrollbar />);
    const { view, rail } = overflow();
    fireEvent.click(screen.getByRole("button", { name: "Scroll forward" }));
    expect(view.scrollBy).toHaveBeenCalledWith({
      top: 140,
      left: 0,
      behavior: "auto",
    });
    pointer(rail, "pointerdown", { clientY: 100 });
    expect(view.scrollBy).toHaveBeenCalledWith({
      top: 180,
      left: 0,
      behavior: "auto",
    });
    expect(media).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
  });
});

describe("Scrollbar drag and measurement", () => {
  it("preserves the grabbed point and ends capture on release", () => {
    render(<Scrollbar showControls={false} />);
    const { view, rail } = overflow();
    pointer(rail, "pointerdown", { clientY: 10 });
    expect(view.scrollTop).toBe(0);
    expect(rail).toHaveFocus();
    expect(rail.setPointerCapture).toHaveBeenCalledWith(1);
    pointer(rail, "pointermove", { clientY: 40 });
    expect(view.scrollTop).toBe(150);
    pointer(rail, "pointerup", { clientY: 40 });
    expect(rail.releasePointerCapture).toHaveBeenCalledWith(1);
    pointer(rail, "pointermove", { clientY: 80 });
    expect(view.scrollTop).toBe(150);
  });
  it("honors pointer cancellation, ignores other pointers and clears a canceled drag", () => {
    const onPointerDown = vi.fn((event: React.PointerEvent<HTMLDivElement>) =>
      event.preventDefault()
    );
    const { rerender } = render(<Scrollbar onPointerDown={onPointerDown} />);
    const { view, rail } = overflow();
    pointer(rail, "pointerdown", { clientY: 10 });
    expect(rail.setPointerCapture).not.toHaveBeenCalled();
    rerender(<Scrollbar />);
    pointer(rail, "pointerdown", { clientY: 10 });
    pointer(rail, "pointermove", { clientY: 80, pointerId: 2 });
    expect(view.scrollTop).toBe(0);
    pointer(rail, "pointercancel");
    pointer(rail, "pointermove", { clientY: 80 });
    expect(view.scrollTop).toBe(0);
  });
  it("honors canceled pointer moves and lost pointer capture", () => {
    const { rerender } = render(
      <Scrollbar onPointerMove={(event) => event.preventDefault()} />
    );
    const { view, rail } = overflow();
    pointer(rail, "pointerdown", { clientY: 10 });
    pointer(rail, "pointermove", { clientY: 40 });
    expect(view.scrollTop).toBe(0);
    rerender(<Scrollbar />);
    pointer(rail, "lostpointercapture");
    pointer(rail, "pointermove", { clientY: 40 });
    expect(view.scrollTop).toBe(0);
  });
  it("clamps the thumb to very small tracks", () => {
    render(<Scrollbar showControls={false} />);
    const { view, rail, thumb } = overflow();
    Object.defineProperty(rail, "clientHeight", {
      value: 12,
      configurable: true,
    });
    fireEvent.scroll(view);
    expect(thumb.style.height).toBe("12px");
    expect(thumb.style.top).toBe("0px");
  });
  it("measures every direct child and updates overflow after a later child changes", async () => {
    render(
      <Scrollbar>
        <span>First</span>
        <span>Second</span>
      </Scrollbar>
    );
    const { view, rail } = overflow();
    expect(observe).toHaveBeenCalledWith(screen.getByText("First"));
    expect(observe).toHaveBeenCalledWith(screen.getByText("Second"));
    Object.defineProperty(view, "scrollHeight", {
      value: 1500,
      configurable: true,
    });
    screen.getByText("Second").append(" changed");
    await waitFor(() => expect(rail).toHaveAttribute("aria-valuemax", "1300"));
  });
  it("updates after container resizing and cleans up its observer", () => {
    const { unmount } = render(<Scrollbar />);
    const { view, rail } = overflow();
    Object.defineProperty(view, "clientHeight", {
      value: 400,
      configurable: true,
    });
    fireEvent(window, new Event("resize"));
    expect(rail).toHaveAttribute("aria-valuemax", "600");
    expect(resize).toBeTypeOf("function");
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});

describe("Scrollbar horizontal wheel and RTL", () => {
  it("leaves a nested viewport's wheel with that viewport", () => {
    render(
      <Scrollbar orientation="horizontal" aria-label="Outer">
        <Scrollbar aria-label="Inner">
          <span>Nested content</span>
        </Scrollbar>
      </Scrollbar>
    );
    const outer = screen.getByRole("region", { name: "Outer" });
    const inner = screen.getByRole("region", { name: "Inner" });
    Object.defineProperties(outer, {
      clientWidth: { value: 200 },
      scrollWidth: { value: 1000 },
      scrollLeft: { value: 0, writable: true },
    });
    expect(wheel(inner).defaultPrevented).toBe(false);
    expect(outer.scrollLeft).toBe(0);
  });
  it("converts a vertical wheel while there is room, and chains at the edge", () => {
    render(<Scrollbar orientation="horizontal" />);
    const { view, rail } = overflow(false);
    expect(wheel(view).defaultPrevented).toBe(true);
    expect(view.scrollLeft).toBe(100);
    expect(rail).toHaveAttribute("aria-valuenow", "100");
    view.scrollLeft = 800;
    fireEvent.scroll(view);
    expect(wheel(view).defaultPrevented).toBe(false);
    expect(view.scrollLeft).toBe(800);
  });
  it("honors React wheel cancellation before adaptation and keeps the outer currentTarget", () => {
    let currentTarget: EventTarget | null = null;
    const onWheel = vi.fn((event: React.WheelEvent<HTMLDivElement>) => {
      currentTarget = event.currentTarget;
      event.preventDefault();
    });
    render(<Scrollbar orientation="horizontal" onWheel={onWheel} />);
    const { view, root } = overflow(false);
    expect(wheel(view).defaultPrevented).toBe(true);
    expect(view.scrollLeft).toBe(0);
    expect(currentTarget).toBe(root);
    expect(onWheel).toHaveBeenCalledTimes(1);
  });
  it("honors capture and native wheel cancellation", () => {
    const { rerender } = render(
      <Scrollbar
        orientation="horizontal"
        onWheelCapture={(event) => event.preventDefault()}
      />
    );
    const { view } = overflow(false);
    expect(wheel(view).defaultPrevented).toBe(true);
    expect(view.scrollLeft).toBe(0);
    rerender(<Scrollbar orientation="horizontal" />);
    view.addEventListener("wheel", (event) => event.preventDefault(), {
      once: true,
    });
    expect(wheel(view).defaultPrevented).toBe(true);
    expect(view.scrollLeft).toBe(0);
  });
  it("honors canceled wheel events even when propagation is stopped", () => {
    const cancel = (event: React.WheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const { rerender } = render(
      <Scrollbar orientation="horizontal" onWheel={cancel} />
    );
    const { view } = overflow(false);
    expect(wheel(view).defaultPrevented).toBe(true);
    expect(view.scrollLeft).toBe(0);
    rerender(<Scrollbar orientation="horizontal" onWheelCapture={cancel} />);
    expect(wheel(view).defaultPrevented).toBe(true);
    expect(view.scrollLeft).toBe(0);
  });
  it("leaves zoom, horizontal gestures and nonoverflowing content native", () => {
    render(<Scrollbar orientation="horizontal" />);
    const { view } = overflow(false);
    expect(wheel(view, { ctrlKey: true }).defaultPrevented).toBe(false);
    expect(wheel(view, { deltaX: 120, deltaY: 50 }).defaultPrevented).toBe(
      false
    );
    expect(view.scrollLeft).toBe(0);
    Object.defineProperty(view, "scrollWidth", {
      value: 200,
      configurable: true,
    });
    expect(wheel(view).defaultPrevented).toBe(false);
  });
  it("converts line and page wheel units", () => {
    render(<Scrollbar orientation="horizontal" />);
    const { view } = overflow(false);
    view.style.lineHeight = "24px";
    wheel(view, { deltaY: 2, deltaMode: 1 });
    expect(view.scrollLeft).toBe(48);
    wheel(view, { deltaY: 1, deltaMode: 2 });
    expect(view.scrollLeft).toBe(248);
  });
  it("keeps RTL positions positive in ARIA and reverses wheel, controls and keyboard logically", () => {
    render(<Scrollbar orientation="horizontal" dir="rtl" />);
    const { view, rail, thumb } = overflow(false, true);
    expect(thumb.style.left).toBe("160px");
    wheel(view);
    expect(view.scrollLeft).toBe(-100);
    expect(rail).toHaveAttribute("aria-valuenow", "100");
    fireEvent.click(screen.getByRole("button", { name: "Scroll forward" }));
    expect(view.scrollBy).toHaveBeenCalledWith({
      top: 0,
      left: -140,
      behavior: "smooth",
    });
    fireEvent.keyDown(view, { key: "End" });
    expect(view.scrollLeft).toBe(-800);
    expect(thumb.style.left).toBe("0px");
    fireEvent.keyDown(rail, { key: "ArrowRight" });
    expect(view.scrollLeft).toBe(-760);
    fireEvent.keyDown(rail, { key: "Home" });
    expect(view.scrollLeft).toBeCloseTo(0);
  });
  it("maps RTL dragging and track clicks to their physical direction", () => {
    render(
      <Scrollbar orientation="horizontal" dir="rtl" showControls={false} />
    );
    const { view, rail } = overflow(false, true);
    pointer(rail, "pointerdown", { clientX: 190 });
    pointer(rail, "pointermove", { clientX: 160 });
    expect(view.scrollLeft).toBe(-150);
    pointer(rail, "pointerup");
    pointer(rail, "pointerdown", { clientX: 20 });
    expect(view.scrollBy).toHaveBeenCalledWith({
      top: 0,
      left: -180,
      behavior: "smooth",
    });
  });
  it("clamps overscroll before computing accessible values and edge fades", () => {
    render(<Scrollbar orientation="horizontal" dir="rtl" />);
    const { view, rail } = overflow(false, true);
    view.scrollLeft = -900;
    fireEvent.scroll(view);
    expect(rail).toHaveAttribute("aria-valuenow", "800");
    expect(view.style.getPropertyValue("--v2-fade-start")).toBe("0px");
    expect(view.style.getPropertyValue("--v2-fade-end")).toBe("28px");
  });
});
