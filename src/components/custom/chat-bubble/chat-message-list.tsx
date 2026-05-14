import * as React from "react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { TooltipProvider } from "../../ui/tooltip"
import { ArrowDown } from "lucide-react"
import { ChatTimelineDivider } from "../chat-timeline-divider"
import { useChatContext } from "../chat-provider"
import { ChatBubblePrimitive } from "./chat-bubble-base"
import type { ChatItem, ChatMessage } from "../chat-types"
import type { ChatMessageListProps } from "./types"

/* ── ChatBubble.MessageList — scrollable thread (requires ChatProvider) ── */

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  (
    { className, onReplyTo, showReplyOn, textMaxWidthClassName, ...props },
    ref
  ) => {
    const { messages, selectedChatId, chats } = useChatContext()

    const selectedChat = React.useMemo(
      () => chats.find((c: ChatItem) => c.id === selectedChatId) ?? null,
      [chats, selectedChatId]
    )

    if (!selectedChat || !selectedChatId) return null

    return (
      <TooltipProvider delayDuration={200}>
        <div
          ref={ref}
          className={cn("flex-1 relative", className)}
          {...props}
        >
          <div
            key={selectedChatId}
            className="absolute inset-0 overflow-y-auto bg-semantic-bg-ui px-6 py-4 animate-in fade-in duration-200 ease-out"
          >
            <ChatTimelineDivider className="my-4" aria-label="Today">
              Today
            </ChatTimelineDivider>

            <div className="flex flex-col gap-4">
              {messages.map((msg: ChatMessage, msgIdx: number) => {
                const unreadCount = selectedChat.unreadCount || 0
                const unreadStartIdx = messages.length - unreadCount
                const showUnreadSeparator =
                  unreadCount > 0 && msgIdx === unreadStartIdx

                if (msg.type === "system") {
                  return (
                    <React.Fragment key={msg.id}>
                      {showUnreadSeparator && (
                        <ChatTimelineDivider
                          variant="unread"
                          aria-label={`${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`}
                        >
                          {unreadCount} unread message
                          {unreadCount > 1 ? "s" : ""}
                        </ChatTimelineDivider>
                      )}
                      <ChatTimelineDivider variant="system">
                        {msg.text
                          .split(/(\*\*[^*]+\*\*)/)
                          .map((part, i) =>
                            part.startsWith("**") ? (
                              <span
                                key={i}
                                className="text-semantic-text-link font-medium"
                              >
                                {part.slice(2, -2)}
                              </span>
                            ) : (
                              part
                            )
                          )}
                      </ChatTimelineDivider>
                    </React.Fragment>
                  )
                }

                return (
                  <React.Fragment key={msg.id}>
                    {showUnreadSeparator && (
                      <ChatTimelineDivider
                        variant="unread"
                        aria-label={`${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`}
                      >
                        {unreadCount} unread message
                        {unreadCount > 1 ? "s" : ""}
                      </ChatTimelineDivider>
                    )}
                    <ChatBubblePrimitive
                      message={msg}
                      replyParticipantName={selectedChat.name}
                      onReplyTo={onReplyTo}
                      showReplyOn={showReplyOn}
                      textMaxWidthClassName={textMaxWidthClassName}
                    />
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon-lg"
            aria-label={
              (selectedChat.unreadCount || 0) > 0
                ? `Scroll to bottom, ${selectedChat.unreadCount} unread messages`
                : "Scroll to bottom"
            }
            className="absolute bottom-4 left-1/2 -translate-x-1/2 shadow-md bg-white"
          >
            <ArrowDown className="size-5" />
            {(selectedChat.unreadCount || 0) > 0 && (
              <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center size-5 rounded-full bg-semantic-border-accent text-white text-[11px] font-semibold">
                {selectedChat.unreadCount}
              </span>
            )}
          </Button>
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {messages.length > 0
              ? `${messages[messages.length - 1].sender === "customer" ? selectedChat.name : "Agent"}: ${messages[messages.length - 1].text || "sent media"}`
              : ""}
          </div>
        </div>
      </TooltipProvider>
    )
  }
)
ChatMessageList.displayName = "ChatMessageList"

export { ChatMessageList }
