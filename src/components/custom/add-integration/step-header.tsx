import * as React from "react"
import { ArrowLeft, X } from "lucide-react"
import { cn } from "../../../lib/utils"
import type { StepHeaderProps } from "./types"

const StepHeader = React.forwardRef<HTMLDivElement, StepHeaderProps>(
  ({ title, subtitle, showBack = false, onBack, onClose }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 border-b border-semantic-border-layout p-4 sm:gap-6 sm:p-6"
        )}
      >
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 text-semantic-text-primary hover:text-semantic-text-secondary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="size-6" />
          </button>
        )}
        <div className="min-w-0 flex flex-1 flex-col gap-0.5">
          <h2 className="m-0 line-clamp-2 text-base font-semibold text-semantic-text-primary sm:text-lg">
            {title}
          </h2>
          <p className="m-0 text-xs tracking-wide text-semantic-text-muted">
            {subtitle}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded text-semantic-text-primary hover:text-semantic-text-secondary hover:bg-semantic-bg-hover transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    )
  }
)
StepHeader.displayName = "StepHeader"

export { StepHeader }
