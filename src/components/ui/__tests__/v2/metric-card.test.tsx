import * as React from "react";
import { renderToString } from "react-dom/server";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MetricCard,
  metricCardVariants,
  type MetricCardProps,
} from "../../v2/metric-card";
import metricCardMeta, { Overview } from "../../v2/metric-card.stories";
import { assertNoBootstrapMarginBleed } from "../utils/bootstrap-compat";

const originalAnimate = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "animate"
);
let reducedMotion: boolean;
let mediaListeners: Set<() => void>;
type MockAnimation = { cancel: Mock<[], void> };
let animations: MockAnimation[];
let animate: Mock<[Keyframe[], KeyframeAnimationOptions], MockAnimation>;

function changeReducedMotion(next: boolean) {
  act(() => {
    reducedMotion = next;
    mediaListeners.forEach((listener) => listener());
  });
}

beforeEach(() => {
  reducedMotion = false;
  mediaListeners = new Set();
  animations = [];
  const media = {
    get matches() {
      return reducedMotion;
    },
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: vi.fn((event: string, listener: () => void) => {
      if (event === "change") mediaListeners.add(listener);
    }),
    removeEventListener: vi.fn((event: string, listener: () => void) => {
      if (event === "change") mediaListeners.delete(listener);
    }),
  } as unknown as MediaQueryList;
  vi.spyOn(window, "matchMedia").mockReturnValue(media);
  animate = vi.fn<[Keyframe[], KeyframeAnimationOptions], MockAnimation>(() => {
    const animation: MockAnimation = { cancel: vi.fn<[], void>() };
    animations.push(animation);
    return animation;
  });
  Object.defineProperty(HTMLElement.prototype, "animate", {
    configurable: true,
    value: animate,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  if (originalAnimate) {
    Object.defineProperty(HTMLElement.prototype, "animate", originalAnimate);
  } else {
    delete (HTMLElement.prototype as { animate?: unknown }).animate;
  }
});

describe("MetricCard content and accessible composition", () => {
  it("names a static group and renders its value, unit, and context", () => {
    render(
      <MetricCard
        label="Answer rate"
        value={94.2}
        suffix="%"
        comparison="Compared with the previous 7 days"
      />
    );
    const card = screen.getByRole("group", { name: "Answer rate" });
    expect(card).toHaveTextContent("94.2%");
    expect(card).toHaveTextContent("Compared with the previous 7 days");
    expect(card).not.toHaveAttribute("tabindex");
    expect(card).not.toHaveAttribute("aria-live");
  });

  it("preserves formatted strings and zero values without inventing formatting", () => {
    const { rerender } = render(
      <MetricCard label="Revenue" value="₹24,500.00" />
    );
    expect(screen.getByText("₹24,500.00")).toBeInTheDocument();
    rerender(<MetricCard label="Missed calls" value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("gives every instance its own accessible label", () => {
    render(
      <>
        <MetricCard label="Calls" value={1286} />
        <MetricCard label="Missed calls" value={74} />
      </>
    );
    const calls = screen.getByRole("group", { name: "Calls" });
    const missed = screen.getByRole("group", { name: "Missed calls" });
    expect(calls.getAttribute("aria-labelledby")).not.toBe(
      missed.getAttribute("aria-labelledby")
    );
  });

  it("respects the caller's accessible name and opt-in live region", () => {
    const { rerender } = render(
      <MetricCard
        label="Calls"
        value={1286}
        aria-label="Current inbound calls"
        aria-live="polite"
      />
    );
    const card = screen.getByRole("group", { name: "Current inbound calls" });
    expect(card).toHaveAttribute("aria-live", "polite");
    expect(card).not.toHaveAttribute("aria-labelledby");
    rerender(
      <>
        <h2 id="external-label">Contact center calls</h2>
        <MetricCard
          label="Calls"
          value={1286}
          aria-labelledby="external-label"
        />
      </>
    );
    expect(
      screen.getByRole("group", { name: "Contact center calls" })
    ).toHaveAttribute("aria-labelledby", "external-label");
  });

  it("includes readable direction while allowing a positive decrease", () => {
    const { container } = render(
      <MetricCard
        label="Missed calls"
        value={74}
        trend={{ change: "18.7%", direction: "down", tone: "positive" }}
      />
    );
    const trend = container.querySelector('[data-slot="metric-card-trend"]');
    expect(trend).toHaveTextContent("Decreased by 18.7%");
    expect(trend).toHaveAttribute("data-tone", "positive");
    expect(trend?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(trend).toHaveClass("text-semantic-success-text");
  });

  it.each([
    ["up", "Increased by", "negative", "text-semantic-error-text"],
    ["flat", "No change:", "neutral", "bg-semantic-bg-ui"],
  ] as const)(
    "makes %s direction readable and preserves the supplied tone",
    (direction, phrase, tone, colorClass) => {
      const { container } = render(
        <MetricCard
          label="Calls"
          value={1286}
          trend={{ change: "4%", direction, tone }}
        />
      );
      const trend = container.querySelector('[data-slot="metric-card-trend"]');
      expect(trend).toHaveTextContent(phrase + " 4%");
      expect(trend).toHaveClass(colorClass);
    }
  );

  it("does not infer whether an unspecified direction is good or bad", () => {
    const { container } = render(
      <MetricCard label="Calls" value={1286} trend={{ change: "+12.4%" }} />
    );
    const trend = container.querySelector('[data-slot="metric-card-trend"]');
    expect(trend).toHaveAttribute("data-tone", "neutral");
    expect(trend).not.toHaveAttribute("data-direction");
    expect(trend?.querySelector("svg")).toBeNull();
  });

  it("keeps graphic semantics and footer buttons usable by keyboard", async () => {
    const onDetails = vi.fn();
    const user = userEvent.setup();
    render(
      <MetricCard
        label="Calls"
        value={1286}
        graphic={<svg role="img" aria-label="Call volume over seven days" />}
      >
        <button type="button" onClick={onDetails}>
          View breakdown
        </button>
      </MetricCard>
    );
    expect(
      screen.getByRole("img", { name: "Call volume over seven days" })
    ).toBeInTheDocument();
    await user.tab();
    expect(
      screen.getByRole("button", { name: "View breakdown" })
    ).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onDetails).toHaveBeenCalledOnce();
  });

  it("omits absent slots and preserves a zero-valued child", () => {
    const { container, rerender } = render(
      <MetricCard label="Calls" value={1286} />
    );
    expect(
      container.querySelector('[data-slot="metric-card-trend"]')
    ).toBeNull();
    expect(
      container.querySelector('[data-slot="metric-card-comparison"]')
    ).toBeNull();
    expect(
      container.querySelector('[data-slot="metric-card-graphic"]')
    ).toBeNull();
    expect(
      container.querySelector('[data-slot="metric-card-footer"]')
    ).toBeNull();
    rerender(
      <MetricCard label="Calls" value={1286}>
        {0}
      </MetricCard>
    );
    expect(
      container.querySelector('[data-slot="metric-card-footer"]')
    ).toHaveTextContent("0");
  });

  it("forwards refs, native attributes, styles, and events to the plain div", () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <MetricCard
        ref={ref}
        label="Calls"
        value={1286}
        id="calls-card"
        title="Inbound calls"
        data-testid="metric"
        dir="rtl"
        className="custom-metric p-8"
        style={{ maxWidth: 300 }}
        onClick={onClick}
        onKeyDown={onKeyDown}
      />
    );
    const card = screen.getByTestId("metric");
    expect(ref.current).toBe(card);
    expect(card.tagName).toBe("DIV");
    expect(card).toHaveAttribute("id", "calls-card");
    expect(card).toHaveAttribute("title", "Inbound calls");
    expect(card).toHaveAttribute("dir", "rtl");
    expect(card).toHaveClass("custom-metric", "p-8");
    expect(card).not.toHaveClass("p-5");
    expect(card).toHaveStyle({ maxWidth: "300px" });
    fireEvent.click(card);
    fireEvent.keyDown(card, { key: "Escape" });
    expect(onClick).toHaveBeenCalledOnce();
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it.each([
    ["default", "bg-semantic-bg-primary"],
    ["subtle", "bg-semantic-bg-ui"],
  ] as const)(
    "supports the %s surface without hover movement",
    (variant, bg) => {
      render(<MetricCard label="Calls" value={1286} variant={variant} />);
      const card = screen.getByRole("group", { name: "Calls" });
      expect(card).toHaveClass(bg);
      expect(card.className).not.toMatch(/hover:|translate|scale/);
    }
  );

  it.each([
    ["sm", "p-4", "text-2xl"],
    ["default", "p-5", "text-3xl"],
    ["lg", "p-6", "text-4xl"],
  ] as const)(
    "keeps %s spacing and value scale consistent",
    (size, pad, text) => {
      const { container } = render(
        <MetricCard label="Calls" value={1286} size={size} />
      );
      expect(screen.getByRole("group", { name: "Calls" })).toHaveClass(pad);
      expect(
        container.querySelector('[data-slot="metric-card-value"]')
      ).toHaveClass(text);
    }
  );

  it("exports the default CVA surface and resets Bootstrap paragraph margins", () => {
    expect(metricCardVariants()).toContain("bg-semantic-bg-primary");
    const { container } = render(
      <MetricCard label="Calls" value={1286} comparison="Previous 7 days" />
    );
    assertNoBootstrapMarginBleed(container);
  });

  it("renders the actual value during server rendering without animation", () => {
    const markup = renderToString(
      <MetricCard label="Answer rate" value={94.2} suffix="%" />
    );
    expect(markup).toContain("94.2%");
    expect(markup).toContain('role="group"');
    expect(animate).not.toHaveBeenCalled();
  });
});

describe("MetricCard value-update motion", () => {
  it("does not animate mount or an unchanged value", () => {
    const { rerender } = render(<MetricCard label="Calls" value={1286} />);
    expect(animate).not.toHaveBeenCalled();
    rerender(<MetricCard label="New label" value={1286} />);
    expect(animate).not.toHaveBeenCalled();
  });

  it("animates only changed values for a finite interval, with one readable copy", () => {
    const { rerender } = render(<MetricCard label="Calls" value={1286} />);
    rerender(<MetricCard label="Calls" value={1298} />);
    expect(screen.getAllByText("1298")).toHaveLength(1);
    expect(screen.queryByText("1286")).not.toBeInTheDocument();
    expect(animate).toHaveBeenCalledOnce();
    expect(animate).toHaveBeenCalledWith(
      [
        { opacity: 0.5, transform: "translateY(3px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 180, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
  });

  it("settles numeric decreases from above", () => {
    const { rerender } = render(<MetricCard label="Missed calls" value={74} />);
    rerender(<MetricCard label="Missed calls" value={70} />);
    expect(animate.mock.calls[0][0][0].transform).toBe("translateY(-3px)");
  });

  it("cancels an interrupted update and cleans up on unmount", () => {
    const { rerender, unmount } = render(
      <MetricCard label="Calls" value={1286} />
    );
    rerender(<MetricCard label="Calls" value={1298} />);
    rerender(<MetricCard label="Calls" value={1311} />);
    expect(animations[0].cancel).toHaveBeenCalledOnce();
    expect(animate).toHaveBeenCalledTimes(2);
    unmount();
    expect(animations[1].cancel).toHaveBeenCalledOnce();
    expect(mediaListeners.size).toBe(0);
  });

  it("does not cancel an update for unrelated native-attribute changes", () => {
    const { rerender } = render(<MetricCard label="Calls" value={1286} />);
    rerender(<MetricCard label="Calls" value={1298} />);
    rerender(<MetricCard label="Calls" value={1298} title="Latest sample" />);
    expect(animate).toHaveBeenCalledOnce();
    expect(animations[0].cancel).not.toHaveBeenCalled();
  });

  it("respects reduced motion from mount", () => {
    reducedMotion = true;
    const { rerender } = render(<MetricCard label="Calls" value={1286} />);
    rerender(<MetricCard label="Calls" value={1298} />);
    expect(screen.getByText("1298")).toBeInTheDocument();
    expect(animate).not.toHaveBeenCalled();
  });

  it("immediately cancels when reduced motion changes live, and resumes for new updates", () => {
    const { rerender } = render(<MetricCard label="Calls" value={1286} />);
    rerender(<MetricCard label="Calls" value={1298} />);
    changeReducedMotion(true);
    expect(animations[0].cancel).toHaveBeenCalledOnce();
    rerender(<MetricCard label="Calls" value={1311} />);
    expect(animate).toHaveBeenCalledOnce();
    changeReducedMotion(false);
    expect(animate).toHaveBeenCalledOnce();
    rerender(<MetricCard label="Calls" value={1324} />);
    expect(animate).toHaveBeenCalledTimes(2);
  });

  it("supports explicit still updates and cancels if animation is disabled live", () => {
    const { rerender } = render(<MetricCard label="Calls" value={1286} />);
    rerender(<MetricCard label="Calls" value={1298} />);
    rerender(<MetricCard label="Calls" value={1298} animateValue={false} />);
    expect(animations[0].cancel).toHaveBeenCalledOnce();
    rerender(<MetricCard label="Calls" value={1311} animateValue={false} />);
    expect(animate).toHaveBeenCalledOnce();
  });

  it("falls back to an immediate readable update without Web Animations", () => {
    delete (HTMLElement.prototype as { animate?: unknown }).animate;
    const { rerender } = render(<MetricCard label="Calls" value={1286} />);
    rerender(<MetricCard label="Calls" value={1298} />);
    expect(screen.getByText("1298")).toBeInTheDocument();
  });
});

describe("MetricCard's local sample hero", () => {
  function renderHero(args: Partial<MetricCardProps> = {}) {
    if (!Overview.render) throw new Error("Overview must provide its hero");
    // This render does not use Storybook context; the preview supplies the same args.
    return render(
      Overview.render(
        { ...metricCardMeta.args, ...args } as MetricCardProps,
        {} as never
      )
    );
  }

  it("updates useful local metrics with period and sample controls", async () => {
    const user = userEvent.setup();
    renderHero();
    expect(screen.getByText(/Local sample data/)).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Inbound calls" })
    ).toHaveTextContent("1286");
    await user.click(screen.getByRole("button", { name: "30 days" }));
    expect(screen.getByRole("button", { name: "30 days" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(
      screen.getByRole("group", { name: "Inbound calls" })
    ).toHaveTextContent("5337");
    expect(
      screen.getByRole("group", { name: "Answer rate" })
    ).toHaveTextContent("93.7%");
    expect(
      screen.getByRole("group", { name: "Missed calls" })
    ).toHaveTextContent("336");
    await user.click(screen.getByRole("button", { name: "Update sample" }));
    expect(
      screen.getByRole("group", { name: "Inbound calls" })
    ).toHaveTextContent("5349");
    expect(
      screen.getByRole("group", { name: "Answer rate" })
    ).toHaveTextContent("93.8%");
    expect(
      screen.getByRole("group", { name: "Missed calls" })
    ).toHaveTextContent("332");
  });

  it("supports period selection with Tab, Enter, and Space", async () => {
    const user = userEvent.setup();
    renderHero();
    await user.tab();
    expect(screen.getByRole("button", { name: "7 days" })).toHaveFocus();
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "30 days" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByRole("button", { name: "90 days" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(
      screen.getByRole("group", { name: "Inbound calls" })
    ).toHaveTextContent("15946");
  });

  it("keeps a zero-valued seed finite and internally consistent", () => {
    renderHero({ value: 0 });
    expect(
      screen.getByRole("group", { name: "Inbound calls" })
    ).toHaveTextContent("0");
    expect(
      screen.getByRole("group", { name: "Answer rate" })
    ).toHaveTextContent("0.0%");
    expect(
      screen.getByRole("group", { name: "Missed calls" })
    ).toHaveTextContent("0");
    expect(document.body).not.toHaveTextContent(/NaN|Infinity/);
  });

  it("keeps all three sample updates still when animation is disabled", async () => {
    const user = userEvent.setup();
    renderHero({ animateValue: false });
    await user.click(screen.getByRole("button", { name: "Update sample" }));
    expect(
      screen.getByRole("group", { name: "Inbound calls" })
    ).toHaveTextContent("1298");
    expect(animate).not.toHaveBeenCalled();
  });
});
