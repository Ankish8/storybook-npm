import * as React from "react";
import type { ChatMessage } from "../chat-types";

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
}

export type ChatBubbleProps = ChatBubbleManualProps | ChatBubbleMessageProps;

/**
 * Prop surface that `ChatMessageList` passes to each `<ChatBubble />` row (message mode).
 * Use this when typing wrapper components or callbacks for list rows.
 */
export type ChatMessageListBubbleRowProps = ChatBubbleMessageProps;

export function isChatBubbleMessageProps(
  props: ChatBubbleProps
): props is ChatBubbleMessageProps {
  return "message" in props && props.message !== undefined;
}
