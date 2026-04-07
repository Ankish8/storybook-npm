import * as React from "react"
import { cn } from "../../../lib/utils"
import type { ToolkitCardProps } from "./types"

const ToolkitCard = React.forwardRef<HTMLButtonElement, ToolkitCardProps>(
  ({ toolkit, isSelected, onClick }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onClick(toolkit)}
        className={cn(
          "flex items-center gap-3 rounded-lg border px-4 py-0 h-[72px] w-full text-left transition-all",
          isSelected
            ? "border-semantic-brand shadow-[0px_1px_6.8px_0px_rgba(0,0,0,0.25)]"
            : "border-semantic-border-layout hover:border-semantic-border-primary"
        )}
        aria-pressed={isSelected}
      >
        <div className="size-10 shrink-0 overflow-hidden rounded">
          <img
            src={toolkit.logo}
            alt={`${toolkit.name} logo`}
            className="size-full object-contain"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="m-0 truncate text-sm font-semibold tracking-wide text-semantic-text-primary">
            {toolkit.name}
          </p>
          <p className="m-0 line-clamp-1 text-xs tracking-wide text-semantic-text-muted">
            {toolkit.description}
          </p>
        </div>
      </button>
    )
  }
)
ToolkitCard.displayName = "ToolkitCard"

export { ToolkitCard }
