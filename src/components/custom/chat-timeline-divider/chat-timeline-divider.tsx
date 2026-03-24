import * as React from "react";
import { cn } from "../../../lib/utils";

/* ── Types ── */

export type ChatTimelineDividerVariant = "default" | "unread" | "system";

export interface ChatTimelineDividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Visual style of the divider.
   * - `default`: plain centered text between lines (e.g. "Today", "Yesterday")
   * - `unread`: bold text in a white pill with border (e.g. "3 unread messages")
   * - `system`: muted text in a white pill with border (e.g. "Assigned to Alex Smith")
   */
  variant?: ChatTimelineDividerVariant;
  /** Content to display — text or ReactNode for rich content (e.g. linked names) */
  children: React.ReactNode;
}

/* ── Variant styles ── */

const containerStyles: Record<ChatTimelineDividerVariant, string> = {
  default: "",
  unread:
    "bg-white px-2.5 py-0.5 rounded-full border border-solid border-semantic-border-layout shadow-sm",
  system:
    "bg-white px-2.5 py-1 rounded-full border border-solid border-semantic-border-layout shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]",
};

const textStyles: Record<ChatTimelineDividerVariant, string> = {
  default: "text-[13px] text-semantic-text-muted",
  unread: "text-[12px] font-semibold text-semantic-text-primary",
  system: "text-[13px] text-semantic-text-muted",
};

/* ── Component ── */

/**
 * ChatTimelineDivider renders a centered label between two horizontal lines
 * in a chat message timeline.
 *
 * Use it to separate messages by date, mark unread boundaries,
 * or display system/action events (assignments, resolutions, etc.).
 *
 * @example
 * ```tsx
 * // Date separator
 * <ChatTimelineDivider>Today</ChatTimelineDivider>
 *
 * // Unread count
 * <ChatTimelineDivider variant="unread">3 unread messages</ChatTimelineDivider>
 *
 * // System event with linked names
 * <ChatTimelineDivider variant="system">
 *   Assigned to <span className="text-semantic-text-link font-medium">Alex Smith</span>
 * </ChatTimelineDivider>
 * ```
 */
const ChatTimelineDivider = React.forwardRef<
  HTMLDivElement,
  ChatTimelineDividerProps
>(
  (
    { variant = "default", children, className, ...props },
    ref
  ) => {
    const showLines = true;

    return (
      <div
        ref={ref}
        role="separator"
        className={cn("flex items-center gap-4 my-2", className)}
        {...props}
      >
        {showLines && (
          <div className="flex-1 h-px bg-semantic-border-layout" />
        )}
        <div className={cn(containerStyles[variant])}>
          <span className={cn(textStyles[variant])}>{children}</span>
        </div>
        {showLines && (
          <div className="flex-1 h-px bg-semantic-border-layout" />
        )}
      </div>
    );
  }
);
ChatTimelineDivider.displayName = "ChatTimelineDivider";

export { ChatTimelineDivider };
