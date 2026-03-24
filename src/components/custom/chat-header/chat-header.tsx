import { Clock } from "lucide-react"
import { Badge } from "../../ui/badge"
import { Tag } from "../../ui/tag"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "../../ui/tooltip"
import { useChatContext } from "../chat-provider"
import { AssignmentDropdown } from "./assignment-dropdown"
import { ResolveButton } from "./resolve-button"

function ChatHeader() {
  const {
    chats,
    selectedChatId,
    channels,
    showContactDetails,
    setShowContactDetails,
  } = useChatContext()

  const selectedChat = chats.find((c) => c.id === selectedChatId)

  if (!selectedChat) return null

  return (
    <div className="flex items-center justify-between px-4 h-[72px] bg-white border-b border-solid border-semantic-border-layout shrink-0">
      <div className="flex items-center gap-3">
        <button
          aria-label={`View contact details for ${selectedChat.name}`}
          onClick={() => setShowContactDetails(!showContactDetails)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-border-focus focus-visible:outline-offset-2 rounded"
        >
          <span className="text-[18px] font-semibold text-semantic-text-primary">
            {selectedChat.name}
          </span>
        </button>
        {selectedChat.channel &&
          (() => {
            const ch = channels.find(
              (c) => c.badge === selectedChat.channel
            )
            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" size="sm">
                    {selectedChat.channel}
                  </Badge>
                </TooltipTrigger>
                {ch && (
                  <TooltipContent side="bottom">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-medium text-white">
                        {ch.name}
                      </span>
                      <span className="text-[12px] text-semantic-text-muted">
                        {ch.phone}
                      </span>
                    </div>
                    <TooltipArrow />
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })()}
        {selectedChat.slaTimer && (
          <Tag variant="warning" size="sm">
            <Clock className="size-3 shrink-0" />
            {selectedChat.slaTimer}
          </Tag>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Assignment Dropdown */}
        <AssignmentDropdown defaultAgent={selectedChat.agentName} />
        {/* Resolve Button */}
        <ResolveButton />
      </div>
    </div>
  )
}
ChatHeader.displayName = "ChatHeader"

export { ChatHeader }
