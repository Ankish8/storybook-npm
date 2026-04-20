import * as React from "react"
import { cn } from "../../../lib/utils"
import { MarkdownBubbleContent } from "./markdown-content"
import type { MarkdownBubbleTone } from "./markdown-content"
import type { ChatMessage, ChatMessageProps } from "./types"

function bubbleTone(
  role: "assistant" | "user",
  variant: NonNullable<ChatMessage["variant"]>
): MarkdownBubbleTone {
  if (role === "user") {
    if (variant === "error") return "user-error"
    if (variant === "success") return "user-success"
    return "user-default"
  }
  if (variant === "error") return "assistant-error"
  if (variant === "success") return "assistant-success"
  return "assistant-default"
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
