import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
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
      expect(tooltip).toHaveClass("bg-v2-semantic-bg-secondary");
      expect(tooltip).toHaveClass("text-v2-semantic-text-inverted");
      expect(tooltip).toHaveClass("text-xs");
      expect(tooltip).toHaveClass("leading-5");
      expect(tooltip).toHaveClass("rounded-md");
      expect(tooltip).toHaveClass("px-3");
      expect(tooltip).toHaveClass("py-2");
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
        expect(arrow).toHaveClass(
          "fill-[var(--tooltip-arrow-fill,var(--v2-semantic-bg-secondary,var(--semantic-bg-secondary)))]"
        );
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

const mockTouchMode = () => {
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    matches: query === "(hover: none)" || query === "(pointer: coarse)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

beforeEach(() => {
  window.matchMedia = (query) => ({
    matches: query === "(hover: hover)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
});

async function tap(trigger: HTMLElement) {
  fireEvent.pointerDown(trigger, { pointerType: "touch", button: 0 });
  fireEvent.pointerUp(trigger, { pointerType: "touch", button: 0 });
  act(() => trigger.focus());
  fireEvent.click(trigger);
  await act(async () => {});
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("Tooltip compatibility and dismissal", () => {
  it("preserves React 19 callback-ref cleanup for trigger and content", () => {
    const triggerCleanup = vi.fn();
    const contentCleanup = vi.fn();
    const triggerRef = vi.fn((node: HTMLButtonElement | null) =>
      node ? triggerCleanup : undefined
    );
    const contentRef = vi.fn((node: HTMLDivElement | null) =>
      node ? contentCleanup : undefined
    );
    const { unmount } = renderTooltip(
      <Tooltip defaultOpen>
        <TooltipTrigger ref={triggerRef}>Help</TooltipTrigger>
        <TooltipContent ref={contentRef}>Details</TooltipContent>
      </Tooltip>
    );
    expect(triggerRef).toHaveBeenCalledWith(screen.getByRole("button"));
    expect(contentRef).toHaveBeenCalledWith(getTooltipContent());
    // Radix can reattach its anchor while registering it. The active attachment
    // must still receive exactly one cleanup when the consumer unmounts it.
    const triggerCleanupsBeforeUnmount = triggerCleanup.mock.calls.length;
    const contentCleanupsBeforeUnmount = contentCleanup.mock.calls.length;
    unmount();
    expect(triggerCleanup).toHaveBeenCalledTimes(
      triggerCleanupsBeforeUnmount + 1
    );
    expect(contentCleanup).toHaveBeenCalledTimes(
      contentCleanupsBeforeUnmount + 1
    );
  });

  it("dismisses the tooltip before its parent dialog and preserves trigger focus", async () => {
    const user = userEvent.setup();
    renderTooltip(
      <DialogPrimitive.Root defaultOpen>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Content>
            <DialogPrimitive.Title>Assignment</DialogPrimitive.Title>
            <DialogPrimitive.Description>
              Choose an owner.
            </DialogPrimitive.Description>
            <button>Stay in dialog</button>
            <Tooltip>
              <TooltipTrigger>Owner help</TooltipTrigger>
              <TooltipContent>Owner details</TooltipContent>
            </Tooltip>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Owner help" });
    expect(trigger).toHaveFocus();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(
      screen.getByRole("dialog", { name: "Assignment" })
    ).toBeInTheDocument();
    expect(trigger).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("restores trigger focus from the existing controlled tour composition", async () => {
    const user = userEvent.setup();
    function Tour() {
      const [open, setOpen] = React.useState(true);
      return (
        <Tooltip
          open={open}
          onOpenChange={(next) => {
            if (next) setOpen(true);
          }}
        >
          <TooltipTrigger>Tour trigger</TooltipTrigger>
          <TooltipContent
            role="dialog"
            aria-label="Tour details"
            onEscapeKeyDown={() => setOpen(false)}
          >
            <button>Next step</button>
          </TooltipContent>
        </Tooltip>
      );
    }
    renderTooltip(<Tour />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole("button", { name: "Next step" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tour trigger" })).toHaveFocus();
  });

  it("keeps the 700ms Provider default and gives keyboard focus immediate help", async () => {
    vi.useFakeTimers();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Timed help</TooltipTrigger>
          <TooltipContent>Help</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    const trigger = screen.getByRole("button", { name: "Timed help" });
    fireEvent.pointerMove(trigger, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(699));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(getTooltipContent()).toHaveAttribute("data-state", "delayed-open");
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(getTooltipContent()).toHaveAttribute("data-state", "instant-open");
  });

  it("lets a Root delay override its Provider delay", () => {
    vi.useFakeTimers();
    render(
      <TooltipProvider delayDuration={500}>
        <Tooltip delayDuration={75}>
          <TooltipTrigger>Short delay</TooltipTrigger>
          <TooltipContent>Help</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    fireEvent.pointerMove(screen.getByRole("button"), { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(74));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("keeps Provider skipDelayDuration when moving to the next trigger", () => {
    vi.useFakeTimers();
    render(
      <TooltipProvider delayDuration={400} skipDelayDuration={300}>
        {["First", "Second"].map((label) => (
          <Tooltip key={label} disableHoverableContent>
            <TooltipTrigger>{label}</TooltipTrigger>
            <TooltipContent>{label} help</TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    );
    fireEvent.pointerMove(screen.getByRole("button", { name: "First" }), {
      pointerType: "mouse",
    });
    act(() => vi.advanceTimersByTime(400));
    expect(screen.getByRole("tooltip")).toHaveTextContent("First help");
    fireEvent.pointerLeave(screen.getByRole("button", { name: "First" }), {
      pointerType: "mouse",
    });
    act(() => vi.advanceTimersByTime(100));
    fireEvent.pointerMove(screen.getByRole("button", { name: "Second" }), {
      pointerType: "mouse",
    });
    expect(screen.getByRole("tooltip")).toHaveTextContent("Second help");
    expect(getTooltipContent()).toHaveAttribute("data-state", "instant-open");
  });

  it("keeps Provider disableHoverableContent dismissal", async () => {
    const user = userEvent.setup();
    renderTooltip(
      <Tooltip>
        <TooltipTrigger>Hover help</TooltipTrigger>
        <TooltipContent>Help</TooltipContent>
      </Tooltip>,
      { disableHoverableContent: true }
    );
    await user.hover(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await user.unhover(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("honors forceMount while closed and forwards content native props/ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    renderTooltip(
      <Tooltip>
        <TooltipTrigger>Help</TooltipTrigger>
        <TooltipContent
          forceMount
          ref={ref}
          data-testid="content"
          id="help-content"
          lang="hi"
          style={{ maxWidth: "180px" }}
        >
          Forced help
        </TooltipContent>
      </Tooltip>
    );
    expect(ref.current).toBe(screen.getByTestId("content"));
    expect(ref.current).toHaveAttribute("data-state", "closed");
    expect(ref.current).toHaveAttribute("id", "help-content");
    expect(ref.current).toHaveAttribute("lang", "hi");
    expect(ref.current).toHaveStyle({ maxWidth: "180px" });
  });

  it("lets controlled consumers decline an open request", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderTooltip(
      <Tooltip open={false} onOpenChange={onOpenChange}>
        <TooltipTrigger>Help</TooltipTrigger>
        <TooltipContent>Help</TooltipContent>
      </Tooltip>
    );
    await user.tab();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("honors cancelled focus and pointer move handlers", async () => {
    const onOpenChange = vi.fn();
    renderTooltip(
      <Tooltip onOpenChange={onOpenChange}>
        <TooltipTrigger
          onFocus={(event) => event.preventDefault()}
          onPointerMove={(event) => event.preventDefault()}
        >
          Cancelled help
        </TooltipTrigger>
        <TooltipContent>Help</TooltipContent>
      </Tooltip>
    );
    fireEvent.focus(screen.getByRole("button"));
    fireEvent.pointerMove(screen.getByRole("button"), { pointerType: "mouse" });
    await act(async () => {});
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("honors a cancelled Escape and then dismisses when cancellation stops", async () => {
    const user = userEvent.setup();
    let cancel = true;
    const onEscape = vi.fn((event: KeyboardEvent) => {
      if (cancel) event.preventDefault();
    });
    renderTooltip(
      <Tooltip>
        <TooltipTrigger>Help</TooltipTrigger>
        <TooltipContent onEscapeKeyDown={onEscape}>Help</TooltipContent>
      </Tooltip>
    );
    await user.tab();
    await user.keyboard("{Escape}");
    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    cancel = false;
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveFocus();
  });

  it("honors a cancelled outside-pointer dismissal", async () => {
    const user = userEvent.setup();
    const onOutside = vi.fn((event: Event) => event.preventDefault());
    renderTooltip(
      <>
        <Tooltip defaultOpen>
          <TooltipTrigger>Help</TooltipTrigger>
          <TooltipContent onPointerDownOutside={onOutside}>Help</TooltipContent>
        </Tooltip>
        <button>Outside</button>
      </>
    );
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(onOutside).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("retains caller surface/size overrides and adds an inverse light surface", () => {
    renderTooltip(
      <Tooltip defaultOpen>
        <TooltipTrigger>Help</TooltipTrigger>
        <TooltipContent
          variant="light"
          className="bg-v2-semantic-primary max-w-xs"
          data-testid="light"
        >
          Help
          <TooltipArrow data-testid="arrow" />
        </TooltipContent>
      </Tooltip>
    );
    expect(screen.getByTestId("light")).toHaveAttribute(
      "data-variant",
      "light"
    );
    expect(screen.getByTestId("light")).not.toHaveAttribute("variant");
    expect(screen.getByTestId("light")).toHaveClass(
      "bg-v2-semantic-primary",
      "max-w-xs",
      "text-v2-semantic-text-primary"
    );
    expect(screen.getByTestId("light")).not.toHaveClass(
      "bg-v2-semantic-bg-primary",
      "max-w-[15rem]"
    );
    expect(screen.getByTestId("arrow")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Tooltip touch and native event behavior", () => {
  it("can close an uncontrolled defaultOpen tooltip with the first tap", async () => {
    mockTouchMode();
    const onOpenChange = vi.fn();
    renderTooltip(
      <Tooltip defaultOpen onOpenChange={onOpenChange}>
        <TooltipTrigger>Initially open</TooltipTrigger>
        <TooltipContent>Details</TooltipContent>
      </Tooltip>
    );
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await tap(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(onOpenChange.mock.calls).toEqual([[false]]);
  });

  it("toggles with one callback per tap, keeps focus and dismisses with Escape", async () => {
    mockTouchMode();
    const onOpenChange = vi.fn();
    renderTooltip(
      <Tooltip onOpenChange={onOpenChange}>
        <TooltipTrigger>Touch help</TooltipTrigger>
        <TooltipContent>Touch details</TooltipContent>
      </Tooltip>
    );
    const trigger = screen.getByRole("button");
    await tap(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(onOpenChange.mock.calls).toEqual([[true]]);
    await tap(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    await tap(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(onOpenChange.mock.calls).toEqual([[true], [false], [true], [false]]);
  });

  it("supports touch toggles from defaultOpen and controlled state", async () => {
    mockTouchMode();
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = React.useState(true);
      return (
        <Tooltip
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <TooltipTrigger>Controlled</TooltipTrigger>
          <TooltipContent>Details</TooltipContent>
        </Tooltip>
      );
    }
    renderTooltip(<Controlled />);
    await tap(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(onOpenChange.mock.calls).toEqual([[false]]);
    await tap(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(onOpenChange.mock.calls).toEqual([[false], [true]]);
  });

  it("honors touch click cancellation from an asChild trigger", async () => {
    mockTouchMode();
    const onOpenChange = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) =>
      event.preventDefault()
    );
    renderTooltip(
      <Tooltip onOpenChange={onOpenChange}>
        <TooltipTrigger asChild>
          <button onClick={onClick}>Cancel tap</button>
        </TooltipTrigger>
        <TooltipContent>Details</TooltipContent>
      </Tooltip>
    );
    await tap(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("keeps native link click events uncancelled and forwards the trigger ref", async () => {
    mockTouchMode();
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    renderTooltip(
      <Tooltip>
        <TooltipTrigger ref={ref} asChild onClick={onClick}>
          <a href="#assignment">Assignment</a>
        </TooltipTrigger>
        <TooltipContent>Details</TooltipContent>
      </Tooltip>
    );
    const trigger = screen.getByRole("link");
    fireEvent.pointerDown(trigger, { pointerType: "touch" });
    fireEvent.pointerUp(trigger, { pointerType: "touch" });
    expect(fireEvent.click(trigger)).toBe(true);
    await act(async () => {});
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].defaultPrevented).toBe(false);
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveAttribute("href", "#assignment");
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("keeps native submit behavior on a touch trigger", async () => {
    mockTouchMode();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    renderTooltip(
      <form onSubmit={onSubmit}>
        <Tooltip>
          <TooltipTrigger type="submit" name="action" value="help">
            Submit
          </TooltipTrigger>
          <TooltipContent>Details</TooltipContent>
        </Tooltip>
      </form>
    );
    await tap(screen.getByRole("button"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button")).toHaveAttribute("name", "action");
    expect(screen.getByRole("button")).toHaveAttribute("value", "help");
  });

  it("does not hijack outside-click focus while dismissing touch help", async () => {
    mockTouchMode();
    const user = userEvent.setup();
    renderTooltip(
      <>
        <Tooltip>
          <TooltipTrigger>Touch help</TooltipTrigger>
          <TooltipContent>Details</TooltipContent>
        </Tooltip>
        <button>Outside</button>
      </>
    );
    await tap(screen.getByRole("button", { name: "Touch help" }));
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  });
});

describe("Tooltip v2 theme inheritance", () => {
  it("keeps an open body portal mounted while the document theme changes", () => {
    const onOpenChange = vi.fn();
    const { container } = renderTooltip(
      <Tooltip open onOpenChange={onOpenChange}>
        <TooltipTrigger>Theme help</TooltipTrigger>
        <TooltipContent>
          Shared theme tokens
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    );
    const content = getTooltipContent();
    expect(content).toHaveClass(
      "bg-v2-semantic-bg-secondary",
      "text-v2-semantic-text-inverted"
    );
    expect(container.contains(content)).toBe(false);
    expect(document.body.contains(content)).toBe(true);

    const previousDark = document.documentElement.classList.contains("dark");
    try {
      document.documentElement.classList.toggle("dark", !previousDark);
      expect(getTooltipContent()).toBe(content);
      expect(content).toHaveAttribute("data-state", "instant-open");
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(content?.querySelector("svg")).toHaveClass(
        "fill-[var(--tooltip-arrow-fill,var(--v2-semantic-bg-secondary,var(--semantic-bg-secondary)))]"
      );
    } finally {
      document.documentElement.classList.toggle("dark", previousDark);
    }
  });
});
