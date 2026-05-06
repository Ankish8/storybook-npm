import * as React from "react";
import { Info, Pencil } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Switch } from "../../ui/switch";
import { Button } from "../../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import type { BotHumanHandoverProps } from "./types";

const DEFAULT_LABEL = "Connect to a human if bot can not answer";

const BotHumanHandover = React.forwardRef<HTMLDivElement, BotHumanHandoverProps>(
  (
    {
      enabled = false,
      label = DEFAULT_LABEL,
      onToggle,
      onEdit,
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
          "flex flex-col gap-4 py-6 border-b border-solid border-semantic-border-layout",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <h2 className="m-0 min-w-0 text-base font-semibold text-semantic-text-primary">
                Human Handover
              </h2>
              {infoTooltip ? (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="inline-flex shrink-0 cursor-pointer"
                        aria-label="Human Handover: more information"
                      >
                        <Info className="size-3.5 text-semantic-text-muted pointer-events-none" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{infoTooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
            </div>
            <p className="m-0 min-w-0 break-words text-sm text-semantic-text-secondary">
              {label}
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2 sm:justify-start">
            <Switch
              checked={enabled}
              onCheckedChange={onToggle}
              disabled={disabled}
            />
            {onEdit ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                aria-label="Edit handover settings"
              >
                <Pencil className="size-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);
BotHumanHandover.displayName = "BotHumanHandover";

export { BotHumanHandover };
