import * as React from "react"
import { User, Trash2 } from "lucide-react"
import { Button } from "../../ui/button"
import { cn } from "../../../lib/utils"
import type { ConnectedAccountCardProps } from "./types"

const ConnectedAccountCard = React.forwardRef<
  HTMLDivElement,
  ConnectedAccountCardProps
>(({ account, onUse, onDelete }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-4 rounded-lg border border-semantic-border-layout p-[13px]"
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-semantic-bg-ui">
        <User className="size-5 text-semantic-text-muted" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="m-0 text-base tracking-wide text-semantic-text-primary">
          {account.label}
        </p>
        <p className="m-0 text-sm tracking-wide text-semantic-text-muted">
          Created by {account.createdBy} &bull; {account.createdAt}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <Button
          size="sm"
          variant="primary"
          onClick={() => onUse(account)}
        >
          Use this
        </Button>
        <button
          type="button"
          onClick={() => onDelete(account)}
          className="flex size-8 items-center justify-center rounded text-semantic-text-muted hover:text-semantic-error-primary transition-colors"
          aria-label={`Delete account ${account.label}`}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  )
})
ConnectedAccountCard.displayName = "ConnectedAccountCard"

export { ConnectedAccountCard }
