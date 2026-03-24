import * as React from "react"
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
  CardVarMap,
} from "../chat-types"
import type { ChatTransport } from "../chat-transport/types"
import { ChatContext } from "./chat-context"

export interface ChatProviderProps {
  transport: ChatTransport
  children: React.ReactNode
}

export function ChatProvider({ transport, children }: ChatProviderProps) {
  // ── Lookup data ──────────────────────────────────────────────
  const [tabs, setTabs] = React.useState<TabDef[]>([])
  const [assignees, setAssignees] = React.useState<AssigneeItem[]>([])
  const [channels, setChannels] = React.useState<ChannelItem[]>([])
  const [contacts, setContacts] = React.useState<Contact[]>([])
  const [templates, setTemplates] = React.useState<TemplateDef[]>([])
  const [cannedMessages, setCannedMessages] = React.useState<CannedMessage[]>(
    []
  )

  // ── Chat list state ──────────────────────────────────────────
  const [chats, setChats] = React.useState<ChatItem[]>([])
  const [activeTab, setActiveTab] = React.useState<Tab>("open")
  const [search, setSearch] = React.useState("")
  const [selectedChatId, setSelectedChatId] = React.useState<string | null>(
    null
  )

  // ── Messages for selected chat ───────────────────────────────
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false)

  // ── Filters ──────────────────────────────────────────────────
  const [appliedFilters, setAppliedFilters] =
    React.useState<ChatFilters | null>(null)

  // ── UI state toggles ────────────────────────────────────────
  const [showFilters, setShowFilters] = React.useState(false)
  const [showNewChat, setShowNewChat] = React.useState(false)
  const [showContactDetails, setShowContactDetails] = React.useState(false)
  const [showTemplateModal, setShowTemplateModal] = React.useState(false)
  const [showAddContact, setShowAddContact] = React.useState(false)

  // ── Loading ──────────────────────────────────────────────────
  const [isLoading, setIsLoading] = React.useState(true)

  // ── Load initial lookup data on mount ────────────────────────
  React.useEffect(() => {
    let cancelled = false

    async function loadInitialData() {
      setIsLoading(true)
      try {
        const [
          tabsData,
          assigneesData,
          channelsData,
          contactsData,
          templatesData,
          cannedData,
        ] = await Promise.all([
          transport.fetchTabs(),
          transport.fetchAssignees(),
          transport.fetchChannels(),
          transport.fetchContacts(),
          transport.fetchTemplates(),
          transport.fetchCannedMessages(),
        ])

        if (cancelled) return

        setTabs(tabsData)
        setAssignees(assigneesData)
        setChannels(channelsData)
        setContacts(contactsData)
        setTemplates(templatesData)
        setCannedMessages(cannedData)
      } catch (err) {
        console.error("[ChatProvider] Failed to load initial data:", err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadInitialData()
    return () => {
      cancelled = true
    }
  }, [transport])

  // ── Re-fetch chats when tab, search, or filters change ──────
  React.useEffect(() => {
    let cancelled = false

    async function loadChats() {
      try {
        const data = await transport.fetchChats({
          tab: activeTab,
          search: search || undefined,
          filters: appliedFilters ?? undefined,
        })
        if (!cancelled) setChats(data)
      } catch (err) {
        console.error("[ChatProvider] Failed to load chats:", err)
      }
    }

    loadChats()
    return () => {
      cancelled = true
    }
  }, [transport, activeTab, search, appliedFilters])

  // ── Fetch messages when selectedChatId changes ──────────────
  React.useEffect(() => {
    if (!selectedChatId) {
      setMessages([])
      return
    }

    let cancelled = false
    setIsLoadingMessages(true)

    async function loadMessages() {
      try {
        const data = await transport.fetchMessages(selectedChatId!)
        if (!cancelled) setMessages(data)
      } catch (err) {
        console.error("[ChatProvider] Failed to load messages:", err)
      } finally {
        if (!cancelled) setIsLoadingMessages(false)
      }
    }

    loadMessages()
    return () => {
      cancelled = true
    }
  }, [transport, selectedChatId])

  // ── Subscribe to real-time messages ─────────────────────────
  React.useEffect(() => {
    if (!transport.onNewMessage) return

    const unsubscribe = transport.onNewMessage((chatId, message) => {
      if (chatId === selectedChatId) {
        setMessages((prev) => [...prev, message])
      }
    })

    return unsubscribe
  }, [transport, selectedChatId])

  // ── Actions ─────────────────────────────────────────────────
  const selectChat = React.useCallback((chatId: string | null) => {
    setSelectedChatId(chatId)
  }, [])

  const applyFilters = React.useCallback(
    (filters: ChatFilters | null) => {
      setAppliedFilters(filters)
    },
    []
  )

  const sendMessage = React.useCallback(
    async (text: string, attachment?: File, replyToMessageId?: string) => {
      if (!selectedChatId) return

      const sent = await transport.sendMessage(selectedChatId, {
        text,
        attachment,
        replyToMessageId,
      })
      setMessages((prev) => [...prev, sent])
    },
    [transport, selectedChatId]
  )

  const sendTemplate = React.useCallback(
    async (
      templateId: string,
      variables: Record<string, string>,
      cardVariables?: Record<
        number,
        { body: Record<string, string>; button: Record<string, string> }
      >
    ) => {
      if (!selectedChatId) return

      await transport.sendTemplate(selectedChatId, {
        templateId,
        variables,
        cardVariables: cardVariables as CardVarMap | undefined,
      })
    },
    [transport, selectedChatId]
  )

  const assignChat = React.useCallback(
    async (agentId: string) => {
      if (!selectedChatId) return
      await transport.assignChat(selectedChatId, agentId)
    },
    [transport, selectedChatId]
  )

  const resolveChat = React.useCallback(async () => {
    if (!selectedChatId) return
    await transport.resolveChat(selectedChatId)
  }, [transport, selectedChatId])

  const createContact = React.useCallback(
    async (contact: { name: string; phone: string; channel: string }) => {
      await transport.createContact(contact)
    },
    [transport]
  )

  // ── Context value ───────────────────────────────────────────
  const value = React.useMemo(
    () => ({
      transport,
      tabs,
      assignees,
      channels,
      chats,
      contacts,
      templates,
      cannedMessages,
      activeTab,
      setActiveTab,
      search,
      setSearch,
      selectedChatId,
      selectChat,
      messages,
      isLoadingMessages,
      appliedFilters,
      applyFilters,
      showFilters,
      setShowFilters,
      showNewChat,
      setShowNewChat,
      showContactDetails,
      setShowContactDetails,
      showTemplateModal,
      setShowTemplateModal,
      showAddContact,
      setShowAddContact,
      sendMessage,
      sendTemplate,
      assignChat,
      resolveChat,
      createContact,
      isLoading,
    }),
    [
      transport,
      tabs,
      assignees,
      channels,
      chats,
      contacts,
      templates,
      cannedMessages,
      activeTab,
      search,
      selectedChatId,
      selectChat,
      messages,
      isLoadingMessages,
      appliedFilters,
      applyFilters,
      showFilters,
      showNewChat,
      showContactDetails,
      showTemplateModal,
      showAddContact,
      sendMessage,
      sendTemplate,
      assignChat,
      resolveChat,
      createContact,
      isLoading,
    ]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
