import * as React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "../../../lib/utils"

export interface IntegrationChatEmptySecondaryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional leading icon (defaults to Sparkles) */
  icon?: React.ReactNode
  /** Main text — tips, hints, or short guidance */
  children: React.ReactNode
}

const defaultIcon = (
  <Sparkles className="size-5 text-semantic-text-secondary" aria-hidden />
)

/**
 * Secondary panel below {@link IntegrationChatEmptyHint} — icon + text in a subtle surface.
 * Pass via `emptyChatSecondary` on SetupIntegration / SetupIntegrationView.
 */
const IntegrationChatEmptySecondary = React.forwardRef<
  HTMLDivElement,
  IntegrationChatEmptySecondaryProps
>(({ className, icon, children, ...props }, ref) => (
  <div
    ref={ref}
    role="note"
    className={cn(
      "flex w-full max-w-md flex-row items-start gap-3 rounded-lg border border-semantic-border-layout bg-semantic-bg-ui p-4 text-left",
      className
    )}
    {...props}
  >
    <span className="shrink-0">{icon ?? defaultIcon}</span>
    <p className="m-0 min-w-0 flex-1 text-sm leading-relaxed text-semantic-text-secondary">
      {children}
    </p>
  </div>
))
IntegrationChatEmptySecondary.displayName = "IntegrationChatEmptySecondary"

export { IntegrationChatEmptySecondary }
