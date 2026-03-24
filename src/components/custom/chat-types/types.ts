export type Tab = "open" | "assigned" | "resolved"

export type TabDef = { id: Tab; label: string; count: number }

export type AssigneeItem = {
  id: string
  label: string
  type: "all" | "unassigned" | "bot" | "agent"
}

export type ChannelItem = {
  id: string
  name: string
  phone: string
  badge: string
}

export type ChatItem = {
  id: string
  tab: Tab
  name: string
  message: string
  timestamp: string
  messageStatus?: "sent" | "delivered" | "read"
  messageType?: "document" | "image" | "video" | "audio" | "text"
  channel: string
  agentName?: string
  unreadCount?: number
  slaTimer?: string
  isBot?: boolean
  isAgentDeleted?: boolean
  isWindowExpired?: boolean
  isFailed?: boolean
}

export type TemplateCategory = "all" | "marketing" | "utility" | "authentication"
export type TemplateType = "text" | "image" | "carousel"

export type TemplateCardDef = {
  cardIndex: number
  bodyVariables: string[]
  buttonVariables: string[]
}

export type TemplateDef = {
  id: string
  name: string
  category: "marketing" | "utility" | "authentication"
  type: TemplateType
  body: string
  footer?: string
  button?: string
  bodyVariables: string[]
  cards?: TemplateCardDef[]
  cardImages?: string[]
}

export type VarMap = Record<string, string>
export type CardVarMap = Record<number, { body: VarMap; button: VarMap }>

export type MediaPayload = {
  url: string
  thumbnailUrl?: string
  filename?: string
  fileType?: string
  fileSize?: string
  pageCount?: number
  duration?: string
  caption?: string
  images?: Array<{
    url: string
    title: string
    buttons?: Array<{ label: string; icon?: string }>
  }>
}

export type SentByType = "agent" | "bot" | "campaign" | "api"

export type ChatMessage = {
  id: string
  text: string
  time: string
  sender: "customer" | "agent"
  senderName?: string
  type?:
    | "text"
    | "image"
    | "video"
    | "audio"
    | "document"
    | "docPreview"
    | "carousel"
    | "otherDoc"
    | "loading"
    | "system"
  status?: "sent" | "delivered" | "read" | "failed"
  replyTo?: { sender: string; text: string; messageId?: string }
  media?: MediaPayload
  error?: string
  sentBy?: { type: SentByType; name?: string }
}

export type Contact = {
  id: string
  name: string
  phone: string
  channel?: string
}

export type ContactDetails = {
  name: string
  phone: string
  email?: string
  source?: string
  marketingOptIn?: boolean
  tags?: string[]
  location?: string
  secondaryPhone?: string
  dob?: string
}

export type CannedMessage = {
  id: string
  shortcut: string
  body: string
}

export type ChatFilters = {
  assignees?: Set<string>
  channels?: Set<string>
}

export type TemplateSendPayload = {
  templateId: string
  variables: VarMap
  cardVariables?: CardVarMap
}

export type SendMessagePayload = {
  text: string
  attachment?: File
  replyToMessageId?: string
}
