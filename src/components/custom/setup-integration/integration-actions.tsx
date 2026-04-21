import * as React from "react"
import { cn } from "../../../lib/utils"
import { Spinner } from "../../ui/spinner"
import type { SetupIntegrationAction } from "./types"

export interface IntegrationActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  actionLabel?: string
  isActionLoading?: boolean
  isActionDisabled?: boolean
  onAction?: () => void
  actionMode?: SetupIntegrationAction
}

const IntegrationActions = React.forwardRef<
  HTMLDivElement,
  IntegrationActionsProps
>(
  (
    {
      className,
      actionLabel = "Test Integration",
      isActionLoading = false,
      isActionDisabled = false,
      onAction,
      actionMode: _actionMode,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex shrink-0 flex-col items-stretch gap-2 px-4 pb-4 pt-2 sm:flex-row sm:items-center sm:justify-end sm:gap-0 sm:px-6 sm:pb-5",
        className
      )}
      {...props}
    >
      <button
        type="button"
        disabled={isActionDisabled || isActionLoading}
        onClick={onAction}
        className={cn(
          "flex h-12 w-full min-w-0 shrink-0 items-center justify-center gap-2 rounded px-4 text-sm font-semibold tracking-wide text-semantic-text-inverted transition-colors sm:w-auto",
          isActionDisabled || isActionLoading
            ? "cursor-not-allowed bg-semantic-disabled-primary"
            : "bg-semantic-primary hover:bg-semantic-primary-hover"
        )}
      >
        {isActionLoading && (
          <Spinner size="sm" className="text-semantic-text-inverted" />
        )}
        {actionLabel}
      </button>
    </div>
  )
)
IntegrationActions.displayName = "IntegrationActions"

export { IntegrationActions }
