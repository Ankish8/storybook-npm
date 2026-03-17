import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { BotListCreateCardProps } from "./types";

export const BotListCreateCard = React.forwardRef<
  HTMLButtonElement,
  BotListCreateCardProps
>(
  (
    {
      label = "Create new bot",
      onClick,
      className,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-2.5 rounded-[5px] min-h-[180px] sm:min-h-[207px] w-full min-w-0 max-w-full",
        "bg-semantic-info-surface-subtle border border-dashed border-semantic-border-layout",
        "cursor-pointer transition-colors hover:bg-semantic-bg-hover hover:border-semantic-border-input",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus",
        "self-stretch justify-self-stretch",
        className
      )}
      aria-label={label}
      {...props}
    >
      <Plus className="size-4 text-semantic-text-secondary shrink-0" />
      <span className="text-sm font-semibold leading-5 text-semantic-text-secondary text-center tracking-[0.014px]">
        {label}
      </span>
    </button>
  )
);

BotListCreateCard.displayName = "BotListCreateCard";
