import type {
  Tab,
  ChatItem,
  ChatMessage,
  Contact,
  ContactDetails,
  TemplateDef,
  TemplateCategory,
  ChatFilters,
  SendMessagePayload,
  TemplateSendPayload,
  AssigneeItem,
  ChannelItem,
  TabDef,
  CannedMessage,
} from "../chat-types"

export interface ChatTransport {
  /** Fetch the list of tabs with counts */
  fetchTabs(): Promise<TabDef[]>

  /** Fetch assignees for filter panel */
  fetchAssignees(): Promise<AssigneeItem[]>

  /** Fetch channels */
  fetchChannels(): Promise<ChannelItem[]>

  /** Fetch chat list for a given tab, optionally filtered */
  fetchChats(params: { tab: Tab; search?: string; filters?: ChatFilters }): Promise<ChatItem[]>

  /** Fetch messages for a specific chat */
  fetchMessages(chatId: string): Promise<ChatMessage[]>

  /** Send a text/attachment message */
  sendMessage(chatId: string, payload: SendMessagePayload): Promise<ChatMessage>

  /** Send a template message */
  sendTemplate(chatId: string, payload: TemplateSendPayload): Promise<void>

  /** Assign a chat to an agent */
  assignChat(chatId: string, agentId: string): Promise<void>

  /** Resolve/close a chat */
  resolveChat(chatId: string): Promise<void>

  /** Fetch contacts for new chat panel */
  fetchContacts(query?: string): Promise<Contact[]>

  /** Create a new contact */
  createContact(contact: { name: string; phone: string; channel: string }): Promise<Contact>

  /** Fetch templates, optionally filtered by category */
  fetchTemplates(category?: TemplateCategory): Promise<TemplateDef[]>

  /** Fetch contact details for the details panel */
  fetchContactDetails(chatId: string): Promise<ContactDetails>

  /** Update contact details */
  updateContactDetails(chatId: string, data: Partial<ContactDetails>): Promise<void>

  /** Fetch canned/quick reply messages */
  fetchCannedMessages(): Promise<CannedMessage[]>

  /** Subscribe to new messages (real-time). Returns unsubscribe function. */
  onNewMessage?(callback: (chatId: string, message: ChatMessage) => void): () => void
}
