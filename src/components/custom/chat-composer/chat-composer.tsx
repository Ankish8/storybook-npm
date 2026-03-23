import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { ReplyQuote } from "../../ui/reply-quote";
import { X, ChevronDown } from "lucide-react";
import type { ChatComposerProps } from "./types";

/**
 * ChatComposer provides a message composition area with textarea, action buttons,
 * reply-to preview, attachment slot, and send button. Also supports an "expired"
 * state showing a template prompt instead of the full composer.
 *
 * The textarea auto-resizes as the user types, up to a maximum height.
 * Use the `onKeyDown` prop to handle keyboard events like Enter-to-send
 * or arrow-key navigation in autocomplete/canned-message menus.
 *
 * @example
 * ```tsx
 * <ChatComposer
 *   value={text}
 *   onChange={setText}
 *   onSend={handleSend}
 *   onKeyDown={(e) => {
 *     if (e.key === "Enter" && !e.shiftKey) {
 *       e.preventDefault();
 *       handleSend();
 *     }
 *   }}
 *   placeholder="Type a message"
 * />
 * ```
 */
const ChatComposer = React.forwardRef<HTMLDivElement, ChatComposerProps>(
  (
    {
      className,
      value,
      onChange,
      onSend,
      placeholder = "Type a message",
      textareaId,
      textareaAriaLabel,
      disabled = false,
      onKeyDown,
      reply,
      onDismissReply,
      onReplyClick,
      attachment,
      leftActions,
      rightActions,
      sendLabel = "Send",
      showSendDropdown = false,
      expired = false,
      expiredMessage = "This chat has expired. Send a template to continue.",
      onTemplateClick,
      ...props
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Focus textarea after reply dismiss
    const handleDismissReply = () => {
      onDismissReply?.();
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    };

    // Auto-resize textarea to fit content, capped by max-height CSS
    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }, [value]);
    if (expired) {
      return (
        <div
          ref={ref}
          role="region"
          aria-label="Message composer"
          className={cn("shrink-0 bg-semantic-bg-ui p-4", className)}
          {...props}
        >
          <div
            role="status"
            className="bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_0px_rgba(10,13,18,0.06)] px-4 py-4 flex items-center justify-center gap-4"
          >
            <span className="text-sm text-semantic-text-muted">
              {expiredMessage}
            </span>
            <Button onClick={onTemplateClick}>
              Select Template
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Message composer"
        className={cn("shrink-0 bg-semantic-bg-ui p-4", className)}
        {...props}
      >
        <div className="bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_0px_rgba(10,13,18,0.06)] px-4 py-3">
          {/* Reply preview */}
          {reply && (
            <div className="flex items-center gap-2 mb-2">
              <ReplyQuote
                sender={reply.sender}
                message={reply.message}
                onClick={onReplyClick}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDismissReply}
                aria-label="Dismiss reply"
                className="shrink-0"
              >
                <X className="size-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Left actions slot */}
            {leftActions && (
              <div className="flex items-center gap-0.5 shrink-0">
                {leftActions}
              </div>
            )}

            {/* Input area */}
            <div className="flex-1 flex flex-col border border-semantic-border-layout rounded-lg bg-white overflow-hidden focus-within:border-semantic-border-focus transition-all">
              {attachment}
              <div className="flex items-end">
                <textarea
                  ref={textareaRef}
                  id={textareaId}
                  aria-label={textareaAriaLabel || placeholder}
                  placeholder={placeholder}
                  rows={1}
                  value={value}
                  onChange={(e) => onChange?.(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={disabled}
                  className="flex-1 resize-none px-3 py-2.5 text-sm text-semantic-text-primary placeholder:text-semantic-text-muted outline-none bg-transparent min-h-[40px] max-h-[120px]"
                />
                {rightActions && (
                  <div className="flex items-center px-2 py-2">
                    {rightActions}
                  </div>
                )}
              </div>
            </div>

            {/* Send button */}
            <Button
              className="shrink-0"
              onClick={onSend}
              disabled={disabled}
              aria-haspopup={showSendDropdown ? "true" : undefined}
              rightIcon={
                showSendDropdown ? (
                  <ChevronDown className="size-3.5" />
                ) : undefined
              }
            >
              {sendLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
ChatComposer.displayName = "ChatComposer";

export { ChatComposer };
