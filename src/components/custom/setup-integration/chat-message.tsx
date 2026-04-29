import * as React from "react"
import { cn } from "../../../lib/utils"
import { BouncingLoader } from "./bouncing-loader"
import { MarkdownBubbleContent } from "./markdown-content"
import type { MarkdownBubbleTone } from "./markdown-content"
import type { ChatMessage, ChatMessageProps } from "./types"

function bubbleTone(
  role: "assistant" | "user",
  variant: NonNullable<ChatMessage["variant"]>
): MarkdownBubbleTone {
  if (variant === "loading") {
    return role === "user" ? "user-default" : "assistant-default"
  }
  if (role === "user") {
    if (variant === "error") return "user-error"
    if (variant === "success") return "user-success"
    return "user-default"
  }
  if (variant === "error") return "assistant-error"
  if (variant === "success") return "assistant-success"
  return "assistant-default"
}

function isChatLoading(message: ChatMessage): boolean {
  const { variant, isLoading } = message
  if (variant === "status") return false
  return isLoading === true || variant === "loading"
}

/** Bouncing three-dot typing indicator: light `bg-ui` pill with `BouncingLoader` dots. */
function ChatMessageTypingPill() {
  return (
    <div
      className="inline-flex min-w-[2.75rem] items-center justify-center rounded-full bg-semantic-bg-ui px-3.5 py-2.5"
      data-slot="chat-message-typing"
    >
      <BouncingLoader
        size={8}
        spacing={6}
        color="var(--semantic-text-placeholder)"
      />
    </div>
  )
}

const ChatMessageBubble = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message }, ref) => {
    const { role, content, variant = "default", statusLabel } = message
    const trimmedContent = content.trim()

    // Status messages — muted text, no bubble
    if (variant === "status") {
      return (
        <div ref={ref} className="flex flex-col items-start">
          <p className="m-0 max-w-full break-words text-sm leading-normal tracking-wide text-semantic-text-muted sm:max-w-[70%]">
            {content}
          </p>
        </div>
      )
    }

    if (isChatLoading(message)) {
      if (role === "user") {
        return (
          <div
            ref={ref}
            className="flex justify-end"
            role="status"
            aria-label="Sending message"
          >
            <ChatMessageTypingPill />
          </div>
        )
      }
      return (
        <div ref={ref} className="flex flex-col items-start gap-1.5" role="status" aria-label="Assistant is typing">
          {statusLabel && (
            <p className="m-0 max-w-full break-words text-sm leading-normal tracking-wide text-semantic-text-muted sm:max-w-[70%]">
              {statusLabel}
            </p>
          )}
          <ChatMessageTypingPill />
        </div>
      )
    }

    // User messages — right-aligned, width fits content (capped for long text)
    if (role === "user") {
      const isUserError = variant === "error"
      const isUserSuccess = variant === "success"
      const mdTone = bubbleTone("user", variant)
      return (
        <div ref={ref} className="flex justify-end">
          <div
            className={cn(
              "w-fit min-w-0 max-w-[85%] rounded-lg rounded-br-none px-3 py-2.5 sm:max-w-[70%]",
              isUserError
                ? "bg-semantic-error-surface"
                : isUserSuccess
                  ? "bg-semantic-success-surface"
                  : "bg-semantic-bg-ui"
            )}
          >
            <MarkdownBubbleContent
              markdown={content}
              tone={mdTone}
              className={cn(
                "break-words",
                isUserError
                  ? "text-semantic-error-text"
                  : isUserSuccess
                    ? "text-semantic-success-text"
                    : "text-semantic-text-primary"
              )}
            />
          </div>
        </div>
      )
    }

    // Assistant — progress line only (no bubble): empty body + statusLabel
    if (!trimmedContent && statusLabel) {
      return (
        <div ref={ref} className="flex flex-col items-start gap-1.5">
          <p className="m-0 max-w-full break-words text-sm leading-normal tracking-wide text-semantic-text-muted sm:max-w-[70%]">
            {statusLabel}
          </p>
        </div>
      )
    }

    // Assistant messages — left-aligned, bubble width fits content
    const isSuccess = variant === "success"
    const isError = variant === "error"
    const mdTone = bubbleTone("assistant", variant)

    return (
      <div ref={ref} className="flex flex-col items-start gap-1.5">
        {statusLabel && (
          <p className="m-0 max-w-full break-words text-sm leading-normal tracking-wide text-semantic-text-muted sm:max-w-[70%]">
            {statusLabel}
          </p>
        )}
        <div
          className={cn(
            "w-fit min-w-0 max-w-[85%] rounded-lg rounded-tl-none px-3 py-2.5 sm:max-w-[70%]",
            isError
              ? "bg-semantic-error-surface"
              : isSuccess
                ? "bg-semantic-success-surface"
                : "bg-semantic-info-surface"
          )}
        >
          <MarkdownBubbleContent
            markdown={content}
            tone={mdTone}
            className={cn(
              "break-words",
              isError
                ? "text-semantic-error-text"
                : isSuccess
                  ? "text-semantic-success-text"
                  : "text-semantic-text-primary"
            )}
          />
        </div>
      </div>
    )
  }
)
ChatMessageBubble.displayName = "ChatMessageBubble"

export { ChatMessageBubble }
