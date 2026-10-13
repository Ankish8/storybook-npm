import * as React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import {
  Toaster,
  toast,
  useToast,
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toastVariants,
} from "../../v2/toast";
import { ToastProvider as V1Provider } from "../../toast";
import { assertNoBootstrapMarginBleed } from "../utils/bootstrap-compat";

function advance(milliseconds: number) {
  act(() => vi.advanceTimersByTime(milliseconds));
}
function notify(props: Parameters<typeof toast>[0]) {
  let result!: ReturnType<typeof toast>;
  act(() => {
    result = toast(props);
  });
  return result;
}
function card(title: string) {
  return screen
    .getByText(title)
    .closest("[data-v2-toast-variant]") as HTMLLIElement;
}
function pointer(
  node: Element,
  type: string,
  x = 0,
  y = 0,
  pointerType = "mouse"
) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    clientX: x,
    clientY: y,
  });
  Object.defineProperties(event, {
    pointerType: { value: pointerType },
    pointerId: { value: 1 },
  });
  fireEvent(node, event);
}
function swipe(node: Element, x: number, y = 0) {
  pointer(node, "pointerdown", 0, 0, "touch");
  pointer(node, "pointermove", x / 2, y / 2, "touch");
  pointer(node, "pointermove", x, y, "touch");
  pointer(node, "pointerup", x, y, "touch");
}
function StoreState() {
  const { toasts } = useToast();
  return (
    <output data-testid="store">
      {toasts.map((item) => `${item.title}:${item.open}`).join(",")}
    </output>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    matches: query === "(hover: hover)",
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  }));
  act(() => toast.dismiss());
  act(() => vi.runOnlyPendingTimers());
});
afterEach(() => {
  cleanup();
  act(() => toast.dismiss());
  act(() => vi.runOnlyPendingTimers());
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Toast primitives and migration", () => {
  it("keeps the exact Radix provider exported by v1", () => {
    expect(ToastProvider).toBe(V1Provider);
  });

  it.each([
    "default",
    "success",
    "error",
    "warning",
    "info",
    "destructive",
  ] as const)(
    "uses the same neutral surface for %s without losing the variant hook",
    (variant) => {
      render(
        <ToastProvider>
          <Toast variant={variant} data-testid="toast">
            Notification
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
      const node = screen.getByTestId("toast");
      expect(node).toHaveClass(
        "bg-semantic-bg-primary",
        "border-semantic-border-layout",
        "text-semantic-text-primary"
      );
      expect(node).toHaveAttribute("data-v2-toast-variant", variant);
      expect(node.className).not.toMatch(
        /bg-semantic-(success|error|warning|info)-surface/
      );
      expect(toastVariants({ variant })).toContain("bg-semantic-bg-primary");
    }
  );

  it("defaults to the neutral default variant", () => {
    render(
      <ToastProvider>
        <Toast data-testid="toast">Hello</Toast>
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByTestId("toast")).toHaveAttribute(
      "data-v2-toast-variant",
      "default"
    );
  });

  it("forwards every primitive ref and native attribute", () => {
    const root = React.createRef<HTMLLIElement>();
    const title = React.createRef<HTMLDivElement>();
    const description = React.createRef<HTMLDivElement>();
    const action = React.createRef<HTMLButtonElement>();
    const close = React.createRef<HTMLButtonElement>();
    const viewport = React.createRef<HTMLOListElement>();
    const { unmount } = render(
      <ToastProvider>
        <Toast
          ref={root}
          id="notice"
          className="consumer-root"
          data-custom="root"
          aria-label="Custom notification"
        >
          <ToastTitle ref={title} className="consumer-title">
            Title
          </ToastTitle>
          <ToastDescription ref={description} className="consumer-description">
            Description
          </ToastDescription>
          <ToastAction
            ref={action}
            altText="Undo the change"
            className="consumer-action"
            data-custom="action"
          >
            Undo
          </ToastAction>
          <ToastClose
            ref={close}
            aria-label="Close custom notice"
            className="consumer-close"
          />
        </Toast>
        <ToastViewport
          ref={viewport}
          className="consumer-viewport"
          data-custom="viewport"
        />
      </ToastProvider>
    );
    expect(root.current).toHaveAttribute("id", "notice");
    expect(root.current).toHaveAttribute("aria-label", "Custom notification");
    expect(title.current).toHaveClass("consumer-title");
    expect(description.current).toHaveClass("consumer-description");
    expect(action.current).toHaveAttribute("data-custom", "action");
    expect(close.current).toHaveAttribute("aria-label", "Close custom notice");
    expect(viewport.current).toHaveClass("consumer-viewport");
    unmount();
    expect(root.current).toBeNull();
    expect(viewport.current).toBeNull();
  });

  it("keeps Bootstrap margin resets with consumer paragraph composition", () => {
    const { container } = render(
      <ToastProvider>
        <Toast>
          <ToastTitle asChild>
            <p>Title</p>
          </ToastTitle>
          <ToastDescription asChild>
            <p>Description</p>
          </ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    assertNoBootstrapMarginBleed(container);
  });

  it("names the default dismiss control and allows native disabled actions", () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Notice</ToastTitle>
          <ToastAction disabled altText="Retry sending">
            Retry
          </ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    expect(
      screen.getByRole("button", { name: "Dismiss notification" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeDisabled();
  });

  it("honors an action click cancellation", () => {
    const onOpenChange = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <ToastProvider>
        <Toast onOpenChange={onOpenChange}>
          <ToastAction altText="Undo this change" onClick={onClick}>
            Undo
          </ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
  });

  it("honors a dismiss click cancellation", () => {
    const onOpenChange = vi.fn();
    render(
      <ToastProvider>
        <Toast onOpenChange={onOpenChange}>
          <ToastClose onClick={(event) => event.preventDefault()} />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss notification" })
    );
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("honors Escape cancellation on a focused primitive", () => {
    const onOpenChange = vi.fn();
    const onEscapeKeyDown = vi.fn((event: KeyboardEvent) =>
      event.preventDefault()
    );
    render(
      <ToastProvider>
        <Toast
          data-testid="toast"
          onOpenChange={onOpenChange}
          onEscapeKeyDown={onEscapeKeyDown}
        >
          Notice
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    act(() => screen.getByTestId("toast").focus());
    fireEvent.keyDown(screen.getByTestId("toast"), { key: "Escape" });
    expect(onEscapeKeyDown).toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it.each([
    ["right", 80, 0],
    ["left", -80, 0],
    ["up", 0, -80],
    ["down", 0, 80],
  ] as const)("keeps native %s swipe-to-dismiss", (direction, x, y) => {
    const onOpenChange = vi.fn();
    render(
      <ToastProvider swipeDirection={direction}>
        <Toast data-testid="toast" onOpenChange={onOpenChange}>
          Swipe
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    swipe(screen.getByTestId("toast"), x, y);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("keeps cancelled swipes open", () => {
    const onOpenChange = vi.fn();
    const onSwipeCancel = vi.fn();
    render(
      <ToastProvider>
        <Toast
          data-testid="toast"
          onOpenChange={onOpenChange}
          onSwipeCancel={onSwipeCancel}
        >
          Swipe
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    swipe(screen.getByTestId("toast"), 35);
    expect(onSwipeCancel).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("honors swipe-end preventDefault", () => {
    const onOpenChange = vi.fn();
    render(
      <ToastProvider>
        <Toast
          data-testid="toast"
          onOpenChange={onOpenChange}
          onSwipeEnd={(event) => event.preventDefault()}
        >
          Swipe
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    swipe(screen.getByTestId("toast"), 80);
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe("Toaster and the existing store", () => {
  it("keeps stacking disabled by default and forwards viewport attributes/styles", () => {
    render(
      <Toaster
        viewportProps={
          {
            className: "consumer-viewport",
            "aria-label": "Workspace notices",
            style: { width: 333 },
            "data-testid": "viewport",
          } as React.ComponentPropsWithoutRef<typeof ToastViewport>
        }
      />
    );
    const node = screen.getByTestId("viewport");
    expect(node).not.toHaveAttribute("data-v2-toast-stack");
    expect(node).toHaveClass("consumer-viewport");
    expect(node).toHaveStyle({ width: "333px" });
    expect(node).toHaveAttribute("aria-label", "Workspace notices");
  });

  it("shows title, description, native action and the labelled dismiss", () => {
    render(<Toaster />);
    notify({
      title: "Saved",
      description: "Shared with the team",
      action: <ToastAction altText="Undo saving">Undo</ToastAction>,
    });
    expect(screen.getByText("Shared with the team")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Dismiss notification" })
    ).toBeInTheDocument();
  });

  it.each(["success", "error", "warning", "info"] as const)(
    "keeps toast.%s and colors only its indicator",
    (variant) => {
      render(<Toaster />);
      act(() => toast[variant]({ title: variant }));
      const node = card(variant);
      expect(node).toHaveClass("bg-semantic-bg-primary", variant);
      expect(node.querySelector("[data-v2-toast-indicator]")).toHaveClass(
        `text-semantic-${variant}-primary`
      );
      expect(
        node.querySelector("[data-v2-toast-indicator] svg")
      ).toHaveAttribute("aria-hidden", "true");
    }
  );

  it("uses the error indicator for the existing destructive alias", () => {
    render(<Toaster />);
    notify({ title: "Removed", variant: "destructive" });
    expect(
      card("Removed").querySelector("[data-v2-toast-indicator]")
    ).toHaveClass("text-semantic-error-primary");
  });

  it("keeps v1's 5000ms provider duration and 50px swipe defaults", () => {
    render(<Toaster />);
    notify({ title: "Timed" });
    advance(4999);
    expect(screen.getByText("Timed")).toBeInTheDocument();
    advance(1);
    expect(screen.queryByText("Timed")).not.toBeInTheDocument();
    notify({ title: "Swiped" });
    swipe(card("Swiped"), 51);
    expect(screen.queryByText("Swiped")).not.toBeInTheDocument();
  });

  it("preserves the five-item newest-first store limit", () => {
    render(<Toaster />);
    for (let index = 1; index <= 6; index++)
      notify({ title: `Notice ${index}` });
    expect(screen.queryByText("Notice 1")).not.toBeInTheDocument();
    expect(document.querySelectorAll("[data-v2-toast-id]")).toHaveLength(5);
    expect(
      [...document.querySelectorAll("[data-v2-toast-id]")].map(
        (node) => node.textContent
      )
    ).toEqual(expect.arrayContaining(["Notice 6", "Notice 2"]));
  });

  it("keeps dismiss controls and the 2000ms default store removal delay", () => {
    render(
      <>
        <Toaster />
        <StoreState />
      </>
    );
    const result = notify({ title: "Dismissable" });
    expect(typeof result.id).toBe("string");
    expect(typeof result.update).toBe("function");
    act(() => result.dismiss());
    expect(screen.queryByText("Dismissable")).not.toBeInTheDocument();
    expect(screen.getByTestId("store")).toHaveTextContent("Dismissable:false");
    advance(1999);
    expect(screen.getByTestId("store")).toHaveTextContent("Dismissable:false");
    advance(1);
    expect(screen.getByTestId("store")).toBeEmptyDOMElement();
  });

  it("keeps an infinite-duration toast mounted through explicit dismissal, then removes it after the finite legacy delay", () => {
    render(
      <>
        <Toaster stack />
        <StoreState />
      </>
    );
    const result = notify({
      title: "Persistent exit",
      duration: Infinity,
      forceMount: true,
    });
    const node = card("Persistent exit");
    advance(60000);
    expect(node).toHaveAttribute("data-state", "open");
    act(() => result.dismiss());
    expect(node).toHaveAttribute("data-state", "closed");
    expect(node).toHaveAttribute("inert");
    expect(node).toHaveClass("data-[state=closed]:pointer-events-none");
    advance(1999);
    expect(node).toBeInTheDocument();
    advance(1);
    expect(node).not.toBeInTheDocument();
    expect(screen.getByTestId("store")).toBeEmptyDOMElement();
  });

  it("supports update without replacing the notification node", () => {
    render(<Toaster />);
    const result = notify({ title: "Saving", description: "Working" });
    const before = card("Saving");
    act(() =>
      result.update({
        id: result.id,
        title: "Saved",
        description: "Finished",
        variant: "success",
      })
    );
    expect(card("Saved")).toBe(before);
    expect(card("Saved")).toHaveAttribute("data-v2-toast-variant", "success");
    expect(screen.queryByText("Working")).not.toBeInTheDocument();
  });

  it("keeps store dismissal when an update replaces the native open-change callback", () => {
    const initial = vi.fn();
    const updated = vi.fn();
    render(<Toaster stack />);
    const result = notify({ title: "Initial", onOpenChange: initial });
    act(() =>
      result.update({ id: result.id, title: "Updated", onOpenChange: updated })
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss notification" })
    );
    expect(initial).not.toHaveBeenCalled();
    expect(updated).toHaveBeenCalledTimes(1);
    expect(updated).toHaveBeenCalledWith(false);
    expect(screen.queryByText("Updated")).not.toBeInTheDocument();
  });

  it("calls the supplied open-change callback exactly once before dismissal", () => {
    const onOpenChange = vi.fn();
    render(<Toaster />);
    notify({ title: "Notice", onOpenChange });
    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss notification" })
    );
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByText("Notice")).not.toBeInTheDocument();
  });
});

describe("Opt-in unified toast stack", () => {
  it("keeps tall expanded cards in positive scroll space and reserves the footer", () => {
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(280);
    render(<Toaster stack defaultExpanded />);
    for (let index = 1; index <= 5; index++)
      notify({ title: `Tall ${index}`, duration: Infinity });
    const viewport = document.querySelector<HTMLOListElement>(
      "[data-v2-toast-stack][data-expanded]"
    )!;
    expect(viewport).toHaveClass(
      "right-0",
      "overflow-y-auto",
      "overscroll-contain"
    );
    const cards = [
      ...viewport.querySelectorAll<HTMLElement>("[data-v2-toast-id]"),
    ];
    expect(cards).toHaveLength(5);
    for (const item of cards) {
      expect(item).toHaveClass("top-4");
      expect(
        parseFloat(item.style.translate.split(" ")[1])
      ).toBeGreaterThanOrEqual(0);
      expect(item).not.toHaveAttribute("inert");
    }
    const listHeight = 5 * 282 + 4 * 12;
    expect(viewport.style.height).toContain(String(listHeight));
    const footer = viewport.querySelector<HTMLElement>(
      "[data-v2-toast-stack-control]"
    )!;
    expect(footer.style.top).toBe(`${listHeight + 28}px`);
  });

  it("layers cards without creating a second store and makes tucked cards inert", () => {
    render(<Toaster stack />);
    notify({ title: "First" });
    notify({ title: "Second" });
    notify({ title: "Front" });
    expect(card("Front")).not.toHaveAttribute("inert");
    expect(card("First")).toHaveAttribute("inert");
    expect(card("First")).toHaveAttribute("aria-hidden", "true");
    expect(card("First")).toHaveStyle({ translate: "0 0px", scale: "0.92" });
    expect(
      screen.getByRole("button", { name: "Expand notifications" })
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("limits collapsed layers but exposes every queued item on expansion", () => {
    render(<Toaster stack visibleToasts={2} />);
    for (let index = 1; index <= 5; index++)
      notify({ title: `Layer ${index}` });
    expect(card("Layer 3")).toHaveStyle({ opacity: "0" });
    fireEvent.click(
      screen.getByRole("button", { name: "Expand notifications" })
    );
    expect(card("Layer 1")).not.toHaveAttribute("inert");
    expect(card("Layer 1")).not.toHaveAttribute("aria-hidden");
    expect(card("Layer 1")).toHaveStyle({ opacity: "1", scale: "1" });
  });

  it("expands and collapses through the explicit control for touch/keyboard", () => {
    const onExpandedChange = vi.fn();
    render(<Toaster stack onExpandedChange={onExpandedChange} />);
    notify({ title: "First" });
    notify({ title: "Second" });
    const toggle = screen.getByRole("button", { name: "Expand notifications" });
    act(() => toggle.focus());
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(onExpandedChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(onExpandedChange).toHaveBeenLastCalledWith(false);
  });

  it("fans out on mouse hover and collapses when the pointer leaves", () => {
    render(<Toaster stack />);
    notify({ title: "First" });
    notify({ title: "Front" });
    const viewport = document.querySelector("ol[data-v2-toast-stack]")!;
    pointer(viewport, "pointerover");
    expect(card("First")).not.toHaveAttribute("inert");
    pointer(viewport, "pointerout");
    expect(card("First")).toHaveAttribute("inert");
  });

  it("pins a hovered stack when its explicit control is activated", () => {
    const onExpandedChange = vi.fn();
    render(<Toaster stack onExpandedChange={onExpandedChange} />);
    notify({ title: "First" });
    notify({ title: "Front" });
    const viewport = document.querySelector("ol[data-v2-toast-stack]")!;
    pointer(viewport, "pointerover");
    const toggle = screen.getByRole("button", {
      name: "Keep notifications expanded",
    });
    fireEvent.click(toggle);
    expect(onExpandedChange).toHaveBeenLastCalledWith(true);
    pointer(viewport, "pointerout");
    expect(card("First")).not.toHaveAttribute("inert");
    expect(toggle).toHaveAccessibleName("Collapse notifications");
    fireEvent.click(toggle);
    expect(onExpandedChange).toHaveBeenLastCalledWith(false);
    expect(card("First")).toHaveAttribute("inert");
  });

  it("expands when a portalled card itself is hovered and collapses on native list leave", () => {
    render(<Toaster stack />);
    notify({ title: "First" });
    notify({ title: "Front" });
    pointer(card("Front"), "pointerover");
    expect(card("First")).not.toHaveAttribute("inert");
    fireEvent(
      document.querySelector("ol[data-v2-toast-stack]")!,
      new MouseEvent("pointerleave")
    );
    expect(card("First")).toHaveAttribute("inert");
  });

  it("does not treat a touch pointer as hover", () => {
    render(<Toaster stack />);
    notify({ title: "First" });
    notify({ title: "Front" });
    pointer(
      document.querySelector("ol[data-v2-toast-stack]")!,
      "pointerover",
      0,
      0,
      "touch"
    );
    expect(card("First")).toHaveAttribute("inert");
  });

  it("allows viewport pointer handler cancellation", () => {
    render(
      <Toaster
        stack
        viewportProps={{ onPointerEnter: (event) => event.preventDefault() }}
      />
    );
    notify({ title: "First" });
    notify({ title: "Front" });
    pointer(document.querySelector("ol[data-v2-toast-stack]")!, "pointerover");
    expect(card("First")).toHaveAttribute("inert");
  });

  it("fans out on focus, then resumes after focus leaves", () => {
    render(
      <>
        <button>Outside</button>
        <Toaster stack />
      </>
    );
    notify({ title: "First" });
    notify({ title: "Front", duration: 1000 });
    act(() => card("Front").focus());
    expect(card("First")).not.toHaveAttribute("inert");
    advance(2000);
    expect(screen.getByText("Front")).toBeInTheDocument();
    act(() => screen.getByRole("button", { name: "Outside" }).focus());
    advance(1000);
    expect(screen.queryByText("Front")).not.toBeInTheDocument();
  });

  it("resumes the remaining duration after expansion and calls pause/resume once", () => {
    const onPause = vi.fn();
    const onResume = vi.fn();
    const onOpenChange = vi.fn();
    const { rerender } = render(<Toaster stack expanded={false} />);
    notify({ title: "Timed", duration: 2000, onPause, onResume, onOpenChange });
    advance(800);
    rerender(<Toaster stack expanded />);
    expect(onPause).toHaveBeenCalledOnce();
    advance(9000);
    expect(screen.getByText("Timed")).toBeInTheDocument();
    rerender(<Toaster stack expanded={false} />);
    expect(onResume).toHaveBeenCalledOnce();
    advance(1199);
    expect(screen.getByText("Timed")).toBeInTheDocument();
    advance(1);
    expect(screen.queryByText("Timed")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("gives a toast added during a pause its whole lifetime after resuming", () => {
    const { rerender } = render(<Toaster stack expanded={false} />);
    notify({ title: "First", duration: 3000 });
    advance(1500);
    rerender(<Toaster stack expanded />);
    notify({ title: "Added while paused", duration: 3000 });
    advance(10000);
    rerender(<Toaster stack expanded={false} />);
    advance(1500);
    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.getByText("Added while paused")).toBeInTheDocument();
    advance(1500);
    expect(screen.queryByText("Added while paused")).not.toBeInTheDocument();
  });

  it("pauses while the document is hidden and resumes remaining time", () => {
    let visibility = "visible";
    const getter = vi
      .spyOn(document, "visibilityState", "get")
      .mockImplementation(() => visibility as DocumentVisibilityState);
    render(<Toaster stack />);
    notify({ title: "Background", duration: 1000 });
    advance(400);
    visibility = "hidden";
    fireEvent(document, new Event("visibilitychange"));
    advance(6000);
    expect(screen.getByText("Background")).toBeInTheDocument();
    visibility = "visible";
    fireEvent(document, new Event("visibilitychange"));
    advance(599);
    expect(screen.getByText("Background")).toBeInTheDocument();
    advance(1);
    expect(screen.queryByText("Background")).not.toBeInTheDocument();
    getter.mockRestore();
  });

  it("pauses on a background window blur and resumes on focus", () => {
    render(<Toaster stack />);
    notify({ title: "Window", duration: 1000 });
    advance(300);
    fireEvent(window, new Event("blur"));
    advance(5000);
    expect(screen.getByText("Window")).toBeInTheDocument();
    fireEvent(window, new Event("focus"));
    advance(700);
    expect(screen.queryByText("Window")).not.toBeInTheDocument();
  });

  it("preserves a persistent provider duration of zero", () => {
    render(<Toaster stack providerProps={{ duration: 0 }} />);
    notify({ title: "Persistent" });
    advance(60000);
    expect(screen.getByText("Persistent")).toBeInTheDocument();
  });

  it("preserves per-toast zero inheriting the Radix provider duration", () => {
    render(<Toaster stack providerProps={{ duration: 1000 }} />);
    notify({ title: "Inherited", duration: 0 });
    advance(999);
    expect(screen.getByText("Inherited")).toBeInTheDocument();
    advance(1);
    expect(screen.queryByText("Inherited")).not.toBeInTheDocument();
  });

  it("preserves an infinite provider duration", () => {
    render(<Toaster stack providerProps={{ duration: Infinity }} />);
    notify({ title: "Persistent" });
    advance(60000);
    expect(screen.getByText("Persistent")).toBeInTheDocument();
  });

  it("pauses during a drag, then resumes after a cancelled swipe", () => {
    render(<Toaster stack />);
    notify({ title: "Dragging", duration: 1000 });
    advance(400);
    const node = card("Dragging");
    pointer(node, "pointerdown", 0, 0, "touch");
    pointer(node, "pointermove", 20, 0, "touch");
    advance(2000);
    expect(screen.getByText("Dragging")).toBeInTheDocument();
    pointer(node, "pointerup", 20, 0, "touch");
    advance(600);
    expect(screen.queryByText("Dragging")).not.toBeInTheDocument();
  });

  it("still cancels native action and swipe dismissal inside the stack", () => {
    render(<Toaster stack />);
    notify({
      title: "Cancellable",
      onSwipeEnd: (event) => event.preventDefault(),
      action: (
        <ToastAction
          altText="Retry the operation"
          onClick={(event) => event.preventDefault()}
        >
          Retry
        </ToastAction>
      ),
    });
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(screen.getByText("Cancellable")).toBeInTheDocument();
    swipe(card("Cancellable"), 80);
    expect(screen.getByText("Cancellable")).toBeInTheDocument();
  });

  it("moves focused dismissal to another card and returns to the entry trigger", () => {
    render(
      <>
        <button>Entry trigger</button>
        <Toaster stack expanded />
      </>
    );
    notify({ title: "First" });
    notify({ title: "Second" });
    const entry = screen.getByRole("button", { name: "Entry trigger" });
    act(() => entry.focus());
    act(() =>
      card("Second").querySelector<HTMLButtonElement>("[toast-close]")!.focus()
    );
    fireEvent.click(card("Second").querySelector("[toast-close]")!);
    expect(card("First").contains(document.activeElement)).toBe(true);
    fireEvent.click(card("First").querySelector("[toast-close]")!);
    expect(entry).toHaveFocus();
  });

  it("keeps external store dismissal accessible when a card has focus", () => {
    render(
      <>
        <button>Entry trigger</button>
        <Toaster stack expanded />
      </>
    );
    const first = notify({ title: "First" });
    const second = notify({ title: "Second" });
    const entry = screen.getByRole("button", { name: "Entry trigger" });
    act(() => entry.focus());
    act(() => card("Second").focus());
    act(() => second.dismiss());
    expect(card("First").contains(document.activeElement)).toBe(true);
    act(() => first.dismiss());
    expect(entry).toHaveFocus();
  });
});
