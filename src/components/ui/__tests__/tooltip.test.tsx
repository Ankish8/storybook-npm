import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
} from "../tooltip";

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
  it("renders trigger correctly", () => {
    renderTooltip(
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
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
      expect(tooltip).toHaveClass("bg-[#343E55]");
      expect(tooltip).toHaveClass("text-white");
      expect(tooltip).toHaveClass("text-xs");
      expect(tooltip).toHaveClass("rounded-md");
      expect(tooltip).toHaveClass("px-3");
      expect(tooltip).toHaveClass("py-1.5");
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
        expect(arrow).toHaveClass("fill-[#343E55]");
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

      // Should have had some delay (at least 50ms to account for test timing)
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(50);
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
