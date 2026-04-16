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
        "flex items-center justify-end px-6 pb-5 pt-2",
        className
      )}
      {...props}
    >
      <button
        type="button"
        disabled={isActionDisabled || isActionLoading}
        onClick={onAction}
        className={cn(
          "flex h-12 items-center justify-center gap-2 rounded px-4 text-sm font-semibold tracking-wide text-semantic-text-inverted transition-colors",
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
