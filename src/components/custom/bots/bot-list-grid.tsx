import * as React from "react";
import { cn } from "../../../lib/utils";
import type { BotListGridProps } from "./types";

export const BotListGrid = React.forwardRef(
  ({ children, className, ...props }: BotListGridProps, ref: React.Ref<HTMLDivElement>) => (
    <div
      ref={ref}
      className={cn(
        "grid w-full min-w-0 max-w-full overflow-hidden gap-3 sm:gap-5 md:gap-6",
        "grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

BotListGrid.displayName = "BotListGrid";
