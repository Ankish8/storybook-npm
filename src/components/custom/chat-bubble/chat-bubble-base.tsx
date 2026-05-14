import * as React from "react";
import { cn } from "../../../lib/utils";
import { ReplyQuote } from "../../ui/reply-quote";
import {
  Check,
  CheckCheck,
  CircleAlert,
  Clock,
  ExternalLink,
  File,
  Phone as PhoneIcon,
  Reply,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
  TooltipProvider,
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
  ChatBubbleFlatProps,
  DeliveryStatus,
  ReplyToPayload,
  ShowReplyOn,
} from "./types";
import {
  isChatBubbleMessageProps,
  isChatBubbleFlatProps,
} from "./types";

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
          {status === "queued" ? (
            <>
              <Clock className="size-4 text-semantic-text-muted shrink-0" />
              <span className="text-[12px] text-semantic-text-muted whitespace-nowrap">
                Queued
              </span>
            </>
          ) : status === "failed" ? (
            <>
              <CircleAlert className="size-4 text-semantic-error-primary shrink-0" />
              <span className="text-[12px] text-semantic-error-primary font-medium whitespace-nowrap">
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
              <span className="text-[12px] text-semantic-text-muted whitespace-nowrap">
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
      <span className="text-[12px] text-semantic-text-muted whitespace-nowrap">
        {timestamp}
      </span>
    </div>
  );
}

function LegacyDeliveryFooterInline({
  status,
  timestamp,
  variant,
}: {
  status?: DeliveryStatus;
  timestamp: string;
  variant: "sender" | "receiver";
}) {
  const isFailed = status === "failed";
  const isQueued = status === "queued";
  return (
    <span
      className={cn(
        "inline-flex items-center align-bottom ml-2 whitespace-nowrap text-[12px] text-semantic-text-muted",
        isFailed ? "gap-1.5" : "gap-1"
      )}
    >
      {variant === "sender" && status && (
        <>
          {isQueued ? (
            <>
              <Clock className="size-4 text-semantic-text-muted shrink-0" />
              <span>Queued</span>
            </>
          ) : isFailed ? (
            <>
              <CircleAlert className="size-4 text-semantic-error-primary shrink-0" />
              <span className="text-semantic-error-primary font-medium">
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
              <span>
                {status === "sent"
                  ? "Sent"
                  : status === "delivered"
                    ? "Delivered"
                    : "Read"}
              </span>
            </>
          )}
          <span className="font-semibold" style={{ fontSize: 10 }}>
            &bull;
          </span>
        </>
      )}
      <span>{timestamp}</span>
    </span>
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
      className={cn(
        "flex items-center mt-1.5",
        msg.type === "audio"
          ? "justify-between"
          : msg.sender === "agent"
            ? "justify-end gap-1.5"
            : "justify-start gap-1.5"
      )}
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
            {msg.status === "queued" ? (
              <>
                <Clock className="size-4 text-semantic-text-muted shrink-0" />
                <span
                  style={{ fontSize: 12 }}
                  className="text-semantic-text-muted whitespace-nowrap"
                >
                  Queued
                </span>
              </>
            ) : msg.status === "failed" ? (
              <span role="alert" className="inline-flex items-center gap-1.5 whitespace-nowrap">
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
                    className={cn(
                      "size-4 shrink-0",
                      msg.status === "read"
                        ? "text-semantic-text-link"
                        : "text-semantic-text-muted"
                    )}
                  />
                )}
                <span
                  style={{ fontSize: 12 }}
                  className="text-semantic-text-muted whitespace-nowrap"
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
        <span
          style={{ fontSize: 12 }}
          className="text-semantic-text-muted whitespace-nowrap"
        >
          {msg.time}
        </span>
      </div>
    </div>
  );
}

