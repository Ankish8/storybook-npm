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
export interface ReplyQuoteProps extends Omit<
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
          "min-w-0 flex flex-col justify-start",
          thumb ? "flex-1" : "w-full"
        )}
      >
        <p className="m-0 min-w-0 shrink-0 truncate text-[14px] font-medium leading-5 tracking-[0.014px] text-[var(--v2-text-primary,#484848)]">
          {sender}
        </p>
        <p className="m-0 min-w-0 line-clamp-1 text-[14px] leading-5 text-[var(--v2-text-secondary,#5E5E5E)]">
          {message}
        </p>
      </div>
      {thumb ? (
        <img
          src={thumb}
          alt=""
          className="size-11 shrink-0 rounded-sm object-cover"
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
    "w-full min-w-0 font-[family-name:var(--font-v2,Inter,sans-serif)] bg-[var(--semantic-bg-ui,#F5F5F5)] border-l-[3px] border-solid border-[var(--semantic-border-accent,#27ABB8)] rounded-sm px-4 py-1.5 mb-2 h-[56px] overflow-hidden cursor-pointer hover:bg-[var(--semantic-bg-hover,#D5D7DA)] transition-colors text-left",
    hasThumbnail
      ? "flex flex-row items-center gap-2"
      : "flex flex-col justify-start gap-0",
    isInteractive &&
      "focus-visible:ring-2 focus-visible:ring-[var(--semantic-border-focus,#2BBCCA)] focus-visible:ring-offset-1 focus-visible:outline-none border-t-0 border-r-0 border-b-0",
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
      const { onCopy, onCut, onPaste, ...buttonProps } =
        props as React.ButtonHTMLAttributes<HTMLButtonElement>;

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
