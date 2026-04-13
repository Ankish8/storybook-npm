import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Switch } from "../../ui/switch";
import { NumberStepField } from "../../ui/number-step-field";
import { Textarea } from "../../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import {
  DEFAULT_MAX_TOTAL_MINUTES,
  DEFAULT_MESSAGE_REQUIRED_ERROR,
  type BotFollowUpsProps,
  type NudgeItem,
} from "./types";

// ── Delay clamping ───────────────────────────────────────────────────────────

function normalizeDelay(
  rawHours: number,
  rawMinutes: number,
  maxHours: number,
  maxMinutes: number,
  minTotalMinutes: number,
  maxTotalMinutes: number
): { hours: number; minutes: number } {
  let h = Number.isFinite(rawHours) ? Math.floor(rawHours) : 0;
  let m = Number.isFinite(rawMinutes) ? Math.floor(rawMinutes) : 0;
  h = Math.max(0, Math.min(maxHours, h));
  m = Math.max(0, Math.min(maxMinutes, m));

  const total = h * 60 + m;
  if (total > maxTotalMinutes) {
    return {
      hours: Math.floor(maxTotalMinutes / 60),
      minutes: maxTotalMinutes % 60,
    };
  }
  if (total < minTotalMinutes) {
    return {
      hours: Math.floor(minTotalMinutes / 60),
      minutes: minTotalMinutes % 60,
    };
  }
  return { hours: h, minutes: m };
}

// ── Nudge card ───────────────────────────────────────────────────────────────

