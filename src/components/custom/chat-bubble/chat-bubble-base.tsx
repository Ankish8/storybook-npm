import * as React from "react";
import { cn } from "../../../lib/utils";
import { ReplyQuote } from "../../ui/reply-quote";
import {
  Check,
  CheckCheck,
  CircleAlert,
  File,
  Reply,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
} from "../../ui/tooltip";
import { Button } from "../../ui/button";
import { DocMedia } from "../doc-media";
import type { ChatMessage } from "../chat-types";
import {
  ImageMedia,
  VideoMedia,
  AudioMedia,
  CarouselMedia,
  ReferralMedia,
  LocationMedia,
  ContactMedia,
  ListReplyMedia,
  LoadingMedia,
  SenderIndicator,
} from "./message-renderers";
import type {
  ChatBubbleProps,
  ChatBubbleManualProps,
  DeliveryStatus,
  ReplyToPayload,
} from "./types";
import { isChatBubbleMessageProps } from "./types";

const maxWidthMap = {
  text: cn("max-w-[65%]"),
  media: cn("max-w-[380px] w-full"),
  audio: cn("max-w-[340px] w-[340px]"),
  carousel: cn("max-w-[466px] w-full"),
};

function LegacyDeliveryFooter({
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

function MessageModeReplyQuoteButton({
  replyTo,
}: {
  replyTo: NonNullable<ChatMessage["replyTo"]>;
}) {
  return (
    <button
      type="button"
      className="w-full bg-white border-l-[3px] border-solid border-semantic-border-accent rounded-sm px-4 py-1.5 mb-2 h-[56px] flex flex-col justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors text-left border-t-0 border-r-0 border-b-0"
      aria-label={`Jump to quoted message from ${replyTo.sender}`}
      onClick={() => {
        if (replyTo.messageId) {
          const prefersReducedMotion = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)"
          ).matches;
          const el = document.getElementById(`msg-${replyTo.messageId}`);
          if (el) {
            el.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "center",
            });
            el.style.outline = "2px solid var(--semantic-border-accent)";
            el.style.outlineOffset = "2px";
            el.style.transition = "outline-color 0.3s ease-out";
            setTimeout(() => {
              el.style.outlineColor = "transparent";
              setTimeout(() => {
                el.style.outline = "";
                el.style.outlineOffset = "";
                el.style.transition = "";
              }, 300);
            }, 1700);
          }
        }
      }}
    >
      <p className="text-[14px] font-semibold text-semantic-text-primary truncate leading-5 tracking-[0.014px] m-0">
        {replyTo.sender}
      </p>
      <p className="text-[14px] text-semantic-text-muted truncate m-0">
        {replyTo.text}
      </p>
    </button>
  );
}

