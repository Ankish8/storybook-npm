import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DateDivider component for separating chat messages by date.
 * Renders a horizontal line with centered date text.
 *
 * @example
 * ```tsx
 * <DateDivider>Today</DateDivider>
 * <DateDivider>March 20, 2026</DateDivider>
 * ```
 */
export interface DateDividerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The date text to display. Can be a string like "Today", "March 20, 2026", etc. */
  children: React.ReactNode;
}

const DateDivider = React.forwardRef(
  ({ className, children, ...props }: DateDividerProps, ref: React.Ref<HTMLDivElement>) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 my-4", className)}
      {...props}
    >
      <div className="flex-1 h-px bg-semantic-border-layout" />
      <span className="text-xs text-semantic-text-muted shrink-0">
        {children}
      </span>
      <div className="flex-1 h-px bg-semantic-border-layout" />
    </div>
  )
);
DateDivider.displayName = "DateDivider";

export { DateDivider };
