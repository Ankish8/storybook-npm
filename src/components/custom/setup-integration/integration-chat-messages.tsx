import * as React from "react"
import { cn } from "../../../lib/utils"
import { ChatMessageBubble } from "./chat-message"
import { IntegrationChatEmptyHint } from "./integration-chat-empty-hint"
import type { ChatMessage } from "./types"

export interface IntegrationChatMessagesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  messages: ChatMessage[]
  /** Classes for the outer fixed-height scroll container */
  messagesAreaClassName?: string
  /** Empty state copy — used when `messages` is empty */
  emptyChatTitle?: React.ReactNode
  emptyChatDescription?: React.ReactNode
  emptyChatIcon?: React.ReactNode
  /** Rendered under the main empty hint when there are no messages */
  emptyChatSecondary?: React.ReactNode
}

const IntegrationChatMessages = React.forwardRef<
  HTMLDivElement,
  IntegrationChatMessagesProps
>(
  (
    {
      className,
      messages,
      messagesAreaClassName = "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
      emptyChatTitle = "No messages yet",
      emptyChatDescription = "Describe your integration action below to get started.",
      emptyChatIcon,
      emptyChatSecondary,
      ...props
    },
    ref
  ) => {
    const messagesEndRef = React.useRef<HTMLDivElement>(null)
    const isEmpty = messages.length === 0

    React.useEffect(() => {
      if (!isEmpty) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    }, [messages, isEmpty])

    return (
      <div
        ref={ref}
        className={cn(
          messagesAreaClassName,
          isEmpty && "min-h-[454px]",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-6",
            isEmpty && "min-h-0 flex-1 items-center justify-center"
          )}
        >
          {isEmpty ? (
            <div
              className={cn(
                "flex w-full max-w-lg flex-col items-center",
                emptyChatSecondary ? "gap-6" : undefined
              )}
            >
              <IntegrationChatEmptyHint
                title={emptyChatTitle}
                description={emptyChatDescription}
                icon={emptyChatIcon}
                className="w-full py-4"
              />
              {emptyChatSecondary}
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
    )
  }
)
IntegrationChatMessages.displayName = "IntegrationChatMessages"

export { IntegrationChatMessages }
