import * as React from "react"
import { cn } from "../../../lib/utils"
import { ChatInput } from "./chat-input"
import { IntegrationActions } from "./integration-actions"
import { IntegrationAssistantBar } from "./integration-assistant-bar"
import { IntegrationAssistantSection } from "./integration-assistant-section"
import { IntegrationChatMessages } from "./integration-chat-messages"
import { IntegrationHeader } from "./integration-header"
import type { SetupIntegrationViewProps } from "./types"

const SetupIntegrationView = React.forwardRef<
  HTMLDivElement,
  SetupIntegrationViewProps
>(
  (
    {
      className,
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
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex w-[860px] max-w-full flex-col gap-0 overflow-hidden border-semantic-border-layout bg-semantic-bg-primary shadow-sm",
        className
      )}
      {...props}
    >
      <IntegrationHeader
        title={title}
        subtitle={subtitle}
        integrationName={integrationName}
        onIntegrationNameChange={onIntegrationNameChange}
        onBack={onBack}
        onClose={onClose}
      />

      <IntegrationAssistantSection>
        <IntegrationAssistantBar onResetClick={onResetChat} />
        <IntegrationChatMessages messages={messages} />
        <ChatInput
          value={inputValue}
          placeholder={inputPlaceholder}
          disabled={isInputDisabled}
          onValueChange={onInputChange}
          onSend={onSendMessage}
        />
      </IntegrationAssistantSection>

      <IntegrationActions
        actionLabel={actionLabel}
        isActionDisabled={isActionDisabled}
        isActionLoading={isActionLoading}
        onAction={onAction}
        actionMode={actionMode}
      />
    </div>
  )
)
SetupIntegrationView.displayName = "SetupIntegrationView"

export { SetupIntegrationView }
