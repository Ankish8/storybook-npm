import * as React from "react";
import { Info, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import type { BotFunctionsProps } from "./types";

const BotFunctions = React.forwardRef<HTMLDivElement, BotFunctionsProps>(
  (
    {
      functions,
      onAdd,
      onEdit,
      onDelete,
      infoTooltip,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-b border-solid border-semantic-border-layout pb-4",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h3 className="m-0 text-sm font-semibold text-semantic-text-primary">
              Functions
            </h3>
            {infoTooltip ? (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      className="size-3.5 text-semantic-text-muted shrink-0 cursor-help"
                      aria-label="Functions: more information"
                    />
                  </TooltipTrigger>
                  <TooltipContent>{infoTooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Info className="size-3.5 text-semantic-text-muted shrink-0" />
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAdd}
            disabled={disabled}
            leftIcon={<Plus className="size-3.5" />}
          >
            Functions
          </Button>
        </div>

        {/* Function list */}
        {functions.length === 0 ? (
          <p className="m-0 text-sm text-semantic-text-muted text-center py-3">
            No functions added yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {functions.map((fn) => (
              <div
                key={fn.id}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-semantic-text-secondary truncate min-w-0">
                  {fn.name}
                </span>
                <div className="flex items-center gap-1 shrink-0 ml-3">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(fn.id)}
                      disabled={disabled}
                      className={cn(
                        "p-1.5 rounded text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors",
                        disabled && "opacity-50 cursor-not-allowed"
                      )}
                      aria-label={`Edit ${fn.name}`}
                    >
                      <Pencil className="size-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(fn.id)}
                      disabled={disabled}
                      className={cn(
                        "p-1.5 rounded text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors",
                        disabled && "opacity-50 cursor-not-allowed"
                      )}
                      aria-label={`Delete ${fn.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
BotFunctions.displayName = "BotFunctions";

export { BotFunctions };
