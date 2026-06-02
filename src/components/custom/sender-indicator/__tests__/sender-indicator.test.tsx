import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TooltipProvider } from "../../../ui/tooltip";
import { SenderIndicator } from "../sender-indicator";

function renderWithTooltip(ui: React.ReactElement) {
  return render(<TooltipProvider delayDuration={0}>{ui}</TooltipProvider>);
}

describe("SenderIndicator", () => {
  it("uses the visible badge as the tooltip trigger", () => {
    renderWithTooltip(
      <SenderIndicator
        sentBy={{ type: "agent", name: "Alex Smith" }}
        withTooltip
        className="absolute bottom-0 left-full ml-1.5"
      />
    );

    const badge = screen.getByText("AS").closest("div");
    expect(badge).toHaveClass("absolute", "bottom-0", "left-full", "ml-1.5");
    expect(badge).toHaveAttribute("data-state", "closed");
  });

  it("keeps a fixed non-shrinking badge width", () => {
    render(<SenderIndicator sentBy={{ type: "bot", name: "Bot" }} />);

    const badge = document.querySelector(".rounded-full");
    expect(badge).toHaveClass("size-7", "min-h-7", "min-w-7", "shrink-0");
    expect(badge?.querySelector("svg")).toHaveClass("size-3.5", "shrink-0");
  });

  it("keeps agent initials centered at a stable width", () => {
    render(<SenderIndicator sentBy={{ type: "agent", name: "Alex Smith" }} />);

    expect(screen.getByText("AS")).toHaveClass("min-w-4", "text-center");
  });

  it("shows the source label when hovering the badge", async () => {
    const user = userEvent.setup();
    renderWithTooltip(
      <SenderIndicator sentBy={{ type: "agent", name: "Alex Smith" }} withTooltip />
    );

    await user.hover(screen.getByText("AS"));

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Agent");
    });
  });

  it("keeps source tooltips concise and non-wrapping", async () => {
    const user = userEvent.setup();
    const longName = "Nivet Customer Success Operations Manager";

    renderWithTooltip(
      <SenderIndicator sentBy={{ type: "agent", name: longName }} withTooltip />
    );

    await user.hover(screen.getByText("NC"));

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Agent");
      const tooltipContent = document.querySelector("[data-side='left']");
      expect(tooltipContent).toHaveTextContent("Agent");
      expect(tooltipContent).toHaveClass("whitespace-nowrap");
      expect(tooltipContent?.querySelector("p")).toHaveClass("m-0");
    });
  });
});
