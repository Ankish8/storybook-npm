import * as React from "react";
import { Info, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import type { FunctionItem } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FunctionsCardProps {
  /** List of functions to display */
  functions: FunctionItem[];
  /** Called when user clicks the add function button */
  onAddFunction?: () => void;
  /**
   * Called when user clicks the edit button on a custom function.
   * When omitted, the edit button is **not rendered**.
   */
  onEditFunction?: (id: string) => void;
  /**
   * Called when user clicks the delete button on a custom function.
   * When omitted, the delete button is **not rendered**.
   */
  onDeleteFunction?: (id: string) => void;
  /** Hover text shown on the info icon next to the "Functions" title */
  infoTooltip?: string;
  /** Disables the "Add Functions" button and other form-level interactions (view mode) */
  disabled?: boolean;
  /** Independently disables the edit button (e.g. user lacks edit permission) */
  editDisabled?: boolean;
  /** Independently disables the delete button (e.g. user lacks delete permission) */
  deleteDisabled?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

const FunctionsCard = React.forwardRef<HTMLDivElement, FunctionsCardProps>(
  ({ functions, onAddFunction, onEditFunction, onDeleteFunction, infoTooltip, disabled, editDisabled, deleteDisabled, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout sm:px-6">
          <div className="flex items-center gap-1.5">
            <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
              Functions
            </h2>
            {infoTooltip ? (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-semantic-text-muted shrink-0 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>{infoTooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Info className="size-3.5 text-semantic-text-muted shrink-0" />
            )}
          </div>
          <button
            type="button"
            onClick={onAddFunction}
            disabled={disabled}
            className={cn("inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold text-semantic-text-secondary bg-semantic-primary-surface hover:bg-semantic-bg-hover transition-colors", disabled && "opacity-50 cursor-not-allowed")}
          >
            <Plus className="size-3.5" />
            Functions
          </button>
        </div>
        {/* Function list */}
        <div className="px-4 py-4 sm:px-6">
          {functions.length === 0 ? (
            <p className="m-0 text-sm text-semantic-text-muted text-center py-2">
              No functions added yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {functions.map((fn) => (
                <div
                  key={fn.id}
                  className="flex items-center justify-between px-4 py-3 rounded border border-semantic-border-layout bg-semantic-bg-primary"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {fn.tooltip ? (
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="size-4 text-semantic-text-muted shrink-0 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>{fn.tooltip}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Info className="size-4 text-semantic-text-muted shrink-0" />
                    )}
                    <span className="text-sm text-semantic-text-primary truncate">
                      {fn.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-3">
                    {fn.isBuiltIn ? (
                      <Badge size="sm" className="font-normal">
                        Built-in
                      </Badge>
                    ) : (
                      <>
                        {onEditFunction && (
                          <button
                            type="button"
                            onClick={() => onEditFunction(fn.id)}
                            disabled={editDisabled}
                            className={cn("p-1.5 rounded text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors", editDisabled && "opacity-50 cursor-not-allowed")}
                            aria-label={`Edit ${fn.name}`}
                          >
                            <Pencil className="size-4" />
                          </button>
                        )}
                        {onDeleteFunction && (
                          <button
                            type="button"
                            onClick={() => onDeleteFunction(fn.id)}
                            disabled={deleteDisabled}
                            className={cn("p-1.5 rounded text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors", deleteDisabled && "opacity-50 cursor-not-allowed")}
                            aria-label={`Delete ${fn.name}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
FunctionsCard.displayName = "FunctionsCard";

export { FunctionsCard };
