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
 * Matches WABA bot screen styling: card shell, header with aggregate counter,
 * and rows with toggles, labels, per-item usage, and actions.
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
    const characterUsageTooltip = `Max ${maxCharacters} characters shared across all instruction types`;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col overflow-hidden rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary",
          className
        )}
        {...props}
      >
        {/* Header — Figma: title + help + aggregate count; add button right */}
        <div className="flex shrink-0 flex-col border-b border-solid border-semantic-border-layout px-6">
          <div className="flex items-center justify-between gap-4 py-5">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
              <div className="flex min-w-0 items-center gap-1">
                <span className="text-base font-semibold text-semantic-text-primary">
                  Instructions
                </span>
                {infoTooltip && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex shrink-0 cursor-pointer text-semantic-text-muted">
                          <Info
                            className="h-3.5 w-3.5"
                            aria-hidden
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{infoTooltip}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-pointer text-sm text-semantic-text-link">
                      <span>(</span>
                      <span className="font-semibold text-semantic-text-muted">
                        {usedCharacters}
                      </span>
                      <span>{`/${maxCharacters} characters)`}</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{characterUsageTooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 shrink-0 gap-1.5 px-4 py-0"
              onClick={onAdd}
              disabled={disabled || addDisabled}
              title={addDisabled ? addDisabledTitle : undefined}
            >
              <Plus aria-hidden />
              Instructions
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-1.5 px-6 py-6">
          {instructions.length > 0 ? (
            instructions.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-[30px]"
              >
                <div className="flex min-w-0 flex-1 items-center gap-[15px]">
                  <Switch
                    size="sm"
                    checked={item.enabled}
                    onCheckedChange={(checked) => onToggle?.(item.id, checked)}
                    disabled={disabled}
                    aria-label={`Toggle ${item.name}`}
                  />
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="truncate text-sm text-semantic-text-secondary">
                      {item.name}
                    </span>
                    <span className="shrink-0 whitespace-nowrap text-sm text-semantic-text-muted">
                      ({item.charCount} character used)
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded"
                    onClick={() => onEdit?.(item.id)}
                    disabled={disabled}
                    aria-label={`Edit ${item.name}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded"
                    onClick={() => onDelete?.(item.id)}
                    disabled={disabled}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="m-0 w-full text-center text-sm text-semantic-text-muted">
              No instructions added yet. Click &quot;+ Instructions&quot; to add
              one.
            </p>
          )}
        </div>
      </div>
    );
  }
);

BotInstructions.displayName = "BotInstructions";

export { BotInstructions };
