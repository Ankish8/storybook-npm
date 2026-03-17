import * as React from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import type { BotListActionProps } from "./types";

const defaultTrigger = (
  <button
    type="button"
    className="p-2 min-h-[44px] min-w-[44px] sm:p-1 sm:min-h-0 sm:min-w-0 rounded hover:bg-semantic-bg-hover text-semantic-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus flex items-center justify-center touch-manipulation"
    aria-label="More options"
  >
    <MoreVertical className="size-4 shrink-0" />
  </button>
);

export const BotListAction = React.forwardRef<HTMLDivElement, BotListActionProps>(
  (
    {
      onEdit,
      onDelete,
      trigger = defaultTrigger,
      align = "end",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("inline-flex", className)} {...props}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
          <DropdownMenuContent
            align={align}
            className="min-w-[160px] max-w-[min(100vw-2rem,320px)] max-h-[min(70vh,400px)] overflow-y-auto rounded-lg border border-semantic-border-layout bg-semantic-bg-ui p-1 shadow-lg"
          >
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-semantic-text-primary outline-none transition-colors focus:bg-semantic-bg-hover focus:text-semantic-text-primary"
              onSelect={(e) => {
                e.preventDefault();
                onEdit?.();
              }}
            >
              <Pencil className="size-4 shrink-0 text-semantic-text-primary" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-semantic-border-layout" />
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-semantic-error-primary outline-none transition-colors focus:bg-semantic-error-surface focus:text-semantic-error-primary"
              onSelect={(e) => {
                e.preventDefault();
                onDelete?.();
              }}
            >
              <Trash2 className="size-4 shrink-0 text-semantic-error-primary" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

BotListAction.displayName = "BotListAction";
