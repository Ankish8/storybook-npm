import * as React from "react";

export type DeliveryStatus = "sent" | "delivered" | "read" | "failed";

export interface ChatBubbleReply {
  /** Name of the person being replied to */
  sender: string;
  /** The quoted message text */
  message: string;
  /** ID of the original message for scroll-to behavior */
  messageId?: string;
}

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
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
  /** Sender indicator rendered outside the bubble at bottom-right (e.g., agent avatar, bot icon) */
  senderIndicator?: React.ReactNode;
}
