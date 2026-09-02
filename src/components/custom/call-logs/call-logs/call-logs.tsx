import * as React from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  MoreHorizontal,
  NotepadText,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  type LucideIcon,
} from "lucide-react";

import { cn } from "../../../../lib/utils";
import { Badge } from "../../../ui/badge";
import { Checkbox } from "../../../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../ui/tooltip";
import type { CallLogsActions, CallLogsHandledBy, CallLogsProps, CallStatus } from "./types";

/* ── Status avatar ── */

// The design uses one phone-handset glyph with a direction arrow that varies
// by status — incoming (connected/ai-handled) vs outgoing (neutral) vs missed
// (X) — not different pictograms per status. "ai-handled" reuses the same
// incoming arrow as "connected", distinguished only by the info/blue tint;
// it is NOT a bot/robot icon (that lives on the What column's bot pill).
const STATUS_AVATAR_CONFIG: Record<
  CallStatus,
  { bg: string; icon: LucideIcon; iconColor: string; label: string }
> = {
  connected: {
    bg: "bg-semantic-success-surface",
    icon: PhoneIncoming,
    iconColor: "text-semantic-success-text",
    label: "Connected call",
  },
  missed: {
    bg: "bg-semantic-error-surface",
    icon: PhoneMissed,
    iconColor: "text-semantic-error-primary",
    label: "Missed call",
  },
  "ai-handled": {
    bg: "bg-semantic-info-surface",
    icon: PhoneIncoming,
    iconColor: "text-semantic-info-primary",
    label: "Handled by AI",
  },
  neutral: {
    bg: "bg-semantic-bg-ui",
    icon: PhoneOutgoing,
    iconColor: "text-semantic-text-secondary",
    label: "Outgoing call",
  },
};

