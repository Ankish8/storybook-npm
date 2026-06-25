import * as React from "react";
import { cn } from "../../../lib/utils";

/* ── Types ── */

export type ChatTimelineDividerVariant = "default" | "unread" | "system";

export interface ChatTimelineDividerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /**
   * Visual style of the divider.
   * - `default`: plain centered text between lines (e.g. "Today", "Yesterday")
   * - `unread`: bold text in a compact white pill (e.g. "3 unread messages")
   * - `system`: compact action feedback tag (e.g. "Assigned to Alex Smith")
   */
  variant?: ChatTimelineDividerVariant;
  /**
   * Content to display. Pass a string and wrap highlights in `**` for link-colored, medium-weight segments
   * (e.g. `Assigned to **Alex Smith** by **Admin**`), or pass a ReactNode for full control.
   */
  children: React.ReactNode;
}

/* ── Variant styles ── */

const containerStyles: Record<ChatTimelineDividerVariant, string> = {
  default: "",
  unread:
    "flex h-5 items-center rounded bg-semantic-bg-primary px-1.5 py-0.5 shadow-sm",
  // Mobile/tablet: full-width-friendly with 20px (px-5) side padding so wrapped
  // text has breathing room; reverts to the compact pill on desktop at `lg`.
  system:
    "flex min-h-5 min-w-0 max-w-[80%] items-center rounded bg-semantic-bg-primary px-5 py-0.5 shadow-sm lg:px-1.5",
};

const textStyles: Record<ChatTimelineDividerVariant, string> = {
  default: "text-[13px] text-semantic-text-muted",
  unread: "text-[12px] font-semibold leading-none text-semantic-text-primary",
  // Mobile/tablet: wrap + centre-align long system events; desktop (`lg`)
  // truncates on a single line.
  system:
    "min-w-0 whitespace-normal break-words text-center text-[12px] font-normal leading-4 text-semantic-text-secondary lg:truncate",
};

const highlightSegmentClassName = cn(
  "font-semibold tracking-[0.06px] text-semantic-text-secondary"
);

/**
 * Splits a string on markdown-style `**label**` markers and returns nodes:
 * text outside markers inherits the parent span; segments inside `**` use the
 * Figma action-feedback emphasis style.
 */
function parseBoldMarkers(content: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null = re.exec(content);
  let i = 0;
  while (m !== null) {
    if (m.index > last) {
      nodes.push(content.slice(last, m.index));
    }
    nodes.push(
      <span key={`b-${i++}`} className={highlightSegmentClassName}>
        {m[1]}
      </span>
    );
    last = m.index + m[0].length;
    m = re.exec(content);
  }
  if (last < content.length) {
    nodes.push(content.slice(last));
  }
  return nodes.length > 0 ? nodes : [content];
}

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
 * // System event — use **name** in a string for link-colored highlights
 * <ChatTimelineDivider variant="system">
 *   Assigned to **Alex Smith** by **Admin**
 * </ChatTimelineDivider>
 * ```
 */
const ChatTimelineDivider = React.forwardRef<
  HTMLDivElement,
  ChatTimelineDividerProps
>(({ variant = "default", children, className, ...props }, ref) => {
  const showLines = true;

  return (
    <div
      ref={ref}
      role="separator"
      className={cn("my-3 flex min-w-0 items-center gap-3", className)}
      {...props}
    >
      {showLines && <div className="flex-1 h-px bg-semantic-border-layout" />}
      <div className={cn(containerStyles[variant])}>
        <span className={cn(textStyles[variant])}>
          {typeof children === "string" ? parseBoldMarkers(children) : children}
        </span>
      </div>
      {showLines && <div className="flex-1 h-px bg-semantic-border-layout" />}
    </div>
  );
});
ChatTimelineDivider.displayName = "ChatTimelineDivider";

export { ChatTimelineDivider };
