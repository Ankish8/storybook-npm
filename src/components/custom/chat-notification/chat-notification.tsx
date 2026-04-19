import * as React from "react";

import { cn } from "../../../lib/utils";
import { Alert } from "../../ui/alert";
import { Button } from "../../ui/button";
import { Typography } from "../../ui/typography";

export type ChatNotificationType = "warning" | "error";

export interface ChatNotificationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Maps to Alert surfaces: `warning` → blocked notifications / soft alerts; `error` → balance / critical notices */
  type: ChatNotificationType;
  /** Main line (shown before the optional action link) */
  message: string;
  /** Trailing link label; omit to show message only */
  actionText?: string;
  /** Fires when the link action is activated */
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** When `true`, shows the Alert dismiss control */
  closable?: boolean;
  /** Called when the dismiss control is used (`closable` must be enabled) */
  onDismiss?: () => void;
  /** Controlled visibility (forwarded to `Alert`) */
  open?: boolean;
  /** Uncontrolled initial visibility */
  defaultOpen?: boolean;
}

const variantByType: Record<ChatNotificationType, "warning" | "error"> = {
  warning: "warning",
  error: "error",
};

/**
 * Full-width chat nudge built from `Alert` (warning/error surfaces) with an optional link-style action.
 */
const ChatNotification = React.forwardRef<
  HTMLDivElement,
  ChatNotificationProps
>(
  (
    {
      type,
      message,
      actionText,
      onActionClick,
      closable = false,
      onDismiss,
      open,
      defaultOpen,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Alert
        ref={ref}
        variant={variantByType[type]}
        showIcon={false}
        closable={closable}
        onClose={onDismiss}
        open={open}
        defaultOpen={defaultOpen}
        className={cn(
          "text-center [&>div]:justify-center",
          className
        )}
        {...props}
      >
        <span className="inline text-center">
          <Typography
            kind="body"
            variant="medium"
            color={type === "error" ? "error" : "primary"}
            className="inline"
          >
            {message}
          </Typography>
          {actionText ? (
            <>
              {" "}
              <Button
                type="button"
                variant="link"
                className="inline h-auto shrink-0 p-0 font-semibold align-baseline"
                onClick={onActionClick}
              >
                {actionText}
              </Button>
            </>
          ) : null}
        </span>
      </Alert>
    );
  }
);
ChatNotification.displayName = "ChatNotification";

export { ChatNotification };