function MessageModeDeliveryFooterInline({ msg }: { msg: ChatMessage }) {
  const isFailed = msg.status === "failed";
  const isQueued = msg.status === "queued";
  return (
    <span
      className={cn(
        "inline-flex items-center align-bottom ml-2 whitespace-nowrap text-[12px] text-semantic-text-muted",
        isFailed ? "gap-1.5" : "gap-1"
      )}
    >
      {msg.sender === "agent" && msg.status && (
        <>
          {isQueued ? (
            <>
              <Clock className="size-4 text-semantic-text-muted shrink-0" />
              <span>Queued</span>
            </>
          ) : isFailed ? (
            <>
              <CircleAlert className="size-4 text-semantic-error-primary shrink-0" />
              <span className="text-semantic-error-primary font-medium">
                Failed
              </span>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="m-0 border-0 bg-transparent p-0 font-semibold text-semantic-text-link underline hover:no-underline cursor-pointer"
              >
                Retry
              </button>
            </>
          ) : (
            <>
              {msg.status === "sent" ? (
                <Check className="size-4 text-semantic-text-muted shrink-0" />
              ) : (
                <CheckCheck
                  className={cn(
                    "size-4 shrink-0",
                    msg.status === "read"
                      ? "text-semantic-text-link"
                      : "text-semantic-text-muted"
                  )}
                />
              )}
              <span>
                {msg.status === "sent"
                  ? "Sent"
                  : msg.status === "delivered"
                    ? "Delivered"
                    : "Read"}
              </span>
            </>
          )}
          <span className="font-semibold" style={{ fontSize: 10 }}>
            &bull;
          </span>
        </>
      )}
      <span>{msg.time}</span>
    </span>
  );
}

