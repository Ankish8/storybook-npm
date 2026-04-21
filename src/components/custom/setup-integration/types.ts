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
  /**
   * Message body. User and assistant bubbles render this as GitHub-Flavored Markdown
   * (lists, bold/italic, fenced code, tables, task lists, links). Status-only lines
   * use plain text.
   */
  content: string
  /**
   * Visual variant for the message bubble:
   * - "default" — assistant: info surface, user: gray surface (default)
   * - "success" — green success surface (assistant or user)
   * - "error" — red error surface (assistant or user-authored failure)
   * - "status" — no bubble, muted text only (e.g., "Mapping tool…", "Running test…")
   */
  variant?: "default" | "success" | "error" | "status"
  /**
   * Optional label above the assistant bubble (no bubble on this line), e.g. "Running test…".
   * If `content` is empty/whitespace and this is set, only this line is shown (progress, no bubble below).
   */
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
  /**
   * Classes for the messages scroll region outer wrapper (passed to IntegrationChatMessages).
   * Defaults to a flex child that fills remaining space (`flex-1 min-h-0`) so the composer
   * and footer stay visible on short viewports; empty content scrolls inside the region.
   */
  messagesAreaClassName?: string
  /** Empty transcript title (centered with icon) — shown when `messages.length === 0` */
  emptyChatTitle?: React.ReactNode
  /** Empty transcript description — shown when `messages.length === 0` */
  emptyChatDescription?: React.ReactNode
  /** Custom icon for the empty transcript — shown when `messages.length === 0` */
  emptyChatIcon?: React.ReactNode
  /**
   * Extra block below the main empty hint (e.g. {@link IntegrationChatEmptySecondary}).
   * Only shown when `messages.length === 0`.
   * Omit or leave undefined to use the built-in tip; pass `null` to hide the secondary block.
   */
  emptyChatSecondary?: React.ReactNode | null
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
  /**
   * Optional keyboard handler on the message field (textarea).
   * Runs after the built-in handling: **Enter** sends (when not empty), **Shift+Enter** inserts a new line.
   * Call `preventDefault()` on the event to override send-on-Enter.
   */
  onInputKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  /** Callback when the primary action button is clicked */
  onAction?: () => void
  /** Callback when "Reset Chat" is clicked */
  onResetChat?: () => void
}

/** Presentational layout — no Dialog; use inside any container. */
export type SetupIntegrationViewProps = Omit<
  SetupIntegrationProps,
  "open" | "onOpenChange"
>

/** Props for the internal ChatMessage sub-component */
export interface ChatMessageProps {
  message: ChatMessage
}

/** Props for the internal ChatInput sub-component */
export interface ChatInputProps {
  value: string
  /**
   * Shown when the field is empty. The field is a multi-line textarea: compose Markdown
   * (**bold**, lists, tables, etc.); it is sent as plain text for the host to persist.
   */
  placeholder?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
  onSend?: (message: string) => void
  /** @see SetupIntegrationProps.onInputKeyDown */
  onInputKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}
