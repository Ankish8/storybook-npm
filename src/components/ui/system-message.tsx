import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * SystemMessage component for displaying centered, muted system/timeline
 * events in a chat interface. Supports **bold** markdown-style formatting
 * which renders as link-colored bold text.
 *
 * @example
 * ```tsx
 * <SystemMessage>Assigned to **Alex Smith** by **Admin**</SystemMessage>
 * <SystemMessage>Chat was closed</SystemMessage>
 * ```
 */
export interface SystemMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The message text. Supports **bold** markdown syntax which renders as link-colored bold text. */
  children: string;
}

const SystemMessage = React.forwardRef<HTMLDivElement, SystemMessageProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex justify-center my-1", className)}
      {...props}
    >
      <span className="text-[13px] text-semantic-text-muted">
        {children.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
          part.startsWith("**") ? (
            <span key={i} className="text-semantic-text-link font-medium">
              {part.slice(2, -2)}
            </span>
          ) : (
            part
          )
        )}
      </span>
    </div>
  )
);
SystemMessage.displayName = "SystemMessage";

export { SystemMessage };
