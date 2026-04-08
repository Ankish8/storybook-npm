import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Switch } from "../../ui/switch";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import type { BotNudgesProps, DelayUnit, NudgeItem } from "./types";

// ── Default options ──────────────────────────────────────────────────────────

const DEFAULT_DELAY_UNIT_OPTIONS: { value: DelayUnit; label: string }[] = [
  { value: "seconds", label: "seconds" },
  { value: "minutes", label: "minutes" },
  { value: "hours", label: "hours" },
];

// ── Nudge card ───────────────────────────────────────────────────────────────

function NudgeCard({
  nudge,
  onToggle,
  onDelayValueChange,
  onDelayUnitChange,
  onMessageChange,
  delayUnitOptions,
  disabled,
}: {
  nudge: NudgeItem;
  onToggle?: (id: string, enabled: boolean) => void;
  onDelayValueChange?: (id: string, value: number) => void;
  onDelayUnitChange?: (id: string, unit: DelayUnit) => void;
  onMessageChange?: (id: string, message: string) => void;
  delayUnitOptions: { value: DelayUnit; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="bg-semantic-bg-ui border border-solid border-semantic-border-layout rounded p-4">
      <div className="flex flex-col gap-4">
        {/* Toggle + name */}
        <div className="flex items-center gap-2">
          <Switch
            size="sm"
            checked={nudge.enabled}
            onCheckedChange={(checked) => onToggle?.(nudge.id, !!checked)}
            disabled={disabled}
            aria-label={`Toggle ${nudge.name}`}
          />
          <span className="text-sm text-semantic-text-primary">
            {nudge.name}
          </span>
        </div>

        {/* Set delay row */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-semantic-text-primary">Set delay</span>
          <div className="flex items-center gap-2.5">
            <div className="flex-1">
              <Input
                type="number"
                value={nudge.delayValue}
                onChange={(e) =>
                  onDelayValueChange?.(
                    nudge.id,
                    Number(e.target.value) || 0
                  )
                }
                disabled={disabled}
                aria-label={`${nudge.name} delay value`}
                className="bg-semantic-bg-primary"
              />
            </div>
            <div className="flex-1">
              <Select
                value={nudge.delayUnit}
                onValueChange={(val) =>
                  onDelayUnitChange?.(nudge.id, val as DelayUnit)
                }
                disabled={disabled}
              >
                <SelectTrigger
                  aria-label={`${nudge.name} delay unit`}
                  className="bg-semantic-bg-primary"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {delayUnitOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Message row */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-semantic-text-primary">Message</span>
          <Textarea
            value={nudge.message}
            onChange={(e) => onMessageChange?.(nudge.id, e.target.value)}
            disabled={disabled}
            rows={3}
            aria-label={`${nudge.name} message`}
            className="bg-semantic-bg-primary"
          />
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

const BotNudges = React.forwardRef<HTMLDivElement, BotNudgesProps>(
  (
    {
      nudges,
      onToggle,
      onDelayValueChange,
      onDelayUnitChange,
      onMessageChange,
      delayUnitOptions = DEFAULT_DELAY_UNIT_OPTIONS,
      infoTooltip = "Nudges are automated messages sent to the user when they are inactive for a set period of time.",
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("pb-4", className)} {...props}>
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-3">
          <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
            Nudges
          </h3>
          {infoTooltip ? (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    className="size-3.5 text-semantic-text-muted shrink-0 cursor-help"
                    aria-label="Nudges information"
                  />
                </TooltipTrigger>
                <TooltipContent>{infoTooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Info className="size-3.5 text-semantic-text-muted shrink-0" />
          )}
        </div>

        {/* Nudge cards */}
        {nudges.length === 0 ? (
          <p className="m-0 text-sm text-semantic-text-muted text-center py-4">
            No nudges configured
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {nudges.map((nudge) => (
              <NudgeCard
                key={nudge.id}
                nudge={nudge}
                onToggle={onToggle}
                onDelayValueChange={onDelayValueChange}
                onDelayUnitChange={onDelayUnitChange}
                onMessageChange={onMessageChange}
                delayUnitOptions={delayUnitOptions}
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
BotNudges.displayName = "BotNudges";

export { BotNudges };
