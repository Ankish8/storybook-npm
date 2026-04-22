import * as React from "react"
import type { ChatMessage } from "../chat-types"
import { TooltipProvider } from "../../ui/tooltip"
import { ChatBubblePrimitive as ChatBubble } from "./chat-bubble-base"

/** Storybook-only samples: agent rows with `sentBy` (bot / campaign / API). Pass as `message` to `ChatBubble`. */

const base: Pick<
  ChatMessage,
  "id" | "time" | "sender" | "type" | "status" | "text"
> = {
  id: "sample-source",
  time: "9:41 AM",
  sender: "agent",
  type: "text",
  status: "read",
  text: "This is a sample outbound message. The circular badge uses the same icons as the thread list: Bot, Campaign (megaphone), or API (plug).",
}

/** Mock agent row — sent by a bot (`sentBy.type` === `bot`). */
export const chatMessageAgentFromBot: ChatMessage = {
  ...base,
  id: "sample-bot",
  senderName: "Support Bot",
  sentBy: { type: "bot", name: "Bot" },
}

/** Mock agent row — campaign / broadcast (`sentBy.type` === `campaign`). */
export const chatMessageAgentFromCampaign: ChatMessage = {
  ...base,
  id: "sample-campaign",
  senderName: "Alex Smith",
  sentBy: { type: "campaign" },
}

/** Mock agent row — API / integration (`sentBy.type` === `api`). */
export const chatMessageAgentFromApi: ChatMessage = {
  ...base,
  id: "sample-api",
  senderName: "Zenith",
  sentBy: { type: "api", name: "Zapier" },
}

function withTooltip(children: React.ReactNode) {
  return (
    <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
  )
}

/** Isolated preview: agent bubble with **Bot** source icon (see `SenderIndicator` + `sentBy`). */
export function ChatBubbleAgentMessageFromBot() {
  return withTooltip(<ChatBubble message={chatMessageAgentFromBot} />)
}

/** Isolated preview: agent bubble with **Campaign** (megaphone) source icon. */
export function ChatBubbleAgentMessageFromCampaign() {
  return withTooltip(
    <ChatBubble message={chatMessageAgentFromCampaign} />
  )
}

/** Isolated preview: agent bubble with **API** (plug) source icon. */
export function ChatBubbleAgentMessageFromApi() {
  return withTooltip(<ChatBubble message={chatMessageAgentFromApi} />)
}