function MessageModeDeliveryFooter({ msg }: { msg: ChatMessage }) {
  return (
    <div
      className={`flex items-center mt-1.5 ${msg.type === "audio" ? "justify-between" : msg.sender === "agent" ? "justify-end gap-1.5" : "justify-start gap-1.5"}`}
      style={msg.type === "audio" ? { paddingLeft: 0 } : undefined}
    >
      {msg.type === "audio" && msg.media && (
        <span
          className="font-semibold text-semantic-text-muted tabular-nums"
          style={{ fontSize: 12, letterSpacing: 0.05 }}
        >
          {msg.media.duration || "0:00"}
        </span>
      )}
      <div className="flex items-center gap-1.5">
        {msg.sender === "agent" && msg.status && (
          <>
            {msg.status === "failed" ? (
              <span role="alert" className="inline-flex items-center gap-1.5">
                <CircleAlert className="size-4 text-semantic-error-primary shrink-0" />
                <span className="text-[13px] text-semantic-error-primary font-medium">
                  Failed
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-[13px] font-semibold text-semantic-text-link underline hover:no-underline"
                >
                  Retry
                </button>
              </span>
            ) : (
              <>
                {msg.status === "sent" ? (
                  <Check className="size-4 text-semantic-text-muted shrink-0" />
                ) : (
                  <CheckCheck
                    className={`size-4 shrink-0 ${msg.status === "read" ? "text-semantic-text-link" : "text-semantic-text-muted"}`}
                  />
                )}
                <span
                  style={{ fontSize: 12 }}
                  className="text-semantic-text-muted"
                >
                  {msg.status === "sent"
                    ? "Sent"
                    : msg.status === "delivered"
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
        <span style={{ fontSize: 12 }} className="text-semantic-text-muted">
          {msg.time}
        </span>
      </div>
    </div>
  );
}

function computeMessageBubbleLayout(msg: ChatMessage) {
  /**
   * True when the card has a full-bleed block above the text/footer (image, referral, or
   * `template` with a header `media` payload). Plain `text` and text-only `template` use
   * a single padded content block instead (same as manual bubbles).
   */
  const hasMedia =
    !!msg.type &&
    msg.type !== "text" &&
    (msg.type !== "template" || !!msg.media);
  const mediaCaption = msg.media?.caption;
  const hasText = !!(msg.text || mediaCaption);
  const isDocWithMeta = msg.type === "otherDoc" && msg.media;

  const isTemplateWithMedia = msg.type === "template" && !!msg.media;

  const bubbleWidth =
    msg.type === "carousel"
      ? cn("max-w-[466px] w-full")
      : msg.type === "image" ||
          msg.type === "video" ||
          isTemplateWithMedia ||
          msg.type === "docPreview" ||
          msg.type === "document" ||
          msg.type === "otherDoc" ||
          msg.type === "loading" ||
          msg.type === "location" ||
          msg.type === "referral"
        ? cn("max-w-[380px] w-full")
        : msg.type === "audio"
          ? cn("max-w-[340px] w-[340px]")
          : msg.type === "contact" || msg.type === "listReply"
            ? cn("max-w-[320px] w-full")
            : cn("max-w-[65%]");

  return {
    hasMedia,
    mediaCaption,
    hasText,
    isDocWithMeta,
    bubbleWidth,
  };
}

const ChatBubbleMessageMode = React.forwardRef<
  HTMLDivElement,
  {
    message: ChatMessage;
    replyParticipantName?: string;
    onReplyTo?: (payload: ReplyToPayload) => void;
    senderIndicator?: React.ReactNode;
  } & Omit<React.HTMLAttributes<HTMLDivElement>, "children">
>(function ChatBubbleMessageMode(
  {
    message: msg,
    replyParticipantName,
    onReplyTo,
    senderIndicator,
    className,
    ...rest
  },
  ref
) {
  const { hasMedia, mediaCaption, hasText, isDocWithMeta, bubbleWidth } =
    computeMessageBubbleLayout(msg);

  return (
    <div
      ref={ref}
      className={cn(
        "group/msg flex items-start gap-1.5",
        msg.sender === "agent" ? "justify-end" : "justify-start",
        className
      )}
      {...rest}
    >
      <div
        id={`msg-${msg.id}`}
        className={cn(
          "flex flex-col",
          bubbleWidth,
          msg.sender === "agent" ? "items-end" : "items-start"
        )}
      >
        {msg.sender === "agent" &&
          (msg.senderName || msg.sentBy || senderIndicator) && (
            <div
              className={cn(
                "mb-1 flex w-full max-w-full items-center gap-1.5 px-1",
                "justify-end"
              )}
            >
              {msg.senderName && (
                <span className="min-w-0 break-words text-right text-[12px] leading-5 text-semantic-text-muted">
                  {msg.senderName}
                </span>
              )}
              {msg.sentBy ? (
                <SenderIndicator
                  sentBy={msg.sentBy}
                  withTooltip
                  className="!size-6 !min-h-6 !min-w-6 shrink-0"
                />
              ) : (
                senderIndicator && (
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-solid border-semantic-border-layout bg-white">
                    {senderIndicator}
                  </div>
                )
              )}
            </div>
          )}
        {msg.sender === "customer" && msg.senderName && (
          <span className="text-[12px] text-semantic-text-muted mb-1 px-1">
            {msg.senderName}
          </span>
        )}
        <div
          className={cn(
            "rounded-lg overflow-hidden",
            msg.type === "audio" ||
              msg.type === "otherDoc" ||
              msg.type === "carousel" ||
              msg.type === "loading" ||
              msg.type === "location" ||
              msg.type === "contact" ||
              msg.type === "listReply" ||
              (msg.type === "template" && msg.media)
              ? "w-full"
              : "",
            msg.sender === "agent"
              ? "bg-semantic-info-surface border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary"
              : "bg-white border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
          )}
        >
          {msg.type === "carousel" && hasText && (
            <div className="px-3 pt-3">
              <p className="text-[14px] leading-5 m-0">
                {msg.text || mediaCaption}
              </p>
            </div>
          )}
          {msg.type === "image" && msg.media && (
            <ImageMedia media={msg.media} />
          )}
          {msg.type === "template" && msg.media && (msg.media.duration ? (
            <VideoMedia media={msg.media} />
          ) : (
            <ImageMedia media={msg.media} />
          ))}
          {msg.type === "video" && msg.media && (
            <VideoMedia media={msg.media} />
          )}
          {msg.type === "audio" && msg.media && (
            <AudioMedia media={msg.media} />
          )}
          {msg.type === "docPreview" && msg.media && (
            <DocMedia
              variant="preview"
              thumbnailUrl={msg.media.thumbnailUrl || msg.media.url}
              filename={msg.media.filename}
              fileType={msg.media.fileType}
              pageCount={msg.media.pageCount}
              fileSize={msg.media.fileSize}
            />
          )}
          {msg.type === "document" && msg.media && (
            <DocMedia
              variant="download"
              thumbnailUrl={msg.media.thumbnailUrl || msg.media.url}
              filename={msg.media.filename}
              fileType={msg.media.fileType}
              pageCount={msg.media.pageCount}
              fileSize={msg.media.fileSize}
            />
          )}
          {msg.type === "otherDoc" && msg.media && (
            <DocMedia
              variant="file"
              filename={msg.media.filename}
              fileType={msg.media.fileType}
            />
          )}
          {msg.type === "carousel" && msg.media && (
            <CarouselMedia media={msg.media} />
          )}
          {msg.type === "loading" && <LoadingMedia error={msg.error} />}
          {msg.type === "referral" && msg.referral && (
            <ReferralMedia referral={msg.referral} />
          )}
          {msg.type === "location" && msg.location && (
            <LocationMedia location={msg.location} />
          )}
          {msg.type === "contact" && msg.contactCard && (
            <ContactMedia contact={msg.contactCard} />
          )}
          {msg.type === "listReply" && msg.listReply && (
            <ListReplyMedia listReply={msg.listReply} />
          )}

          <div
            className={cn(
              hasMedia
                ? `px-3 pb-1.5 ${msg.type === "audio" ? "pt-0" : msg.type === "otherDoc" ? "pt-3 mt-1" : "pt-2"}`
                : "px-3 pt-3 pb-1.5"
            )}
          >
            {msg.replyTo && (
              <MessageModeReplyQuoteButton replyTo={msg.replyTo} />
            )}
            {hasText && msg.type !== "carousel" && (
              <p className="text-[14px] leading-5 m-0">
                {msg.text || mediaCaption}
              </p>
            )}
            {isDocWithMeta && (
              <div className="flex items-center gap-2 mt-1.5">
                <File className="size-3.5 text-semantic-text-muted" />
                <span className="text-[13px] text-semantic-text-muted">
                  {[
                    msg.media!.fileType,
                    msg.media!.pageCount &&
                      `${msg.media!.pageCount} pages`,
                    msg.media!.fileSize,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
            )}
            <MessageModeDeliveryFooter msg={msg} />
          </div>
        </div>
      </div>
      {msg.sender === "customer" && onReplyTo && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Reply"
              onClick={() =>
                onReplyTo({
                  messageId: msg.id,
                  sender: replyParticipantName ?? "",
                  text: msg.text || msg.media?.caption || "",
                })
              }
              className="opacity-0 group-hover/msg:opacity-100 group-focus-within/msg:opacity-100 transition-opacity shrink-0 rounded-full text-semantic-text-muted hover:text-semantic-text-secondary hover:bg-semantic-bg-hover"
            >
              <Reply className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="m-0">Reply</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
});
ChatBubbleMessageMode.displayName = "ChatBubbleMessageMode";

/**
 * Single-message bubble. For the threaded scroll view (with `onReplyTo`, root `className` on the container) use **`ChatBubble.MessageList`**.
 *
 * Displays sender/receiver alignment, optional sender name, reply quote, media slot, text, delivery status, and timestamp.
 * Pass **`message`** (`ChatMessage`) to render template media types — same rows as **`ChatBubble.MessageList`**.
 *
 * @example
 * ```tsx
 * <ChatBubble variant="sender" timestamp="2:15 PM" status="sent">
 *   Hello, how can I help you?
 * </ChatBubble>
 *
 * <ChatBubble message={msg} replyParticipantName={name} onReplyTo={...} />
 * ```
 */
const ChatBubblePrimitive = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  (props, ref) => {
    if (isChatBubbleMessageProps(props)) {
      const {
        message,
        replyParticipantName,
        onReplyTo,
        senderIndicator,
        className,
        ...rest
      } = props;
      return (
        <ChatBubbleMessageMode
          ref={ref}
          message={message}
          replyParticipantName={replyParticipantName}
          onReplyTo={onReplyTo}
          senderIndicator={senderIndicator}
          className={className}
          {...rest}
        />
      );
    }

    const {
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
      ...rest
    } = props as ChatBubbleManualProps;

    const hasMedia = !!media;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start gap-1.5",
          variant === "sender" ? "justify-end" : "justify-start",
          className
        )}
        {...rest}
      >
        <div
          className={cn(
            "flex flex-col",
            maxWidthMap[maxWidth],
            variant === "sender" ? "items-end" : "items-start"
          )}
        >
          {variant === "sender" && (senderName || senderIndicator) && (
            <div
              className={cn(
                "mb-1 flex w-full max-w-full items-center gap-1.5 px-1",
                "justify-end"
              )}
            >
              {senderName && (
                <span className="min-w-0 break-words text-right text-[12px] leading-5 text-semantic-text-muted">
                  {senderName}
                </span>
              )}
              {senderIndicator && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-solid border-semantic-border-layout bg-white">
                  {senderIndicator}
                </div>
              )}
            </div>
          )}
          {variant === "receiver" && senderName && (
            <span className="mb-1 px-1 text-[12px] text-semantic-text-muted">
              {senderName}
            </span>
          )}
          <div
            className={cn(
              "overflow-hidden rounded",
              !hasMedia && "px-3 pb-1.5 pt-3",
              variant === "sender"
                ? "border-[0.2px] border-solid border-semantic-border-layout bg-semantic-info-surface text-semantic-text-primary"
                : "border-[0.2px] border-solid border-semantic-border-layout bg-white text-semantic-text-primary shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            )}
          >
            {media}
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
                <p className="m-0 text-[14px] leading-5">{children}</p>
              )}
              <LegacyDeliveryFooter
                status={status}
                timestamp={timestamp}
                variant={variant}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ChatBubblePrimitive.displayName = "ChatBubble";

export { ChatBubblePrimitive };
