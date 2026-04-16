import * as React from "react"
import { SendHorizonal } from "lucide-react"
import { cn } from "../../../lib/utils"
import type { ChatInputProps } from "./types"

const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  (
    {
      value,
      placeholder = "Describe your action...",
      disabled = false,
      onValueChange,
      onSend,
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey && value.trim() && onSend) {
        e.preventDefault()
        onSend(value.trim())
      }
    }

    const handleSend = () => {
      if (value.trim() && onSend) {
        onSend(value.trim())
      }
    }

    return (
      <div
        ref={ref}
        className="border-t border-semantic-border-layout px-6 pb-2 pt-5"
      >
        <div className="flex h-12 items-center rounded-[10px] border border-semantic-border-input bg-semantic-bg-primary pl-4 pr-1 shadow-[4px_4px_25px_0px_rgba(0,0,0,0.04)]">
          <input
            type="text"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent text-sm text-semantic-text-primary outline-none",
              "placeholder:text-semantic-text-placeholder",
              disabled && "cursor-not-allowed opacity-50"
            )}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg bg-semantic-bg-ui transition-colors",
              value.trim() && !disabled
                ? "text-semantic-text-secondary hover:bg-semantic-bg-grey"
                : "cursor-not-allowed text-semantic-text-muted opacity-60"
            )}
            aria-label="Send message"
          >
            <SendHorizonal className="size-5" />
          </button>
        </div>
      </div>
    )
  }
)
ChatInput.displayName = "ChatInput"

export { ChatInput }
