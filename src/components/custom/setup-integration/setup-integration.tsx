import * as React from "react";
import { cn } from "../../../lib/utils";
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog";
import { ConfirmationModal } from "../../ui/confirmation-modal";
import { SetupIntegrationView } from "./setup-integration-view";
import type { SetupIntegrationProps } from "./types";

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
      messagesAreaClassName,
      emptyChatTitle,
      emptyChatDescription,
      emptyChatIcon,
      emptyChatSecondary,
      inputValue = "",
      isInputDisabled = false,
      inputPlaceholder = "Describe your action… (Shift+Enter for new line)",
      isActionLoading = false,
      actionLabel = "Test Integration",
      isActionDisabled = false,
      actionMode = "test",
      integrationName,
      onIntegrationNameChange,
      onConfirmIntegrationName,
      isIntegrationNameLoading = false,
      onClose,
      onBack,
      onInputChange,
      onInputKeyDown,
      onSendMessage,
      onAction,
      onResetChat,
      ...rest
    },
    ref
  ) => {
    const [showResetConfirm, setShowResetConfirm] = React.useState(false);
    const [showDiscardConfirm, setShowDiscardConfirm] = React.useState(false);

    const handleDiscardRequest = () => {
      setShowDiscardConfirm(true);
    };

    const handleResetRequest = () => {
      setShowResetConfirm(true);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          hideCloseButton
          className={cn(
            "flex h-[min(100dvh-1rem,920px)] max-h-[min(100dvh-1rem,920px)] min-h-0 w-[min(calc(100vw-1rem),860px)] max-w-none min-w-0 flex-col gap-0 overflow-hidden border border-solid border-semantic-border-layout bg-semantic-bg-primary p-0 shadow-sm",
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
            messagesAreaClassName={messagesAreaClassName}
            emptyChatTitle={emptyChatTitle}
            emptyChatDescription={emptyChatDescription}
            emptyChatIcon={emptyChatIcon}
            emptyChatSecondary={emptyChatSecondary}
            inputValue={inputValue}
            isInputDisabled={isInputDisabled}
            inputPlaceholder={inputPlaceholder}
            isActionLoading={isActionLoading}
            actionLabel={actionLabel}
            isActionDisabled={isActionDisabled}
            actionMode={actionMode}
            integrationName={integrationName}
            onIntegrationNameChange={onIntegrationNameChange}
            onConfirmIntegrationName={onConfirmIntegrationName}
            isIntegrationNameLoading={isIntegrationNameLoading}
            onClose={onClose ? handleDiscardRequest : undefined}
            onBack={onBack ? handleDiscardRequest : undefined}
            onInputChange={onInputChange}
            onInputKeyDown={onInputKeyDown}
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
            setShowResetConfirm(false);
            onResetChat?.();
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
            setShowDiscardConfirm(false);
            onClose?.();
          }}
        />
      </Dialog>
    );
  }
);
SetupIntegration.displayName = "SetupIntegration";

export { SetupIntegration };
