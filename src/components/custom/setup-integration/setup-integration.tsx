import * as React from "react"
import { ArrowLeft, X, Sparkles, RotateCcw, Pencil, Check } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Spinner } from "../../ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../ui/dialog"
import { ConfirmationModal } from "../../ui/confirmation-modal"
import { ChatMessageBubble } from "./chat-message"
import { ChatInput } from "./chat-input"
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
      ...props
    },
    ref
  ) => {
    const messagesEndRef = React.useRef<HTMLDivElement>(null)
    const [showResetConfirm, setShowResetConfirm] = React.useState(false)
    const [showDiscardConfirm, setShowDiscardConfirm] = React.useState(false)
    const [isEditingName, setIsEditingName] = React.useState(false)
    const [editNameDraft, setEditNameDraft] = React.useState("")

    const handleEditName = () => {
      setEditNameDraft(integrationName ?? "")
      setIsEditingName(true)
    }

    const handleConfirmName = () => {
      const trimmed = editNameDraft.trim()
      if (trimmed && trimmed !== integrationName) {
        onIntegrationNameChange?.(trimmed)
      }
      setIsEditingName(false)
    }

    const handleEditNameKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleConfirmName()
      } else if (e.key === "Escape") {
        setIsEditingName(false)
      }
    }

    // Auto-scroll to bottom when messages change
    React.useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          hideCloseButton
          className={cn(
            "flex w-[860px] max-w-none flex-col gap-0 overflow-hidden border-semantic-border-layout bg-semantic-bg-primary p-0 shadow-sm",
            className
          )}
          {...props}
        >
          <DialogTitle className="sr-only">
            {integrationName ? `${title} - ${integrationName}` : title}
          </DialogTitle>

          {/* Step Header */}
          <div className="flex items-center gap-2.5 border-b border-semantic-border-layout p-6">
            {onBack && (
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(true)}
                className="shrink-0 text-semantic-text-primary hover:text-semantic-text-secondary transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="size-6" />
              </button>
            )}
            <div className="flex flex-1 flex-col gap-0.5">
              {integrationName !== undefined ? (
                <div className="flex items-center gap-1.5">
                  <h2 className="m-0 shrink-0 text-lg font-semibold text-semantic-text-primary">
                    {title} -
                  </h2>
                  {isEditingName ? (
                    <>
                      <input
                        type="text"
                        value={editNameDraft}
                        onChange={(e) => setEditNameDraft(e.target.value)}
                        onKeyDown={handleEditNameKeyDown}
                        autoFocus
                        className="m-0 h-8 rounded border border-semantic-border-focus bg-semantic-bg-primary px-2 text-lg font-semibold text-semantic-text-primary outline-none"
                        aria-label="Integration name"
                      />
                      <button
                        type="button"
                        onClick={handleConfirmName}
                        className="shrink-0 text-semantic-text-secondary hover:text-semantic-text-primary transition-colors"
                        aria-label="Confirm name"
                      >
                        <Check className="size-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-semibold text-semantic-text-primary">
                        {integrationName}
                      </span>
                      {onIntegrationNameChange && (
                        <button
                          type="button"
                          onClick={handleEditName}
                          className="shrink-0 text-semantic-text-muted hover:text-semantic-text-secondary transition-colors"
                          aria-label="Edit integration name"
                        >
                          <Pencil className="size-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <h2 className="m-0 text-lg font-semibold text-semantic-text-primary">
                  {title}
                </h2>
              )}
              <p className="m-0 text-xs tracking-wide text-semantic-text-muted">
                {subtitle}
              </p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(true)}
                className="flex size-8 shrink-0 items-center justify-center rounded text-semantic-text-primary hover:text-semantic-text-secondary hover:bg-semantic-bg-hover transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* AI Assistant Bar */}
          <div className="flex h-[52px] items-center justify-between border-b border-[#e4e4e4] bg-semantic-info-surface-subtle px-6">
            <div className="flex items-center gap-2.5 px-1">
              <Sparkles className="size-[18px] text-semantic-text-secondary" />
              <span className="text-sm font-semibold tracking-wide text-semantic-text-primary">
                AI Assistant
              </span>
            </div>
            {onResetChat && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1 text-sm font-semibold tracking-wide text-semantic-text-muted hover:text-semantic-text-secondary transition-colors"
              >
                <RotateCcw className="size-[11px]" />
                Reset Chat
              </button>
            )}
          </div>

          {/* Chat Messages Area */}
          <div className="h-[454px]">
            <div className="flex h-full flex-col gap-5 overflow-y-auto p-6">
              {messages.map((msg) => (
                <ChatMessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <ChatInput
            value={inputValue}
            placeholder={inputPlaceholder}
            disabled={isInputDisabled}
            onValueChange={onInputChange}
            onSend={onSendMessage}
          />

          {/* Action Button — right-aligned */}
          <div className="flex items-center justify-end px-6 pb-5 pt-2">
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
        </DialogContent>

        {/* Reset Chat Confirmation */}
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

        {/* Discard Integration Confirmation */}
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
