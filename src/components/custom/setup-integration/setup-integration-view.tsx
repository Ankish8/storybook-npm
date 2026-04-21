import * as React from "react"
import { cn } from "../../../lib/utils"
import { ChatInput } from "./chat-input"
import { IntegrationActions } from "./integration-actions"
import { IntegrationAssistantBar } from "./integration-assistant-bar"
import { IntegrationAssistantSection } from "./integration-assistant-section"
import { IntegrationChatEmptySecondary } from "./integration-chat-empty-secondary"
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
      messagesAreaClassName,
      emptyChatTitle,
      emptyChatDescription,
      emptyChatIcon,
      emptyChatSecondary,
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
      onInputKeyDown,
      onSendMessage,
      onAction,
      onResetChat,
      ...props
    },
    ref
  ) => {
    const defaultEmptySecondary = (
      <IntegrationChatEmptySecondary>
        Describe what your bot should do with this integration. You can map fields,
        run tests, and publish when you are ready.
      </IntegrationChatEmptySecondary>
    )
    const resolvedEmptySecondary =
      emptyChatSecondary === null
        ? undefined
        : (emptyChatSecondary ?? defaultEmptySecondary)

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full min-h-0 w-full min-w-0 max-w-[860px] flex-col gap-0 overflow-hidden border-semantic-border-layout bg-semantic-bg-primary shadow-sm",
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
          <IntegrationChatMessages
            messages={messages}
            messagesAreaClassName={messagesAreaClassName}
            emptyChatTitle={emptyChatTitle}
            emptyChatDescription={emptyChatDescription}
            emptyChatIcon={emptyChatIcon}
            emptyChatSecondary={resolvedEmptySecondary}
          />
          <ChatInput
            value={inputValue}
            placeholder={inputPlaceholder}
            disabled={isInputDisabled}
            onValueChange={onInputChange}
            onInputKeyDown={onInputKeyDown}
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
  }
)
SetupIntegrationView.displayName = "SetupIntegrationView"

export { SetupIntegrationView }
