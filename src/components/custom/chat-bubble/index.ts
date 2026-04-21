/**
 * Chat Bubble — `ChatBubble` single messages plus **`ChatBubble.MessageList`** (scroll thread: `onReplyTo`, root `className`).
 * Re-exports chat types, timeline divider, and provider for full template wiring.
 */

import { ChatBubblePrimitive } from "./chat-bubble-base";
import { ChatMessageList } from "./chat-message-list";

/** Single-message bubble with static **`MessageList`** for the provider-driven thread. */
export const ChatBubble = Object.assign(ChatBubblePrimitive, {
  MessageList: ChatMessageList,
});

export { ChatMessageList } from "./chat-message-list";

export {
  ChatTimelineDivider,
  type ChatTimelineDividerProps,
  type ChatTimelineDividerVariant,
} from "../chat-timeline-divider";

export { ChatProvider, ChatContext, useChatContext } from "../chat-provider";
export type { ChatContextValue } from "../chat-provider/types";

export * from "../chat-types";

export type {
  ChatBubbleProps,
  ChatBubbleManualProps,
  ChatBubbleMessageProps,
  ChatBubbleReply,
  DeliveryStatus,
  ReplyToPayload,
  ChatMessageListBubbleRowProps,
  ChatMessageListProps,
} from "./types";
export { isChatBubbleMessageProps } from "./types";
