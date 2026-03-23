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
        "relative flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-2.5 rounded-[5px] min-h-[180px] sm:min-h-[207px] w-full min-w-0 max-w-full",
        "bg-semantic-info-surface-subtle",
        "group cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus",
        "self-stretch justify-self-stretch",
        className
      )}
      aria-label={label}
      {...props}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <rect
          x="0.5"
          y="0.5"
          style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
          rx="4.5"
          fill="none"
          strokeWidth="1"
          strokeDasharray="6 6"
          className="stroke-[#c0c3ca] group-hover:stroke-[#717680] transition-colors duration-150"
        />
      </svg>
      <Plus className="size-4 text-semantic-text-secondary shrink-0" />
      <span className="text-sm font-semibold leading-5 text-semantic-text-secondary text-center tracking-[0.014px]">
        {label}
      </span>
    </button>
  )
);

BotListCreateCard.displayName = "BotListCreateCard";