function StatusAvatar({ status }: { status: CallStatus }) {
  const config = STATUS_AVATAR_CONFIG[status];
  const Icon = config.icon;
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex size-[26px] shrink-0 cursor-default items-center justify-center rounded-full transition-colors hover:brightness-95",
              config.bg
            )}
          >
            <Icon className={cn("size-4", config.iconColor)} aria-hidden="true" />
          </div>
        </TooltipTrigger>
        <TooltipContent>{config.label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/* ── AI spark icon ── */

/**
 * The two-point spark used on AI/bot pills. Exact vector from the design
 * (Figma node 8114:51451) — lucide's `Sparkles` is a three-star stroke icon
 * and does not match. Filled with `currentColor` so callers set the tone.
 */
function AiSparkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5.96635 14.9998C5.99185 12.0607 8.64356 9.68409 11.9327 9.64964C8.63082 9.6152 5.9791 7.21566 5.96635 4.25354C5.96635 7.20417 3.28914 9.60372 0 9.64964C3.28914 9.68409 5.94086 12.0607 5.96635 14.9998Z"
        fill="currentColor"
      />
      <path
        d="M11.4147 6.45236C11.4274 4.68428 13.021 3.26062 14.9971 3.23766C13.021 3.2147 11.4147 1.77957 11.4147 0C11.4147 1.77957 9.80837 3.2147 7.83234 3.23766C9.80837 3.26062 11.4019 4.68428 11.4147 6.45236Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ── Copy number ── */

const COPIED_RESET_MS = 2000;

/**
 * Copy affordance revealed when the caller cell is hovered — mirrors the
 * design's Number component, which only shows the copy icon on hover and
 * surfaces a "Copy Number" tooltip once the icon itself is hovered.
 */
function CopyNumberButton({
  phoneNumber,
  onCopyNumber,
}: {
  phoneNumber: string;
  onCopyNumber?: (phoneNumber: string) => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // The row itself is clickable — don't open the detail panel on copy.
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      onCopyNumber?.(phoneNumber);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      // Clipboard access denied/unavailable — nothing to recover from here.
    }
  };

  return (
    <TooltipProvider delayDuration={700} skipDelayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={copied ? "Copied" : "Copy Number"}
            onClick={handleCopy}
            className={cn(
              "shrink-0 rounded opacity-0 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus group-hover/caller:opacity-100",
              copied
                ? "text-semantic-success-primary"
                : "text-semantic-text-muted hover:text-semantic-text-primary"
            )}
          >
            {copied ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>Copy Number</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/* ── Truncated text with a hover tooltip ── */

/**
 * Single-line text that ellipsizes when the row is too narrow to show it in
 * full, revealing the untruncated value in a tooltip on hover — used for the
 * Who column's phone number and caller name so responsive layouts clip
 * gracefully instead of overflowing the row.
 */
function TruncatedText({ text, className }: { text: string; className?: string }) {
  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("min-w-0 truncate", className)}>{text}</span>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/* ── Handled-by pill ── */

const PILL_TONE_CLASSES = {
  neutral: "bg-semantic-bg-ui text-semantic-text-primary",
  info: "bg-semantic-info-surface text-semantic-text-primary",
  error: "bg-semantic-error-surface text-semantic-error-text",
} as const;

function Pill({
  tone,
  children,
}: {
  tone: keyof typeof PILL_TONE_CLASSES;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-0 items-center gap-0.5 whitespace-nowrap rounded px-2 text-sm",
        PILL_TONE_CLASSES[tone]
      )}
    >
      {children}
    </span>
  );
}

/**
 * Tooltip label for an agent / handoff-target pill: "<name> from <department>"
 * when connected, or "Call missed[ from <department>]" when missed. Returns
 * undefined when there's nothing meaningful to say.
 */
function handlerTooltipLabel(
  agentName: string | undefined,
  department: string | undefined,
  missed: boolean
): string | undefined {
  if (missed) {
    return department ? `Call missed from ${department}` : "Call missed";
  }
  if (!agentName) return undefined;
  return department ? `${agentName} from ${department}` : agentName;
}

/**
 * Wraps a single What-column pill in a hover Tooltip describing it (e.g. the
 * bot pill → "AI Agent", the agent pill → "Nivetha N. from support"). Renders
 * the pill unwrapped when tooltips are disabled or there's no label.
 */
function PillTooltip({
  label,
  enabled,
  children,
}: {
  label?: string;
  enabled: boolean;
  children: React.ReactNode;
}) {
  if (!enabled || !label) return <>{children}</>;
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex min-w-0 cursor-default">{children}</span>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function HandledByContent({
  handledBy,
  status,
  enableTooltips,
}: {
  handledBy: CallLogsHandledBy;
  status: CallStatus;
  enableTooltips: boolean;
}) {
  switch (handledBy.type) {
    case "connecting":
      return (
        <PillTooltip label="Connecting call" enabled={enableTooltips}>
          <span className="inline-flex h-[30px] items-center rounded-full bg-semantic-success-surface px-4 text-sm text-semantic-success-text">
            Connecting...
          </span>
        </PillTooltip>
      );
    case "none":
      return <span className="text-sm text-semantic-text-placeholder">-</span>;
    case "agent":
      return (
        <PillTooltip
          label={handlerTooltipLabel(handledBy.agentName, handledBy.department, status === "missed")}
          enabled={enableTooltips}
        >
          <Pill tone="neutral">
            <span className="min-w-0 truncate">{handledBy.agentName}</span>
            {handledBy.department && (
              <>
                <span className="shrink-0 text-semantic-text-placeholder">|</span>
                <span className="min-w-0 truncate text-semantic-text-muted">
                  {handledBy.department}
                </span>
              </>
            )}
          </Pill>
        </PillTooltip>
      );
    case "bot":
      return (
        <PillTooltip label="AI Agent" enabled={enableTooltips}>
          <Pill tone="info">
            <AiSparkIcon className="size-[15px] shrink-0 text-semantic-text-link" />
            <span className="min-w-0 truncate">{handledBy.botName}</span>
          </Pill>
        </PillTooltip>
      );
    case "campaign":
      // The pill already reads "Campaign | <name>"; the tooltip gives the full,
      // untruncated campaign name.
      return (
        <PillTooltip label={handledBy.campaignName} enabled={enableTooltips}>
          <Pill tone="neutral">
            <span className="shrink-0">Campaign</span>
            <span className="shrink-0 text-semantic-text-placeholder">|</span>
            <span className="min-w-0 truncate text-semantic-text-muted">
              {handledBy.campaignName}
            </span>
          </Pill>
        </PillTooltip>
      );
    case "bot-handoff": {
      const targetLabel = [handledBy.agentName, handledBy.department]
        .filter(Boolean)
        .join(" | ");
      const missed = Boolean(handledBy.missed);
      return (
        <div className="flex min-w-0 items-center gap-1.5">
          {/* The bot pill always reads as the AI agent, independent of the handoff target. */}
          <PillTooltip label="AI Agent" enabled={enableTooltips}>
            <Pill tone="info">
              <AiSparkIcon className="size-[15px] shrink-0 text-semantic-text-link" />
              <span className="min-w-0 truncate">{handledBy.botName}</span>
            </Pill>
          </PillTooltip>
          <ArrowRight className="size-[18px] shrink-0 text-semantic-text-muted" aria-hidden="true" />
          <PillTooltip
            label={handlerTooltipLabel(handledBy.agentName, handledBy.department, missed)}
            enabled={enableTooltips}
          >
            <Pill tone={missed ? "error" : "neutral"}>
              <span className="min-w-0 truncate">{targetLabel}</span>
            </Pill>
          </PillTooltip>
        </div>
      );
    }
    default:
      return null;
  }
}

/**
 * Renders the What column. Each handled-by pill carries its own hover tooltip
 * describing it (see `HandledByContent`) — e.g. in a bot→agent handoff, the
 * bot pill reads "AI Agent" and the agent pill "Nivetha N. from support".
 * Passing `summary` replaces those per-pill tooltips with a single cell-level
 * tooltip showing the custom copy (e.g. a notes preview).
 */
function WhatColumnCell({
  handledBy,
  status,
  summary,
}: {
  handledBy: CallLogsHandledBy;
  status: CallStatus;
  summary?: string;
}) {
  if (summary) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex min-w-0 cursor-default">
              <HandledByContent handledBy={handledBy} status={status} enableTooltips={false} />
            </div>
          </TooltipTrigger>
          <TooltipContent>{summary}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <HandledByContent handledBy={handledBy} status={status} enableTooltips />;
}

