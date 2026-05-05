import * as React from "react";
import type {
  ChatMessage,
  MediaPayload,
  LocationPayload,
  ContactPayload,
  ReferralPayload,
  ListReplyPayload,
  ChatBubbleButton,
  SentByType,
} from "../chat-types";

export type DeliveryStatus = "sent" | "delivered" | "read" | "failed";

export interface ChatBubbleReply {
  /** Name of the person being replied to */
  sender: string;
  /** The quoted message text */
  message: string;
  /** ID of the original message for scroll-to behavior */
  messageId?: string;
}

/** Payload for the optional customer-side reply action (`onReplyTo`) */
export interface ReplyToPayload {
  messageId: string;
  sender: string;
  text: string;
}

type HtmlDiv = React.HTMLAttributes<HTMLDivElement>;

/** Manual bubble: compose with `children`, optional `media`, etc. */
export interface ChatBubbleManualProps extends HtmlDiv {
  /** Whether this is a sent (agent) or received (customer) message */
  variant: "sender" | "receiver";
  /** Message timestamp text (e.g., "2:15 PM") */
  timestamp: string;
  /** Delivery status — only shown for sender variant */
  status?: DeliveryStatus;
  /** Sender name displayed above the bubble */
  senderName?: string;
  /** Reply quote data */
  reply?: ChatBubbleReply;
  /** Callback when reply quote is clicked */
  onReplyClick?: (messageId: string) => void;
  /** Slot for media content (rendered full-bleed, no padding) */
  media?: React.ReactNode;
  /** Controls max-width of the bubble: "text" = 65%, "media" = 380px, "audio" = 340px, "carousel" = 466px */
  maxWidth?: "text" | "media" | "audio" | "carousel";
  /**
   * **Manual mode only** — e.g. avatar/initials slot to the right of the bubble. In **message mode**
   * (the `message` prop), source UI comes from `message.sentBy` / `message.senderName` in the
   * header, not this prop.
   */
  senderIndicator?: React.ReactNode;
}

/**
 * Scrollable message thread (provider-driven). Same surface as {@link ChatBubble} `MessageList` static.
 * `className` merges onto the **root** wrapper around the scroll region; `onReplyTo` fires for customer bubbles only.
 */
export interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fires when the customer-message reply control is activated (customer bubble only). */
  onReplyTo?: (payload: ReplyToPayload) => void;
}

/** Full template message: renders text, media, documents, carousel, location, contact, etc. */
export interface ChatBubbleMessageProps extends HtmlDiv {
  /**
   * `ChatMessage` from `../chat-types`. Relevant to **source badges** (bot / campaign / API):
   * - `sender` must be `"agent"` for a header badge; use `senderName?` and `sentBy?`.
   * - `sentBy.type` — `bot` | `campaign` | `api` | `agent` (see `SenderIndicator`).
   * - `sentBy.name` — tooltips and, for `type: "agent"`, initials in the circle.
   * All other fields (`id`, `text`, `time`, `type`, `status`, `media`, …) drive body and footer.
   */
  message: ChatMessage;
  /**
   * Display name for the thread participant (customer rows) — passed into the **Reply** action
   * payload. Not the same as `message.senderName` (agent display label in the row header).
   */
  replyParticipantName?: string;
  /**
   * Customer-message reply control; mirrors `ChatMessageList`’s `onReplyTo`.
   */
  onReplyTo?: (payload: ReplyToPayload) => void;
  /**
   * Optional custom header slot when `sentBy` is not set; otherwise `SenderIndicator` uses `message.sentBy`.
   */
  senderIndicator?: React.ReactNode;
}

/**
 * Base props shared by all flat-mode message types. Use these alongside one of the
 * `type`-specific payload props (e.g. `location`, `contactCard`, `referral`).
 *
 * Flat mode is the **preferred API for non-text message types** — pass `type` plus
 * the matching payload prop directly instead of wrapping data in a `ChatMessage`.
 */
export interface ChatBubbleFlatBase
  extends Omit<HtmlDiv, "children" | "onCopy" | "onCut" | "onPaste"> {
  /** Bubble alignment. `sender` = right (agent), `receiver` = left (customer). */
  variant: "sender" | "receiver";
  /** Footer time label (e.g. `"2:15 PM"`). */
  timestamp: string;
  /** Delivery status — only shown for `sender` variant. */
  status?: DeliveryStatus;
  /** Sender name shown above the bubble. */
  senderName?: string;
  /**
   * Source badge for **agent rows only** — drives the icon next to `senderName`
   * (bot, campaign, api, agent initials). Mirrors `ChatMessage.sentBy`.
   */
  sentBy?: { type: SentByType; name?: string };
  /** Optional reply-quote block (rendered above body). */
  replyTo?: { sender: string; text: string; messageId?: string };
  /** Customer-row reply control payload (`onReplyTo` shows the Reply button). */
  onReplyTo?: (payload: ReplyToPayload) => void;
  /** Display name passed into the `onReplyTo` payload. */
  replyParticipantName?: string;
  /**
   * DOM anchor id used for scroll-to-quote behavior — when another bubble's
   * `replyTo.messageId` matches this, clicking the quote scrolls here.
   */
  messageId?: string;
}

