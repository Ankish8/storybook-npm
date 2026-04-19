import * as React from "react";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Typography } from "../../ui/typography";

export interface ClearLocalChatDataProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Section heading */
  title: string;
  /** Supporting copy under the title */
  description: string;
  /** Destructive action label */
  buttonText: string;
  /** Fires when the user confirms clearing local data */
  onClearDataClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Shows loading state on the button */
  loading?: boolean;
}

/**
 * Settings-style block for clearing locally stored chat data (destructive `Button` + body copy).
 */
const ClearLocalChatData = React.forwardRef<
  HTMLDivElement,
  ClearLocalChatDataProps
>(
  (
    {
      title,
      description,
      buttonText,
      onClearDataClick,
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-4", className)}
        {...props}
      >
        <Typography kind="title" variant="large" color="primary" tag="h2">
          {title}
        </Typography>
        <Typography
          kind="body"
          variant="medium"
          color="muted"
          tag="p"
          className="max-w-2xl"
        >
          {description}
        </Typography>
        <Button
          type="button"
          variant="destructive"
          loading={loading}
          onClick={onClearDataClick}
        >
          {buttonText}
        </Button>
      </div>
    );
  }
);
ClearLocalChatData.displayName = "ClearLocalChatData";

export { ClearLocalChatData };