function TemplateButton({
  button,
}: {
  button: NonNullable<ChatMessage["buttons"]>[number];
}) {
  const Icon =
    button.kind === "url"
      ? ExternalLink
      : button.kind === "phone"
        ? PhoneIcon
        : null;
  const handleClick: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> = (e) => {
    e.stopPropagation();
  };
  const label = (
    <span className="inline-flex items-center justify-center gap-1.5">
      {Icon && <Icon className="size-3.5" />}
      {button.label}
    </span>
  );
  const className = cn(
    "block w-full text-center text-[14px] font-medium text-semantic-text-link",
    "border-0 border-t border-solid border-semantic-border-layout",
    "bg-transparent hover:bg-semantic-bg-hover transition-colors",
    "py-2.5 cursor-pointer no-underline"
  );
  if (button.kind === "url") {
    return (
      <a
        href={button.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
      >
        {label}
      </a>
    );
  }
  if (button.kind === "phone") {
    return (
      <a href={`tel:${button.phone}`} className={className} onClick={handleClick}>
        {label}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={handleClick}>
      {label}
    </button>
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
  const isTemplateWithButtons =
    msg.type === "template" &&
    Array.isArray(msg.buttons) &&
    msg.buttons.length > 0;

  const bubbleWidth =
    msg.type === "carousel"
      ? cn("max-w-[466px] w-full")
      : msg.type === "image" ||
          msg.type === "video" ||
          isTemplateWithMedia ||
          isTemplateWithButtons ||
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

  const hasButtons =
    msg.type === "template" && Array.isArray(msg.buttons) && msg.buttons.length > 0;

  return {
    hasMedia,
    mediaCaption,
    hasText,
    isDocWithMeta,
    bubbleWidth,
    hasButtons,
  };
}

const ChatBubbleMessageMode = React.forwardRef<
  HTMLDivElement,
  {
    message: ChatMessage;
    replyParticipantName?: string;
    onReplyTo?: (payload: ReplyToPayload) => void;
    showReplyOn?: ShowReplyOn;
    senderIndicator?: React.ReactNode;
  } & Omit<React.HTMLAttributes<HTMLDivElement>, "children">
>(function ChatBubbleMessageMode(
  {
    message: msg,
    replyParticipantName,
    onReplyTo,
    showReplyOn = "customer",
    senderIndicator,
    className,
    ...rest
  },
  ref
) {
  const {
    hasMedia,
    mediaCaption,
    hasText,
    isDocWithMeta,
    bubbleWidth,
    hasButtons,
  } = computeMessageBubbleLayout(msg);

  // Inline footer is disabled in favor of block footer (right-aligned for agent).
  // The block footer's whitespace-nowrap on its spans prevents internal wrap, and
  // the bubble grows to accommodate the footer width when text is shorter than it.
  const shouldUseInlineFooter = false;

  const shouldShowReplyIcon =
    !!onReplyTo &&
    (showReplyOn === "both" || showReplyOn === msg.sender);

  const replyButton = shouldShowReplyIcon ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Reply"
          onClick={() =>
            onReplyTo!({
              messageId: msg.id,
              sender:
                msg.sender === "agent"
                  ? msg.senderName ?? replyParticipantName ?? ""
                  : replyParticipantName ?? "",
              text: msg.text || msg.media?.caption || "",
            })
          }
          className={cn(
            "absolute top-0 opacity-0 group-hover/msg:opacity-100 group-focus-within/msg:opacity-100 transition-opacity shrink-0 rounded-full text-semantic-text-muted hover:text-semantic-text-secondary hover:bg-semantic-bg-hover",
            msg.sender === "agent" ? "right-full mr-1.5" : "left-full ml-1.5"
          )}
        >
          <Reply className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="m-0">Reply</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  ) : null;

  // Sender indicator renders OUTSIDE the bubble on the right side for agent messages,
  // bottom-aligned with the bubble. Absolutely positioned so it doesn't take flex width
  // from the bubble (same fix pattern as the reply button).
  const senderIcon =
    msg.sender === "agent" && (msg.sentBy || senderIndicator) ? (
      msg.sentBy ? (
        <SenderIndicator
          sentBy={msg.sentBy}
          withTooltip
          className="!size-6 !min-h-6 !min-w-6 absolute bottom-0 left-full ml-1.5"
        />
      ) : (
        <div className="absolute bottom-0 left-full ml-1.5 flex size-7 items-center justify-center rounded-full border border-solid border-semantic-border-layout bg-white">
          {senderIndicator}
        </div>
      )
    ) : null;

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
          msg.sender === "agent" ? "items-end" : "items-start",
          // Reserve 36px inside the column so the absolutely-positioned sender
          // icon (sentBy badge or custom senderIndicator) stays within the box.
          // Prevents avatar clipping by ancestor overflow:hidden / tight padding.
          msg.sender === "agent" &&
            (msg.sentBy || senderIndicator) &&
            "pr-9"
        )}
      >
        {msg.sender === "customer" && msg.senderName && (
          <span className="text-[12px] text-semantic-text-muted mb-1 px-1">
            {msg.senderName}
          </span>
        )}
        <div
          className={cn(
            "relative flex items-start gap-1.5 w-full",
            msg.sender === "agent" ? "justify-end" : "justify-start"
          )}
        >
        {replyButton}
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
              (msg.type === "template" && (msg.media || hasButtons))
              ? "w-full"
              : "w-fit min-w-min",
            msg.sender === "agent"
              ? "bg-semantic-info-surface border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary"
              : "bg-white border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
          )}
        >
          {msg.type === "carousel" && hasText && (
            <div className="px-4 pt-3">
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
              "px-4",
              hasButtons ? "pb-2" : "pb-1.5",
              hasMedia
                ? msg.type === "audio"
                  ? "pt-0"
                  : msg.type === "otherDoc"
                    ? "pt-3 mt-1"
                    : "pt-2"
                : "pt-3"
            )}
          >
            {msg.replyTo && (
              <MessageModeReplyQuoteButton replyTo={msg.replyTo} />
            )}
            {hasText && msg.type !== "carousel" && (
              <p className="text-[14px] leading-5 m-0">
                {msg.text || mediaCaption}
                {shouldUseInlineFooter && (
                  <MessageModeDeliveryFooterInline msg={msg} />
                )}
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
            {!hasButtons && !shouldUseInlineFooter && (
              <MessageModeDeliveryFooter msg={msg} />
            )}
          </div>
          {hasButtons && (
            <>
              {msg.buttons!.map((btn, i) => (
                <TemplateButton key={i} button={btn} />
              ))}
              <div className="px-4 pt-2 pb-1.5">
                <MessageModeDeliveryFooter msg={msg} />
              </div>
            </>
          )}
        </div>
        {msg.sender === "agent" && senderIcon}
        </div>
      </div>
    </div>
  );
});
ChatBubbleMessageMode.displayName = "ChatBubbleMessageMode";

/**
 * Adapts flat-mode props (`type` discriminator + per-type payload) into a synthetic
 * `ChatMessage` so the existing message-mode renderers handle every variant. Internal
 * helper — exposed only for `ChatBubblePrimitive` dispatch.
 */
