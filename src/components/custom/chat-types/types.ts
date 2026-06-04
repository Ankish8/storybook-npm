import type { ReactNode } from "react"

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

/** Attachment kind for media payloads (template headers, carousel cards, etc.). */
export type MediaAttachmentType = "image" | "video" | "document"

export type MediaPayload = {
  url: string
  thumbnailUrl?: string
  filename?: string
  fileType?: string
  fileSize?: string
  pageCount?: number
  duration?: string
  /** Visual attachment kind when multiple renderers share one media slot (defaults to image). */
  mediaType?: MediaAttachmentType
  /** When set (e.g. Live Chat), click opens fullscreen preview (same intent as video-media `opensPreviewOnClick`). */
  onActivate?: () => void
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

export type ContactCardItem = {
  id?: string
  name: string
  phone: string
  email?: string
  organization?: string
  avatarUrl?: string
  initials?: string
}

export type ContactListModalConfig = {
  enabled?: boolean
  title?: ReactNode
  viewLabel?: string
}

export type ContactPayload = ContactCardItem & {
  /** Additional contacts for multi-contact messages. When omitted, the top-level contact is used as the single contact. */
  contacts?: ContactCardItem[]
  /** Set to `false` to disable the built-in contact-list modal, or pass labels/title to customize it. */
  modal?: boolean | ContactListModalConfig
  /** Overrides the card action label. Defaults to "View Contact" / "View Contacts". */
  viewLabel?: string
  /** Fires when the card action is clicked, before the optional built-in modal opens. */
  onViewContacts?: (contacts: ContactCardItem[]) => void
}

export type ReferralPayload = {
  headline: string
  body?: string
  sourceUrl?: string
  thumbnailUrl?: string
  sourceType?: "ad" | "post" | "unknown"
}

export type ListReplyRow = {
  id: string
  title: string
  description?: string
}

export type ListReplySection = {
  title: string
  rows: ListReplyRow[]
}

export type ListReplyModalConfig = {
  /** Modal title. Defaults to the list header, then the button label, then "Select an option". */
  title?: string
  /** Optional helper text shown below the modal title. */
  description?: string
}

export type ListReplyPayload = {
  header?: string
  body: string
  footer?: string
  /** Marks the list prompt as required, rendering a required indicator next to the body copy. */
  required?: boolean
  buttonText: string
  /** When true, the built-in list UI starts open. */
  showList?: boolean
  /** Built-in list modal config. Pass `false` to keep the legacy inline row expansion. */
  modal?: boolean | ListReplyModalConfig
  sections?: ListReplySection[]
}

/**
 * Button rendered inside a `template` bubble — quick-reply (sends text response),
 * url (opens link), phone (dials number), or copy-code (copies a one-time code /
 * OTP / coupon to the user's clipboard). WhatsApp templates can mix kinds in a
 * single message.
 */
export type ChatBubbleButton =
  | { kind: "quickReply"; label: string; id?: string }
  | { kind: "url"; label: string; url: string }
  | { kind: "phone"; label: string; phone: string }
  | { kind: "copyCode"; label: string; code: string }

export type ChatFailedMessage = {
  /** Optional error code shown before the message, e.g. "131049". */
  code?: string | number
  /** Detailed failed-delivery reason shown below the bubble. */
  text: string
}

export type ChatMessage = {
  id: string
  text: string
  time: string
  sender: "customer" | "agent"
  /**
   * Shown in the **header** above the bubble (outbound: right-aligned; inbound: left). On **agent**
   * messages, when `sentBy` is set, the name and source badge sit on the same row (see
   * `SenderIndicator` in the `sender-indicator` module).
   */
  senderName?: string
  type?:
    | "text"
    | "template"
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
  status?: "queued" | "sent" | "delivered" | "read" | "failed"
  failedMessage?: ChatFailedMessage
  replyTo?: { sender: string; text: ReactNode; messageId?: string }
  media?: MediaPayload
  error?: string
  /**
   * **Agent rows only** (`sender: "agent"`). Drives the header-row badge next to `senderName`
   * (see `SenderBadgeIcon` in `SenderIndicator`):
   * - `agent` + `name` → two-letter initials; if `name` is missing, the badge falls back to the plug icon.
   * - `bot` → Bot icon.
   * - `campaign` → megaphone; tooltip `"Campaign"`.
   * - `api` → plug; tooltip `"API"`.
   */
  sentBy?: { type: SentByType; name?: string }
  location?: LocationPayload
  contactCard?: ContactPayload
  referral?: ReferralPayload
  listReply?: ListReplyPayload
  /**
   * Template-message buttons (quick-reply / url / phone / copy-code). Only rendered
   * when `type === "template"`. When present, the delivery footer renders **below**
   * the button stack to match WhatsApp's template layout.
   */
  buttons?: ChatBubbleButton[]
  /**
   * WhatsApp template header text (max 60 chars per WhatsApp spec). Only used when
   * `type === "template"`. Mutually exclusive with media headers — if `media` is set
   * on a template message, the media header takes precedence and this is ignored.
   */
  templateHeaderText?: string
  /**
   * WhatsApp template footer text (plain text, no placeholders, max 60 chars per
   * WhatsApp spec). Only used when `type === "template"`.
   */
  templateFooterText?: string
  /**
   * Rich body content for send-template preview (placeholder highlighting).
   * When set, rendered instead of `text` for template messages.
   */
  textContent?: ReactNode
  /**
   * Rich text-header content for send-template preview. When set, rendered
   * instead of `templateHeaderText` for template messages.
   */
  templateHeaderContent?: ReactNode
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
