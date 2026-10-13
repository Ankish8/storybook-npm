import * as React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";
import { ProgressIndicator } from "../../v2/progress-indicator";
import type { ProgressIndicatorProps } from "../../v2/progress-indicator";
import meta, { Overview } from "../../v2/progress-indicator.stories";

const { updateArgs } = vi.hoisted(() => ({ updateArgs: vi.fn() }));
vi.mock("storybook/preview-api", () => ({
  useArgs: () => [{}, updateArgs, vi.fn()],
}));

const fillPercent = (fill: HTMLElement) =>
  100 + parseFloat(/translateX\((-?[\d.]+)%\)/.exec(fill.style.transform)![1]);
const barFill = () =>
  screen.getByRole("progressbar").firstElementChild
    ?.firstElementChild as HTMLElement;
const shapes = ["bar", "circle", "semi-circle"] as const;
let reducedMotion = false;
let motionListeners: Set<() => void>;
let addMediaListener: Mock<[string, () => void], void>;
let removeMediaListener: Mock<[string, () => void], void>;

beforeEach(() => {
  reducedMotion = false;
  motionListeners = new Set();
  addMediaListener = vi.fn((_event: string, callback: () => void) => {
    motionListeners.add(callback);
  });
  removeMediaListener = vi.fn((_event: string, callback: () => void) => {
    motionListeners.delete(callback);
  });
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    get matches() {
      return query === "(prefers-reduced-motion: reduce)" && reducedMotion;
    },
    media: query,
    onchange: null,
    addEventListener: addMediaListener,
    removeEventListener: removeMediaListener,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  updateArgs.mockClear();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const changeMotionPreference = (reduce: boolean) => {
  act(() => {
    reducedMotion = reduce;
    motionListeners.forEach((listener) => listener());
  });
};

const OverviewRender =
  Overview.render as React.ComponentType<ProgressIndicatorProps>;
const renderTask = () => render(<OverviewRender {...meta.args} />);

describe("v2 ProgressIndicator compatibility and measurement", () => {
  it("keeps the default labelled linear bar at zero with a right-hand label", () => {
    render(<ProgressIndicator />);
    const progress = screen.getByRole("progressbar", { name: "Progress" });
    expect(progress.tagName).toBe("DIV");
    expect(progress).toHaveAttribute("aria-valuemin", "0");
    expect(progress).toHaveAttribute("aria-valuemax", "100");
    expect(progress).toHaveAttribute("aria-valuenow", "0");
    expect(progress).toHaveClass("w-[320px]", "min-h-5");
    expect(fillPercent(barFill())).toBe(0);
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(progress).not.toHaveAttribute("tabindex");
    expect(progress).not.toHaveAttribute("aria-live");
  });

  it.each(shapes)("exposes the measured fractional value in %s", (variant) => {
    render(
      <ProgressIndicator
        value={37.25}
        variant={variant}
        aria-label="Contact check"
      />
    );
    const progress = screen.getByRole("progressbar", { name: "Contact check" });
    expect(progress).toHaveAttribute("aria-valuenow", "37.25");
    expect(progress).toHaveAttribute("aria-valuetext", "37.25%");
    expect(screen.getByText("37%")).toHaveClass("tabular-nums");
  });

  it.each([
    [-12, 0],
    [110, 100],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
    [Number.NEGATIVE_INFINITY, 0],
  ])("normalizes %s to %s for semantics and visuals", (value, expected) => {
    render(<ProgressIndicator value={value} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      String(expected)
    );
    expect(fillPercent(barFill())).toBe(expected);
    expect(screen.getByText(`${expected}%`)).toBeInTheDocument();
  });

  it("does not round 99.6% up to completion", () => {
    render(<ProgressIndicator value={99.6} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "99.6"
    );
    expect(screen.getByText("99%")).toBeInTheDocument();
    expect(screen.queryByText("100%")).toBeNull();
    expect(barFill()).not.toHaveAttribute("data-complete");
    expect(screen.getByRole("progressbar").querySelector("svg")).toBeNull();
  });

  it("forwards native attributes, styles, classes, events and an HTMLDivElement ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();
    render(
      <ProgressIndicator
        ref={ref}
        id="progress"
        title="Checking"
        className="custom-progress w-[480px]"
        style={{ width: 480 }}
        onClick={onClick}
        data-consumer="check"
        value={45}
      />
    );
    const progress = screen.getByRole("progressbar");
    expect(ref.current).toBe(progress);
    expect(progress).toHaveAttribute("id", "progress");
    expect(progress).toHaveAttribute("title", "Checking");
    expect(progress).toHaveAttribute("data-consumer", "check");
    expect(progress).toHaveClass("custom-progress", "w-[480px]");
    expect(progress).toHaveStyle({ width: "480px" });
    fireEvent.click(progress);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("clears a callback ref on unmount", () => {
    const ref = vi.fn();
    const { unmount } = render(<ProgressIndicator ref={ref} />);
    expect(ref).toHaveBeenLastCalledWith(screen.getByRole("progressbar"));
    unmount();
    expect(ref).toHaveBeenLastCalledWith(null);
  });

  it("supports external labelling and custom completed-item text", () => {
    render(
      <>
        <span id="task-label">Sample format check</span>
        <ProgressIndicator
          value={50}
          aria-labelledby="task-label"
          aria-valuetext="12 of 24 checked"
        />
      </>
    );
    const progress = screen.getByRole("progressbar", {
      name: "Sample format check",
    });
    expect(progress).not.toHaveAttribute("aria-label");
    expect(progress).toHaveAttribute("aria-valuetext", "12 of 24 checked");
  });

  it.each(shapes)("hides only the visible label in %s", (variant) => {
    render(
      <ProgressIndicator value={50} labelPosition="none" variant={variant} />
    );
    expect(screen.queryByText("50%")).toBeNull();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "50"
    );
  });

  it("retains bottom-label and circular geometry choices", () => {
    const { rerender } = render(
      <ProgressIndicator value={40} labelPosition="bottom" />
    );
    expect(screen.getByRole("progressbar")).toHaveClass(
      "flex-col",
      "items-end"
    );
    rerender(<ProgressIndicator value={40} variant="circle" />);
    expect(
      screen.getByRole("progressbar").querySelector("svg")
    ).toHaveAttribute("viewBox", "0 0 54 54");
    rerender(<ProgressIndicator value={40} variant="semi-circle" />);
    expect(
      screen.getByRole("progressbar").querySelector("svg")
    ).toHaveAttribute("viewBox", "0 0 54 27");
    expect(
      screen.getByRole("progressbar").querySelector("path:last-child")
    ).toHaveAttribute("stroke-dashoffset", "60");
  });
});

describe("unknown progress and finite settling", () => {
  it.each(shapes)(
    "does not imply completion or a known percentage in indeterminate %s",
    (variant) => {
      render(
        <ProgressIndicator
          variant={variant}
          value={100}
          indeterminate
          aria-label="Checking"
        />
      );
      const progress = screen.getByRole("progressbar", { name: "Checking" });
      expect(progress).not.toHaveAttribute("aria-valuenow");
      expect(progress).not.toHaveAttribute("aria-valuetext");
      expect(progress).toHaveAttribute("data-state", "indeterminate");
      expect(screen.queryByText(/%/)).toBeNull();
      expect(progress.querySelector("[data-complete]")).toBeNull();
    }
  );

  it("keeps track then fill and ships its bar loading keyframes", () => {
    render(<ProgressIndicator indeterminate />);
    const track = screen.getByRole("progressbar")
      .firstElementChild as HTMLElement;
    expect(track.firstElementChild).toBe(barFill());
    expect(barFill()).toHaveStyle({
      width: "30%",
      animationPlayState: "running",
    });
    expect(track.querySelector("style")?.textContent).toContain(
      "translateX(350%)"
    );
    expect(track).toHaveClass("h-[7px]", "border");
  });

  it("renders a real quarter-ring even when an indeterminate circle has value zero", () => {
    render(<ProgressIndicator variant="circle" indeterminate />);
    const arc = screen
      .getByRole("progressbar")
      .querySelector("circle:last-child");
    expect(arc).toHaveAttribute("pathLength", "100");
    expect(arc).toHaveAttribute("stroke-dasharray", "100");
    expect(arc).toHaveAttribute("stroke-dashoffset", "75");
    expect(arc).toHaveStyle({ animationDuration: "1.5s" });
    expect(
      screen.getByRole("progressbar").querySelector("style")?.textContent
    ).toContain("@keyframes myoperator-v2-progress-rotate");
  });

  it("renders a partial semicircular sweep independent of its value", () => {
    render(<ProgressIndicator variant="semi-circle" indeterminate />);
    const progress = screen.getByRole("progressbar");
    const arc = progress.querySelector("path:last-child");
    expect(arc).toHaveAttribute("stroke-dasharray", "30 100");
    expect(arc).toHaveAttribute("stroke-dashoffset", "-35");
    expect(progress.querySelector("style")?.textContent).toContain(
      "myoperator-v2-progress-sweep"
    );
  });

  it("updates semantics immediately and settles the visible value exactly", async () => {
    const { rerender } = render(<ProgressIndicator value={20} />);
    rerender(<ProgressIndicator value={60} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "60"
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "60%"
    );
    expect(fillPercent(barFill())).toBeLessThan(60);
    expect(
      Math.abs(
        fillPercent(barFill()) -
          Number(screen.getByText(/%/).textContent?.replace("%", ""))
      )
    ).toBeLessThanOrEqual(0.5);
    await waitFor(() => expect(fillPercent(barFill())).toBe(60), {
      timeout: 1200,
    });
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("stops an interrupted update from overwriting the latest measured target", async () => {
    const { rerender } = render(<ProgressIndicator value={20} />);
    rerender(<ProgressIndicator value={90} />);
    rerender(<ProgressIndicator value={35} />);
    await waitFor(() => expect(fillPercent(barFill())).toBe(35), {
      timeout: 1200,
    });
    expect(screen.getByText("35%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "35"
    );
  });

  it("shows the success fill and check after the measured fill reaches 100", async () => {
    const { rerender } = render(<ProgressIndicator value={80} />);
    rerender(<ProgressIndicator value={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    );
    expect(barFill()).not.toHaveAttribute("data-complete");
    expect(screen.getByRole("progressbar").querySelector("svg")).toBeNull();
    await waitFor(() => expect(barFill()).toHaveAttribute("data-complete"), {
      timeout: 1200,
    });
    expect(fillPercent(barFill())).toBe(100);
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(
      screen
        .getByRole("progressbar")
        .querySelector("svg")
        ?.closest("[aria-hidden=true]")
    ).not.toBeNull();
  });

  it("returns from unknown to measured progress without retaining a loading animation", () => {
    const { rerender } = render(<ProgressIndicator value={40} indeterminate />);
    rerender(<ProgressIndicator value={40} />);
    expect(barFill().style.width).toBe("");
    expect(fillPercent(barFill())).toBe(40);
    expect(screen.getByRole("progressbar").querySelector("style")).toBeNull();
    expect(screen.getByText("40%")).toBeInTheDocument();
  });
});

describe("motion preferences, visibility and cleanup", () => {
  it("jumps values immediately when reduced motion is already enabled", () => {
    reducedMotion = true;
    const { rerender } = render(<ProgressIndicator value={10} />);
    rerender(<ProgressIndicator value={80} />);
    expect(fillPercent(barFill())).toBe(80);
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(barFill()).toHaveStyle({ transition: "none" });
  });

  it("cancels an in-flight value animation on a live reduced-motion change", () => {
    const { rerender } = render(<ProgressIndicator value={10} />);
    rerender(<ProgressIndicator value={80} />);
    changeMotionPreference(true);
    expect(fillPercent(barFill())).toBe(80);
    rerender(<ProgressIndicator value={90} />);
    expect(fillPercent(barFill())).toBe(90);
  });

  it.each(shapes)(
    "pauses continuous loading in a hidden page for %s",
    (variant) => {
      render(<ProgressIndicator variant={variant} indeterminate />);
      vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
      act(() => document.dispatchEvent(new Event("visibilitychange")));
      const progress = screen.getByRole("progressbar");
      const fill =
        variant === "bar"
          ? barFill()
          : progress.querySelector(
              variant === "circle" ? "circle:last-child" : "path:last-child"
            );
      expect(fill).toHaveStyle({ animationPlayState: "paused" });
    }
  );

  it("pauses loading and jumps determinate updates offscreen, then disconnects its observer", () => {
    let callback: IntersectionObserverCallback;
    const disconnect = vi.fn();
    const observe = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(listener: IntersectionObserverCallback) {
          callback = listener;
        }
        observe = observe;
        disconnect = disconnect;
      }
    );
    const { rerender, unmount } = render(<ProgressIndicator indeterminate />);
    expect(observe).toHaveBeenCalledWith(screen.getByRole("progressbar"));
    act(() =>
      callback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    );
    expect(barFill()).toHaveStyle({ animationPlayState: "paused" });
    rerender(<ProgressIndicator value={65} />);
    expect(fillPercent(barFill())).toBe(65);
    rerender(<ProgressIndicator value={90} />);
    expect(fillPercent(barFill())).toBe(90);
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("unsubscribes from its media query when unmounted", () => {
    const { unmount } = render(<ProgressIndicator />);
    const listener = addMediaListener.mock.calls.find(
      ([event]) => event === "change"
    )?.[1];
    unmount();
    expect(removeMediaListener).toHaveBeenCalledWith("change", listener);
    expect(motionListeners.size).toBe(0);
  });
});

describe("Overview local sample task", () => {
  it("derives progress from checked contacts and supports pause, resume, completion and reset", async () => {
    reducedMotion = true;
    vi.useFakeTimers();
    renderTask();
    const progress = screen.getByRole("progressbar", {
      name: "Sample contact format check",
    });
    expect(screen.getByText(/Local demo/)).toBeInTheDocument();
    expect(progress).toHaveAttribute("aria-valuenow", "0");
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    await act(async () => vi.advanceTimersByTime(180));
    expect(progress).toHaveAttribute(
      "aria-valuetext",
      "1 of 24 sample contacts checked"
    );
    expect(updateArgs.mock.calls.at(-1)?.[0].value).toBeCloseTo(100 / 24);
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    await act(async () => vi.advanceTimersByTime(1000));
    expect(progress).toHaveAttribute(
      "aria-valuetext",
      "1 of 24 sample contacts checked"
    );
    expect(screen.getByRole("status")).toHaveTextContent("Check paused.");
    fireEvent.click(screen.getByRole("button", { name: "Resume" }));
    for (let index = 1; index < 24; index++) {
      await act(async () => vi.advanceTimersByTime(180));
    }
    expect(progress).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Check complete. 2 sample contacts need attention."
    );
    expect(screen.getByRole("button", { name: "Complete" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(progress).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByRole("button", { name: "Start" })).toBeEnabled();
    await act(async () => vi.advanceTimersByTime(1000));
    expect(progress).toHaveAttribute("aria-valuenow", "0");
  });

  it("provides native Enter/Space control without making the progressbar focusable", async () => {
    const user = userEvent.setup();
    renderTask();
    await user.tab();
    expect(screen.getByRole("button", { name: "Start" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Pause" })).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("button", { name: "Resume" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Reset" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("tabindex");
  });

  it("stops pending sample work on unmount", async () => {
    vi.useFakeTimers();
    const { unmount } = renderTask();
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    unmount();
    await act(async () => vi.advanceTimersByTime(1000));
    expect(updateArgs).not.toHaveBeenCalled();
  });
});

it("preserves cleanup-returning callback refs", () => {
  const calls: string[] = [];
  const ref = (node: HTMLDivElement | null) => {
    calls.push(node ? "attach" : "null");
    if (node)
      return () => {
        calls.push("cleanup");
      };
  };
  const { unmount } = render(<ProgressIndicator ref={ref} value={40} />);
  unmount();
  expect(calls).toEqual(["attach", "cleanup"]);
});
