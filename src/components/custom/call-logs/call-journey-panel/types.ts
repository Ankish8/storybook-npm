import type * as React from "react";

/** A single event rendered within the call journey timeline */
export interface CallJourneyEvent {
  /** Event title, e.g. "Call Received Entry" */
  title: string;
  /** Short duration/meta label shown next to the title, e.g. "(0s)" or "102s talk-time" */
  meta?: string;
  /** Event description text */
  description: string;
  /** "highlighted" renders as a bordered card (used for AI/bot-handled Participants); default is a plain timeline item */
  variant?: "default" | "highlighted";
  /** Only shown when variant is "highlighted", e.g. "AI Handler ID: bot_sales_v2" */
  handlerId?: string;
}

export interface CallJourneyPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small label above the title, e.g. "US-7 LEG TIMELINE" */
  legLabel: string;
  /** Panel title, defaults to "Call Journey Trace" */
  title?: string;
  /** Call UID shown under the title */
  callUid: string;
  /** Label above the customer value, defaults to "CUSTOMER" */
  customerLabel?: string;
  /** Customer identity line, e.g. "+1 (555) 019-3321 (David Miller)" */
  customerValue: string;
  /** Timestamp shown top-right, e.g. "7/6/2026, 3:45:30 PM" */
  timestamp: string;
  /** Ordered list of timeline events */
  events: CallJourneyEvent[];
  /** Called when the close button is clicked */
  onClose?: () => void;
}
