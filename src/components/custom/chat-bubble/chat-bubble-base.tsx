import * as React from "react";
import { cn } from "../../../lib/utils";
import { ReplyQuote } from "../../ui/reply-quote";
import {
  Check,
  CheckCheck,
  CircleAlert,
  Clock,
  Copy,
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
  ChatMessage,
  ChatFailedMessage,
  DeliveryStatus,
  ReplyToPayload,
  ShowReplyOn,
} from "./types";
import {
  isChatBubbleMessageProps,
  isChatBubbleFlatProps,
} from "./types";

// Default max-width for text bubbles. Consumers override via the
// `textMaxWidthClassName` prop. Library is the single source of truth — do
// NOT also apply `max-w-*` on a wrapping element (compounds with this one).
//
// IMPORTANT — wrapped in `cn(...)` so the CLI's `tw-` prefix transformer
// rewrites the literal at install time. A bare `"max-w-[65%]"` outside any
// recognized pattern would ship to consumers unprefixed (and not match their
// tw-prefixed CSS), making the default a no-op.
const DEFAULT_TEXT_MAX_WIDTH = cn("max-w-[65%]");

const maxWidthMap = {
  text: cn(DEFAULT_TEXT_MAX_WIDTH),
  media: cn("max-w-[380px] w-full"),
  audio: cn("max-w-[340px] w-full"),
  carousel: cn("max-w-[466px] w-full"),
};

const MESSAGE_BODY_TEXT_CLASS = cn(
  "m-0 min-w-0 max-w-full break-all [overflow-wrap:anywhere]"
);

const URL_PATTERN = /https?:\/\/[^\s<]+/gi;
const TRAILING_URL_PUNCTUATION = /[.,!?;:)\]}]+$/;

const RECEIVER_TEXT_ONLY_MIN_WIDTH = "7rem";
const SENDER_TEXT_ONLY_STATUS_MIN_WIDTH = "13rem";
const SENDER_TEXT_ONLY_FAILED_MIN_WIDTH = "14rem";

type ChatBubbleRenderableMessage = ChatMessage & {
  textContent?: React.ReactNode;
  templateHeaderContent?: React.ReactNode;
  media?: ChatMessage["media"] & {
    mediaType?: "image" | "video" | "document";
  };
};

function shouldShowLegacyDeliveryFooter(
  variant: "sender" | "receiver",
  status: DeliveryStatus | undefined,
  timestamp: string
): boolean {
  const hasTime = Boolean(timestamp?.trim());
  if (variant === "sender") {
    return hasTime || Boolean(status);
  }
  return hasTime;
}

function shouldShowMessageDeliveryFooter(
  msg: ChatBubbleRenderableMessage
): boolean {
  const hasTime = Boolean(msg.time?.trim());
  if (msg.sender === "agent") {
    return hasTime || Boolean(msg.status);
  }
  return hasTime;
}

function splitTrailingUrlPunctuation(url: string): [string, string] {
  const trailingPunctuation = url.match(TRAILING_URL_PUNCTUATION)?.[0] ?? "";

  if (!trailingPunctuation) {
    return [url, ""];
  }

  return [url.slice(0, -trailingPunctuation.length), trailingPunctuation];
}

function renderTextWithLinks(text: string, keyPrefix: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  URL_PATTERN.lastIndex = 0;

  while ((match = URL_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const [url, trailingPunctuation] = splitTrailingUrlPunctuation(match[0]);

    nodes.push(
      <a
        key={`${keyPrefix}-url-${match.index}`}
        href={url}
        title={url}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-0 max-w-full break-all text-semantic-text-link underline [overflow-wrap:anywhere]"
      >
        {url}
      </a>
    );

    if (trailingPunctuation) {
      nodes.push(trailingPunctuation);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length ? nodes : text;
}

function renderMessageText(text: string): React.ReactNode {
  return renderTextWithLinks(text, "message");
}

function renderMessageContent(
  content: React.ReactNode,
  keyPrefix: string
): React.ReactNode {
  return typeof content === "string"
    ? renderTextWithLinks(content, keyPrefix)
    : content;
}

function renderManualContent(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child, index) =>
    typeof child === "string" ? renderTextWithLinks(child, `manual-${index}`) : child
  );
}

function getTextOnlyMinWidthStyle(
  minWidth?: string
): React.CSSProperties | undefined {
  if (!minWidth) {
    return undefined;
  }

  return {
    minWidth: `min(${minWidth}, 100%)`,
  };
}

function getTextOnlyColumnMinWidthStyle(
  minWidth?: string
): React.CSSProperties | undefined {
  if (!minWidth) {
    return undefined;
  }

  return {
    minWidth: `min(${minWidth}, 100%)`,
  };
}

const failedColumnStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "min(100%, 640px)",
};