/** Plain text bubble — same shape as manual mode but discriminated by `type`. */
export interface ChatBubbleFlatTextProps extends ChatBubbleFlatBase {
  type: "text";
  /** Body text. */
  text: string;
}

/** Image / video / document / docPreview / otherDoc — full-bleed media + optional caption. */
export interface ChatBubbleFlatMediaProps extends ChatBubbleFlatBase {
  type: "image" | "video" | "document" | "docPreview" | "otherDoc";
  media: MediaPayload;
  /** Optional caption rendered below the media. */
  text?: string;
}

/** Audio waveform bubble — no caption, footer shows duration on the left. */
export interface ChatBubbleFlatAudioProps extends ChatBubbleFlatBase {
  type: "audio";
  media: MediaPayload;
}

/** Carousel of cards (images/videos + title + per-card buttons). */
export interface ChatBubbleFlatCarouselProps extends ChatBubbleFlatBase {
  type: "carousel";
  media: MediaPayload;
  text?: string;
}

/** Loading placeholder with optional error banner. */
export interface ChatBubbleFlatLoadingProps extends ChatBubbleFlatBase {
  type: "loading";
  error?: string;
}

/** Location pin card — static map preview + name/address (or coordinates). */
export interface ChatBubbleFlatLocationProps extends ChatBubbleFlatBase {
  type: "location";
  location: LocationPayload;
  text?: string;
}

/** Contact (vCard) card — name, phone, email, organization. */
export interface ChatBubbleFlatContactProps extends ChatBubbleFlatBase {
  type: "contact";
  contactCard: ContactPayload;
  text?: string;
}

/** Click-to-WhatsApp / social-post referral context card. */
export interface ChatBubbleFlatReferralProps extends ChatBubbleFlatBase {
  type: "referral";
  referral: ReferralPayload;
  text?: string;
}

/** Interactive list reply (WhatsApp List Message) — header, body, footer, button. */
export interface ChatBubbleFlatListReplyProps extends ChatBubbleFlatBase {
  type: "listReply";
  listReply: ListReplyPayload;
  text?: string;
}

/**
 * Template message — body text with optional media header and stacked buttons
 * (quick-reply, url, phone). When `buttons` is set, the delivery footer renders
 * below the button stack (matches WhatsApp's template layout).
 */
export interface ChatBubbleFlatTemplateProps extends ChatBubbleFlatBase {
  type: "template";
  /** Body text — required for templates. */
  text: string;
  /** Optional media header (image / video). */
  media?: MediaPayload;
  /** Quick-reply / url / phone buttons rendered full-width, stacked. */
  buttons?: ChatBubbleButton[];
}

/**
 * Discriminated union of flat-mode props. Pass `type` plus the matching payload
 * prop — no need to construct a `ChatMessage` object.
 *
 * @example
 * ```tsx
 * <ChatBubble type="location" variant="receiver" timestamp="2:15 PM"
 *   location={{ latitude: 28.6, longitude: 77.2, name: "Office" }} />
 *
 * <ChatBubble type="template" variant="sender" timestamp="1:49 PM" status="read"
 *   text="Hello sd, This is your Sales report of this years."
 *   buttons={[
 *     { kind: "quickReply", label: "Interested" },
 *     { kind: "quickReply", label: "Not interested" },
 *   ]} />
 * ```
 */
export type ChatBubbleFlatProps =
  | ChatBubbleFlatTextProps
  | ChatBubbleFlatMediaProps
  | ChatBubbleFlatAudioProps
  | ChatBubbleFlatCarouselProps
  | ChatBubbleFlatLoadingProps
  | ChatBubbleFlatLocationProps
  | ChatBubbleFlatContactProps
  | ChatBubbleFlatReferralProps
  | ChatBubbleFlatListReplyProps
  | ChatBubbleFlatTemplateProps;

export type ChatBubbleProps =
  | ChatBubbleManualProps
  | ChatBubbleMessageProps
  | ChatBubbleFlatProps;

/**
 * Prop surface that `ChatMessageList` passes to each `<ChatBubble />` row (message mode).
 * Use this when typing wrapper components or callbacks for list rows.
 */
export type ChatMessageListBubbleRowProps = ChatBubbleMessageProps;

export function isChatBubbleMessageProps(
  props: ChatBubbleProps
): props is ChatBubbleMessageProps {
  return "message" in props && (props as ChatBubbleMessageProps).message !== undefined;
}

/**
 * True for the new flat-props mode (`type` discriminator + per-type payload).
 * False for manual mode and message mode.
 */
export function isChatBubbleFlatProps(
  props: ChatBubbleProps
): props is ChatBubbleFlatProps {
  return (
    !isChatBubbleMessageProps(props) &&
    "type" in props &&
    typeof (props as { type?: unknown }).type === "string"
  );
}
