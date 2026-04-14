import * as React from "react";
import { Plus, Info, Pencil, Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Switch } from "../../ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import type { BotInstructionsProps } from "./types";

/**
 * BotInstructions displays the instructions section for bot configuration.
 * Shows instruction items with toggles, character counter, and action buttons.
 */
const BotInstructions = React.forwardRef<HTMLDivElement, BotInstructionsProps>(
  (
    {
      className,
      instructions,
      maxCharacters = 5000,
      usedCharacters = 0,
      onAdd,
      onToggle,
      onEdit,
      onDelete,
      infoTooltip,
      disabled = false,
      addDisabled = false,
      addDisabledTitle,
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
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-semibold text-semantic-text-primary">
              Instructions
            </span>
            {infoTooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex cursor-help text-semantic-text-muted">
                      <Info className="h-4 w-4" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{infoTooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <span className="text-sm">
              <span className="text-semantic-text-muted">
                ({usedCharacters}
              </span>
              <span className="text-semantic-text-link">
                /{maxCharacters} characters)
              </span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAdd}
            disabled={disabled || addDisabled}
            title={addDisabled ? addDisabledTitle : undefined}
         >
            <Plus className="h-3.5 w-3.5" />
            Instructions
          </Button>
        </div>

        {/* Instruction list */}
        {instructions.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {instructions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Switch
                    size="sm"
                    checked={item.enabled}
                    onCheckedChange={(checked) => onToggle?.(item.id, checked)}
                    disabled={disabled}
                    aria-label={`Toggle ${item.name}`}
                  />
                  <span className="text-sm text-semantic-text-secondary truncate">
                    {item.name}
                  </span>
                  <span className="text-xs text-semantic-text-muted whitespace-nowrap">
                    ({item.charCount} character used)
                  </span>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit?.(item.id)}
                    disabled={disabled}
                    aria-label={`Edit ${item.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete?.(item.id)}
                    disabled={disabled}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="m-0 text-sm text-semantic-text-muted">
            No instructions added yet. Click &quot;+ Instructions&quot; to add
            one.
          </p>
        )}
      </div>
    );
  }
);

BotInstructions.displayName = "BotInstructions";

export { BotInstructions };
