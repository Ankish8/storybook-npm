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
  messageStatus?:
    | "sent"
    | "delivered"
    | "read"
    | "received"
    | "queue"
    | "failed"
  messageType?:
    | "text"
    | "button"
    | "reaction"
    | "audio"
    | "document"
    | "image"
    | "video"
    | "sticker"
    | "template"
    | "location"
    | "unsupportedFile"
    | "unsupported message"
    | "contacts"
    | "interactive"
  /** When absent, channel pill still renders if `agentName` is set */
  channel?: string
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
    mediaType?: "image" | "video"
    thumbnailUrl?: string
    title: string
    buttons?: Array<{ label: string; icon?: string }>
  }>
}

export type SentByType = "agent" | "bot" | "campaign" | "api"

export type LocationPayload = {
  latitude: number
  longitude: number
  name?: string
  address?: string
}

export type ContactPayload = {
  name: string
  phone: string
  email?: string
  organization?: string
}

export type ReferralPayload = {
  headline: string
  body?: string
  sourceUrl?: string
  thumbnailUrl?: string
  sourceType?: "ad" | "post" | "unknown"
}

export type ListReplyPayload = {
  header?: string
  body: string
  footer?: string
  buttonText: string
  sections?: Array<{
    title: string
    rows: Array<{ id: string; title: string; description?: string }>
  }>
}

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
    | "referral"
    | "location"
    | "contact"
    | "listReply"
  status?: "sent" | "delivered" | "read" | "failed"
  replyTo?: { sender: string; text: string; messageId?: string }
  media?: MediaPayload
  error?: string
  sentBy?: { type: SentByType; name?: string }
  location?: LocationPayload
  contactCard?: ContactPayload
  referral?: ReferralPayload
  listReply?: ListReplyPayload
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
