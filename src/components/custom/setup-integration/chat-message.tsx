import * as React from "react"
import { cn } from "../../../lib/utils"
import type { ChatMessageProps } from "./types"

const ChatMessageBubble = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message }, ref) => {
    const { role, content, variant = "default", statusLabel } = message

    // Status messages — muted text, no bubble
    if (variant === "status") {
      return (
        <div ref={ref}>
          <p className="m-0 text-sm tracking-wide text-semantic-text-muted">
            {content}
          </p>
        </div>
      )
    }

    // User messages — right-aligned
    if (role === "user") {
      return (
        <div ref={ref} className="flex justify-end">
          <div className="rounded-lg rounded-br-none bg-semantic-bg-ui px-3 py-2.5">
            <p className="m-0 text-sm leading-normal text-semantic-text-primary">
              {content}
            </p>
          </div>
        </div>
      )
    }

    // Assistant messages — left-aligned
    const isSuccess = variant === "success"
    const isError = variant === "error"

    return (
      <div ref={ref} className="flex flex-col gap-1.5">
        {statusLabel && (
          <p className="m-0 text-sm tracking-wide text-semantic-text-muted">
            {statusLabel}
          </p>
        )}
        <div
          className={cn(
            "max-w-[70%] rounded-lg rounded-tl-none px-3 py-2.5",
            isError
              ? "bg-semantic-error-surface"
              : isSuccess
                ? "bg-semantic-success-surface"
                : "bg-semantic-info-surface"
          )}
        >
          <p
            className={cn(
              "m-0 text-sm leading-normal",
              isError
                ? "text-semantic-error-text"
                : isSuccess
                  ? "text-semantic-success-text"
                  : "text-semantic-text-primary"
            )}
          >
            {content}
          </p>
        </div>
      </div>
    )
  }
)
ChatMessageBubble.displayName = "ChatMessageBubble"

export { ChatMessageBubble }
