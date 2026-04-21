import * as React from "react"
import { SendHorizontal } from "lucide-react"
import { cn } from "../../../lib/utils"
import type { ChatInputProps } from "./types"

const MAX_TEXTAREA_HEIGHT_PX = 200

const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  (
    {
      value,
      placeholder = "Describe your action...",
      disabled = false,
      onValueChange,
      onSend,
      onInputKeyDown,
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const resizeTextarea = React.useCallback(() => {
      const el = textareaRef.current
      if (!el) return
      el.style.height = "auto"
      const next = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)
      el.style.height = `${Math.max(next, 48)}px`
    }, [])

    React.useLayoutEffect(() => {
      resizeTextarea()
    }, [value, resizeTextarea])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onInputKeyDown?.(e)
      if (e.defaultPrevented) return
      if (e.key === "Enter" && !e.shiftKey) {
        if (value.trim() && onSend && !disabled) {
          e.preventDefault()
          onSend(value.trim())
        } else if (!value.trim()) {
          e.preventDefault()
        }
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
        className="relative z-10 shrink-0 border-t border-semantic-border-layout bg-semantic-bg-primary px-4 pb-2 pt-4 sm:px-6 sm:pt-5"
      >
        <div className="flex min-h-12 max-h-[min(200px,40vh)] items-end rounded-[10px] border border-semantic-border-input bg-semantic-bg-primary pl-3 pr-1 shadow-[4px_4px_25px_0px_rgba(0,0,0,0.04)] sm:pl-4">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            aria-multiline="true"
            className={cn(
              "max-h-[200px] min-h-12 flex-1 resize-none bg-transparent py-3 text-sm leading-relaxed text-semantic-text-primary outline-none",
              "placeholder:text-semantic-text-placeholder",
              disabled && "cursor-not-allowed opacity-50"
            )}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className={cn(
              "mb-1 flex size-10 shrink-0 items-center justify-center rounded-lg bg-semantic-bg-ui transition-colors",
              value.trim() && !disabled
                ? "text-semantic-text-secondary hover:bg-semantic-bg-grey"
                : "cursor-not-allowed text-semantic-text-muted opacity-60"
            )}
            aria-label="Send message"
          >
            <SendHorizontal className="size-5" />
          </button>
        </div>
      </div>
    )
  }
)
ChatInput.displayName = "ChatInput"

export { ChatInput }
