import * as React from "react";
import { Info, Plus } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../../ui/badge";
import type { FunctionItem } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FunctionsCardProps {
  /** List of functions to display */
  functions: FunctionItem[];
  /** Called when user clicks the add function button */
  onAddFunction?: () => void;
  /** Additional className */
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

const FunctionsCard = React.forwardRef<HTMLDivElement, FunctionsCardProps>(
  ({ functions, onAddFunction, className }, ref) => {
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
            <Info className="size-3.5 text-semantic-text-muted shrink-0" />
          </div>
          <button
            type="button"
            onClick={onAddFunction}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold text-semantic-text-secondary bg-semantic-primary-surface hover:bg-semantic-bg-hover transition-colors"
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
                    <Info className="size-4 text-semantic-text-muted shrink-0" />
                    <span className="text-sm text-semantic-text-primary truncate">
                      {fn.name}
                    </span>
                  </div>
                  {fn.isBuiltIn && (
                    <Badge size="sm" className="font-normal shrink-0 ml-3">
                      Built-in
                    </Badge>
                  )}
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