function FailedMessageFeedback({
  failedMessage,
}: {
  failedMessage?: ChatFailedMessage;
}) {
  const {
    code,
    text = "",
    learnMoreLabel = "Learn more",
    lessMoreLabel = "Show less",
  } = failedMessage ?? {};
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [needsToggle, setNeedsToggle] = React.useState(false);
  const measureRef = React.useRef<HTMLParagraphElement>(null);
  const hasCode =
    code !== undefined && code !== null && String(code).trim() !== "";
  const trimmedText = text.trim();
  const collapsedText =
    needsToggle && !isExpanded
      ? trimmedText.slice(0, 126).trimEnd()
      : trimmedText;

  const toggleButtonClassName =
    "m-0 border-0 bg-transparent p-0 text-left text-[12px] font-semibold tracking-[0.06px] text-semantic-error-text underline hover:no-underline";

  React.useLayoutEffect(() => {
    const measureToggleNeed = () => {
      const element = measureRef.current;
      if (!element) {
        return;
      }

      // leading-4 on text-[12px] => 16px line height; two lines => 32px (max-h-8).
      const twoLineHeight = 32;
      const overflows = element.scrollHeight > twoLineHeight + 1;
      setNeedsToggle(overflows);
    };

    measureToggleNeed();

    const element = measureRef.current;
    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const resizeObserver = new ResizeObserver(measureToggleNeed);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [trimmedText, isExpanded]);

  if (!trimmedText) {
    return null;
  }

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsExpanded((current) => !current);
  };

  return (
    <div
      className="mt-2 flex w-full min-w-0 max-w-full items-start gap-2 text-semantic-error-text"
      role="alert"
    >
      <CircleAlert className="size-[15px] shrink-0 text-semantic-error-primary" />
      <div className="flex min-w-0 flex-1 items-start gap-1 text-[12px] leading-4 tracking-normal">
        {hasCode && (
          <span className="shrink-0 text-[14px] font-semibold leading-4 tracking-[0.014px]">
            <span>{code}</span>
            <span>:</span>
          </span>
        )}
        <div className="relative min-w-0 flex-1">
          <p
            ref={measureRef}
            aria-hidden
            className="pointer-events-none invisible absolute left-0 top-0 m-0 w-full break-words text-[12px] leading-4 tracking-normal"
          >
            {trimmedText}
          </p>
          {isExpanded ? (
            <p className="m-0 min-w-0 break-words leading-4">
              {trimmedText}
              {needsToggle && (
                <>
                  {" "}
                  <button
                    type="button"
                    className={toggleButtonClassName}
                    onClick={handleToggle}
                  >
                    {lessMoreLabel}
                  </button>
                </>
              )}
            </p>
          ) : (
            <div>
              <p className="m-0 min-w-0 break-words leading-4">
                {collapsedText}
                {needsToggle && (
                  <>
                    {" "}
                    <button
                      type="button"
                      className={toggleButtonClassName}
                      onClick={handleToggle}
                    >
                      {learnMoreLabel}
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LegacyDeliveryFooter({
  status,
  timestamp,
  variant,
}: {
  status?: DeliveryStatus;
  timestamp: string;
  variant: "sender" | "receiver";
}) {
  if (!shouldShowLegacyDeliveryFooter(variant, status, timestamp)) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-1.5 flex max-w-full flex-wrap items-center",
        variant === "sender" ? "justify-end gap-1.5" : "justify-start gap-1.5"
      )}
    >
      {variant === "sender" && status && (
        <>
          {status === "queued" ? (
            <>
              <Clock className="size-4 text-semantic-text-muted shrink-0" />
              <span className="text-[12px] text-semantic-text-muted whitespace-nowrap">
                Sending
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
              <span>Sending</span>
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
  onReplyClick,
}: {
  replyTo: NonNullable<ChatMessage["replyTo"]>;
  onReplyClick?: (messageId: string) => void;
}) {
  return (
    <button
      type="button"
      className="w-full bg-semantic-bg-primary border-l-[3px] border-solid border-semantic-border-accent rounded-sm px-4 py-1.5 mb-2 h-[56px] flex flex-col justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors text-left border-t-0 border-r-0 border-b-0"
      aria-label={`Jump to quoted message from ${replyTo.sender}`}
      onClick={() => {
        if (!replyTo.messageId) return;
        if (onReplyClick) {
          onReplyClick(replyTo.messageId);
          return;
        }
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
      }}
    >
      <p className="text-[14px] font-semibold text-semantic-text-primary truncate leading-5 tracking-[0.014px] m-0">
        {replyTo.sender}
      </p>
      <div className="text-[14px] text-semantic-text-muted truncate m-0">
        {replyTo.text}
      </div>
    </button>
  );
}

function MessageModeDeliveryFooter({
  msg,
}: {
  msg: ChatBubbleRenderableMessage;
}) {
  if (!shouldShowMessageDeliveryFooter(msg)) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-1.5 flex max-w-full flex-wrap items-center",
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
      <div
        className={cn(
          "flex min-w-0 max-w-full flex-wrap items-center gap-1.5",
          msg.sender === "agent" ? "justify-end" : "justify-start"
        )}
      >
        {msg.sender === "agent" && msg.status && (
          <>
            {msg.status === "queued" ? (
              <>
                <Clock className="size-4 text-semantic-text-muted shrink-0" />
                <span
                  style={{ fontSize: 12 }}
                  className="text-semantic-text-muted whitespace-nowrap"
                >
                  Sending
                </span>
              </>
            ) : msg.status === "failed" ? (
              <span
                role="alert"
                className="inline-flex min-w-0 max-w-full flex-wrap items-center justify-end gap-1.5"
              >
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

function MessageModeDeliveryFooterInline({
  msg,
}: {
  msg: ChatBubbleRenderableMessage;
}) {
  if (!shouldShowMessageDeliveryFooter(msg)) {
    return null;
  }

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
              <span>Sending</span>
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

const TEMPLATE_BUTTON_CLASSNAME = cn(
  "block w-full text-center text-[14px] font-medium text-semantic-text-link",
  "border-0 border-t border-solid border-semantic-border-layout",
  "bg-transparent hover:bg-semantic-bg-hover transition-colors",
  "py-2.5 cursor-pointer no-underline"
);

function CopyCodeButton({
  label,
  code,
}: {
  label: string;
  code: string;
}) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(
        () => setCopied(true),
        () => setCopied(false),
      );
    }
  };

  return (
    <button
      type="button"
      className={TEMPLATE_BUTTON_CLASSNAME}
      onClick={handleClick}
      aria-label={`Copy ${label}`}
    >
      <span className="inline-flex items-center justify-center gap-1.5">
        <Copy className="size-3.5" />
        {copied ? "Copied" : label}
      </span>
    </button>
  );
}

function TemplateButton({
  button,
}: {
  button: NonNullable<ChatMessage["buttons"]>[number];
}) {
  const handleClick: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> = (e) => {
    e.stopPropagation();
  };
  if (button.kind === "copyCode") {
    return <CopyCodeButton label={button.label} code={button.code} />;
  }
  const Icon =
    button.kind === "url"
      ? ExternalLink
      : button.kind === "phone"
        ? PhoneIcon
        : null;
  const label = (
    <span className="inline-flex items-center justify-center gap-1.5">
      {Icon && <Icon className="size-3.5" />}
      {button.label}
    </span>
  );
  if (button.kind === "url") {
    return (
      <a
        href={button.url}
        target="_blank"
        rel="noopener noreferrer"
        className={TEMPLATE_BUTTON_CLASSNAME}
        onClick={handleClick}
      >
        {label}
      </a>
    );
  }
  if (button.kind === "phone") {
    return (
      <a href={`tel:${button.phone}`} className={TEMPLATE_BUTTON_CLASSNAME} onClick={handleClick}>
        {label}
      </a>
    );
  }
  return (
    <button type="button" className={TEMPLATE_BUTTON_CLASSNAME} onClick={handleClick}>
      {label}
    </button>
  );
}

function computeMessageBubbleLayout(
  msg: ChatBubbleRenderableMessage,
  // Reference the module-level constant (which IS prefixed by the CLI transformer)
  // rather than a bare string literal here (which the transformer would skip).
  textMaxWidthClassName: string = DEFAULT_TEXT_MAX_WIDTH
) {
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
  const hasText = !!(msg.text || msg.textContent || mediaCaption);
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
          ? cn("max-w-[340px] w-full")
          : msg.type === "contact" || msg.type === "listReply"
            ? cn("max-w-[320px] w-full")
            // Text bubbles: library is single source of truth for max-width.
            // Consumers override via the `textMaxWidthClassName` prop.
            : cn(textMaxWidthClassName);

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
    message: ChatBubbleRenderableMessage;
    replyParticipantName?: string;
    onReplyClick?: (messageId: string) => void;
    onReplyTo?: (payload: ReplyToPayload) => void;
    showReplyOn?: ShowReplyOn;
    senderIndicator?: React.ReactNode;
    textMaxWidthClassName?: string;
  } & Omit<React.HTMLAttributes<HTMLDivElement>, "children">
>(function ChatBubbleMessageMode(
  {
    message: msg,
    replyParticipantName,
    onReplyClick,
    onReplyTo,
    showReplyOn = "customer",
    senderIndicator,
    textMaxWidthClassName = DEFAULT_TEXT_MAX_WIDTH,
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
  } = computeMessageBubbleLayout(msg, textMaxWidthClassName);
  const messageBodyContent = msg.textContent ?? msg.text ?? mediaCaption ?? "";
  const templateHeaderContent =
    msg.templateHeaderContent ?? msg.templateHeaderText;
  const templateMediaKind = msg.media?.mediaType;
  const hasFailedFeedback =
    msg.sender === "agent" &&
    msg.status === "failed" &&
    !!msg.failedMessage?.text;

  // Inline footer is disabled in favor of block footer.
  // For text-only bubbles, the block footer can be wider than the text content.
  // overflow-hidden on the bubble would clip the footer unless the bubble is
  // forced to be at least as wide as the widest possible footer:
  //   - receiver / customer: just a timestamp
  //   - sender / agent, failed: "Failed" + Retry + bullet + timestamp → 14rem
  //   - sender / agent, delivered/read: icon + label + bullet + timestamp → 13rem
  //   - sender / agent, no status: just a timestamp
  const shouldUseInlineFooter = false;
  const isMessageReceiverTextOnly =
    msg.sender === "customer" && !hasMedia && hasText && !hasButtons;
  const isMessageSenderTextOnly =
    msg.sender === "agent" && !hasMedia && hasText && !hasButtons;
  // Used to decide whether the bubble wrapper needs `w-fit` (text bubbles, so
  // the reply-button absolute anchor matches the rendered bubble width).
  const isMessageTextOnly = isMessageReceiverTextOnly || isMessageSenderTextOnly;
  const messageTextOnlyMinWidth: string | undefined = isMessageReceiverTextOnly
    ? RECEIVER_TEXT_ONLY_MIN_WIDTH
    : isMessageSenderTextOnly
      ? msg.status === "failed"
        ? SENDER_TEXT_ONLY_FAILED_MIN_WIDTH
        : msg.status
          ? SENDER_TEXT_ONLY_STATUS_MIN_WIDTH
          : RECEIVER_TEXT_ONLY_MIN_WIDTH
      : undefined;

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
            "absolute top-0 z-10 opacity-0 group-hover/msg:opacity-100 group-focus-within/msg:opacity-100 transition-opacity shrink-0 rounded-full text-semantic-text-muted hover:text-semantic-text-secondary hover:bg-semantic-bg-hover",
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
        <div className="absolute bottom-0 left-full ml-1.5 flex size-7 items-center justify-center rounded-full border border-solid border-semantic-border-layout bg-semantic-bg-primary">
          {senderIndicator}
        </div>
      )
    ) : null;

  return (
    <div
      ref={ref}
      className={cn(
        "group/msg flex w-full min-w-0 max-w-full items-start gap-1.5",
        msg.sender === "agent" ? "justify-end" : "justify-start",
        className
      )}
      {...rest}
    >
      <div
        id={`msg-${msg.id}`}
        className={cn(
          "flex min-w-0 flex-col",
          hasFailedFeedback
            ? "w-full max-w-full"
            : isMessageTextOnly
              ? "max-w-full"
              : bubbleWidth,
          msg.sender === "agent" ? "items-end" : "items-start",
          // Reserve 36px inside the column so the absolutely-positioned sender
          // icon (sentBy badge or custom senderIndicator) stays within the box.
          // Prevents avatar clipping by ancestor overflow:hidden / tight padding.
          msg.sender === "agent" &&
            (msg.sentBy || senderIndicator) &&
            "pr-9"
        )}
        style={
          hasFailedFeedback
            ? failedColumnStyle
            : getTextOnlyColumnMinWidthStyle(messageTextOnlyMinWidth)
        }
      >
        {msg.sender === "customer" && msg.senderName && (
          <span className="text-[12px] text-semantic-text-muted mb-1 px-1">
            {msg.senderName}
          </span>
        )}
        <div
          className={cn(
            "flex w-full min-w-0 max-w-full items-start gap-1.5",
            msg.sender === "agent" ? "justify-end" : "justify-start"
          )}
        >
        {/*
          Bubble wrapper: provides the positioning anchor for the absolutely-
          positioned reply button + sender icon, AND owns the minWidth so the
          wrapper's width === the rendered bubble width. Putting the absolute
          children on an outer flex row would let them detach from the actual
          bubble (since the bubble's minWidth doesn't propagate to the row).
        */}
        <div
          className={cn(
            "relative",
            isMessageTextOnly ? bubbleWidth : "max-w-full",
            // Text-only bubbles shrink the wrapper to content (+ minWidth);
            // media variants let the column's max-w control width via w-full.
            isMessageTextOnly ? "w-fit" : "w-full"
          )}
          style={getTextOnlyMinWidthStyle(messageTextOnlyMinWidth)}
        >
        {replyButton}
        <div
          className={cn(
            "rounded-lg overflow-hidden w-full",
            msg.sender === "agent"
              ? "bg-semantic-info-surface border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary"
              : "bg-semantic-bg-primary border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary shadow-xs"
          )}
        >
          {msg.type === "carousel" && hasText && (
            <div className="px-4 pt-3">
              <p
                className={cn(
                  MESSAGE_BODY_TEXT_CLASS,
                  "text-[14px] leading-5"
                )}
              >
                {renderMessageContent(messageBodyContent, "carousel-message")}
              </p>
            </div>
          )}
          {msg.type === "image" && msg.media && (
            <ImageMedia media={msg.media} />
          )}
          {msg.type === "template" &&
            msg.media &&
            (templateMediaKind === "video" || msg.media.duration ? (
              <VideoMedia media={msg.media} />
            ) : templateMediaKind === "document" ? (
              <DocMedia
                variant="file"
                filename={msg.media.filename}
                fileType={msg.media.fileType}
                pageCount={msg.media.pageCount}
                fileSize={msg.media.fileSize}
                onDownload={() => {
                  if (msg.media?.url) {
                    window.open(
                      msg.media.url,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }
                }}
              />
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
              <MessageModeReplyQuoteButton
                replyTo={msg.replyTo}
                onReplyClick={onReplyClick}
              />
            )}
            {msg.type === "template" && templateHeaderContent && !msg.media && (
              <p
                className={cn(
                  MESSAGE_BODY_TEXT_CLASS,
                  "mb-1 text-[14px] font-semibold text-semantic-text-primary"
                )}
              >
                {renderMessageContent(templateHeaderContent, "template-header")}
              </p>
            )}
            {hasText && msg.type !== "carousel" && (
              <p
                className={cn(
                  MESSAGE_BODY_TEXT_CLASS,
                  "text-[14px] leading-5"
                )}
              >
                {renderMessageContent(messageBodyContent, "message")}
                {shouldUseInlineFooter && (
                  <MessageModeDeliveryFooterInline msg={msg} />
                )}
              </p>
            )}
            {msg.type === "template" && msg.templateFooterText && (
              <p
                className={cn(
                  MESSAGE_BODY_TEXT_CLASS,
                  "mt-1 text-[12px] text-semantic-text-muted"
                )}
              >
                {renderMessageText(msg.templateFooterText)}
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
              {msg.buttons!.map((btn: NonNullable<ChatMessage["buttons"]>[number], i: number) => (
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
        {hasFailedFeedback && (
          <FailedMessageFeedback failedMessage={msg.failedMessage} />
        )}
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
    failedMessage: props.failedMessage,
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
      return {
        ...base,
        contactCard: {
          ...props.contactCard,
          contacts: props.contacts ?? props.contactCard.contacts,
          modal: props.contactModal ?? props.contactCard.modal,
          viewLabel: props.contactViewLabel ?? props.contactCard.viewLabel,
          onViewContacts:
            props.onViewContacts ?? props.contactCard.onViewContacts,
        },
        text: props.text ?? "",
      };
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
        templateHeaderText: props.templateHeaderText,
        templateFooterText: props.templateFooterText,
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
 *
 *    <ChatBubble type="template" variant="sender" timestamp="1:50 PM" status="sent"
 *      templateHeaderText="Verification code"
 *      text="Your one-time code is 4Y5GX9. It expires in 10 minutes."
 *      templateFooterText="Do not share this code with anyone."
 *      buttons={[
 *        { kind: "copyCode", label: "4Y5GX9", code: "4Y5GX9" },
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
        onReplyClick,
        onReplyTo,
        showReplyOn,
        senderIndicator,
        textMaxWidthClassName,
        className,
        ...rest
      } = props;
      return (
        <ChatBubbleMessageMode
          ref={ref}
          message={message}
          replyParticipantName={replyParticipantName}
          onReplyClick={onReplyClick}
          onReplyTo={onReplyTo}
          showReplyOn={showReplyOn}
          senderIndicator={senderIndicator}
          textMaxWidthClassName={textMaxWidthClassName}
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
        failedMessage: _failedMessage,
        onReplyTo,
        showReplyOn,
        replyParticipantName,
        messageId: _messageId,
        type: _type,
        textMaxWidthClassName,
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
      delete restNoPayload.contacts;
      delete restNoPayload.contactModal;
      delete restNoPayload.contactViewLabel;
      delete restNoPayload.onViewContacts;
      delete restNoPayload.referral;
      delete restNoPayload.listReply;
      delete restNoPayload.buttons;
      delete restNoPayload.error;
      delete restNoPayload.failedMessage;
      delete restNoPayload.templateHeaderText;
      delete restNoPayload.templateFooterText;
      const message = flatPropsToMessage(flat);
      return (
        <ChatBubbleMessageMode
          ref={ref}
          message={message}
          replyParticipantName={replyParticipantName}
          onReplyTo={onReplyTo}
          showReplyOn={showReplyOn}
          textMaxWidthClassName={textMaxWidthClassName}
          className={className}
          {...(restNoPayload as React.HTMLAttributes<HTMLDivElement>)}
        />
      );
    }

    const {
      variant,
      timestamp,
      status,
      failedMessage,
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
      textMaxWidthClassName = DEFAULT_TEXT_MAX_WIDTH,
      children,
      className,
      ...rest
    } = props as ChatBubbleManualProps;

    const hasMedia = !!media;
    // Block footer everywhere. For text-only bubbles, the bubble gets a minWidth
    // sized to the widest possible footer so overflow-hidden never clips it:
    //   - receiver: just a timestamp
    //   - sender, failed: "Failed" + Retry + bullet + timestamp → 14rem
    //   - sender, delivered/read: icon + label + bullet + timestamp → 13rem
    //   - sender, no status: just a timestamp
    const useManualInlineFooter = false;
    const isManualReceiverTextOnly =
      variant === "receiver" && !hasMedia && !!children;
    const isManualSenderTextOnly =
      variant === "sender" && !hasMedia && !!children;
    const isManualTextOnly =
      isManualReceiverTextOnly || isManualSenderTextOnly;
    const hasManualFailedFeedback =
      variant === "sender" && status === "failed" && !!failedMessage?.text;
    const manualTextOnlyMinWidth: string | undefined = isManualReceiverTextOnly
      ? RECEIVER_TEXT_ONLY_MIN_WIDTH
      : isManualSenderTextOnly
        ? status === "failed"
          ? SENDER_TEXT_ONLY_FAILED_MIN_WIDTH
          : status
            ? SENDER_TEXT_ONLY_STATUS_MIN_WIDTH
            : RECEIVER_TEXT_ONLY_MIN_WIDTH
        : undefined;

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
                "absolute top-0 z-10 opacity-0 group-hover/msg:opacity-100 group-focus-within/msg:opacity-100 transition-opacity shrink-0 rounded-full text-semantic-text-muted hover:text-semantic-text-secondary hover:bg-semantic-bg-hover",
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
          "group/msg flex w-full min-w-0 max-w-full items-start gap-1.5",
          variant === "sender" ? "justify-end" : "justify-start",
          className
        )}
        {...rest}
      >
        <div
          className={cn(
            "flex min-w-0 flex-col",
            // Text bubbles: prop-driven cap (library is single source of truth).
            // Media variants: use the absolute-px caps from maxWidthMap.
            hasManualFailedFeedback
              ? "w-full max-w-full"
              : isManualTextOnly
                ? "max-w-full"
                : maxWidth === "text"
                  ? textMaxWidthClassName
                  : maxWidthMap[maxWidth],
            variant === "sender" ? "items-end" : "items-start",
            // Reserve 36px (28px avatar + 6px ml + 2px buffer) inside the column
            // so the absolutely-positioned senderIndicator stays within the box.
            // Prevents avatar clipping when consumers wrap the bubble in a container
            // with overflow:hidden or tight right/left padding.
            senderIndicator && variant === "sender" && "pr-9"
          )}
          style={
            hasManualFailedFeedback
              ? failedColumnStyle
              : getTextOnlyColumnMinWidthStyle(manualTextOnlyMinWidth)
          }
        >
          {variant === "receiver" && senderName && (
            <span className="mb-1 px-1 text-[12px] text-semantic-text-muted">
              {senderName}
            </span>
          )}
          <div
            className={cn(
              "flex w-full min-w-0 max-w-full items-start gap-1.5",
              variant === "sender" ? "justify-end" : "justify-start"
            )}
          >
          {/*
            Bubble wrapper: positioning anchor for reply button + sender icon,
            and owns the minWidth so the wrapper width === rendered bubble width.
          */}
          <div
            className={cn(
              "relative",
              isManualTextOnly ? textMaxWidthClassName : "max-w-full",
              isManualTextOnly ? "w-fit" : "w-full"
            )}
            style={getTextOnlyMinWidthStyle(manualTextOnlyMinWidth)}
          >
          {manualReplyButton}
          <div
            className={cn(
              "overflow-hidden rounded w-full",
              !hasMedia && "px-4 pb-1.5 pt-3",
              variant === "sender"
                ? "border-[0.2px] border-solid border-semantic-border-layout bg-semantic-info-surface text-semantic-text-primary"
                : "border-[0.2px] border-solid border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-primary shadow-xs"
            )}
          >
            {media}
            <div className={hasMedia ? "px-4 pb-1.5 pt-2" : ""}>
              {reply && (
                <ReplyQuote
                  sender={reply.sender}
                  message={reply.message}
                  className="bg-semantic-bg-primary"
                  onClick={() => {
                    if (reply.messageId && onReplyClick) {
                      onReplyClick(reply.messageId);
                    }
                  }}
                />
              )}
              {children && (
                <p
                  className={cn(
                    MESSAGE_BODY_TEXT_CLASS,
                    "text-[14px] leading-5"
                  )}
                >
                  {renderManualContent(children)}
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
            <div className="absolute bottom-0 left-full ml-1.5 flex size-7 items-center justify-center rounded-full border border-solid border-semantic-border-layout bg-semantic-bg-primary">
              {senderIndicator}
            </div>
          )}
          </div>
          </div>
          {hasManualFailedFeedback && (
            <FailedMessageFeedback failedMessage={failedMessage} />
          )}
        </div>
      </div>
    );
  }
);
ChatBubblePrimitive.displayName = "ChatBubble";

export { ChatBubblePrimitive };
