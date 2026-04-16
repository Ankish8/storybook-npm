import * as React from "react"
import { Sparkles, RotateCcw } from "lucide-react"
import { cn } from "../../../lib/utils"

export interface IntegrationAssistantBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Label next to the leading icon (default: "AI Assistant") */
  label?: string
  /** Reset control label (default: "Reset Chat") */
  resetLabel?: string
  onResetClick?: () => void
  leadingIcon?: React.ReactNode
  resetIcon?: React.ReactNode
}

const IntegrationAssistantBar = React.forwardRef<
  HTMLDivElement,
  IntegrationAssistantBarProps
>(
  (
    {
      className,
      label = "AI Assistant",
      resetLabel = "Reset Chat",
      onResetClick,
      leadingIcon,
      resetIcon,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex h-[52px] shrink-0 items-center justify-between border-b border-semantic-border-layout bg-semantic-info-surface-subtle px-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5 px-1">
        {leadingIcon ?? (
          <Sparkles className="size-[18px] text-semantic-text-secondary" />
        )}
        <span className="text-sm font-semibold tracking-wide text-semantic-text-primary">
          {label}
        </span>
      </div>
      {onResetClick && (
        <button
          type="button"
          onClick={onResetClick}
          className="flex items-center gap-1 text-sm font-semibold tracking-wide text-semantic-text-muted hover:text-semantic-text-secondary transition-colors"
        >
          {resetIcon ?? <RotateCcw className="size-[11px]" />}
          {resetLabel}
        </button>
      )}
    </div>
  )
)
IntegrationAssistantBar.displayName = "IntegrationAssistantBar"

export { IntegrationAssistantBar }
