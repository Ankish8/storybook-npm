import * as React from "react"
import { cn } from "../../../lib/utils"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../ui/dialog"
import { ConfirmationModal } from "../../ui/confirmation-modal"
import { SetupIntegrationView } from "./setup-integration-view"
import type { SetupIntegrationProps } from "./types"

const SetupIntegration = React.forwardRef<
  HTMLDivElement,
  SetupIntegrationProps
>(
  (
    {
      className,
      open,
      onOpenChange,
      title = "Setup Integration",
      subtitle = "Step 3 of 4",
      messages,
      inputValue = "",
      isInputDisabled = false,
      inputPlaceholder = "Describe your action...",
      isActionLoading = false,
      actionLabel = "Test Integration",
      isActionDisabled = false,
      actionMode = "test",
      integrationName,
      onIntegrationNameChange,
      onClose,
      onBack,
      onInputChange,
      onSendMessage,
      onAction,
      onResetChat,
      ...rest
    },
    ref
  ) => {
    const [showResetConfirm, setShowResetConfirm] = React.useState(false)
    const [showDiscardConfirm, setShowDiscardConfirm] = React.useState(false)

    const handleDiscardRequest = () => {
      setShowDiscardConfirm(true)
    }

    const handleResetRequest = () => {
      setShowResetConfirm(true)
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          hideCloseButton
          className={cn(
            "flex h-[min(100dvh-1rem,920px)] max-h-[min(100dvh-1rem,920px)] w-[min(calc(100vw-1rem),860px)] max-w-none min-w-0 flex-col gap-0 overflow-hidden border-semantic-border-layout bg-semantic-bg-primary p-0 shadow-sm",
            className
          )}
          {...rest}
        >
          <DialogTitle className="sr-only">
            {integrationName ? `${title} - ${integrationName}` : title}
          </DialogTitle>

          <SetupIntegrationView
            className="w-full max-w-none border-0 shadow-none"
            title={title}
            subtitle={subtitle}
            messages={messages}
            inputValue={inputValue}
            isInputDisabled={isInputDisabled}
            inputPlaceholder={inputPlaceholder}
            isActionLoading={isActionLoading}
            actionLabel={actionLabel}
            isActionDisabled={isActionDisabled}
            actionMode={actionMode}
            integrationName={integrationName}
            onIntegrationNameChange={onIntegrationNameChange}
            onClose={onClose ? handleDiscardRequest : undefined}
            onBack={onBack ? handleDiscardRequest : undefined}
            onInputChange={onInputChange}
            onSendMessage={onSendMessage}
            onAction={onAction}
            onResetChat={onResetChat ? handleResetRequest : undefined}
          />
        </DialogContent>

        <ConfirmationModal
          open={showResetConfirm}
          onOpenChange={setShowResetConfirm}
          title="Reset Chat?"
          description="This will clear your entire conversation. This cannot be undone."
          variant="destructive"
          confirmButtonText="Confirm"
          cancelButtonText="Cancel"
          onConfirm={() => {
            setShowResetConfirm(false)
            onResetChat?.()
          }}
        />

        <ConfirmationModal
          open={showDiscardConfirm}
          onOpenChange={setShowDiscardConfirm}
          title="Discard integration?"
          description="Are you sure you want to close this? Unsaved progress will be lost."
          variant="destructive"
          confirmButtonText="Discard"
          cancelButtonText="Cancel"
          onConfirm={() => {
            setShowDiscardConfirm(false)
            onClose?.()
          }}
        />
      </Dialog>
    )
  }
)
SetupIntegration.displayName = "SetupIntegration"

export { SetupIntegration }
