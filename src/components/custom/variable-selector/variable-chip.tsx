import * as React from "react";
import { Pencil } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { VariableChipProps } from "./types";

export const VariableChip = React.forwardRef<HTMLSpanElement, VariableChipProps>(
  ({ name, showEditIcon = false, onEdit, className }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex h-7 max-w-[min(100%,18rem)] shrink-0 items-center gap-0.5 rounded bg-semantic-bg-ui px-1.5 py-[3px] text-xs text-semantic-text-secondary sm:gap-1 sm:px-2 sm:text-sm",
          className
        )}
        data-variable-name={name}
      >
        <span className="min-w-0 truncate">{`{{${name}}}`}</span>
        {showEditIcon && onEdit && (
          <button
            type="button"
            aria-label={`Edit ${name}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(name);
            }}
            className="shrink-0 cursor-pointer rounded p-0.5 text-semantic-text-muted hover:bg-semantic-bg-hover hover:text-semantic-text-primary focus:outline-none"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </span>
    );
  }
);
VariableChip.displayName = "VariableChip";
