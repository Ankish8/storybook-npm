import * as React from "react";
import { cn } from "../../../lib/utils";
import { ReplyQuote } from "../../ui/reply-quote";
import { Check, CheckCheck, CircleAlert } from "lucide-react";
import type { ChatBubbleProps, DeliveryStatus } from "./types";

const maxWidthMap = {
  text: "max-w-[65%]",
  media: "max-w-[380px] w-full",
  audio: "max-w-[340px] w-[340px]",
  carousel: "max-w-[466px] w-full",
};

function DeliveryFooter({
  status,
  timestamp,
  variant,
}: {
  status?: DeliveryStatus;
  timestamp: string;
  variant: "sender" | "receiver";
}) {
  return (
    <div
      className={cn(
        "flex items-center mt-1.5",
        variant === "sender" ? "justify-end gap-1.5" : "justify-start gap-1.5"
      )}
    >
      {variant === "sender" && status && (
        <>
          {status === "failed" ? (
            <>
              <CircleAlert className="size-4 text-semantic-error-primary shrink-0" />
              <span className="text-[12px] text-semantic-error-primary font-medium">
                Failed to send
              </span>
            </>
          ) : (
            <>
              {status === "sent" ? (
                <Check className="size-4 text-semantic-text-muted shrink-0" />
              ) : (
                <CheckCheck
                  className={cn(
                    "size-4 shrink-0",
                    status === "read"
                      ? "text-semantic-text-link"
                      : "text-semantic-text-muted"
                  )}
                />
              )}
              <span className="text-[12px] text-semantic-text-muted">
                {status === "sent"
                  ? "Sent"
                  : status === "delivered"
                    ? "Delivered"
                    : "Read"}
              </span>
            </>
          )}
          <span
            className="font-semibold text-semantic-text-muted"
            style={{ fontSize: 10 }}
          >
            &bull;
          </span>
        </>
      )}
      <span className="text-[12px] text-semantic-text-muted">{timestamp}</span>
    </div>
  );
}

/**
 * ChatBubble displays a single chat message with sender/receiver alignment,
 * optional sender name, reply quote, media slot, text content, delivery status,
 * and timestamp.
 *
 * @example
 * ```tsx
 * <ChatBubble variant="sender" timestamp="2:15 PM" status="sent">
 *   Hello, how can I help you?
 * </ChatBubble>
 *
 * <ChatBubble
 *   variant="sender"
 *   timestamp="2:15 PM"
 *   status="delivered"
 *   senderIndicator={<span className="text-[10px] font-medium">AS</span>}
 * >
 *   Message with agent initials indicator
 * </ChatBubble>
 * ```
 */
const ChatBubble = React.forwardRef(
  (
    {
      variant,
      timestamp,
      status,
      senderName,
      reply,
      onReplyClick,
      media,
      maxWidth = "text",
      senderIndicator,
      children,
      className,
      ...props
    }: ChatBubbleProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const hasMedia = !!media;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start gap-1.5",
          variant === "sender" ? "justify-end" : "justify-start",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex flex-col",
            maxWidthMap[maxWidth],
            variant === "sender" ? "items-end" : "items-start"
          )}
        >
          {senderName && (
            <span className="text-[12px] text-semantic-text-muted mb-1 px-1">
              {senderName}
            </span>
          )}
          <div
            className={cn(
              "rounded overflow-hidden",
              !hasMedia && "px-3 pt-3 pb-1.5",
              variant === "sender"
                ? "bg-semantic-info-surface border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary"
                : "bg-white border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            )}
          >
            {/* Media area (full-bleed) */}
            {media}

            {/* Text + footer area */}
            <div className={hasMedia ? "px-3 pb-1.5 pt-2" : ""}>
              {reply && (
                <ReplyQuote
                  sender={reply.sender}
                  message={reply.message}
                  className="bg-white"
                  onClick={() => {
                    if (reply.messageId && onReplyClick) {
                      onReplyClick(reply.messageId);
                    }
                  }}
                />
              )}
              {children && (
                <p className="text-[14px] leading-5 m-0">{children}</p>
              )}
              <DeliveryFooter
                status={status}
                timestamp={timestamp}
                variant={variant}
              />
            </div>
          </div>
        </div>
        {variant === "sender" && senderIndicator && (
          <div className="self-end mb-1 shrink-0 size-7 rounded-full bg-white border border-solid border-semantic-border-layout flex items-center justify-center">
            {senderIndicator}
          </div>
        )}
      </div>
    );
  }
);
ChatBubble.displayName = "ChatBubble";

export { ChatBubble };
