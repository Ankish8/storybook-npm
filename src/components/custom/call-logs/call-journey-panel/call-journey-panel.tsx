import * as React from "react";
import { X } from "lucide-react";

import { cn } from "../../../../lib/utils";
import type { CallJourneyEvent, CallJourneyPanelProps } from "./types";

/* ── Timeline event ── */

function TimelineEvent({ event, isLast }: { event: CallJourneyEvent; isLast: boolean }) {
  const isHighlighted = event.variant === "highlighted";

  return (
    <div className={cn("flex items-start gap-3", !isLast && "pb-6")}>
      <div className="flex flex-col items-center self-stretch">
        <span className="size-[10px] shrink-0 rounded-full bg-semantic-primary" />
        {!isLast && <span className="w-px flex-1 bg-semantic-border-layout" />}
      </div>

      {isHighlighted ? (
        <div className="flex flex-1 flex-col gap-2 rounded-lg border border-solid border-semantic-info-border bg-semantic-bg-primary p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-base font-semibold text-semantic-text-primary">
              {event.title}
            </span>
            {event.meta && <span className="text-xs text-semantic-text-muted">{event.meta}</span>}
          </div>
          {event.handlerId && (
            <span className="text-xs font-semibold text-semantic-text-secondary">
              {event.handlerId}
            </span>
          )}
          <span className="text-sm text-semantic-text-muted">{event.description}</span>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-semibold text-semantic-text-primary">
              {event.title}
            </span>
            {event.meta && <span className="text-xs text-semantic-text-muted">{event.meta}</span>}
          </div>
          <span className="text-sm text-semantic-text-muted">{event.description}</span>
        </div>
      )}
    </div>
  );
}

/* ── Main component ── */

/**
 * CallJourneyPanel is a slide-out side panel showing the full event timeline
 * for a single call. Drop it into a fixed-width slide-out/drawer container —
 * the panel itself fills the available width and height.
 *
 * @example
 * ```tsx
 * <CallJourneyPanel
 *   legLabel="US-7 LEG TIMELINE"
 *   callUid="UID-2026-0701-01"
 *   customerValue="+1 (555) 019-3321 (David Miller)"
 *   timestamp="7/6/2026, 3:45:30 PM"
 *   events={[
 *     {
 *       title: "Call Received Entry",
 *       meta: "(0s)",
 *       description: "Incoming call initialized from mobile network region gateway.",
 *     },
 *     {
 *       title: "Entered Call IVR Flow",
 *       meta: "(15s)",
 *       description:
 *         "Caller processed through tree node selector. Selection department: Billing.",
 *     },
 *     {
 *       title: "Voicebot Session Leg",
 *       meta: "102s talk-time",
 *       description:
 *         "Engaging customer with structured conversational intelligence model. Action Resolution: hangup.",
 *       variant: "highlighted",
 *       handlerId: "AI Handler ID: bot_sales_v2",
 *     },
 *     {
 *       title: "Call Ended",
 *       meta: "(117s)",
 *       description: "Session terminated after successful resolution.",
 *     },
 *   ]}
 *   onClose={() => {}}
 * />
 * ```
 */
const CallJourneyPanel = React.forwardRef(
  (
    {
      legLabel,
      title = "Call Journey Trace",
      callUid,
      customerLabel = "CUSTOMER",
      customerValue,
      timestamp,
      events,
      onClose,
      className,
      ...props
    }: CallJourneyPanelProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full flex-col border-l border-solid border-semantic-border-layout bg-semantic-bg-primary",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-4 border-b border-solid border-semantic-border-layout p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-wide text-semantic-text-link">{legLabel}</span>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-md hover:bg-semantic-bg-hover"
            >
              <X className="size-[18px] text-semantic-text-muted" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-semantic-text-primary">{title}</span>
            <span className="text-sm text-semantic-text-muted">Call UID: {callUid}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-solid border-semantic-border-layout bg-semantic-bg-ui p-4">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-semantic-text-muted">
              {customerLabel}
            </span>
            <span className="truncate text-sm font-semibold text-semantic-primary">
              {customerValue}
            </span>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 text-right">
            <span className="text-xs font-semibold uppercase tracking-wide text-semantic-text-muted">
              TIMESTAMP
            </span>
            <span className="text-sm text-semantic-text-primary">{timestamp}</span>
          </div>
        </div>

        <div className="flex flex-col px-4 py-6">
          {events.map((event, index) => (
            <TimelineEvent
              key={`${event.title}-${index}`}
              event={event}
              isLast={index === events.length - 1}
            />
          ))}
        </div>
      </div>
    );
  }
);
CallJourneyPanel.displayName = "CallJourneyPanel";

export { CallJourneyPanel };
