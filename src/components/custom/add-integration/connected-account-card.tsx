import * as React from "react"
import { User } from "lucide-react"
import { Button } from "../../ui/button"
import type { ConnectedAccountCardProps } from "./types"

const ConnectedAccountCard = React.forwardRef<
  HTMLDivElement,
  ConnectedAccountCardProps
>(({ account, actionLabel, onAction }, ref) => {
  return (
    <div
      ref={ref}
      className="flex items-center gap-4 rounded-lg border border-semantic-border-layout p-[13px]"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-semantic-bg-ui">
        <User className="size-5 text-semantic-text-muted" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2.5">
          <p className="m-0 text-base tracking-wide text-semantic-text-primary">
            {account.label}
          </p>
          {account.isActive && (
            <div className="flex items-center justify-center rounded-[25px] bg-semantic-success-surface px-3 py-1">
              <p className="m-0 text-xs font-semibold text-semantic-success-text">
                Active
              </p>
            </div>
          )}
        </div>
        <p className="m-0 text-sm tracking-wide text-semantic-text-muted">
          Created by {account.createdBy} &bull; {account.createdAt}
        </p>
      </div>
      <div className="flex shrink-0 items-center">
        <Button
          size="default"
          variant={actionLabel === "Switch" ? "outline" : "primary"}
          className="min-w-[96px]"
          onClick={() => onAction(account)}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  )
})
ConnectedAccountCard.displayName = "ConnectedAccountCard"

export { ConnectedAccountCard }