function flatPropsToMessage(props: ChatBubbleFlatProps): ChatMessage {
  const sender = props.variant === "sender" ? "agent" : "customer";
  const id = props.messageId ?? `flat-${Math.random().toString(36).slice(2, 10)}`;
  const base: ChatMessage = {
    id,
    text: "",
    time: props.timestamp,
    sender,
    type: props.type,
    status: props.status,
    senderName: props.senderName,
    sentBy: props.sentBy,
    replyTo: props.replyTo,
  };
  switch (props.type) {
    case "text":
      return { ...base, text: props.text };
    case "image":
    case "video":
    case "document":
    case "docPreview":
    case "otherDoc":
      return { ...base, media: props.media, text: props.text ?? "" };
    case "audio":
      return { ...base, media: props.media };
    case "carousel":
      return { ...base, media: props.media, text: props.text ?? "" };
    case "loading":
      return { ...base, error: props.error };
    case "location":
      return { ...base, location: props.location, text: props.text ?? "" };
    case "contact":
      return { ...base, contactCard: props.contactCard, text: props.text ?? "" };
    case "referral":
      return { ...base, referral: props.referral, text: props.text ?? "" };
    case "listReply":
      return { ...base, listReply: props.listReply, text: props.text ?? "" };
    case "template":
      return {
        ...base,
        text: props.text,
        media: props.media,
        buttons: props.buttons,
      };
  }
}

/**
 * Single-message bubble. Three input modes — pick the one that matches your data:
 *
 * 1. **Flat mode (preferred for non-text types)** — pass `type` plus the matching payload prop:
 *    ```tsx
 *    <ChatBubble type="location" variant="receiver" timestamp="2:15 PM"
 *      location={{ latitude: 28.6, longitude: 77.2, name: "Office" }} />
 *
 *    <ChatBubble type="template" variant="sender" timestamp="1:49 PM" status="read"
 *      text="This is your sales report."
 *      buttons={[
 *        { kind: "quickReply", label: "Interested" },
 *        { kind: "quickReply", label: "Not interested" },
 *      ]} />
 *    ```
 *
 * 2. **Manual mode** — `variant`, `timestamp`, `children`, optional `media` slot:
 *    ```tsx
 *    <ChatBubble variant="sender" timestamp="2:15 PM" status="sent">
 *      Hello, how can I help you?
 *    </ChatBubble>
 *    ```
 *
 * 3. **Message mode** (used by `ChatBubble.MessageList`) — pass a full `ChatMessage`:
 *    ```tsx
 *    <ChatBubble message={msg} replyParticipantName={name} onReplyTo={...} />
 *    ```
 */
