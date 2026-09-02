import type * as React from "react";

import type { CheckedState } from "../../../ui/checkbox";

/** Call-outcome category that drives the row's avatar color and icon */
export type CallStatus = "connected" | "missed" | "ai-handled" | "neutral";

/** What handled the call, and how it should be summarized in the row */
export type CallLogsHandledBy =
  | { type: "agent"; agentName: string; department?: string }
  | { type: "bot"; botName: string }
  | {
      type: "bot-handoff";
      botName: string;
      agentName?: string;
      department?: string;
      /** Renders the handoff target in error styling (e.g. handed off but not picked up) */
      missed?: boolean;
    }
  | { type: "campaign"; campaignName: string }
  | { type: "connecting" }
  | { type: "none" };

/**
 * Trailing row actions — live-call controls, or none. Recording playback is
 * no longer a row-level action: it's started from `CallDetailPanel` (opened
 * via the row's `onClick`/`expandable`) and, once started, continues in the
 * background via `RecordingPlaybackBar` when the panel is closed.
 */
export type CallLogsActions =
  | {
      type: "live";
      onTransfer?: () => void;
      /** Called when "Notes" is selected from the row's more-actions menu */
      onSelectNotes?: () => void;
      /** Called when "End Call" is selected from the row's more-actions menu */
      onSelectEndCall?: () => void;
    }
  | { type: "none" };

export interface CallLogsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Visual call-outcome category driving the avatar color/icon */
  status: CallStatus;
  /** Caller's phone number, shown as the primary line */
  phoneNumber: string;
  /** Caller's display name, shown under the phone number (falls back to "-") */
  callerName?: string;
  /** Shows a green LIVE badge next to the phone number */
  isLive?: boolean;
  /** Shows a note icon next to the phone number */
  hasNote?: boolean;
  /** Called with the phone number after it is copied via the hover copy action */
  onCopyNumber?: (phoneNumber: string) => void;
  /** What handled the call */
  handledBy: CallLogsHandledBy;
  /**
   * Overrides the What-column hover tooltip. By default the tooltip is
   * auto-derived from `handledBy` + `status` (e.g. "Nivetha N. from support",
   * "AI Agent", "Call missed from support"); set this to show custom copy
   * instead, such as a notes/outcome preview.
   */
  summary?: string;
  /** Call start time label, e.g. "05:00 PM" */
  time?: string;
  /** Call duration label, e.g. "5m 48s" */
  duration?: string;
  /** Renders the duration in green with a pulsing dot for an in-progress call */
  isOngoing?: boolean;
  /** Trailing actions — live-call controls, or none */
  actions?: CallLogsActions;
  /** Row checkbox checked state */
  checked?: CheckedState;
  /** Row checkbox change handler */
  onCheckedChange?: (checked: CheckedState) => void;
  /** Shows a chevron affordance indicating the row can expand */
  expandable?: boolean;
  /** Click handler for the row (e.g. to expand call detail) */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
