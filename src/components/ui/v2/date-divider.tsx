import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DateDivider component for separating chat messages by date.
 * Renders a horizontal line with centered date text. Spacing and label type follow
 * Arc's chat-thread day separator (12px gap, 20px above / 14px to the first message,
 * 12px medium label); line and text colours stay ours.
 *
 * @example
 * ```tsx
 * <DateDivider>Today</DateDivider>
 * <DateDivider>March 20, 2026</DateDivider>
 * ```
 */
export interface DateDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The date text to display. Can be a string like "Today", "March 20, 2026", etc. */
  children: React.ReactNode;
}

const DateDivider = React.forwardRef(
  (
    { className, children, ...props }: DateDividerProps,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 px-1 pt-5 pb-3.5 font-[family-name:var(--font-v2,Inter,sans-serif)]",
        className
      )}
      {...props}
    >
      <div className="flex-1 h-px bg-semantic-border-layout" />
      <span className="shrink-0 text-xs font-medium leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-muted,#707070)]">
        {children}
      </span>
      <div className="flex-1 h-px bg-semantic-border-layout" />
    </div>
  )
);
DateDivider.displayName = "DateDivider";

export { DateDivider };
