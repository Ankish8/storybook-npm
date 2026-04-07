import * as React from "react"

/**
 * Chat message — OpenAI-compatible core fields (role, content)
 * with additional UI metadata for rendering.
 */
export interface ChatMessage {
  /** Unique identifier for React keys */
  id: string
  /** Message role — matches OpenAI chat completions format */
  role: "assistant" | "user"
  /** Message text content */
  content: string
  /**
   * Visual variant for the message bubble:
   * - "default" — assistant: info surface, user: gray surface (default)
   * - "success" — green success surface (typically final confirmation)
   * - "error" — red error surface (AI processing failure)
   * - "status" — no bubble, muted text with avatar (e.g., "Mapping tool...")
   */
  variant?: "default" | "success" | "error" | "status"
  /** Optional status label shown above the message bubble (e.g., "Running test...") */
  statusLabel?: string
}

/** Action button mode — controls the primary action at the bottom */
export type SetupIntegrationAction = "test" | "publish"

export interface SetupIntegrationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  open: boolean
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void
  /** Header title (e.g., "Setup Integration", "Test Integration") */
  title?: string
  /** Step subtitle (e.g., "Step 3 of 4") */
  subtitle?: string
  /** Chat messages to display */
  messages: ChatMessage[]
  /** Current text input value */
  inputValue?: string
  /** Whether the text input is disabled */
  isInputDisabled?: boolean
  /** Placeholder text for the input */
  inputPlaceholder?: string
  /** Whether the action button shows a loading spinner */
  isActionLoading?: boolean
  /** Action button label (e.g., "Test Integration", "Publish Integration") */
  actionLabel?: string
  /** Whether the action button is disabled */
  isActionDisabled?: boolean
  /** Current action mode — controls button styling */
  actionMode?: SetupIntegrationAction
  /** Integration name shown in header for edit mode (e.g., "Integration test 1") */
  integrationName?: string
  /** Callback when integration name is changed (confirmed via checkmark or Enter) */
  onIntegrationNameChange?: (name: string) => void
  /** Callback when close (X) is clicked */
  onClose?: () => void
  /** Callback when back arrow is clicked */
  onBack?: () => void
  /** Callback when text input value changes */
  onInputChange?: (value: string) => void
  /** Callback when a message is sent (Enter or send button) */
  onSendMessage?: (message: string) => void
  /** Callback when the primary action button is clicked */
  onAction?: () => void
  /** Callback when "Reset Chat" is clicked */
  onResetChat?: () => void
}

/** Props for the internal ChatMessage sub-component */
export interface ChatMessageProps {
  message: ChatMessage
}

/** Props for the internal ChatInput sub-component */
export interface ChatInputProps {
  value: string
  placeholder?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
  onSend?: (message: string) => void
}
