import * as React from "react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { TextField } from "../../ui/text-field"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"
import { Badge } from "../../ui/badge"
import { ChatListItem, type MessageType } from "../chat-list-item"
import { useChatContext } from "../chat-provider"
import type { Tab } from "../chat-types"
import { Search, Plus, CircleAlert } from "lucide-react"

/* ── Custom Icons ── */

const FilterIcon = () => (
  <svg
    aria-hidden="true"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="text-semantic-text-primary"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="10" y1="17" x2="14" y2="17" />
  </svg>
)

/* ── Helpers ── */

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-semantic-text-primary">
        {text.slice(idx, idx + query.length)}
      </strong>
      {text.slice(idx + query.length)}
    </>
  )
}

/* ── ChatSidebar ── */

export interface ChatSidebarProps {
  /** Swappable content — typically FilterPanel or NewChatPanel rendered by the parent */
  children?: React.ReactNode
  /** Ref forwarded to the chat area for focus management after selecting a chat */
  chatAreaRef?: React.RefObject<HTMLDivElement | null>
}

function ChatSidebar({ children, chatAreaRef }: ChatSidebarProps) {
  const {
    tabs,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    chats,
    selectedChatId,
    selectChat,
    showFilters,
    setShowFilters,
    showNewChat,
    setShowNewChat,
    appliedFilters,
    setShowContactDetails,
  } = useChatContext()

  const hasActiveFilters =
    (appliedFilters?.assignees != null && appliedFilters.assignees.size > 0) ||
    (appliedFilters?.channels != null && appliedFilters.channels.size > 0)

  const filteredChats = React.useMemo(() => {
    return chats.filter((c) => {
      if (c.tab !== activeTab) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          c.name.toLowerCase().includes(q) ||
          c.message.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [chats, activeTab, search])

  const openNewChat = React.useCallback(() => {
    setShowFilters(false)
    setSearch("")
    setShowNewChat(true)
  }, [setShowFilters, setSearch, setShowNewChat])

  const openFilters = React.useCallback(() => {
    setShowFilters(true)
    setSearch("")
  }, [setShowFilters, setSearch])

  const handleSelectChat = React.useCallback(
    (chatId: string) => {
      selectChat(chatId)
      setShowContactDetails(false)
      requestAnimationFrame(() => chatAreaRef?.current?.focus())
    },
    [selectChat, setShowContactDetails, chatAreaRef]
  )

  // Determine if a swappable child panel is active
  const showSwappableContent = showNewChat || showFilters

  return (
    <nav
      aria-label="Inbox"
      className="flex flex-col w-[356px] h-full bg-white shrink-0 border-r border-solid border-semantic-border-layout"
    >
      {showSwappableContent && children ? (
        <div
          key={showNewChat ? "newchat" : "filters"}
          className="flex flex-col flex-1 min-h-0 animate-in slide-in-from-right-3 fade-in duration-200"
        >
          {children}
        </div>
      ) : (
        <div
          key="inbox"
          className="flex flex-col flex-1 min-h-0 animate-in fade-in duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 h-[72px] shrink-0">
            <h1 className="m-0 text-[24px] font-semibold text-semantic-text-primary leading-8">
              Inbox
            </h1>
            <Button
              variant="outline"
              className="h-10"
              leftIcon={<Plus className="size-5" />}
              onClick={openNewChat}
            >
              New Chat
            </Button>
          </div>

          {/* Search + Filter button */}
          <div
            role="search"
            aria-label="Search conversations"
            className="flex gap-2 px-4 shrink-0"
          >
            <TextField
              placeholder="Search conversations"
              aria-label="Search conversations"
              leftIcon={<Search className="size-[18px]" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              clearable
              onClear={() => setSearch("")}
              wrapperClassName="flex-1"
              size="default"
            />
            <Button
              variant="outline"
              size="icon-lg"
              onClick={openFilters}
              className={cn(
                "relative",
                hasActiveFilters &&
                  "border-semantic-primary text-semantic-primary"
              )}
            >
              <FilterIcon />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-semantic-border-accent animate-in zoom-in duration-200 ring-1 ring-semantic-border-layout" />
              )}
            </Button>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as Tab)}
          >
            <TabsList fullWidth className="shrink-0 mt-1">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                  <Badge
                    variant={activeTab === tab.id ? "primary" : "default"}
                    size="sm"
                  >
                    {tab.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Chat List */}
          <div className="sr-only" aria-live="polite">
            {`${filteredChats.length} conversations`}
          </div>
          <div
            key={activeTab}
            className="flex-1 overflow-y-auto animate-in fade-in duration-150 ease-out"
          >
            {filteredChats.map((chat) => (
              <div key={chat.id} className="relative">
                <ChatListItem
                  {...chat}
                  messageType={chat.messageType as MessageType}
                  message={
                    search
                      ? highlightMatch(chat.message, search)
                      : chat.message
                  }
                  messageStatus={
                    chat.isFailed ? undefined : chat.messageStatus
                  }
                  isSelected={selectedChatId === chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                />
                {chat.isFailed && (
                  <div className="absolute top-5 right-4">
                    <CircleAlert className="size-4 text-semantic-error-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

ChatSidebar.displayName = "ChatSidebar"

export { ChatSidebar }