const ChatBubblePrimitive = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  (props, ref) => {
    if (isChatBubbleMessageProps(props)) {
      const {
        message,
        replyParticipantName,
        onReplyTo,
        showReplyOn,
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
          showReplyOn={showReplyOn}
          senderIndicator={senderIndicator}
          className={className}
          {...rest}
        />
      );
    }

    if (isChatBubbleFlatProps(props)) {
      const flat = props as ChatBubbleFlatProps;
      const {
        variant: _variant,
        timestamp: _timestamp,
        status: _status,
        senderName: _senderName,
        sentBy: _sentBy,
        replyTo: _replyTo,
        onReplyTo,
        showReplyOn,
        replyParticipantName,
        messageId: _messageId,
        type: _type,
        className,
        ...rest
      } = flat as ChatBubbleFlatProps & {
        className?: string;
      };
      // Drop type-specific payload fields from the spread so they don't leak as DOM attrs.
      const restNoPayload = rest as Record<string, unknown>;
      delete restNoPayload.text;
      delete restNoPayload.media;
      delete restNoPayload.location;
      delete restNoPayload.contactCard;
      delete restNoPayload.referral;
      delete restNoPayload.listReply;
      delete restNoPayload.buttons;
      delete restNoPayload.error;
      const message = flatPropsToMessage(flat);
      return (
        <ChatBubbleMessageMode
          ref={ref}
          message={message}
          replyParticipantName={replyParticipantName}
          onReplyTo={onReplyTo}
          showReplyOn={showReplyOn}
          className={className}
          {...(restNoPayload as React.HTMLAttributes<HTMLDivElement>)}
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
      onReplyTo,
      showReplyOn = "customer",
      replyParticipantName,
      messageId,
      children,
      className,
      ...rest
    } = props as ChatBubbleManualProps;

    const hasMedia = !!media;
    // Block footer everywhere. Inline-footer-in-<p> was previously enabled for
    // receiver text bubbles to fix Bug #8's clipping, but inline-flow wraps the
    // footer to a new line when bubble width is tight, producing a worse visual.
    // Instead, the bubble's `min-w-min` (set on the bubble div below) ensures
    // the bubble is at least as wide as the footer's atomic min-content — the
    // bubble may extend past the column's max-w in extremely narrow chat panels,
    // but content stays visible (no clipping).
    const useManualInlineFooter = false;

    // For manual mode: variant "sender" maps to agent semantics, "receiver" to customer.
    const manualSenderRole: "agent" | "customer" =
      variant === "sender" ? "agent" : "customer";
    const shouldShowManualReplyIcon =
      !!onReplyTo &&
      (showReplyOn === "both" || showReplyOn === manualSenderRole);

    // Manual mode is used outside of ChatBubble.MessageList (which provides its own
    // TooltipProvider). Wrap locally so consumers who don't have a TooltipProvider
    // in their tree don't hit a runtime error. Nested providers are safe in Radix.
    const manualReplyButton = shouldShowManualReplyIcon ? (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Reply"
              onClick={() =>
                onReplyTo!({
                  messageId: messageId ?? "",
                  sender:
                    variant === "sender"
                      ? senderName ?? replyParticipantName ?? ""
                      : replyParticipantName ?? senderName ?? "",
                  text:
                    typeof children === "string" ? (children as string) : "",
                })
              }
              className={cn(
                "absolute top-0 opacity-0 group-hover/msg:opacity-100 group-focus-within/msg:opacity-100 transition-opacity shrink-0 rounded-full text-semantic-text-muted hover:text-semantic-text-secondary hover:bg-semantic-bg-hover",
                variant === "sender" ? "right-full mr-1.5" : "left-full ml-1.5"
              )}
            >
              <Reply className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="m-0">Reply</p>
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : null;

    return (
      <div
        ref={ref}
        className={cn(
          "group/msg flex items-start gap-1.5",
          variant === "sender" ? "justify-end" : "justify-start",
          className
        )}
        {...rest}
      >
        <div
          className={cn(
            "flex flex-col",
            maxWidthMap[maxWidth],
            variant === "sender" ? "items-end" : "items-start",
            // Reserve 36px (28px avatar + 6px ml + 2px buffer) inside the column
            // so the absolutely-positioned senderIndicator stays within the box.
            // Prevents avatar clipping when consumers wrap the bubble in a container
            // with overflow:hidden or tight right/left padding.
            senderIndicator && variant === "sender" && "pr-9"
          )}
        >
          {variant === "receiver" && senderName && (
            <span className="mb-1 px-1 text-[12px] text-semantic-text-muted">
              {senderName}
            </span>
          )}
          <div
            className={cn(
              "relative flex items-start gap-1.5 w-full",
              variant === "sender" ? "justify-end" : "justify-start"
            )}
          >
          {manualReplyButton}
          <div
            className={cn(
              "overflow-hidden rounded",
              !hasMedia && "px-4 pb-1.5 pt-3 w-fit min-w-min",
              variant === "sender"
                ? "border-[0.2px] border-solid border-semantic-border-layout bg-semantic-info-surface text-semantic-text-primary"
                : "border-[0.2px] border-solid border-semantic-border-layout bg-white text-semantic-text-primary shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            )}
          >
            {media}
            <div className={hasMedia ? "px-4 pb-1.5 pt-2" : ""}>
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
                <p className="m-0 text-[14px] leading-5">
                  {children}
                  {useManualInlineFooter && (
                    <LegacyDeliveryFooterInline
                      status={status}
                      timestamp={timestamp}
                      variant={variant}
                    />
                  )}
                </p>
              )}
              {!useManualInlineFooter && (
                <LegacyDeliveryFooter
                  status={status}
                  timestamp={timestamp}
                  variant={variant}
                />
              )}
            </div>
          </div>
          {variant === "sender" && senderIndicator && (
            <div className="absolute bottom-0 left-full ml-1.5 flex size-7 items-center justify-center rounded-full border border-solid border-semantic-border-layout bg-white">
              {senderIndicator}
            </div>
          )}
          </div>
        </div>
      </div>
    );
  }
);
ChatBubblePrimitive.displayName = "ChatBubble";

export { ChatBubblePrimitive };
