import * as React from "react"
import { cn } from "../../../lib/utils"
import { ChatMessageBubble } from "./chat-message"
import type { ChatMessage } from "./types"

export interface IntegrationChatMessagesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  messages: ChatMessage[]
  /** Classes for the outer fixed-height scroll container */
  messagesAreaClassName?: string
}

const IntegrationChatMessages = React.forwardRef<
  HTMLDivElement,
  IntegrationChatMessagesProps
>(
  (
    {
      className,
      messages,
      messagesAreaClassName = "flex min-h-0 flex-1 flex-col overflow-hidden",
      ...props
    },
    ref
  ) => {
    const messagesEndRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
      <div
        ref={ref}
        className={cn(messagesAreaClassName, className)}
        {...props}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-6">
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    )
  }
)
IntegrationChatMessages.displayName = "IntegrationChatMessages"

export { IntegrationChatMessages }
