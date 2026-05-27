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

export type {
  Tab,
  TabDef,
  AssigneeItem,
  ChannelItem,
  ChatItem,
  TemplateCategory,
  TemplateType,
  TemplateCardDef,
  TemplateDef,
  VarMap,
  CardVarMap,
  MediaPayload,
  SentByType,
  LocationPayload,
  ContactPayload,
  ReferralPayload,
  ListReplyPayload,
  ChatBubbleButton,
  ChatMessage,
  Contact,
  ContactDetails,
  CannedMessage,
  ChatFilters,
  TemplateSendPayload,
  SendMessagePayload,
  ChatBubbleProps,
  ChatBubbleManualProps,
  ChatBubbleMessageProps,
  ChatBubbleFlatProps,
  ChatBubbleFlatBase,
  ChatBubbleFlatTextProps,
  ChatBubbleFlatMediaProps,
  ChatBubbleFlatAudioProps,
  ChatBubbleFlatCarouselProps,
  ChatBubbleFlatLoadingProps,
  ChatBubbleFlatLocationProps,
  ChatBubbleFlatContactProps,
  ChatBubbleFlatReferralProps,
  ChatBubbleFlatListReplyProps,
  ChatBubbleFlatTemplateProps,
  ChatBubbleReply,
  ChatFailedMessage,
  DeliveryStatus,
  ReplyToPayload,
  ChatMessageListBubbleRowProps,
  ChatMessageListProps,
} from "./types";
export {
  isChatBubbleMessageProps,
  isChatBubbleFlatProps,
} from "./types";
