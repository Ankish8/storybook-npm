import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { Scrollbar } from "../../v2/scrollbar";
const originalObserver = globalThis.ResizeObserver;
beforeEach(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof ResizeObserver;
});
afterEach(() => {
  globalThis.ResizeObserver = originalObserver;
});
it("keeps an accessible keyboard-focusable native viewport", () => {
  render(
    <Scrollbar aria-label="People">
      <span>Ada</span>
    </Scrollbar>
  );
  expect(screen.getByRole("region", { name: "People" })).toHaveAttribute(
    "tabindex",
    "0"
  );
  expect(screen.getByText("Ada")).toBeInTheDocument();
});
it("updates controls at scroll boundaries and forwards scroll events", () => {
  const onScroll = vi.fn();
  render(
    <Scrollbar onScroll={onScroll}>
      <span>People</span>
    </Scrollbar>
  );
  const view = screen.getByRole("region");
  Object.defineProperties(view, {
    clientHeight: { value: 200 },
    scrollHeight: { value: 1000 },
    scrollTop: { value: 0, writable: true },
  });
  fireEvent.scroll(view);
  expect(
    screen.getByRole("button", { name: "Scroll backward" })
  ).toBeDisabled();
  expect(screen.getByRole("button", { name: "Scroll forward" })).toBeEnabled();
  view.scrollTop = 800;
  fireEvent.scroll(view);
  expect(screen.getByRole("button", { name: "Scroll forward" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Scroll backward" })).toBeEnabled();
  expect(onScroll).toHaveBeenCalledTimes(2);
});
it("scrolls on the selected axis", () => {
  render(
    <Scrollbar orientation="horizontal">
      <span>People</span>
    </Scrollbar>
  );
  const view = screen.getByRole("region");
  Object.defineProperties(view, {
    clientWidth: { value: 200 },
    scrollWidth: { value: 1000 },
    scrollLeft: { value: 0, writable: true },
  });
  view.scrollBy = vi.fn() as unknown as typeof view.scrollBy;
  fireEvent.scroll(view);
  fireEvent.click(screen.getByRole("button", { name: "Scroll forward" }));
  expect(view.scrollBy).toHaveBeenCalledWith({
    top: 0,
    left: 140,
    behavior: "smooth",
  });
});
it("can omit the arrow controls", () => {
  render(<Scrollbar showControls={false} />);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

it("snaps step scrolling when reduced motion is requested", () => {
  const preference = vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: true,
  } as MediaQueryList);
  try {
    render(
      <Scrollbar>
        <span>People</span>
      </Scrollbar>
    );
    const view = screen.getByRole("region");
    Object.defineProperties(view, {
      clientHeight: { value: 200 },
      scrollHeight: { value: 1000 },
      scrollTop: { value: 0, writable: true },
    });
    view.scrollBy = vi.fn() as unknown as typeof view.scrollBy;
    fireEvent.scroll(view);
    fireEvent.click(screen.getByRole("button", { name: "Scroll forward" }));
    expect(preference).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    expect(view.scrollBy).toHaveBeenCalledWith({
      top: 140,
      left: 0,
      behavior: "auto",
    });
  } finally {
    preference.mockRestore();
  }
});

it("preserves the grabbed point when dragging the thumb", () => {
  const { container } = render(
    <Scrollbar showControls={false}>
      <span>Content</span>
    </Scrollbar>
  );
  const view = screen.getByRole("region");
  const rail = container.querySelector(".self-stretch") as HTMLDivElement;
  const thumb = rail.firstElementChild as HTMLDivElement;
  Object.defineProperties(view, {
    clientHeight: { value: 200 },
    scrollHeight: { value: 1000 },
    scrollTop: { value: 0, writable: true },
  });
  Object.defineProperty(rail, "clientHeight", { value: 200 });
  rail.getBoundingClientRect = () => ({
    top: 0,
    bottom: 200,
    height: 200,
    left: 0,
    right: 16,
    width: 16,
    x: 0,
    y: 0,
    toJSON() {},
  });
  thumb.getBoundingClientRect = () => ({
    top: 0,
    bottom: 40,
    height: 40,
    left: 0,
    right: 8,
    width: 8,
    x: 0,
    y: 0,
    toJSON() {},
  });
  rail.hasPointerCapture = () => true;
  fireEvent.scroll(view);
  fireEvent(
    rail,
    new MouseEvent("pointerdown", { bubbles: true, button: 0, clientY: 10 })
  );
  expect(view.scrollTop).toBe(0);
  fireEvent(
    rail,
    new MouseEvent("pointermove", { bubbles: true, button: 0, clientY: 40 })
  );
  expect(view.scrollTop).toBe(150);
});
