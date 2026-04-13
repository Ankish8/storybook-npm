import * as React from "react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
} from "../../ui/tooltip"
import {
  Check,
  CheckCheck,
  CircleAlert,
  Reply,
  File,
  ArrowDown,
} from "lucide-react"
import { ChatTimelineDivider } from "../chat-timeline-divider"
import { DocMedia } from "../doc-media"
import { useChatContext } from "../chat-provider"
import type { ChatMessage } from "../chat-types"
import {
  ImageMedia,
  VideoMedia,
  AudioMedia,
  CarouselMedia,
  ReferralMedia,
  LocationMedia,
  ContactMedia,
  ListReplyMedia,
  LoadingMedia,
  SenderIndicator,
} from "./message-renderers"

/* ── Types ── */

export interface ReplyToPayload {
  messageId: string
  sender: string
  text: string
}

export interface ChatMessageListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Callback when the user clicks the reply button on a message */
  onReplyTo?: (payload: ReplyToPayload) => void
}

/* ── Component ── */

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, onReplyTo, ...props }, ref) => {
    const { messages, selectedChatId, chats } = useChatContext()

    const selectedChat = React.useMemo(
      () => chats.find((c) => c.id === selectedChatId) ?? null,
      [chats, selectedChatId]
    )

    if (!selectedChat || !selectedChatId) return null

    return (
      <div
        ref={ref}
        className={cn("flex-1 relative", className)}
        {...props}
      >
        <div
          key={selectedChatId}
          className="absolute inset-0 overflow-y-auto bg-semantic-bg-ui px-6 py-4 animate-in fade-in duration-200 ease-out"
        >
          {/* Date Divider */}
          <ChatTimelineDivider className="my-4" aria-label="Today">
            Today
          </ChatTimelineDivider>

          {/* Messages */}
          <div className="flex flex-col gap-4">
            {messages.map((msg, msgIdx) => {
              // Show unread separator before the last N messages (based on chat's unreadCount)
              const unreadCount = selectedChat.unreadCount || 0
              const unreadStartIdx = messages.length - unreadCount
              const showUnreadSeparator =
                unreadCount > 0 && msgIdx === unreadStartIdx
              const hasMedia = msg.type && msg.type !== "text"
              const mediaCaption = msg.media?.caption
              const hasText = msg.text || mediaCaption
              const isDocWithMeta = msg.type === "otherDoc" && msg.media

              // Media types get different bubble widths
              const bubbleWidth =
                msg.type === "carousel"
                  ? "max-w-[466px] w-full"
                  : msg.type === "image" ||
                      msg.type === "video" ||
                      msg.type === "docPreview" ||
                      msg.type === "document" ||
                      msg.type === "otherDoc" ||
                      msg.type === "loading" ||
                      msg.type === "location"
                    ? "max-w-[380px] w-full"
                    : msg.type === "audio"
                      ? "max-w-[340px] w-[340px]"
                      : msg.type === "contact" ||
                          msg.type === "listReply"
                        ? "max-w-[320px] w-full"
                        : "max-w-[65%]"

              // System messages (e.g., assignment actions)
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
                  <div
                    className={`flex items-start gap-1.5 group/msg ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      id={`msg-${msg.id}`}
                      className={`flex flex-col ${bubbleWidth} ${
                        msg.sender === "agent" ? "items-end" : "items-start"
                      }`}
                    >
                      {msg.senderName && (
                        <span className="text-[12px] text-semantic-text-muted mb-1 px-1">
                          {msg.senderName}
                        </span>
                      )}
                      <div
                        className={`rounded-lg overflow-hidden ${ hasMedia ? "" : "px-3 pt-3 pb-1.5" } ${ msg.type === "audio" || msg.type === "otherDoc" || msg.type === "carousel" || msg.type === "loading" || msg.type === "location" || msg.type === "contact" || msg.type === "listReply" ? "w-full" : "" } ${ msg.sender === "agent" ? "bg-semantic-info-surface border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary" : "bg-white border-[0.2px] border-solid border-semantic-border-layout text-semantic-text-primary shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" }`}
                      >
                        {/* Carousel: body text goes ABOVE cards */}
                        {msg.type === "carousel" && hasText && (
                          <div className="px-3 pt-3">
                            <p className="text-[14px] leading-5 m-0">
                              {msg.text || mediaCaption}
                            </p>
                          </div>
                        )}

                        {/* Media area (full-bleed) */}
                        {msg.type === "image" && msg.media && (
                          <ImageMedia media={msg.media} />
                        )}
                        {msg.type === "video" && msg.media && (
                          <VideoMedia media={msg.media} />
                        )}
                        {msg.type === "audio" && msg.media && (
                          <AudioMedia media={msg.media} />
                        )}
                        {msg.type === "docPreview" && msg.media && (
                          <DocMedia
                            variant="preview"
                            thumbnailUrl={
                              msg.media.thumbnailUrl || msg.media.url
                            }
                            filename={msg.media.filename}
                            fileType={msg.media.fileType}
                            pageCount={msg.media.pageCount}
                            fileSize={msg.media.fileSize}
                          />
                        )}
                        {msg.type === "document" && msg.media && (
                          <DocMedia
                            variant="download"
                            thumbnailUrl={
                              msg.media.thumbnailUrl || msg.media.url
                            }
                            filename={msg.media.filename}
                            fileType={msg.media.fileType}
                            pageCount={msg.media.pageCount}
                            fileSize={msg.media.fileSize}
                          />
                        )}
                        {msg.type === "otherDoc" && msg.media && (
                          <DocMedia
                            variant="file"
                            filename={msg.media.filename}
                            fileType={msg.media.fileType}
                          />
                        )}
                        {msg.type === "carousel" && msg.media && (
                          <CarouselMedia media={msg.media} />
                        )}
                        {msg.type === "loading" && (
                          <LoadingMedia error={msg.error} />
                        )}
                        {msg.type === "referral" && msg.referral && (
                          <ReferralMedia referral={msg.referral} />
                        )}
                        {msg.type === "location" && msg.location && (
                          <LocationMedia location={msg.location} />
                        )}
                        {msg.type === "contact" && msg.contactCard && (
                          <ContactMedia contact={msg.contactCard} />
                        )}
                        {msg.type === "listReply" && msg.listReply && (
                          <ListReplyMedia listReply={msg.listReply} />
                        )}

                        {/* Text + footer area (with padding) */}
                        <div
                          className={
                            hasMedia
                              ? `px-3 pb-1.5 ${msg.type === "audio" ? "pt-0" : msg.type === "otherDoc" ? "pt-3 mt-1" : "pt-2"}`
                              : ""
                          }
                        >
                          {msg.replyTo && (
                            <ReplyQuoteButton replyTo={msg.replyTo} />
                          )}
                          {hasText && msg.type !== "carousel" && (
                            <p className="text-[14px] leading-5 m-0">
                              {msg.text || mediaCaption}
                            </p>
                          )}
                          {/* File metadata row for download-type docs */}
                          {isDocWithMeta && (
                            <div className="flex items-center gap-2 mt-1.5">
                              <File className="size-3.5 text-semantic-text-muted" />
                              <span className="text-[13px] text-semantic-text-muted">
                                {[
                                  msg.media!.fileType,
                                  msg.media!.pageCount &&
                                    `${msg.media!.pageCount} pages`,
                                  msg.media!.fileSize,
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                            </div>
                          )}
                          {/* Delivery footer */}
                          <DeliveryFooter msg={msg} />
                        </div>
                      </div>
                    </div>
                    {/* Sender indicator for outbound messages */}
                    {msg.sender === "agent" && msg.sentBy && (
                      <SenderIndicator
                        sentBy={msg.sentBy}
                        withTooltip
                        className="self-end mb-1 shrink-0"
                      />
                    )}
                    {msg.sender === "customer" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              onReplyTo?.({
                                messageId: msg.id,
                                sender: selectedChat.name,
                                text:
                                  msg.text || msg.media?.caption || "",
                              })
                            }
                            className="opacity-0 group-hover/msg:opacity-100 transition-opacity shrink-0 rounded-full text-semantic-text-muted hover:text-semantic-text-secondary hover:bg-semantic-bg-hover"
                          >
                            <Reply className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="m-0">Reply</p>
                          <TooltipArrow />
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Scroll to bottom button */}
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
        {/* New messages live region */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {messages.length > 0
            ? `${messages[messages.length - 1].sender === "customer" ? selectedChat.name : "Agent"}: ${messages[messages.length - 1].text || "sent media"}`
            : ""}
        </div>
      </div>
    )
  }
)
ChatMessageList.displayName = "ChatMessageList"

/* ── ReplyQuoteButton (private) ── */

function ReplyQuoteButton({
  replyTo,
}: {
  replyTo: NonNullable<ChatMessage["replyTo"]>
}) {
  return (
    <button
      type="button"
      className="w-full bg-white border-l-[3px] border-solid border-semantic-border-accent rounded-sm px-4 py-1.5 mb-2 h-[56px] flex flex-col justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors text-left border-t-0 border-r-0 border-b-0"
      aria-label={`Jump to quoted message from ${replyTo.sender}`}
      onClick={() => {
        if (replyTo.messageId) {
          const prefersReducedMotion = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)"
          ).matches
          const el = document.getElementById(`msg-${replyTo.messageId}`)
          if (el) {
            el.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "center",
            })
            el.style.outline = "2px solid var(--semantic-border-accent)"
            el.style.outlineOffset = "2px"
            el.style.transition = "outline-color 0.3s ease-out"
            setTimeout(() => {
              el.style.outlineColor = "transparent"
              setTimeout(() => {
                el.style.outline = ""
                el.style.outlineOffset = ""
                el.style.transition = ""
              }, 300)
            }, 1700)
          }
        }
      }}
    >
      <p className="text-[14px] font-semibold text-semantic-text-primary truncate leading-5 tracking-[0.014px] m-0">
        {replyTo.sender}
      </p>
      <p className="text-[14px] text-semantic-text-muted truncate m-0">
        {replyTo.text}
      </p>
    </button>
  )
}

/* ── DeliveryFooter (private) ── */

function DeliveryFooter({ msg }: { msg: ChatMessage }) {
  return (
    <div
      className={`flex items-center mt-1.5 ${msg.type === "audio" ? "justify-between" : msg.sender === "agent" ? "justify-end gap-1.5" : "justify-start gap-1.5"}`}
      style={msg.type === "audio" ? { paddingLeft: 0 } : undefined}
    >
      {/* Audio duration on the left */}
      {msg.type === "audio" && msg.media && (
        <span
          className="font-semibold text-semantic-text-muted tabular-nums"
          style={{ fontSize: 12, letterSpacing: 0.05 }}
        >
          {msg.media.duration || "0:00"}
        </span>
      )}
      {/* Delivery status + time */}
      <div className="flex items-center gap-1.5">
        {msg.sender === "agent" && msg.status && (
          <>
            {msg.status === "failed" ? (
              <span role="alert" className="inline-flex items-center gap-1.5">
                <CircleAlert className="size-4 text-semantic-error-primary shrink-0" />
                <span className="text-[13px] text-semantic-error-primary font-medium">
                  Failed
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="text-[13px] font-semibold text-semantic-text-link underline hover:no-underline"
                >
                  Retry
                </button>
              </span>
            ) : (
              <>
                {msg.status === "sent" ? (
                  <Check className="size-4 text-semantic-text-muted shrink-0" />
                ) : (
                  <CheckCheck
                    className={`size-4 shrink-0 ${msg.status === "read" ? "text-semantic-text-link" : "text-semantic-text-muted"}`}
                  />
                )}
                <span
                  style={{ fontSize: 12 }}
                  className="text-semantic-text-muted"
                >
                  {msg.status === "sent"
                    ? "Sent"
                    : msg.status === "delivered"
                      ? "Delivered"
                      : "Read"}
                </span>
              </>
            )}
            <span
              className="font-semibold text-semantic-text-muted"
              style={{ fontSize: 10 }}
            >
              •
            </span>
          </>
        )}
        <span style={{ fontSize: 12 }} className="text-semantic-text-muted">
          {msg.time}
        </span>
      </div>
    </div>
  )
}

export { ChatMessageList }
