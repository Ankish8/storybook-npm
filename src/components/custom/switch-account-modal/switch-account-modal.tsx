import * as React from "react"
import { Info, FileText, X } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog"
import type { SwitchAccountModalProps } from "./types"

const SwitchAccountModal = React.forwardRef<
  HTMLDivElement,
  SwitchAccountModalProps
>(
  (
    {
      className,
      open,
      onOpenChange,
      accountId,
      affectedIntegrations,
      cancelLabel = "Cancel",
      confirmLabel = "Confirm",
      isConfirming = false,
      onCancel,
      onConfirm,
      ...props
    },
    ref
  ) => {
    const handleCancel = () => {
      onCancel?.()
      onOpenChange(false)
    }

    const handleConfirm = () => {
      onConfirm?.()
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          hideCloseButton
          className="w-[504px] max-w-none gap-0 overflow-hidden border-semantic-border-layout bg-semantic-bg-primary p-0 shadow-sm"
        >
          <div
            ref={ref}
            className={cn("flex flex-col gap-6 p-6", className)}
            {...props}
          >
            {/* Header */}
            <div className="flex flex-col gap-2">
              <DialogTitle className="m-0 text-base font-semibold leading-normal text-semantic-text-primary">
                Switch Account?
              </DialogTitle>
              <DialogDescription className="m-0 text-sm tracking-wide text-semantic-text-muted">
                You are switching to account {accountId}. Each toolkit can only
                have one active account per bot.
              </DialogDescription>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4">
              {/* Info Banner */}
              <div className="flex items-start gap-2.5 rounded border border-semantic-info-border bg-semantic-info-surface p-3">
                <Info className="size-[18px] shrink-0 text-semantic-info-text" />
                <p className="m-0 text-sm tracking-wide text-semantic-info-text">
                  All the current integrations will be affected which might
                  lead to malfunctioning of the bot.
                </p>
              </div>

              {/* Affected Integrations */}
              <div className="flex flex-col gap-2.5">
                <p className="m-0 text-xs font-semibold tracking-[0.06em] text-semantic-text-muted">
                  Affected Integrations
                </p>
                <div className="rounded border border-semantic-border-layout px-4 py-2.5">
                  <ul className="m-0 flex max-h-[130px] list-none flex-col gap-1.5 overflow-y-auto p-0">
                    {affectedIntegrations.length === 0 ? (
                      <li>
                        <p className="m-0 py-2 text-xs tracking-wide text-semantic-text-muted">
                          No integrations are currently affected.
                        </p>
                      </li>
                    ) : (
                      affectedIntegrations.map((integration) => (
                        <li
                          key={integration.id}
                          className="flex h-7 items-center gap-2"
                        >
                          <span className="flex size-4 shrink-0 items-center justify-center text-semantic-text-primary">
                            {integration.icon ?? (
                              <FileText className="size-4" />
                            )}
                          </span>
                          <p className="m-0 truncate text-xs tracking-wide text-semantic-text-primary">
                            {integration.name}
                          </p>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                size="default"
                onClick={handleCancel}
                disabled={isConfirming}
              >
                {cancelLabel}
              </Button>
              <Button
                variant="primary"
                size="default"
                onClick={handleConfirm}
                loading={isConfirming}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>

          {/* Close button (top-right) */}
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Close"
            className="absolute right-2 top-2 flex size-6 items-center justify-center rounded text-semantic-text-primary transition-colors hover:bg-semantic-bg-hover"
          >
            <X className="size-3" />
          </button>
        </DialogContent>
      </Dialog>
    )
  }
)
SwitchAccountModal.displayName = "SwitchAccountModal"

export { SwitchAccountModal }
