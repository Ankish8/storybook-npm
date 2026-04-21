import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AudioLines,
  Bot,
  Check,
  CheckCheck,
  CircleAlert,
  Clock,
  ContactRound,
  FileText,
  FileWarning,
  Image as ImageIcon,
  Inbox,
  LayoutTemplate,
  ListTree,
  MapPin,
  Smile,
  SquareMousePointer,
  Sticker,
  Video,
  type LucideIcon,
} from "lucide-react";

/* ── Types ── */

export type MessageStatus =
  | "sent"
  | "delivered"
  | "read"
  | "received"
  | "queue"
  | "failed";

export type MessageType =
  | "text"
  | "button"
  | "reaction"
  | "audio"
  | "document"
  | "image"
  | "video"
  | "sticker"
  | "template"
  | "location"
  | "unsupportedFile"
  | "unsupported message"
  | "contacts"
  | "interactive";

const MESSAGE_TYPE_ICON_MAP: Partial<Record<MessageType, LucideIcon>> = {
  button: SquareMousePointer,
  reaction: Smile,
  audio: AudioLines,
  document: FileText,
  image: ImageIcon,
  video: Video,
  sticker: Sticker,
  template: LayoutTemplate,
  location: MapPin,
  unsupportedFile: FileWarning,
  ["unsupported message"]: CircleAlert,
  contacts: ContactRound,
  interactive: ListTree,
};

export interface ChatListItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Contact or customer name (supports ReactNode for highlighted search matches) */
  name: React.ReactNode;
  /** Last message preview text (supports ReactNode for highlighted search matches) */
  message: React.ReactNode;
  /** Timestamp display string (e.g. "2:30 PM", "Yesterday") */
  timestamp: string;
  /**
   * Delivery / handling status of the last message.
   * Mutually exclusive with `unreadCount` — when set, no unread badge is shown.
   * - `sent`: single gray checkmark (message left the server)
   * - `delivered`: double gray checkmarks (reached the customer's device)
   * - `read`: double accent checkmarks (customer opened the message)
   * - `received`: inbound / received (inbox icon)
   * - `queue`: pending in outbound queue (clock)
   * - `failed`: send or delivery failed (error icon)
   */
  messageStatus?: MessageStatus;
  /**
   * Number of unread messages from the customer.
   * Only shown when `messageStatus` is not set (i.e., last message was inbound).
   */
  unreadCount?: number;
  /**
   * SLA timer label showing how long the customer has been waiting (e.g. "2h", "50m").
   * Displayed as a warning-colored tag next to the name.
   * Typically appears on unread/inbound conversations.
   */
  slaTimer?: string;
  /**
   * Type of the last message — controls the icon prefix before the message text.
   * `text` shows no icon (default).
   */
  messageType?: MessageType;
  /** Channel identifier (e.g. "MY01"). Omit when unknown — channel pill still shows if `agentName` is set. */
  channel?: string;
  /** Name of the assigned agent */
  agentName?: string;
  /** Whether the assigned agent's account has been deleted — renders in error color */
  isAgentDeleted?: boolean;
  /** Whether the conversation is handled by an AI/IVR bot — shows bot icon */
  isBot?: boolean;
  /** Whether this item is currently selected/active in the inbox */
  isSelected?: boolean;
  /** Callback when the chat item is clicked */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/* ── Sub-components ── */

function StatusIndicator({ status }: { status: MessageStatus }) {
  if (status === "sent") {
    return (
      <span aria-label="Sent">
        <Check className="size-4 text-semantic-text-placeholder shrink-0" aria-hidden="true" />
      </span>
    );
  }
  if (status === "delivered") {
    return (
      <span aria-label="Delivered">
        <CheckCheck className="size-4 text-semantic-text-placeholder shrink-0" aria-hidden="true" />
      </span>
    );
  }
  if (status === "read") {
    return (
      <span aria-label="Read">
        <CheckCheck className="size-4 text-semantic-text-link shrink-0" aria-hidden="true" />
      </span>
    );
  }
  if (status === "received") {
    return (
      <span aria-label="Received">
        <Inbox className="size-4 text-semantic-info-primary shrink-0" aria-hidden="true" />
      </span>
    );
  }
  if (status === "queue") {
    return (
      <span aria-label="Queued">
        <Clock className="size-4 text-semantic-warning-primary shrink-0" aria-hidden="true" />
      </span>
    );
  }
  // failed
  return (
    <span aria-label="Failed">
      <CircleAlert className="size-4 text-semantic-error-primary shrink-0" aria-hidden="true" />
    </span>
  );
}

