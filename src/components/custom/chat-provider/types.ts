import type {
  Tab,
  ChatItem,
  ChatMessage,
  AssigneeItem,
  ChannelItem,
  TabDef,
  Contact,
  TemplateDef,
  CannedMessage,
  ChatFilters,
} from "../chat-types"
import type { ChatTransport } from "../chat-transport/types"

export interface ChatContextValue {
  // Transport
  transport: ChatTransport

  // Data
  tabs: TabDef[]
  assignees: AssigneeItem[]
  channels: ChannelItem[]
  chats: ChatItem[]
  contacts: Contact[]
  templates: TemplateDef[]
  cannedMessages: CannedMessage[]

  // Chat list state
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  search: string
  setSearch: (query: string) => void
  selectedChatId: string | null
  selectChat: (chatId: string | null) => void

  // Messages for selected chat
  messages: ChatMessage[]
  isLoadingMessages: boolean

  // Filters
  appliedFilters: ChatFilters | null
  applyFilters: (filters: ChatFilters | null) => void

  // UI state toggles
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  showNewChat: boolean
  setShowNewChat: (show: boolean) => void
  showContactDetails: boolean
  setShowContactDetails: (show: boolean) => void
  showTemplateModal: boolean
  setShowTemplateModal: (show: boolean) => void
  showAddContact: boolean
  setShowAddContact: (show: boolean) => void

  // Actions
  sendMessage: (text: string, attachment?: File, replyToMessageId?: string) => Promise<void>
  sendTemplate: (templateId: string, variables: Record<string, string>, cardVariables?: Record<number, { body: Record<string, string>; button: Record<string, string> }>) => Promise<void>
  assignChat: (agentId: string) => Promise<void>
  resolveChat: () => Promise<void>
  createContact: (contact: { name: string; phone: string; channel: string }) => Promise<void>

  // Loading states
  isLoading: boolean
}