/* ── Trailing actions ── */

function ActionsContent({
  actions,
  expandable,
}: {
  actions: CallLogsActions;
  expandable?: boolean;
}) {
  return (
    <div className="flex h-full flex-1 items-center justify-end gap-9 px-4">
      {actions.type === "live" && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              actions.onTransfer?.();
            }}
            className="text-sm font-semibold text-semantic-text-link hover:underline"
          >
            Transfer
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More actions"
                onClick={(event) => event.stopPropagation()}
                className="flex size-8 items-center justify-center rounded hover:bg-semantic-bg-hover"
              >
                <MoreHorizontal className="size-[18px] text-semantic-text-muted" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => actions.onSelectNotes?.()}>
                Notes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-semantic-error-primary focus:bg-semantic-error-surface focus:text-semantic-error-primary"
                onSelect={() => actions.onSelectEndCall?.()}
              >
                End Call
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}

      {expandable && (
        <ChevronRight className="size-[18px] shrink-0 text-semantic-text-muted" aria-hidden="true" />
      )}
    </div>
  );
}

/* ── Main component ── */

/**
 * CallLogs renders a single row within a call-logs table: caller identity,
 * who/what handled the call, timing, and trailing actions (transfer/more-actions
 * for live calls). Recording playback lives in `CallDetailPanel`, opened via
 * this row's `onClick`/`expandable`.
 *
 * @example
 * ```tsx
 * <CallLogs
 *   status="connected"
 *   phoneNumber="+91 98765 43210"
 *   callerName="Priya Sharma"
 *   handledBy={{ type: "bot-handoff", botName: "Eva", agentName: "Nivedithatha N.", department: "Customer support" }}
 *   time="05:00 PM"
 *   duration="6m 48s"
 *   expandable
 * />
 * ```
 */
const CallLogs = React.forwardRef(
  (
    {
      status,
      phoneNumber,
      callerName,
      isLive = false,
      hasNote = false,
      onCopyNumber,
      handledBy,
      summary,
      time,
      duration,
      isOngoing = false,
      actions = { type: "none" },
      checked = false,
      onCheckedChange,
      expandable = false,
      onClick,
      className,
      ...props
    }: CallLogsProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const isClickable = Boolean(onClick);

    return (
      <div
        ref={ref}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          isClickable
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        className={cn(
          // Every row highlights on hover so the table scans consistently —
          // live rows aren't clickable but still have inline actions.
          "flex h-20 w-full items-center border-b border-solid border-semantic-border-layout bg-semantic-bg-primary transition-colors hover:bg-semantic-bg-hover",
          isClickable && "cursor-pointer",
          className
        )}
        {...props}
      >
        <div
          className="flex h-full shrink-0 items-center pl-4"
          onClick={(event) => event.stopPropagation()}
        >
          <Checkbox
            checked={checked}
            onCheckedChange={onCheckedChange}
            aria-label={`Select call from ${phoneNumber}`}
            size="sm"
            checkboxClassName="border data-[state=unchecked]:border-[var(--color-neutral-300)]"
          />
        </div>

        <div className="flex h-full min-w-0 flex-[2] items-center gap-2.5 px-4 py-3">
          <StatusAvatar status={status} />
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="group/caller flex min-w-0 items-center gap-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <TruncatedText
                  text={phoneNumber}
                  className="text-sm font-semibold text-semantic-text-primary"
                />
                <CopyNumberButton phoneNumber={phoneNumber} onCopyNumber={onCopyNumber} />
              </div>
              {hasNote && (
                <NotepadText
                  className="size-3.5 shrink-0 text-semantic-text-muted"
                  aria-hidden="true"
                />
              )}
              {isLive && (
                <Badge variant="active" size="sm" className="shrink-0">
                  LIVE
                </Badge>
              )}
            </div>
            {callerName ? (
              <TruncatedText text={callerName} className="text-sm text-semantic-text-muted" />
            ) : (
              <span className="truncate text-sm text-semantic-text-muted">-</span>
            )}
          </div>
        </div>

        <div className="hidden h-full min-w-0 flex-[3] items-center px-4 py-3 sm:flex">
          <WhatColumnCell handledBy={handledBy} status={status} summary={summary} />
        </div>

        <div className="hidden h-full w-[160px] shrink-0 flex-col justify-center gap-0.5 px-4 py-3 sm:flex">
          {time && <span className="text-sm text-semantic-text-primary">{time}</span>}
          {duration && (
            <span
              className={cn(
                "flex items-center gap-1.5 text-sm",
                isOngoing ? "text-semantic-success-hover" : "text-semantic-text-muted"
              )}
            >
              {isOngoing && (
                <span className="size-[7px] shrink-0 animate-pulse rounded-full bg-semantic-success-hover" />
              )}
              {duration}
            </span>
          )}
        </div>

        <ActionsContent actions={actions} expandable={expandable} />
      </div>
    );
  }
);
CallLogs.displayName = "CallLogs";

export { CallLogs, AiSparkIcon };
