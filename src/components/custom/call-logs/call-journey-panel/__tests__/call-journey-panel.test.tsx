import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CallJourneyPanel } from "../call-journey-panel";
import type { CallJourneyEvent } from "../types";
import { assertNoBootstrapMarginBleed } from "../../../../ui/__tests__/utils/bootstrap-compat";

const defaultEvents: CallJourneyEvent[] = [
  {
    title: "Call Received Entry",
    meta: "(0s)",
    description: "Incoming call initialized from mobile network region gateway.",
  },
  {
    title: "Entered Call IVR Flow",
    meta: "(15s)",
    description:
      "Caller processed through tree node selector. Selection department: Billing.",
  },
  {
    title: "Voicebot Session Leg",
    description:
      "Engaging customer with structured conversational intelligence model.",
    variant: "highlighted",
    handlerId: "AI Handler ID: bot_sales_v2",
  },
  {
    title: "Call Ended",
    meta: "(117s)",
    description: "Session terminated after successful resolution.",
  },
];

const defaultProps = {
  legLabel: "US-7 LEG TIMELINE",
  callUid: "UID-2026-0701-01",
  customerValue: "+1 (555) 019-3321 (David Miller)",
  timestamp: "7/6/2026, 3:45:30 PM",
  events: defaultEvents,
};

describe("CallJourneyPanel", () => {
  it("renders correctly with required props only", () => {
    render(<CallJourneyPanel {...defaultProps} />);
    expect(screen.getByText("US-7 LEG TIMELINE")).toBeInTheDocument();
  });

  /* ── legLabel / title ── */

  it("renders the legLabel", () => {
    render(<CallJourneyPanel {...defaultProps} />);
    expect(screen.getByText("US-7 LEG TIMELINE")).toBeInTheDocument();
  });

  it("renders the default title 'Call Journey Trace' when title is omitted", () => {
    render(<CallJourneyPanel {...defaultProps} />);
    expect(screen.getByText("Call Journey Trace")).toBeInTheDocument();
  });

  it("renders a custom title override", () => {
    render(<CallJourneyPanel {...defaultProps} title="Custom Journey Title" />);
    expect(screen.getByText("Custom Journey Title")).toBeInTheDocument();
    expect(screen.queryByText("Call Journey Trace")).not.toBeInTheDocument();
  });

  /* ── callUid ── */

  it("renders 'Call UID: {callUid}'", () => {
    render(<CallJourneyPanel {...defaultProps} />);
    expect(
      screen.getByText(`Call UID: ${defaultProps.callUid}`)
    ).toBeInTheDocument();
  });

  /* ── customerLabel ── */

  it("renders the default customerLabel 'CUSTOMER' when omitted", () => {
    render(<CallJourneyPanel {...defaultProps} />);
    expect(screen.getByText("CUSTOMER")).toBeInTheDocument();
  });

  it("renders a custom customerLabel override", () => {
    render(<CallJourneyPanel {...defaultProps} customerLabel="CLIENT" />);
    expect(screen.getByText("CLIENT")).toBeInTheDocument();
    expect(screen.queryByText("CUSTOMER")).not.toBeInTheDocument();
  });

  /* ── customerValue / timestamp ── */

  it("renders customerValue, the 'TIMESTAMP' label, and timestamp", () => {
    render(<CallJourneyPanel {...defaultProps} />);
    expect(
      screen.getByText(defaultProps.customerValue)
    ).toBeInTheDocument();
    expect(screen.getByText("TIMESTAMP")).toBeInTheDocument();
    expect(screen.getByText(defaultProps.timestamp)).toBeInTheDocument();
  });

  /* ── events: title / description ── */

  it("renders every event's title and description for a multi-event array", () => {
    render(<CallJourneyPanel {...defaultProps} />);
    defaultEvents.forEach((event) => {
      expect(screen.getByText(event.title)).toBeInTheDocument();
      expect(screen.getByText(event.description)).toBeInTheDocument();
    });
  });

  /* ── events: meta ── */

  it("renders an event's meta when provided, and omits it when not provided", () => {
    const { container } = render(
      <CallJourneyPanel
        {...defaultProps}
        events={[
          { title: "Event With Meta", description: "Desc A", meta: "(5s)" },
          { title: "Event Without Meta", description: "Desc B" },
        ]}
      />
    );
    // Each timeline row is the "flex items-start gap-3" wrapper rendered by
    // TimelineEvent; this class combination is unique to event rows.
    const rows = container.querySelectorAll(".gap-3");
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector(".text-xs")).toBeInTheDocument();
    expect(screen.getByText("(5s)")).toBeInTheDocument();
    expect(rows[1].querySelector(".text-xs")).not.toBeInTheDocument();
  });

  /* ── events: handlerId ── */

  it("renders handlerId for a variant: 'highlighted' event", () => {
    render(
      <CallJourneyPanel
        {...defaultProps}
        events={[
          {
            title: "Voicebot Session Leg",
            description: "Engaging customer with AI.",
            variant: "highlighted",
            handlerId: "AI Handler ID: bot_sales_v2",
          },
        ]}
      />
    );
    expect(
      screen.getByText("AI Handler ID: bot_sales_v2")
    ).toBeInTheDocument();
  });

  it("never renders handlerId for a variant: 'default' (or omitted) event, even if one is passed", () => {
    render(
      <CallJourneyPanel
        {...defaultProps}
        events={[
          {
            title: "Explicit Default Event",
            description: "Desc default",
            variant: "default",
            handlerId: "Should Not Show A",
          },
          {
            title: "Omitted Variant Event",
            description: "Desc omitted",
            handlerId: "Should Not Show B",
          },
        ]}
      />
    );
    // The component only reads event.handlerId inside the isHighlighted
    // branch (variant === "highlighted"); the default-variant branch never
    // references it, so it must not render regardless of variant being
    // explicitly "default" or omitted.
    expect(screen.queryByText("Should Not Show A")).not.toBeInTheDocument();
    expect(screen.queryByText("Should Not Show B")).not.toBeInTheDocument();
  });

  /* ── timeline connecting lines ── */

  it("renders one fewer connecting line than dots (the last event has no line)", () => {
    const { container } = render(<CallJourneyPanel {...defaultProps} />);
    const dots = container.querySelectorAll('[class*="rounded-full"]');
    const lines = container.querySelectorAll('[class*="w-px"]');
    expect(dots.length).toBe(defaultEvents.length);
    expect(lines.length).toBe(defaultEvents.length - 1);
  });

  /* ── close button ── */

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<CallJourneyPanel {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* ── className / ref / passthrough ── */

  it("merges custom className onto the root element", () => {
    const { container } = render(
      <CallJourneyPanel {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("flex");
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<CallJourneyPanel {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes additional HTML attributes through to the root element", () => {
    render(<CallJourneyPanel {...defaultProps} data-testid="panel-1" />);
    expect(screen.getByTestId("panel-1")).toBeInTheDocument();
  });

  /* ── Bootstrap compatibility ── */

  it("has no Bootstrap margin bleed on <p> elements", () => {
    // CallJourneyPanel currently renders no <p> tags (spans only), so this
    // is trivially satisfied — kept as a regression guard for future changes.
    const { container } = render(<CallJourneyPanel {...defaultProps} />);
    assertNoBootstrapMarginBleed(container);
  });
});
