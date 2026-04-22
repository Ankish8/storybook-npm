import * as React from "react"
import { User } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { Spinner } from "../../ui/spinner"
import type { ConnectedAccountCardProps, ComposioAccountRowStatus } from "./types"

function StatusBadge({ status }: { status: ComposioAccountRowStatus }) {
  if (status === "active") {
    return (
      <div className="flex shrink-0 items-center justify-center rounded-[25px] bg-semantic-success-surface px-3 py-1">
        <p className="m-0 text-xs font-semibold text-semantic-success-text">Active</p>
      </div>
    )
  }
  if (status === "expired") {
    return (
      <div className="flex shrink-0 items-center justify-center rounded-[25px] bg-semantic-error-surface px-3 py-1">
        <p className="m-0 text-xs font-semibold text-semantic-error-text">Expired</p>
      </div>
    )
  }
  if (status === "initialized") {
    return (
      <div className="flex shrink-0 items-center justify-center rounded-[25px] bg-semantic-bg-ui px-3 py-1">
        <p className="m-0 text-xs font-semibold text-semantic-text-secondary">
          Initialized
        </p>
      </div>
    )
  }
  return null
}

const actionBtnClass =
  "h-8 min-h-8 w-full min-w-0 px-4 py-0 sm:min-w-[96px] sm:w-auto"

const ConnectedAccountCard = React.forwardRef<
  HTMLDivElement,
  ConnectedAccountCardProps
>(({ account, rowStatus, showAction, actionType, onAction }, ref) => {
  const showBadge =
    rowStatus === "active" ||
    rowStatus === "expired" ||
    rowStatus === "initialized"

  return (
    <div
      ref={ref}
      className="flex flex-col gap-3 rounded-lg border border-semantic-border-layout p-3 sm:min-h-[70px] sm:flex-row sm:items-center sm:gap-4 sm:p-[13px]"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-semantic-bg-ui">
          <User className="size-5 text-semantic-text-muted" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-2.5">
            <p className="m-0 break-words text-base font-normal leading-normal tracking-wide text-semantic-text-primary">
              {account.label}
            </p>
            {showBadge && <StatusBadge status={rowStatus} />}
          </div>
          <p className="m-0 break-words text-sm tracking-wide text-semantic-text-muted">
            Created by {account.createdBy} &bull; {account.createdAt}
          </p>
        </div>
      </div>
      {showAction && (
        <div
          className={cn(
            "flex w-full shrink-0 items-stretch justify-end sm:w-auto sm:min-w-[96px] sm:items-center",
            actionType === "spinner" ? "sm:justify-end" : ""
          )}
        >
          {actionType === "spinner" && (
            <div className="flex w-full justify-end sm:w-auto sm:min-w-[96px] sm:justify-center">
              <Spinner
                size="default"
                className="size-6"
                aria-label="Account initializing"
              />
            </div>
          )}
          {actionType === "continue" && (
            <Button
              size="sm"
              variant="primary"
              className={actionBtnClass}
              onClick={() => onAction(account)}
            >
              Continue
            </Button>
          )}
          {actionType === "switch" && (
            <Button
              size="sm"
              variant="outline"
              className={actionBtnClass}
              onClick={() => onAction(account)}
            >
              Switch
            </Button>
          )}
          {actionType === "reconnect" && (
            <Button
              size="sm"
              variant="outline"
              className={actionBtnClass}
              onClick={() => onAction(account)}
            >
              Reconnect
            </Button>
          )}
        </div>
      )}
    </div>
  )
})
ConnectedAccountCard.displayName = "ConnectedAccountCard"

export { ConnectedAccountCard }
