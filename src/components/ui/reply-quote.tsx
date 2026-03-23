import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * ReplyQuote component for displaying a quoted message with a brand-accented left border.
 * Used in chat applications for reply-to previews.
 *
 * When an `onClick` handler is provided, the component becomes interactive:
 * it receives `role="button"`, `tabIndex={0}`, and keyboard support (Enter/Space).
 * A focus ring is shown when focused via keyboard.
 *
 * @example
 * ```tsx
 * <ReplyQuote sender="John Doe" message="Hello, how are you?" />
 * <ReplyQuote sender="Jane" message="Check this out!" onClick={() => scrollToMessage()} />
 * ```
 */
export interface ReplyQuoteProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Name of the person being quoted */
  sender: string;
  /** The quoted message text */
  message: string;
}

const ReplyQuote = React.forwardRef<HTMLDivElement, ReplyQuoteProps>(
  ({ className, sender, message, onClick, onKeyDown, role, tabIndex, "aria-label": ariaLabel, ...props }, ref) => {
    const isInteractive = !!onClick;

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          if (e.key === " ") {
            e.preventDefault();
          }
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
        onKeyDown?.(e);
      },
      [onClick, onKeyDown]
    );

    return (
      <div
        ref={ref}
        className={cn(
          "w-full bg-semantic-bg-ui border-l-[3px] border-semantic-border-accent rounded-sm px-4 py-1.5 mb-2 h-[56px] flex flex-col justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors",
          isInteractive && "focus-visible:ring-2 focus-visible:ring-semantic-border-focus focus-visible:ring-offset-1 focus-visible:outline-none",
          className
        )}
        role={role ?? (isInteractive ? "button" : undefined)}
        tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
        onClick={onClick}
        onKeyDown={isInteractive ? handleKeyDown : onKeyDown}
        aria-label={ariaLabel ?? `Quoted reply from ${sender}: ${message}`}
        {...props}
      >
        <p className="text-[14px] font-semibold text-semantic-text-primary truncate leading-5 tracking-[0.014px] m-0">
          {sender}
        </p>
        <p className="text-[14px] text-semantic-text-muted truncate m-0">
          {message}
        </p>
      </div>
    );
  }
);
ReplyQuote.displayName = "ReplyQuote";

export { ReplyQuote };
