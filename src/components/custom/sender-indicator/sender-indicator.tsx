import * as React from "react"
import { Bot, Megaphone, Plug } from "lucide-react"
import { cn } from "../../../lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
} from "../../ui/tooltip"
import type { SentByType } from "../chat-types"

/* ── Helpers ── */

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getTooltipLabel(sentBy: { type: SentByType; name?: string }): string {
  if (sentBy.type === "agent") return sentBy.name || "Agent"
  if (sentBy.type === "bot") return sentBy.name || "Bot"
  if (sentBy.type === "campaign") return "Campaign"
  return "API"
}

/* ── Badge Icon (inner) ── */

function SenderBadgeIcon({
  sentBy,
}: {
  sentBy: { type: SentByType; name?: string }
}) {
  const iconClass = "size-3.5 text-semantic-text-muted"

  if (sentBy.type === "agent" && sentBy.name) {
    return (
      <span className="text-[10px] font-medium text-semantic-text-secondary leading-none">
        {getInitials(sentBy.name)}
      </span>
    )
  }
  if (sentBy.type === "bot") return <Bot className={iconClass} />
  if (sentBy.type === "campaign") return <Megaphone className={iconClass} />
  return <Plug className={iconClass} />
}

/* ── SenderIndicator ── */

export interface SenderIndicatorProps {
  /** Sender metadata — type + optional name */
  sentBy: { type: SentByType; name?: string }
  /** Wrap the badge in a Tooltip showing the sender label */
  withTooltip?: boolean
  /** Additional className for the outer badge circle */
  className?: string
}

const SenderIndicator = React.forwardRef<HTMLDivElement, SenderIndicatorProps>(
  ({ sentBy, withTooltip, className }, ref) => {
    const badge = (
      <div
        ref={withTooltip ? undefined : ref}
        className={cn(
          "size-7 rounded-full bg-white border border-solid border-semantic-border-layout flex items-center justify-center cursor-default",
          className,
        )}
      >
        <SenderBadgeIcon sentBy={sentBy} />
      </div>
    )

    if (!withTooltip) return badge

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div ref={ref}>{badge}</div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="m-0">{getTooltipLabel(sentBy)}</p>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    )
  },
)
SenderIndicator.displayName = "SenderIndicator"

export { SenderIndicator, SenderBadgeIcon, getInitials, getTooltipLabel }
