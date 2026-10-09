import * as React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  cleanup,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { animate } from "motion/react";
import { ButtonGroup } from "../../v2/button-group";
const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("motion/react", async (original) => {
  const actual = await original<typeof import("motion/react")>();
  return {
    ...actual,
    animate: vi.fn(actual.animate),
    useReducedMotion: () => preference.reduced,
  };
});
const actions = [
  { id: "a", label: "Alpha", icon: <svg /> },
  { id: "b", label: "Beta", icon: <svg /> },
];
let observers: Set<{ nodes: Set<Element>; run: () => void }>;
beforeEach(() => {
  preference.reduced = false;
  observers = new Set();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      nodes = new Set<Element>();
      run: () => void;
      constructor(callback: () => void) {
        this.run = callback;
        observers.add(this);
      }
      observe(node: Element) {
        this.nodes.add(node);
      }
      unobserve(node: Element) {
        this.nodes.delete(node);
      }
      disconnect() {
        observers.delete(this);
      }
    }
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      const left = this.dataset.groupSegment === "b" ? 100.25 : 0;
      return {
        x: left,
        y: 0,
        left,
        top: 0,
        right: left + 100.25,
        bottom: 42,
        width: 100.25,
        height: 42,
        toJSON: () => ({}),
      };
    }
  );
  vi.mocked(animate).mockClear();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const resize = () =>
  act(() => {
    [...observers].forEach((observer) => observer.run());
  });
it("springs between measured segments and does not cancel that spring on the observer's initial delivery", () => {
  render(<ButtonGroup items={actions} />);
  fireEvent.pointerMove(screen.getByRole("button", { name: "Alpha" }));
  resize();
  vi.mocked(animate).mockClear();
  fireEvent.pointerMove(screen.getByRole("button", { name: "Beta" }));
  const calls = vi
    .mocked(animate)
    .mock.calls.filter(
      (call) => (call[2] as { type?: string })?.type === "spring"
    );
  expect(calls).toHaveLength(4);
  expect(calls[0][1]).toBe(100.25);
  // A newly attached ResizeObserver delivers once even when no box changed.
  resize();
  expect((calls[0][0] as { get: () => number }).get()).not.toBe(100.25);
});
it("jumps to the new segment under reduced motion without a spring", () => {
  preference.reduced = true;
  render(<ButtonGroup items={actions} />);
  fireEvent.pointerMove(screen.getByRole("button", { name: "Alpha" }));
  fireEvent.pointerMove(screen.getByRole("button", { name: "Beta" }));
  expect(
    vi
      .mocked(animate)
      .mock.calls.filter(
        (call) => (call[2] as { type?: string })?.type === "spring"
      )
  ).toHaveLength(0);
});
it("collapses icon labels to fit and restores them when the parent has room", () => {
  render(
    <div data-testid="container">
      <ButtonGroup items={actions} />
    </div>
  );
  const group = screen.getByRole("group");
  const parent = screen.getByTestId("container");
  Object.defineProperties(group, {
    clientWidth: { configurable: true, value: 120 },
    scrollWidth: { configurable: true, value: 210 },
  });
  Object.defineProperty(parent, "clientWidth", {
    configurable: true,
    value: 120,
  });
  resize();
  expect(group).toHaveAttribute("data-compact", "true");
  expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
    "title",
    "Alpha"
  );
  Object.defineProperty(parent, "clientWidth", {
    configurable: true,
    value: 400,
  });
  resize();
  expect(group).toHaveAttribute("data-compact", "false");
});
it("disconnects its measurement observers on unmount", () => {
  const view = render(<ButtonGroup items={actions} />);
  fireEvent.pointerMove(screen.getByRole("button", { name: "Alpha" }));
  expect(observers.size).toBeGreaterThan(0);
  view.unmount();
  expect(observers.size).toBe(0);
});
