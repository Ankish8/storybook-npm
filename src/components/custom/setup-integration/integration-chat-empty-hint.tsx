import * as React from "react"
import { MessageSquare } from "lucide-react"
import { cn } from "../../../lib/utils"
import { EmptyState } from "../../ui/empty-state"

export interface IntegrationChatEmptyHintProps {
  /** Bold heading */
  title: React.ReactNode
  /** Optional supporting line */
  description?: React.ReactNode
  /** Replaces the default message icon */
  icon?: React.ReactNode
  className?: string
}

const defaultIcon = (
  <MessageSquare className="size-10 text-semantic-text-secondary" aria-hidden />
)

/**
 * Centered empty transcript: icon + title + description. Uses {@link EmptyState}.
 */
function IntegrationChatEmptyHint({
  title,
  description,
  icon,
  className,
}: IntegrationChatEmptyHintProps) {
  return (
    <EmptyState
      icon={icon ?? defaultIcon}
      title={title}
      description={description}
      className={cn("py-8", className)}
    />
  )
}
IntegrationChatEmptyHint.displayName = "IntegrationChatEmptyHint"

export { IntegrationChatEmptyHint }