function UnreadBadge({ count }: { count: number }) {
  return (
    <span
      className="shrink-0 inline-flex items-center justify-center rounded-full bg-semantic-border-accent font-semibold text-white"
      style={{ width: 18, height: 18, fontSize: 10, lineHeight: 1 }}
      aria-label={`${count > 99 ? "99+" : count} unread messages`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function SlaTag({ timer }: { timer: string }) {
  return (
    <span
      className="flex items-center gap-2 h-5 px-[6px] py-[2px] rounded bg-semantic-warning-surface shrink-0"
      aria-label={`SLA timer: ${timer}`}
    >
      <Clock className="size-3 text-semantic-warning-text" aria-hidden="true" />
      <span className="text-[12px] text-semantic-warning-text">{timer}</span>
    </span>
  );
}

function MessageTypeIcon({ type }: { type: MessageType }) {
  const Icon = MESSAGE_TYPE_ICON_MAP[type];
  if (!Icon) {
    return null;
  }
  return <Icon className="size-[14px] text-semantic-text-placeholder shrink-0" aria-hidden="true" />;
}

function channelPillVisible(channel?: string, agentName?: string) {
  return Boolean((channel && channel.trim()) || (agentName && agentName.trim()));
}

function ChannelPill({
  channel,
  agentName,
  isAgentDeleted,
  isBot,
}: {
  channel?: string;
  agentName?: string;
  isAgentDeleted?: boolean;
  isBot?: boolean;
}) {
  const ch = channel?.trim() ?? "";
  const agent = agentName?.trim() ?? "";
  const textColor = isAgentDeleted ? "text-semantic-error-text" : "text-semantic-text-primary";

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "inline-flex items-center gap-[6px] px-2 py-1 rounded-[12px] border border-solid border-semantic-border-layout text-[12px] max-w-full min-w-0",
          textColor
        )}
      >
        {ch ? (
          <>
            <span className="shrink-0">{ch}</span>
            {agent ? (
              <>
                <span className="shrink-0">-</span>
                <span className="truncate">{agent}</span>
              </>
            ) : null}
          </>
        ) : (
          <span className="truncate">{agent}</span>
        )}
        {isBot && <Bot className="size-[14px] text-semantic-text-primary shrink-0" aria-hidden="true" />}
      </span>
    </div>
  );
}

/* ── Main Component ── */

/**
 * ChatListItem displays a conversation preview in an inbox-style list.
 *
 * Each item shows the contact name, last message preview, timestamp,
 * delivery status or unread count, optional SLA timer, and channel/agent info.
 *
 * @example
 * ```tsx
 * <ChatListItem
 *   name="Aditi Kumar"
 *   message="Have a look at this document"
 *   timestamp="2:30 PM"
 *   messageStatus="sent"
 *   messageType="document"
 *   channel="MY01"
 *   agentName="Alex Smith"
 *   onClick={() => setSelectedChat("1")}
 * />
 * ```
 */
const ChatListItem = React.forwardRef(
  (
    {
      name,
      message,
      timestamp,
      messageStatus,
      unreadCount,
      slaTimer,
      messageType = "text",
      channel,
      agentName,
      isAgentDeleted = false,
      isBot = false,
      isSelected = false,
      onClick,
      className,
      ...props
    }: ChatListItemProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const showChannelPill = channelPillVisible(channel, agentName);
    const nameText = typeof name === "string" ? name : "";
    const messageText = typeof message === "string" ? message : "";
    const defaultAriaLabel = `${nameText}. ${messageText}. ${timestamp}${unreadCount ? `. ${unreadCount} unread` : ""}${slaTimer ? `. SLA: ${slaTimer}` : ""}${messageStatus ? `. ${messageStatus}` : ""}`;

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-selected={isSelected}
        aria-label={defaultAriaLabel}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        className={cn(
          "flex items-start px-4 py-5 w-full transition-colors cursor-pointer",
          isSelected
            ? "bg-[var(--color-neutral-50)] border-l-4 border-solid border-l-semantic-border-accent border-b border-b-semantic-border-layout"
            : "bg-white hover:bg-[var(--color-neutral-50)] border-b border-solid border-semantic-border-layout",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Row 1: Name + SLA Timer + Status/Unread Badge */}
          <div className="flex items-center gap-[6px]">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-[14px] text-semantic-text-primary truncate">
                {name}
              </span>
              {slaTimer && <SlaTag timer={slaTimer} />}
            </div>
            {messageStatus ? (
              <StatusIndicator status={messageStatus} />
            ) : unreadCount ? (
              <UnreadBadge count={unreadCount} />
            ) : null}
          </div>

          {/* Row 2: Message Type Icon + Message Preview + Timestamp */}
          <div className="flex items-center gap-[6px]">
            <MessageTypeIcon type={messageType} />
            <p className="flex-1 text-[14px] text-semantic-text-muted truncate min-w-0 m-0">
              {message}
            </p>
            <span className="text-[12px] text-semantic-text-placeholder tracking-[0.06px] shrink-0">
              {timestamp}
            </span>
          </div>

          {/* Row 3: Channel + Agent Pill */}
          {showChannelPill ? (
            <ChannelPill
              channel={channel}
              agentName={agentName}
              isAgentDeleted={isAgentDeleted}
              isBot={isBot}
            />
          ) : null}
        </div>
      </div>
    );
  }
);
ChatListItem.displayName = "ChatListItem";

export { ChatListItem };
