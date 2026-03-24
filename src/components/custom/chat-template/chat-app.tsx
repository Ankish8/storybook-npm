import * as React from "react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import {
  TooltipProvider,
} from "../../ui/tooltip"
import { Plus, MessageSquare, Upload, User } from "lucide-react"
import { useChatContext } from "../chat-provider"
import { ChatSidebar } from "../chat-sidebar"
import { ChatFilterPanel } from "../chat-filter-panel"
import { ChatNewPanel } from "../chat-new-panel"
import { AddNewContactModal } from "../chat-new-panel"
import { ChatHeader } from "../chat-header"
import { ChatMessageList } from "../chat-message-list"
import { ChatInput } from "../chat-input"
import { ChatTemplateModal } from "../chat-template-modal"
import { ChatContactPanel } from "../chat-contact-panel"

/* ── ChatApp ── */

export interface ChatAppProps {
  /** Additional className for the outer container */
  className?: string
}

/**
 * The fully composed chat application.
 * Wrap with `<ChatProvider transport={...}>` to use.
 *
 * @example
 * ```tsx
 * import { ChatApp, ChatProvider, MockTransport } from "./components/custom/chat-template"
 *
 * <ChatProvider transport={new MockTransport()}>
 *   <ChatApp />
 * </ChatProvider>
 * ```
 */
export function ChatApp({ className }: ChatAppProps) {
  const {
    chats,
    selectedChatId,
    showFilters,
    setShowFilters,
    showNewChat,
    setShowNewChat,
    showAddContact,
    setShowAddContact,
    showTemplateModal,
    showContactDetails,
    setShowContactDetails,
    applyFilters,
    setSearch,
    channels,
  } = useChatContext()

  const chatAreaRef = React.useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const selectedChat = React.useMemo(
    () => chats.find((c) => c.id === selectedChatId) ?? null,
    [chats, selectedChatId]
  )

  const openNewChat = React.useCallback(() => {
    setShowFilters(false)
    setSearch("")
    setShowNewChat(true)
  }, [setShowFilters, setSearch, setShowNewChat])

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("flex h-screen bg-semantic-bg-ui", className)}>
        {/* ── Left Panel: Sidebar ── */}
        <ChatSidebar chatAreaRef={chatAreaRef}>
          {showNewChat ? (
            <ChatNewPanel
              onBack={() => setShowNewChat(false)}
              onOpenAddContact={() => setShowAddContact(true)}
            />
          ) : showFilters ? (
            <ChatFilterPanel
              onClose={() => {
                setShowFilters(false)
                setSearch("")
              }}
              onApply={(assigneeSet, channelSet) => {
                applyFilters({
                  assignees: assigneeSet.size > 0 ? assigneeSet : undefined,
                  channels: channelSet.size > 0 ? channelSet : undefined,
                })
                setShowFilters(false)
                setSearch("")
              }}
            />
          ) : null}
        </ChatSidebar>

        {/* ── Right Panel: Chat Window or Empty State ── */}
        {selectedChat ? (
          <main
            className="flex-[1_0_0] min-h-0 min-w-0 flex"
            ref={chatAreaRef}
            tabIndex={-1}
          >
            {/* Chat Window */}
            <div
              className="flex-1 flex flex-col min-w-0 relative"
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={(e) => {
                if (
                  e.currentTarget === e.target ||
                  !e.currentTarget.contains(e.relatedTarget as Node)
                )
                  setIsDragging(false)
              }}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                // The ChatInput handles the attachment internally via context or props
                // For drag-drop we'd need to integrate with ChatInput — for now this is a placeholder
              }}
            >
              <h2 className="sr-only m-0">{selectedChat.name} — Chat</h2>
              <div className="sr-only" aria-live="assertive">
                {isDragging
                  ? "Drop zone active. Release to attach file."
                  : ""}
              </div>

              {/* Chat Header */}
              <ChatHeader />

              {/* Messages Area */}
              <ChatMessageList />

              {/* Message Input */}
              <ChatInput
                expired={
                  selectedChat.isWindowExpired ||
                  selectedChat.tab === "resolved"
                }
                expiredMessage={
                  selectedChat.tab === "resolved"
                    ? "This chat is closed. Send a template to continue."
                    : "This chat has expired. Send a template to continue."
                }
              />

              {/* Drag & drop overlay */}
              {isDragging && (
                <div
                  role="region"
                  aria-label="Drop zone — drop file to attach"
                  className="absolute inset-0 z-50 bg-semantic-primary/5 backdrop-blur-[1px] flex items-center justify-center border-2 border-dashed border-semantic-primary rounded-lg animate-in fade-in duration-200 ease-out"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="size-10 text-semantic-primary" />
                    <span className="text-[16px] font-semibold text-semantic-primary">
                      Drop file to attach
                    </span>
                    <span className="text-[13px] text-semantic-text-muted">
                      Images, videos, documents
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Details Panel */}
            <ChatContactPanel name={selectedChat.name} />

            {/* Right Action Sidebar */}
            <aside
              aria-label="Actions"
              className="w-[56px] bg-white border-l border-solid border-semantic-border-layout flex flex-col items-center py-2 gap-4 shrink-0"
            >
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Contact details"
                onClick={() => setShowContactDetails(!showContactDetails)}
                className={cn(
                  "transition-colors duration-200",
                  showContactDetails &&
                    "bg-semantic-bg-hover text-semantic-primary"
                )}
              >
                <User className="size-6" />
              </Button>
            </aside>
          </main>
        ) : (
          /* ── Empty State ── */
          <div className="flex-[1_0_0] min-h-0 min-w-0 bg-semantic-bg-ui shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] flex flex-col items-center justify-center p-4">
            {showNewChat ? (
              <div className="flex flex-col items-center gap-5 w-[300px] shrink-0">
                <div className="size-[100px] shrink-0 rounded-full bg-white border border-solid border-semantic-border-layout flex items-center justify-center shadow-sm">
                  <MessageSquare className="size-12 text-semantic-text-muted" />
                </div>
                <div className="flex flex-col items-center gap-[6px]">
                  <h2 className="m-0 text-[24px] font-semibold text-semantic-text-primary leading-8">
                    Start New Conversation
                  </h2>
                  <p className="text-[16px] text-semantic-text-muted text-center m-0">
                    Select a contact or add new contact.
                  </p>
                </div>
                <Button
                  className="w-full h-12"
                  leftIcon={<Plus className="w-6 h-6" />}
                  onClick={() => setShowAddContact(true)}
                >
                  Add New Contact
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 w-[276px] shrink-0">
                <div className="size-[100px] shrink-0 rounded-full bg-white border border-solid border-semantic-border-layout flex items-center justify-center shadow-sm">
                  <MessageSquare className="size-12 text-semantic-text-muted" />
                </div>
                <div className="flex flex-col items-center gap-[6px]">
                  <h2 className="m-0 text-[24px] font-semibold text-semantic-text-primary leading-8">
                    No conversation selected
                  </h2>
                  <p className="text-[16px] text-semantic-text-muted text-center m-0">
                    Select a chat from inbox or start new chat
                  </p>
                </div>
                <Button
                  className="w-full h-12"
                  leftIcon={<Plus className="w-6 h-6" />}
                  onClick={openNewChat}
                >
                  Start New Chat
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── Modals ── */}
        {showAddContact && (
          <AddNewContactModal
            defaultChannel={channels[0]}
            onClose={() => setShowAddContact(false)}
          />
        )}
        {showTemplateModal && (
          <ChatTemplateModal />
        )}
      </div>
    </TooltipProvider>
  )
}

ChatApp.displayName = "ChatApp"
