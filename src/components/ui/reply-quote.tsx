import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * ReplyQuote component for displaying a quoted message with a brand-accented left border.
 * Used in chat applications for reply-to previews.
 *
 * When an `onClick` handler is provided, the component becomes interactive:
 * it renders as a `<button>`, with native keyboard support.
 *
 * @example
 * ```tsx
 * <ReplyQuote sender="John Doe" message="Hello, how are you?" />
 * <ReplyQuote sender="Jane" message="Check this out!" thumbnailUrl="https://..." onClick={() => scrollToMessage()} />
 * ```
 */
export interface ReplyQuoteProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onClick" | "onKeyDown"
  > {
  /** Name of the person being quoted */
  sender: string;
  /** The quoted message text (plain string or formatted React node) */
  message: React.ReactNode;
  /** Optional thumbnail shown on the right (e.g. template image header) */
  thumbnailUrl?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
}

function ReplyQuoteInner({
  sender,
  message,
  thumbnailUrl,
}: Pick<ReplyQuoteProps, "sender" | "message" | "thumbnailUrl">) {
  const thumb = thumbnailUrl?.trim();

  return (
    <>
      <div
        className={cn(
          "tw-min-w-0 tw-flex tw-flex-col tw-justify-start",
          thumb ? "tw-flex-1" : "tw-w-full"
        )}
      >
        <p className="tw-m-0 tw-min-w-0 tw-shrink-0 tw-truncate tw-text-[14px] tw-font-semibold tw-leading-5 tw-tracking-[0.014px] tw-text-[var(--semantic-text-primary,#181D27)]">
          {sender}
        </p>
        <p className="tw-m-0 tw-min-h-0 tw-min-w-0 tw-flex-1 tw-truncate tw-text-[14px] tw-leading-5 tw-text-[var(--semantic-text-muted,#717680)]">
          {message}
        </p>
      </div>
      {thumb ? (
        <img
          src={thumb}
          alt=""
          className="tw-size-11 tw-shrink-0 tw-rounded-sm tw-object-cover"
        />
      ) : null}
    </>
  );
}

function replyQuoteClassName(
  className: string | undefined,
  hasThumbnail: boolean,
  isInteractive: boolean
) {
  return cn(
    "tw-w-full tw-min-w-0 tw-bg-[var(--semantic-bg-ui,#F5F5F5)] tw-border-l-[3px] tw-border-solid tw-border-[var(--semantic-border-accent,#27ABB8)] tw-rounded-sm tw-px-4 tw-py-1.5 tw-mb-2 tw-h-[56px] tw-overflow-hidden tw-cursor-pointer hover:tw-bg-[var(--semantic-bg-hover,#D5D7DA)] tw-transition-colors tw-text-left",
    hasThumbnail
      ? "tw-flex tw-flex-row tw-items-center tw-gap-2"
      : "tw-flex tw-flex-col tw-justify-start tw-gap-0",
    isInteractive &&
      "focus-visible:tw-ring-2 focus-visible:tw-ring-[var(--semantic-border-focus,#2BBCCA)] focus-visible:tw-ring-offset-1 focus-visible:tw-outline-none tw-border-t-0 tw-border-r-0 tw-border-b-0",
    className
  );
}

const ReplyQuote = React.forwardRef<HTMLDivElement, ReplyQuoteProps>(
  (
    {
      className,
      sender,
      message,
      thumbnailUrl,
      onClick,
      onKeyDown,
      role,
      tabIndex,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const isInteractive = !!onClick;
    const thumb = Boolean(thumbnailUrl?.trim());
    const label =
      ariaLabel ??
      `Quoted reply from ${sender}${
        typeof message === "string" && message ? `: ${message}` : ""
      }`;

    if (isInteractive) {
      const {
        onCopy,
        onCut,
        onPaste,
        ...buttonProps
      } = props as React.ButtonHTMLAttributes<HTMLButtonElement>;

      return (
        <button
          type="button"
          className={replyQuoteClassName(className, thumb, true)}
          onClick={onClick}
          onKeyDown={onKeyDown}
          aria-label={label}
          onCopy={onCopy}
          onCut={onCut}
          onPaste={onPaste}
          {...buttonProps}
        >
          <ReplyQuoteInner
            sender={sender}
            message={message}
            thumbnailUrl={thumbnailUrl}
          />
        </button>
      );
    }

    return (
      <div
        ref={ref}
        className={replyQuoteClassName(className, thumb, false)}
        role={role}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        aria-label={label}
        {...props}
      >
        <ReplyQuoteInner
          sender={sender}
          message={message}
          thumbnailUrl={thumbnailUrl}
        />
      </div>
    );
  }
);
ReplyQuote.displayName = "ReplyQuote";

export { ReplyQuote };