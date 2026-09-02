import * as React from "react";
import { X } from "lucide-react";

import { cn } from "../../../../lib/utils";
import type { BulkSelectionToolbarProps } from "./types";

/**
 * BulkSelectionToolbar shows above a table when rows are selected, surfacing
 * the selection count and any bulk actions available for that selection.
 *
 * @example
 * ```tsx
 * <BulkSelectionToolbar
 *   selectedCount={16}
 *   actions={[{ label: "Download Recordings", onClick: () => {} }]}
 *   onClose={() => clearSelection()}
 * />
 * ```
 */
const BulkSelectionToolbar = React.forwardRef(
  (
    { selectedCount, actions = [], onClose, className, ...props }: BulkSelectionToolbarProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-wrap items-center gap-x-6 gap-y-2 rounded-md bg-semantic-info-surface px-4 py-2.5",
          className
        )}
        {...props}
      >
        <span className="flex-1 text-sm font-semibold text-semantic-text-primary">
          {selectedCount} selected
        </span>
        <div className="flex flex-wrap shrink-0 items-center gap-x-6 gap-y-2">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="whitespace-nowrap text-sm font-semibold text-semantic-text-link hover:underline"
            >
              {action.label}
            </button>
          ))}
          {onClose && (
            <button
              type="button"
              aria-label="Clear selection"
              onClick={onClose}
              className="flex size-6 items-center justify-center rounded-full hover:bg-semantic-bg-hover"
            >
              <X className="size-4 text-semantic-text-muted" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    );
  }
);
BulkSelectionToolbar.displayName = "BulkSelectionToolbar";

export { BulkSelectionToolbar };
