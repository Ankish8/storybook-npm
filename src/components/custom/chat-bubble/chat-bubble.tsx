/**
 * Backward-compat shim for consumers that imported `ChatBubble` from
 * `./chat-bubble`. The component was refactored into `chat-bubble-base.tsx`
 * (primitive) plus dispatch via `ChatBubbleProps` union (manual / message /
 * flat modes). Pre-refactor installs still had a `chat-bubble.tsx` in their
 * tree that referenced the old single-shape `ChatBubbleProps` — this shim
 * lets `npx myoperator-ui add chat-bubble --overwrite` replace that stale
 * file with a thin re-export that compiles against the current union.
 *
 * New code should import from `./index` (the public surface), not this file.
 */
export { ChatBubblePrimitive as ChatBubble } from "./chat-bubble-base";
export type {
  ChatBubbleProps,
  ChatBubbleManualProps,
  ChatBubbleMessageProps,
  ChatBubbleFlatProps,
  ChatBubbleReply,
  DeliveryStatus,
  ShowReplyOn,
  ReplyToPayload,
  ChatMessageListProps,
} from "./types";
export {
  isChatBubbleMessageProps,
  isChatBubbleFlatProps,
} from "./types";
