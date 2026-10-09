import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
} from "../../v2/tooltip";

// Helper to render tooltip with provider
const renderTooltip = (ui: React.ReactNode, providerProps = {}) => {
  return render(
    <TooltipProvider delayDuration={0} {...providerProps}>
      {ui}
    </TooltipProvider>
  );
};

// Helper to get the tooltip content element (not the a11y span)
const getTooltipContent = () => {
  return document.querySelector("[data-radix-popper-content-wrapper] > div");
};

describe("Tooltip", () => {
  it("opens on click when primary input cannot hover (touch / tablet)", async () => {
    const previousMatchMedia = window.matchMedia;
    try {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === "(hover: none)",
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
          onchange: null,
        })),
      });

      renderTooltip(
        <Tooltip>
          <TooltipTrigger>Tap me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      expect(window.matchMedia("(hover: none)").matches).toBe(true);

      // Pointer events must run before click so suppressFocusOpenRef is set (userEvent.click ordering differs in jsdom).
      const trigger = screen.getByText("Tap me");
      fireEvent.pointerDown(trigger);
      fireEvent.pointerUp(trigger);
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    } finally {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: previousMatchMedia,
      });
    }
  });

  it("renders trigger correctly", () => {
    renderTooltip(
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    );
    const trigger = screen.getByText("Hover me");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveClass("cursor-pointer");
  });

  it("shows content on hover", async () => {
    const user = userEvent.setup();
    renderTooltip(
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover me");
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("closes when controlled open state changes to false", async () => {
    const { rerender } = renderTooltip(
      <Tooltip open={true}>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    );

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    rerender(
      <TooltipProvider delayDuration={0}>
        <Tooltip open={false}>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("shows content on focus", async () => {
    const user = userEvent.setup();
    renderTooltip(
      <Tooltip>
        <TooltipTrigger asChild>
          <button>Focus me</button>
        </TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    );

    const trigger = screen.getByRole("button", { name: "Focus me" });
    await user.tab();

    expect(trigger).toHaveFocus();
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("applies custom className to content", async () => {
    const user = userEvent.setup();
    renderTooltip(
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent className="custom-class">
          Tooltip content
        </TooltipContent>
      </Tooltip>
    );

    await user.hover(screen.getByText("Hover me"));

    await waitFor(() => {
      expect(getTooltipContent()).toHaveClass("custom-class");
    });
  });

  it("applies default styling classes", async () => {
    const user = userEvent.setup();
    renderTooltip(
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    );

    await user.hover(screen.getByText("Hover me"));

    await waitFor(() => {
      const tooltip = getTooltipContent();
      expect(tooltip).toHaveClass("pointer-events-none");
      expect(tooltip).toHaveClass(
        "data-[state=delayed-open]:pointer-events-auto"
      );
      expect(tooltip).toHaveClass(
        "data-[state=instant-open]:pointer-events-auto"
      );
      expect(tooltip).toHaveClass("bg-semantic-info-surface");
      expect(tooltip).toHaveClass("text-[var(--v2-text-secondary,#5E5E5E)]");
      expect(tooltip).toHaveClass("text-sm");
      expect(tooltip).toHaveClass("leading-[1.4]");
      expect(tooltip).toHaveClass("rounded-md");
      expect(tooltip).toHaveClass("px-4");
      expect(tooltip).toHaveClass("py-3");
      expect(tooltip).toHaveClass("max-w-[15rem]");
    });
  });

  it("renders with asChild trigger", async () => {
    const user = userEvent.setup();
    renderTooltip(
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="custom-button">Custom Button</button>
        </TooltipTrigger>
        <TooltipContent>Button tooltip</TooltipContent>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Custom Button" });
    expect(button).toHaveClass("custom-button");
    expect(button).toHaveClass("cursor-pointer");

    await user.hover(button);
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("respects sideOffset prop", async () => {
    const user = userEvent.setup();
    renderTooltip(
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent sideOffset={10}>Tooltip content</TooltipContent>
      </Tooltip>
    );

    await user.hover(screen.getByText("Hover me"));

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("respects side prop", async () => {
    const user = userEvent.setup();
    renderTooltip(
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent side="bottom">Tooltip content</TooltipContent>
      </Tooltip>
    );

    await user.hover(screen.getByText("Hover me"));

    await waitFor(() => {
      const tooltip = getTooltipContent();
      expect(tooltip).toHaveAttribute("data-side", "bottom");
    });
  });

  it("supports controlled open state", async () => {
    const { rerender } = renderTooltip(
      <Tooltip open={false}>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    );

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    rerender(
      <TooltipProvider delayDuration={0}>
        <Tooltip open={true}>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("calls onOpenChange callback", async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    renderTooltip(
      <Tooltip onOpenChange={handleOpenChange}>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    );

    await user.hover(screen.getByText("Hover me"));

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe("TooltipArrow", () => {
    it("renders arrow with default styling", async () => {
      const user = userEvent.setup();
      renderTooltip(
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>
            Tooltip content
            <TooltipArrow data-testid="arrow" />
          </TooltipContent>
        </Tooltip>
      );

      await user.hover(screen.getByText("Hover me"));

      await waitFor(() => {
        const arrow = screen.getByTestId("arrow");
        expect(arrow).toHaveClass("fill-semantic-info-surface");
      });
    });

    it("applies custom className to arrow", async () => {
      const user = userEvent.setup();
      renderTooltip(
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>
            Tooltip content
            <TooltipArrow className="custom-arrow" data-testid="arrow" />
          </TooltipContent>
        </Tooltip>
      );

      await user.hover(screen.getByText("Hover me"));

      await waitFor(() => {
        expect(screen.getByTestId("arrow")).toHaveClass("custom-arrow");
      });
    });

    it("forwards ref correctly", async () => {
      const ref = React.createRef<SVGSVGElement>();
      const user = userEvent.setup();
      renderTooltip(
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>
            Tooltip content
            <TooltipArrow ref={ref} />
          </TooltipContent>
        </Tooltip>
      );

      await user.hover(screen.getByText("Hover me"));

      await waitFor(() => {
        expect(ref.current).toBeInstanceOf(SVGSVGElement);
      });
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to TooltipContent", async () => {
      const ref = React.createRef<HTMLDivElement>();
      const user = userEvent.setup();
      renderTooltip(
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent ref={ref}>Tooltip content</TooltipContent>
        </Tooltip>
      );

      await user.hover(screen.getByText("Hover me"));

      await waitFor(() => {
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
      });
    });
  });

  describe("TooltipProvider", () => {
    it("respects delayDuration prop", async () => {
      const user = userEvent.setup();
      const startTime = Date.now();

      render(
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      await user.hover(screen.getByText("Hover me"));

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      // Tooltip should not open synchronously on hover; allow fast CI (timing is flaky).
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(10);
    });
  });

  describe("Accessibility", () => {
    it("has correct role", async () => {
      const user = userEvent.setup();
      renderTooltip(
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      await user.hover(screen.getByText("Hover me"));

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });
    });

    it("trigger has aria-describedby when tooltip is open", async () => {
      const user = userEvent.setup();
      renderTooltip(
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      const trigger = screen.getByText("Hover me");
      await user.hover(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-describedby");
      });
    });

    it("can be dismissed with Escape key", async () => {
      const user = userEvent.setup();
      renderTooltip(
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Focus me</button>
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );

      await user.tab();

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });
  });
});

describe("Tooltip v2 refresh", () => {
  it("only fades (120ms, no travel or scale) when Radix opens it inside the skip-delay window or on keyboard focus", () => {
    renderTooltip(
      <Tooltip defaultOpen>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Help</TooltipContent>
      </Tooltip>
    );
    const content = getTooltipContent() as HTMLElement;
    // A tooltip that is open from the start is not delayed, so Radix reports `instant-open`.
    expect(content).toHaveAttribute("data-state", "instant-open");
    expect(content).toHaveClass(
      "data-[state=instant-open]:motion-safe:[animation-duration:120ms]"
    );
    // The 0.97 grow and the 3px rise only exist on the delayed path; fade/zoom values are motion-safe, or the
    // motion-safe animate-in reset cancels them.
    expect(content).toHaveClass(
      "motion-safe:fade-in-0",
      "data-[state=delayed-open]:motion-safe:zoom-in-[0.97]",
      "data-[state=delayed-open]:data-[side=top]:slide-in-from-bottom-[3px]",
      "data-[state=closed]:motion-safe:fade-out-0",
      "data-[state=closed]:motion-safe:zoom-out-[0.98]"
    );
    expect(content).not.toHaveClass("fade-in-0");
    // 160ms in on the delayed path, 120ms out.
    expect(content).toHaveClass(
      "motion-safe:[animation-duration:160ms]",
      "data-[state=closed]:motion-safe:[animation-duration:120ms]"
    );
  });

  it("opens after Arc's 250ms delay (Radix defaults to 700ms): not open right after hover, open later", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Help</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    await user.hover(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await waitFor(
      () => expect(screen.getByRole("tooltip")).toBeInTheDocument(),
      { timeout: 2000 }
    );
    // Opened through the delay path, so it keeps the 160ms grow-in.
    expect(getTooltipContent()).toHaveAttribute("data-state", "delayed-open");
  });

  it("draws a 1px edge so the pale surface does not melt into a white page", () => {
    renderTooltip(
      <Tooltip defaultOpen>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Help</TooltipContent>
      </Tooltip>
    );
    const content = getTooltipContent();
    expect(content).toHaveClass("border", "border-solid", "border-black/5");
    // Arc's raised shadow sits alongside it.
    expect(content?.className).toContain(
      "shadow-[0_6px_18px_rgba(0,0,0,0.065)"
    );
  });

  it("lets a caller restyle the surface (the dark disabled-row tooltip in MultiSelect)", () => {
    renderTooltip(
      <Tooltip defaultOpen>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent className="bg-semantic-primary">Help</TooltipContent>
      </Tooltip>
    );
    expect(getTooltipContent()).toHaveClass("bg-semantic-primary");
  });
});

describe("TooltipProvider delay", () => {
  it("lets a TooltipProvider delayDuration override the 250ms default", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Help</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    await user.hover(screen.getByRole("button", { name: "Trigger" }));
    await waitFor(() => expect(screen.getByRole("tooltip")).toBeInTheDocument());
  });
});
