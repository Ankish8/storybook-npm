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
  /** The quoted message content */
  message: React.ReactNode;
}

const ReplyQuote = React.forwardRef(
  ({ className, sender, message, onClick, onKeyDown, role, tabIndex, "aria-label": ariaLabel, ...props }: ReplyQuoteProps, ref: React.Ref<HTMLDivElement>) => {
    const isInteractive = !!onClick;
    const messageLabel = typeof message === "string" ? `: ${message}` : "";

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
          "tw-max-w-full tw-min-w-0 tw-bg-[var(--semantic-bg-ui,#F5F5F5)] tw-border-l-[3px] tw-border-solid tw-border-[var(--semantic-border-accent,#27ABB8)] tw-rounded-sm tw-px-4 tw-py-1.5 tw-mb-2 tw-h-[56px] tw-flex tw-flex-col tw-justify-center tw-gap-0 tw-overflow-hidden tw-cursor-pointer hover:tw-bg-[var(--semantic-bg-hover,#D5D7DA)] tw-transition-colors",
          isInteractive && "focus-visible:tw-ring-2 focus-visible:tw-ring-[var(--semantic-border-focus,#2BBCCA)] focus-visible:tw-ring-offset-1 focus-visible:tw-outline-none",
          className
        )}
        role={role ?? (isInteractive ? "button" : undefined)}
        tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
        onClick={onClick}
        onKeyDown={isInteractive ? handleKeyDown : onKeyDown}
        aria-label={ariaLabel ?? `Quoted reply from ${sender}${messageLabel}`}
        {...props}
      >
        <p className="tw-m-0 tw-min-w-0 tw-shrink-0 tw-truncate tw-text-[14px] tw-font-semibold tw-leading-5 tw-tracking-[0.014px] tw-text-[var(--semantic-text-primary,#181D27)]">
          {sender}
        </p>
        <div className="tw-m-0 tw-min-h-0 tw-min-w-0 tw-flex-1 tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap tw-text-[14px] tw-leading-5 tw-text-[var(--semantic-text-muted,#717680)] [&_*]:tw-inline">
          {message}
        </div>
      </div>
    );
  }
);
ReplyQuote.displayName = "ReplyQuote";

export { ReplyQuote };