function NudgeCard({
  nudge,
  displayLabel,
  onToggle,
  onDelayHoursChange,
  onDelayMinutesChange,
  onDelayHoursBlur,
  onDelayMinutesBlur,
  onMessageChange,
  onMessageBlur,
  messageError,
  maxHours,
  maxMinutes,
  minTotalMinutes,
  maxTotalMinutes,
  disabled,
}: {
  nudge: NudgeItem;
  displayLabel: string;
  onToggle?: (id: string, enabled: boolean) => void;
  onDelayHoursChange?: (id: string, hours: number) => void;
  onDelayMinutesChange?: (id: string, minutes: number) => void;
  onDelayHoursBlur?: (
    id: string,
    event: React.FocusEvent<HTMLInputElement>
  ) => void;
  onDelayMinutesBlur?: (
    id: string,
    event: React.FocusEvent<HTMLInputElement>
  ) => void;
  onMessageChange?: (id: string, message: string) => void;
  onMessageBlur?: (
    id: string,
    event: React.FocusEvent<HTMLTextAreaElement>
  ) => void;
  /** Shown under the message field (Info icon + error text, Figma-style). */
  messageError?: string;
  maxHours: number;
  maxMinutes: number;
  minTotalMinutes: number;
  maxTotalMinutes: number;
  disabled?: boolean;
}) {
  const messageErrorDescId = React.useId();

  const handleHoursChange = (next: number) => {
    const { hours, minutes } = normalizeDelay(
      next,
      nudge.delayMinutes,
      maxHours,
      maxMinutes,
      minTotalMinutes,
      maxTotalMinutes
    );
    if (hours !== nudge.delayHours) onDelayHoursChange?.(nudge.id, hours);
    if (minutes !== nudge.delayMinutes) {
      onDelayMinutesChange?.(nudge.id, minutes);
    }
  };

  const handleMinutesChange = (next: number) => {
    const { hours, minutes } = normalizeDelay(
      nudge.delayHours,
      next,
      maxHours,
      maxMinutes,
      minTotalMinutes,
      maxTotalMinutes
    );
    if (hours !== nudge.delayHours) onDelayHoursChange?.(nudge.id, hours);
    if (minutes !== nudge.delayMinutes) {
      onDelayMinutesChange?.(nudge.id, minutes);
    }
  };

  return (
    <div className="border border-solid border-semantic-border-layout rounded p-4">
      <div className="flex flex-col gap-4">
        {/* Toggle + name */}
        <div className="flex items-center gap-2">
          <Switch
            size="sm"
            checked={nudge.enabled}
            onCheckedChange={(checked) => onToggle?.(nudge.id, !!checked)}
            disabled={disabled}
            aria-label={`Toggle ${displayLabel}`}
          />
          <span className="text-sm text-semantic-text-primary">
            {displayLabel}
          </span>
        </div>

        {/* Set delay — hour : minute */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-semantic-text-muted">Set delay</span>
          <div className="flex items-center gap-2 min-w-0">
            <NumberStepField
              value={nudge.delayHours}
              onValueChange={(v) => handleHoursChange(v)}
              onBlur={(e) => onDelayHoursBlur?.(nudge.id, e)}
              min={0}
              max={maxHours}
              suffix="hour"
              disabled={disabled}
              aria-label={`${displayLabel} delay hours`}
              incrementAriaLabel={`Increase ${displayLabel} hours`}
              decrementAriaLabel={`Decrease ${displayLabel} hours`}
            />
            <span
              className="text-sm font-medium text-semantic-text-primary select-none shrink-0"
              aria-hidden
            >
              :
            </span>
            <NumberStepField
              value={nudge.delayMinutes}
              onValueChange={(v) => handleMinutesChange(v)}
              onBlur={(e) => onDelayMinutesBlur?.(nudge.id, e)}
              min={0}
              max={maxMinutes}
              suffix="minutes"
              disabled={disabled}
              aria-label={`${displayLabel} delay minutes`}
              incrementAriaLabel={`Increase ${displayLabel} minutes`}
              decrementAriaLabel={`Decrease ${displayLabel} minutes`}
            />
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-semantic-text-muted">Message</span>
          <Textarea
            value={nudge.message}
            onChange={(e) => onMessageChange?.(nudge.id, e.target.value)}
            onBlur={(e) => onMessageBlur?.(nudge.id, e)}
            disabled={disabled}
            rows={3}
            state={messageError ? "error" : "default"}
            aria-label={`${displayLabel} message`}
            aria-invalid={!!messageError}
            aria-describedby={messageError ? messageErrorDescId : undefined}
            className="bg-semantic-bg-primary"
          />
          {messageError ? (
            <div
              id={messageErrorDescId}
              className="flex items-center gap-1.5 text-xs text-semantic-error-primary min-w-0"
              role="alert"
            >
              <Info className="size-3.5 shrink-0" aria-hidden />
              <p className="m-0">{messageError}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

const DEFAULT_TOOLTIP =
  "Follow-ups are automated messages sent when the user is inactive for the delay you set.";

const BotFollowUps = React.forwardRef<HTMLDivElement, BotFollowUpsProps>(
  (
    {
      nudges,
      title = "Follow-ups",
      onToggle,
      onDelayHoursChange,
      onDelayMinutesChange,
      onDelayHoursBlur,
      onDelayMinutesBlur,
      onMessageChange,
      onMessageBlur,
      messageRequiredError = DEFAULT_MESSAGE_REQUIRED_ERROR,
      tooltip,
      infoTooltip,
      minTotalMinutes = 0,
      maxTotalMinutes = DEFAULT_MAX_TOTAL_MINUTES,
      maxHours = 23,
      maxMinutes = 59,
      getItemLabel,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const tooltipContent = (tooltip ?? infoTooltip) || DEFAULT_TOOLTIP;

    const [messageErrors, setMessageErrors] = React.useState<
      Record<string, string>
    >({});

    React.useEffect(() => {
      const ids = new Set(nudges.map((n) => n.id));
      setMessageErrors((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const k of Object.keys(next)) {
          if (!ids.has(k)) {
            delete next[k];
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, [nudges]);

    const handleMessageChange = React.useCallback(
      (id: string, message: string) => {
        if (message.trim()) {
          setMessageErrors((prev) => {
            if (!prev[id]) return prev;
            const rest = { ...prev };
            delete rest[id];
            return rest;
          });
        }
        onMessageChange?.(id, message);
      },
      [onMessageChange]
    );

    const handleMessageBlur = React.useCallback(
      (id: string, event: React.FocusEvent<HTMLTextAreaElement>) => {
        const v = event.target.value;
        if (!v.trim()) {
          setMessageErrors((prev) => ({
            ...prev,
            [id]: messageRequiredError,
          }));
        } else {
          setMessageErrors((prev) => {
            if (!prev[id]) return prev;
            const rest = { ...prev };
            delete rest[id];
            return rest;
          });
        }
        onMessageBlur?.(id, event);
      },
      [onMessageBlur, messageRequiredError]
    );

    return (
      <div ref={ref} className={cn("pb-4", className)} {...props}>
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-3">
          <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
            {title}
          </h3>
          {tooltipContent ? (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    className="size-3.5 text-semantic-text-muted shrink-0 cursor-help"
                    aria-label={`${title}: more information`}
                  />
                </TooltipTrigger>
                <TooltipContent>{tooltipContent}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Info className="size-3.5 text-semantic-text-muted shrink-0" />
          )}
        </div>

        {/* Cards */}
        {nudges.length === 0 ? (
          <p className="m-0 text-sm text-semantic-text-muted text-center py-4">
            No follow-ups configured
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {nudges.map((nudge, index) => (
              <NudgeCard
                key={nudge.id}
                nudge={nudge}
                displayLabel={
                  getItemLabel?.(nudge, index) ?? `Followup ${index + 1}`
                }
                onToggle={onToggle}
                onDelayHoursChange={onDelayHoursChange}
                onDelayMinutesChange={onDelayMinutesChange}
                onDelayHoursBlur={onDelayHoursBlur}
                onDelayMinutesBlur={onDelayMinutesBlur}
                onMessageChange={handleMessageChange}
                onMessageBlur={handleMessageBlur}
                messageError={messageErrors[nudge.id]}
                maxHours={maxHours}
                maxMinutes={maxMinutes}
                minTotalMinutes={minTotalMinutes}
                maxTotalMinutes={maxTotalMinutes}
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
BotFollowUps.displayName = "BotFollowUps";

export { BotFollowUps };
