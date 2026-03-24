import * as React from "react"
import { Send, Paperclip, Smile, LayoutGrid, Image as LucideImage, Play, Music, FileText } from "lucide-react"
import { Button } from "../../ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "../../ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
} from "../../ui/tooltip"
import { ChatComposer } from "../chat-composer"
import { ComposerAttachmentPreview } from "./composer-attachment-preview"
import { CannedMessagesDropdown } from "./canned-messages"
import { useChatContext } from "../chat-provider"
import type { CannedMessage } from "../chat-types"

export interface ChatInputProps {
  /** Whether the chat is expired / resolved (shows template prompt) */
  expired?: boolean
  /** Message shown in the expired state */
  expiredMessage?: string
}

/**
 * ChatInput is the full message input area that wraps ChatComposer with:
 * - Canned message dropdown (triggered by typing "/")
 * - Attachment upload (image, video, audio, document) via dropdown
 * - Templates button
 * - Emoji button
 * - Reply-to bar with scroll-to-original
 * - Attachment preview before sending
 *
 * It manages its own local state for composerText, cannedIndex, attachment,
 * replyingTo, and the hidden file input ref.
 */
function ChatInput({ expired = false, expiredMessage }: ChatInputProps) {
  const { sendMessage, cannedMessages, setShowTemplateModal } = useChatContext()

  const [composerText, setComposerText] = React.useState("")
  const [cannedIndex, setCannedIndex] = React.useState(-1)
  const [composerAttachment, setComposerAttachment] = React.useState<File | null>(null)
  const [replyingTo, setReplyingTo] = React.useState<{ messageId: string; sender: string; text: string } | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  /** Filter canned messages based on the current "/" query */
  const cannedQuery = composerText.startsWith("/") ? composerText.slice(1).toLowerCase() : ""
  const filteredCanned = React.useMemo(
    () =>
      cannedMessages.filter(
        (cm: CannedMessage) =>
          cm.shortcut.toLowerCase().includes(cannedQuery) ||
          cm.body.toLowerCase().includes(cannedQuery)
      ),
    [cannedMessages, cannedQuery]
  )

  /** Handle keyboard events for canned messages and Enter-to-send */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send (when not in canned menu)
    if (e.key === "Enter" && !e.shiftKey && !composerText.startsWith("/")) {
      e.preventDefault()
      if (composerText.trim()) {
        sendMessage(composerText.trim(), composerAttachment ?? undefined, replyingTo?.messageId)
        setComposerText("")
        setComposerAttachment(null)
        setReplyingTo(null)
      }
      return
    }
    // Canned message keyboard navigation
    if (composerText.startsWith("/")) {
      if (filteredCanned.length === 0) return
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setCannedIndex((prev) => (prev + 1) % filteredCanned.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setCannedIndex((prev) => (prev <= 0 ? filteredCanned.length - 1 : prev - 1))
      } else if (e.key === "Enter" && cannedIndex >= 0 && cannedIndex < filteredCanned.length) {
        e.preventDefault()
        setComposerText(filteredCanned[cannedIndex].body)
        setCannedIndex(-1)
      } else if (e.key === "Escape") {
        e.preventDefault()
        setComposerText("")
        setCannedIndex(-1)
      }
    }
  }

  /** Handle send action */
  const handleSend = () => {
    if (composerText.trim()) {
      sendMessage(composerText.trim(), composerAttachment ?? undefined, replyingTo?.messageId)
    }
    setComposerText("")
    setComposerAttachment(null)
    setReplyingTo(null)
    setCannedIndex(-1)
  }

  /** Scroll to and highlight the original message being replied to */
  const handleReplyClick = () => {
    if (replyingTo) {
      const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      const el = document.getElementById(`msg-${replyingTo.messageId}`)
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" })
        el.classList.add("ring-2", "ring-semantic-border-accent", "ring-offset-2")
        setTimeout(() => el.classList.remove("ring-2", "ring-semantic-border-accent", "ring-offset-2"), 2000)
      }
    }
  }

  const showCannedDropdown = composerText.startsWith("/") && !expired

  return (
    <div className="relative">
      {/* Canned message count live region */}
      <div className="sr-only" aria-live="polite">
        {composerText.startsWith("/")
          ? `${filteredCanned.length} canned message${filteredCanned.length !== 1 ? "s" : ""} found`
          : ""}
      </div>

      {/* Canned messages dropdown (above composer) */}
      {showCannedDropdown && (
        <CannedMessagesDropdown
          query={cannedQuery}
          activeIndex={cannedIndex}
          onSelect={(body) => {
            setComposerText(body)
            setCannedIndex(-1)
          }}
          cannedMessages={cannedMessages}
        />
      )}

      <ChatComposer
        sendLabel={<><Send className="size-4" />Send</>}
        expired={expired}
        expiredMessage={expiredMessage}
        onTemplateClick={() => setShowTemplateModal(true)}
        value={composerText}
        onChange={(val) => {
          setComposerText(val)
          setCannedIndex(-1)
        }}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
        placeholder="Type '/' for canned message"
        reply={
          replyingTo
            ? {
                sender: replyingTo.sender,
                message: replyingTo.text,
                messageId: replyingTo.messageId,
              }
            : undefined
        }
        onDismissReply={() => setReplyingTo(null)}
        onReplyClick={handleReplyClick}
        attachment={
          composerAttachment ? (
            <ComposerAttachmentPreview
              file={composerAttachment}
              onRemove={() => setComposerAttachment(null)}
            />
          ) : undefined
        }
        leftActions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <Paperclip className="size-[18px]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuLabel>Attach Media</DropdownMenuLabel>
                <DropdownMenuItem
                  onSelect={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "image/*"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <LucideImage className="size-4" /> Image
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "video/*"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <Play className="size-4" /> Video
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "audio/*"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <Music className="size-4" /> Audio
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <FileText className="size-4" /> Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowTemplateModal(true)}>
                  <LayoutGrid className="size-[18px]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="m-0">Templates</p>
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </>
        }
        rightActions={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <Smile className="size-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="m-0">Emoji</p>
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        }
      />

      {/* Hidden file input for attachment uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) setComposerAttachment(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}
ChatInput.displayName = "ChatInput"

export { ChatInput }
