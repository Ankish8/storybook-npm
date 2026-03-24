import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * UnreadSeparator component for displaying a horizontal divider with an unread message count.
 * Used in chat message lists to indicate where unread messages begin.
 *
 * @example
 * ```tsx
 * <UnreadSeparator count={3} />
 * <UnreadSeparator count={1} />
 * <UnreadSeparator count={5} label="5 new messages" />
 * ```
 */
export interface UnreadSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of unread messages */
  count: number;
  /** Custom label. Defaults to "{count} unread message(s)" */
  label?: string;
}

const UnreadSeparator = React.forwardRef(
  ({ className, count, label, ...props }: UnreadSeparatorProps, ref: React.Ref<HTMLDivElement>) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 my-2", className)}
      {...props}
    >
      <div className="flex-1 h-px bg-semantic-border-layout" />
      <span className="text-xs text-semantic-text-muted bg-semantic-bg-ui px-2 shrink-0">
        {label ?? `${count} unread message${count !== 1 ? "s" : ""}`}
      </span>
      <div className="flex-1 h-px bg-semantic-border-layout" />
    </div>
  )
);
UnreadSeparator.displayName = "UnreadSeparator";

export { UnreadSeparator };
