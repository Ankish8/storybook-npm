import * as React from "react";
import { cn } from "../../../lib/utils";
import type { BotListHeaderProps } from "./types";

export const BotListHeader = React.forwardRef<HTMLDivElement, BotListHeaderProps>(
  ({ title, subtitle, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1.5 min-w-0 shrink", className)}
      {...props}
    >
      {title != null && (
        <h1 className="m-0 text-base font-semibold text-semantic-text-primary tracking-[0.064px] break-words sm:text-lg">
          {title}
        </h1>
      )}
      {subtitle != null && (
        <p className="m-0 text-xs sm:text-sm text-semantic-text-muted tracking-[0.035px] break-words">
          {subtitle}
        </p>
      )}
    </div>
  )
);

BotListHeader.displayName = "BotListHeader";
