import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CallLogs } from "../call-logs";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

// Uses an "agent" handledBy (with department) as the neutral default so it
// never collides with the "-" placeholder text asserted in other tests.
const defaultProps = {
  status: "connected" as const,
  phoneNumber: "+91 98765 43210",
  handledBy: {
    type: "agent" as const,
    agentName: "Base Agent",
    department: "Support team",
  },
};

describe("CallLogs", () => {
  it("renders correctly with required props only", () => {
    render(
      <CallLogs
        status="connected"
        phoneNumber="+91 98765 43210"
        handledBy={{ type: "none" }}
      />
    );
    expect(screen.getByText("+91 98765 43210")).toBeInTheDocument();
  });

  /* ── status avatar (Who column) ── */
  //
  // The design uses one phone-handset glyph with a direction arrow that
  // varies by status (incoming / outgoing / missed X) rather than different
  // pictograms — "ai-handled" reuses the incoming arrow (tinted blue), not a
  // bot/robot icon, and "neutral" is the outgoing arrow.

  it.each([
    ["connected", "lucide-phone-incoming", "text-semantic-success-text", "Connected call"],
    ["missed", "lucide-phone-missed", "text-semantic-error-primary", "Missed call"],
    ["ai-handled", "lucide-phone-incoming", "text-semantic-info-primary", "Handled by AI"],
    ["neutral", "lucide-phone-outgoing", "text-semantic-text-secondary", "Outgoing call"],
  ] as const)(
    "renders the correct icon, color, and tooltip for status '%s'",
    async (status, iconClass, colorClass, tooltipLabel) => {
      const user = userEvent.setup();
      const { container } = render(<CallLogs {...defaultProps} status={status} />);

      const icon = container.querySelector(`.${iconClass}`);
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass(colorClass);

      await user.hover(icon!.closest("[class*='cursor-default']") as Element);
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveTextContent(tooltipLabel);
      });
    }
  );

  /* ── callerName ── */

  it("renders callerName when provided", () => {
    render(<CallLogs {...defaultProps} callerName="Priya Sharma" />);
    expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
  });

  it("falls back to '-' when callerName is omitted", () => {
    render(<CallLogs {...defaultProps} />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  /* ── truncation + hover tooltips (Who column) ── */

  it("truncates the phone number and caller name instead of overflowing the row", () => {
    render(
      <CallLogs
        {...defaultProps}
        callerName="A Caller Name So Long It Would Otherwise Overflow The Row"
      />
    );
    expect(screen.getByText(defaultProps.phoneNumber)).toHaveClass("truncate");
    expect(
      screen.getByText("A Caller Name So Long It Would Otherwise Overflow The Row")
    ).toHaveClass("truncate");
  });

  it("reveals the full phone number in a tooltip on hover", async () => {
    const user = userEvent.setup();
    render(<CallLogs {...defaultProps} />);

    await user.hover(screen.getByText(defaultProps.phoneNumber));
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent(defaultProps.phoneNumber);
    });
  });

  it("reveals the full caller name in a tooltip on hover", async () => {
    const user = userEvent.setup();
    render(<CallLogs {...defaultProps} callerName="Priya Sharma" />);

    await user.hover(screen.getByText("Priya Sharma"));
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Priya Sharma");
    });
  });

  it("does not attach a hover tooltip to the '-' placeholder when callerName is omitted", async () => {
    const user = userEvent.setup();
    render(<CallLogs {...defaultProps} />);

    await user.hover(screen.getByText("-"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  /* ── isLive ── */

  it("shows a LIVE badge when isLive is true", () => {
    render(<CallLogs {...defaultProps} isLive />);
    expect(screen.getByText("LIVE")).toBeInTheDocument();
  });

  it("does not show a LIVE badge by default", () => {
    render(<CallLogs {...defaultProps} />);
    expect(screen.queryByText("LIVE")).not.toBeInTheDocument();
  });

  /* ── hasNote ── */

  it("shows the note icon when hasNote is true", () => {
    const { container } = render(<CallLogs {...defaultProps} hasNote />);
    // status avatar icon + copy-number icon + note icon
    expect(container.querySelectorAll("svg").length).toBe(3);
  });

  it("does not show the note icon by default", () => {
    const { container } = render(<CallLogs {...defaultProps} />);
    // status avatar icon + copy-number icon
    expect(container.querySelectorAll("svg").length).toBe(2);
  });

  /* ── copy number ── */

  it("renders a copy-number button for the phone number", () => {
    render(<CallLogs {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Copy Number" })).toBeInTheDocument();
  });

  it("copies the phone number and fires onCopyNumber", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    // `Object.assign` can't override navigator.clipboard once jsdom (or a
    // prior userEvent.setup() in this file) has defined it as a getter-only
    // accessor — redefine the property outright so this mock always sticks.
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    const onCopyNumber = vi.fn();

    render(<CallLogs {...defaultProps} onCopyNumber={onCopyNumber} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy Number" }));

    expect(writeText).toHaveBeenCalledWith("+91 98765 43210");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(onCopyNumber).toHaveBeenCalledWith("+91 98765 43210");
  });

  it("does not trigger the row onClick when copying", () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    const onClick = vi.fn();

    render(<CallLogs {...defaultProps} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy Number" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  /* ── handledBy variants ── */

  it("renders 'agent' handledBy", () => {
    render(
      <CallLogs
        {...defaultProps}
        handledBy={{
          type: "agent",
          agentName: "Komal R.",
          department: "Customer support",
        }}
      />
    );
    expect(screen.getByText("Komal R.")).toBeInTheDocument();
    expect(screen.getByText("Customer support")).toBeInTheDocument();
  });

  it("renders 'bot' handledBy", () => {
    render(
      <CallLogs {...defaultProps} handledBy={{ type: "bot", botName: "Eva" }} />
    );
    expect(screen.getByText("Eva")).toBeInTheDocument();
  });

  it("renders 'bot-handoff' handledBy", () => {
    render(
      <CallLogs
        {...defaultProps}
        handledBy={{
          type: "bot-handoff",
          botName: "Eva",
          agentName: "Nivedithatha N.",
          department: "Customer support",
        }}
      />
    );
    expect(screen.getByText("Eva")).toBeInTheDocument();
    expect(
      screen.getByText("Nivedithatha N. | Customer support")
    ).toBeInTheDocument();
  });

  it("renders 'campaign' handledBy", () => {
    render(
      <CallLogs
        {...defaultProps}
        handledBy={{ type: "campaign", campaignName: "Q3 Enterprise Campaign" }}
      />
    );
    expect(screen.getByText("Campaign")).toBeInTheDocument();
    expect(screen.getByText("Q3 Enterprise Campaign")).toBeInTheDocument();
  });

  it("truncates What-column pill names instead of overflowing the row", () => {
    render(
      <CallLogs
        {...defaultProps}
        handledBy={{
          type: "agent",
          agentName: "A Very Long Agent Name That Should Not Overflow",
          department: "An Equally Long Department Name",
        }}
      />
    );
    expect(
      screen.getByText("A Very Long Agent Name That Should Not Overflow")
    ).toHaveClass("truncate");
    expect(
      screen.getByText("An Equally Long Department Name")
    ).toHaveClass("truncate");
  });

  it("truncates the bot-handoff target pill's name instead of overflowing the row", () => {
    render(
      <CallLogs
        {...defaultProps}
        handledBy={{
          type: "bot-handoff",
          botName: "Eva",
          agentName: "A Very Long Agent Name",
          department: "A Very Long Department Name",
        }}
      />
    );
    expect(
      screen.getByText("A Very Long Agent Name | A Very Long Department Name")
    ).toHaveClass("truncate");
  });

  it("renders 'connecting' handledBy", () => {
    render(<CallLogs {...defaultProps} handledBy={{ type: "connecting" }} />);
    expect(screen.getByText("Connecting...")).toBeInTheDocument();
  });

  it("renders 'none' handledBy", () => {
    render(
      <CallLogs
        {...defaultProps}
        callerName="Priya Sharma"
        handledBy={{ type: "none" }}
      />
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  /* ── What column hover tooltip ── */

  async function hoverWhatColumn(user: ReturnType<typeof userEvent.setup>, anchorText: string) {
    const trigger = screen.getByText(anchorText).closest("[class*='cursor-default']");
    expect(trigger).toBeTruthy();
    await user.hover(trigger as Element);
  }

  it("auto-derives an agent tooltip: '<name> from <department>'", async () => {
    const user = userEvent.setup();
    render(
      <CallLogs
        {...defaultProps}
        handledBy={{ type: "agent", agentName: "Nivetha N.", department: "support" }}
      />
    );
    await hoverWhatColumn(user, "Nivetha N.");
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Nivetha N. from support");
    });
  });

  it("auto-derives 'AI Agent' for a bot-handled call", async () => {
    const user = userEvent.setup();
    render(
      <CallLogs {...defaultProps} status="ai-handled" handledBy={{ type: "bot", botName: "Eva" }} />
    );
    await hoverWhatColumn(user, "Eva");
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("AI Agent");
    });
  });

  it("shows 'AI Agent' on the bot pill of a bot→agent handoff (independent of the target)", async () => {
    const user = userEvent.setup();
    render(
      <CallLogs
        {...defaultProps}
        handledBy={{
          type: "bot-handoff",
          botName: "Eva",
          agentName: "Nivedithatha N.",
          department: "Customer support",
        }}
      />
    );
    await hoverWhatColumn(user, "Eva");
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("AI Agent");
    });
  });

  it("shows '<agent> from <department>' on the handoff target pill", async () => {
    const user = userEvent.setup();
    render(
      <CallLogs
        {...defaultProps}
        handledBy={{
          type: "bot-handoff",
          botName: "Eva",
          agentName: "Nivedithatha N.",
          department: "Customer support",
        }}
      />
    );
    await hoverWhatColumn(user, "Nivedithatha N. | Customer support");
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent(
        "Nivedithatha N. from Customer support"
      );
    });
  });

  it("shows 'Call missed from <department>' on a missed handoff target pill", async () => {
    const user = userEvent.setup();
    render(
      <CallLogs
        {...defaultProps}
        status="missed"
        handledBy={{ type: "bot-handoff", botName: "Arina", department: "support", missed: true }}
      />
    );
    // Anchor on the target pill (department only) — the bot pill reads "AI Agent".
    await hoverWhatColumn(user, "support");
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Call missed from support");
    });
  });

  it("auto-derives a campaign tooltip from the campaign name", async () => {
    const user = userEvent.setup();
    render(
      <CallLogs
        {...defaultProps}
        handledBy={{ type: "campaign", campaignName: "Q3 Enterprise Campaign" }}
      />
    );
    await hoverWhatColumn(user, "Q3 Enterprise Campaign");
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Q3 Enterprise Campaign");
    });
  });

  it("lets `summary` override the auto-derived tooltip", async () => {
    const user = userEvent.setup();
    render(<CallLogs {...defaultProps} summary="Inquired about login failures." />);
    await hoverWhatColumn(user, "Base Agent");
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Inquired about login failures.");
    });
  });

  it("renders no What-column tooltip wrapper when there is no handler", () => {
    render(
      <CallLogs {...defaultProps} callerName="Someone" handledBy={{ type: "none" }} />
    );
    // The lone "-" placeholder is the What-column content; it must not be
    // wrapped in a tooltip trigger.
    expect(screen.getByText("-").closest("[class*='cursor-default']")).toBeNull();
  });

  /* ── time / duration ── */

  it("renders time and duration when provided", () => {
    render(<CallLogs {...defaultProps} time="05:00 PM" duration="6m 48s" />);
    expect(screen.getByText("05:00 PM")).toBeInTheDocument();
    expect(screen.getByText("6m 48s")).toBeInTheDocument();
  });

  it("always renders the time/duration column, even when neither value is provided", () => {
    // The column must always reserve its slot so the "What"/actions columns
    // start at the same x position on every row, regardless of this row's data.
    const { container } = render(<CallLogs {...defaultProps} />);
    expect(container.querySelector('[class*="w-[160px]"]')).toBeInTheDocument();
  });

  it("renders the time/duration block when at least one is provided", () => {
    const { container } = render(<CallLogs {...defaultProps} time="05:00 PM" />);
    expect(container.querySelector('[class*="w-[160px]"]')).toBeInTheDocument();
  });

  /* ── responsive: What/When hide below `sm` ── */

  it("hides the What column below the `sm` breakpoint", () => {
    const { container } = render(<CallLogs {...defaultProps} />);
    const whatColumn = container.querySelector('[class*="flex-\\[3\\]"]');
    expect(whatColumn).toHaveClass("hidden", "sm:flex");
  });

  it("hides the When column below the `sm` breakpoint", () => {
    const { container } = render(<CallLogs {...defaultProps} time="05:00 PM" />);
    const whenColumn = container.querySelector('[class*="w-[160px]"]');
    expect(whenColumn).toHaveClass("hidden", "sm:flex");
  });

  /* ── isOngoing ── */

  it("renders duration in the ongoing (green) state", () => {
    render(<CallLogs {...defaultProps} duration="6m 48s" isOngoing />);
    expect(screen.getByText("6m 48s")).toHaveClass("text-semantic-success-hover");
  });

  it("renders duration in the muted state when not ongoing", () => {
    render(<CallLogs {...defaultProps} duration="6m 48s" />);
    expect(screen.getByText("6m 48s")).toHaveClass("text-semantic-text-muted");
  });

  /* ── actions: live ── */

  it("renders Transfer and More actions controls for live actions", () => {
    render(<CallLogs {...defaultProps} actions={{ type: "live" }} />);
    expect(screen.getByText("Transfer")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "More actions" })
    ).toBeInTheDocument();
  });

  it("calls onTransfer when Transfer is clicked, without bubbling to row onClick", () => {
    const onTransfer = vi.fn();
    const onRowClick = vi.fn();
    render(
      <CallLogs
        {...defaultProps}
        actions={{ type: "live", onTransfer }}
        onClick={onRowClick}
      />
    );
    fireEvent.click(screen.getByText("Transfer"));
    expect(onTransfer).toHaveBeenCalledTimes(1);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it("opens the more-actions menu without bubbling to row onClick, and calls onSelectNotes when Notes is chosen", async () => {
    const user = userEvent.setup();
    const onSelectNotes = vi.fn();
    const onRowClick = vi.fn();
    render(
      <CallLogs
        {...defaultProps}
        actions={{ type: "live", onSelectNotes }}
        onClick={onRowClick}
      />
    );
    await user.click(screen.getByRole("button", { name: "More actions" }));
    expect(onRowClick).not.toHaveBeenCalled();
    await user.click(screen.getByText("Notes"));
    expect(onSelectNotes).toHaveBeenCalledTimes(1);
  });

  it("calls onSelectEndCall when End Call is chosen from the more-actions menu", async () => {
    const user = userEvent.setup();
    const onSelectEndCall = vi.fn();
    render(
      <CallLogs {...defaultProps} actions={{ type: "live", onSelectEndCall }} />
    );
    await user.click(screen.getByRole("button", { name: "More actions" }));
    await user.click(screen.getByText("End Call"));
    expect(onSelectEndCall).toHaveBeenCalledTimes(1);
  });

  it("renders no transfer or more-actions controls by default", () => {
    render(<CallLogs {...defaultProps} />);
    expect(screen.queryByText("Transfer")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "More actions" })
    ).not.toBeInTheDocument();
  });

  /* ── expandable ── */

  it("renders a chevron affordance when expandable", () => {
    const { container } = render(<CallLogs {...defaultProps} expandable />);
    const actionsContainer = container.querySelector(".gap-9.px-4");
    expect(actionsContainer?.querySelectorAll("svg").length).toBe(1);
  });

  it("does not render a chevron by default", () => {
    const { container } = render(<CallLogs {...defaultProps} />);
    const actionsContainer = container.querySelector(".gap-9.px-4");
    expect(actionsContainer?.querySelectorAll("svg").length).toBe(0);
  });

  /* ── className / ref / passthrough ── */

  it("merges custom className onto the root element", () => {
    const { container } = render(
      <CallLogs {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("flex");
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<CallLogs {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes additional HTML attributes through to the root element", () => {
    render(<CallLogs {...defaultProps} data-testid="row-1" />);
    expect(screen.getByTestId("row-1")).toBeInTheDocument();
  });

  /* ── row onClick ── */

  it("has role=button and tabIndex=0 when onClick is provided", () => {
    render(<CallLogs {...defaultProps} onClick={vi.fn()} data-testid="row" />);
    const row = screen.getByTestId("row");
    expect(row).toHaveAttribute("role", "button");
    expect(row).toHaveAttribute("tabindex", "0");
  });

  it("has no role=button when onClick is omitted", () => {
    render(<CallLogs {...defaultProps} data-testid="row" />);
    const row = screen.getByTestId("row");
    expect(row).not.toHaveAttribute("role");
  });

  it("calls onClick when the row is clicked", () => {
    const onRowClick = vi.fn();
    render(<CallLogs {...defaultProps} onClick={onRowClick} />);
    fireEvent.click(screen.getByText(defaultProps.phoneNumber));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  /* ── checkbox ── */

  it("calls onCheckedChange when the checkbox is clicked, without bubbling to row onClick", () => {
    const onCheckedChange = vi.fn();
    const onRowClick = vi.fn();
    render(
      <CallLogs
        {...defaultProps}
        onCheckedChange={onCheckedChange}
        onClick={onRowClick}
      />
    );
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it("renders a compact 16px checkbox with a 1px outline border, matching the Figma table-row spec", () => {
    render(<CallLogs {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass("h-4", "w-4", "border");
    expect(checkbox).not.toHaveClass("h-5", "w-5", "border-2");
  });

  /* ── Bootstrap compatibility ── */

  it("has no Bootstrap margin bleed on <p> elements", () => {
    // CallLogs currently renders no <p> tags (spans only), so this is
    // trivially satisfied — kept as a regression guard for future changes.
    const { container } = render(<CallLogs {...defaultProps} />);
    assertNoBootstrapMarginBleed(container);
  });
});
