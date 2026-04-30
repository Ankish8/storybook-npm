import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
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
  /** Shown under the message field (field-level error via Textarea). */
  messageError?: string;
  maxHours: number;
  maxMinutes: number;
  minTotalMinutes: number;
  maxTotalMinutes: number;
  disabled?: boolean;
}) {
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
    <div className="flex min-w-0 flex-col gap-4 py-5">
      {/* Toggle + name */}
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Switch
          size="sm"
          checked={nudge.enabled}
          onCheckedChange={(checked) => onToggle?.(nudge.id, !!checked)}
          disabled={disabled}
          aria-label={`Toggle ${displayLabel}`}
        />
        <span className="text-sm font-medium text-semantic-text-primary">
          {displayLabel}
        </span>
      </div>

      {/* Set Delay — hour : minute */}
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-xs text-semantic-text-muted">Set Delay</span>
        <div className="flex min-w-0 w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-2 sm:gap-y-2">
          <NumberStepField
            value={nudge.delayHours}
            onValueChange={(v) => handleHoursChange(v)}
            onBlur={(e) => onDelayHoursBlur?.(nudge.id, e)}
            min={0}
            max={maxHours}
            suffix="hour"
            disabled={disabled}
            className="min-w-0 w-full sm:max-w-[min(100%,240px)] sm:flex-1"
            aria-label={`${displayLabel} delay hours`}
            incrementAriaLabel={`Increase ${displayLabel} hours`}
            decrementAriaLabel={`Decrease ${displayLabel} hours`}
          />
          <span
            className="hidden shrink-0 select-none pb-2.5 text-sm font-medium text-semantic-text-primary sm:inline"
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
            className="min-w-0 w-full sm:max-w-[min(100%,240px)] sm:flex-1"
            aria-label={`${displayLabel} delay minutes`}
            incrementAriaLabel={`Increase ${displayLabel} minutes`}
            decrementAriaLabel={`Decrease ${displayLabel} minutes`}
          />
        </div>
      </div>

      {/* Message */}
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-xs text-semantic-text-muted">Message</span>
        <Textarea
          value={nudge.message}
          onChange={(e) => onMessageChange?.(nudge.id, e.target.value)}
          onBlur={(e) => onMessageBlur?.(nudge.id, e)}
          disabled={disabled}
          rows={3}
          error={messageError}
          errorIcon
          aria-label={`${displayLabel} message`}
          className="min-h-[88px] w-full min-w-0 bg-semantic-bg-primary sm:min-h-[96px]"
        />
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
      defaultOpen = true,
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

    const accordionId = "follow-ups";

    return (
      <div
        ref={ref}
        className={cn("min-w-0 max-w-full", className)}
        {...props}
      >
        <div
          className={cn(
            "overflow-hidden rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary"
          )}
        >
          <Accordion
            type="single"
            defaultValue={defaultOpen ? [accordionId] : []}
          >
            <AccordionItem value={accordionId}>
              <AccordionTrigger
                className={cn(
                  "border-b border-solid border-semantic-border-layout px-4 py-4 hover:no-underline sm:px-6 sm:py-5"
                )}
              >
                <span className="flex min-w-0 items-center gap-1.5 text-base font-semibold text-semantic-text-primary">
                  {title}
                  {tooltipContent ? (
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className="inline-flex shrink-0 cursor-help"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`${title}: more information`}
                          >
                            <Info className="pointer-events-none size-3.5 text-semantic-text-muted" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{tooltipContent}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Info
                      className="size-3.5 shrink-0 text-semantic-text-muted"
                      aria-hidden
                    />
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
                  {nudges.length === 0 ? (
                    <p className="m-0 text-center text-sm text-semantic-text-muted">
                      No follow-ups configured
                    </p>
                  ) : (
                    <div className="divide-y divide-semantic-border-layout">
                      {nudges.map((nudge, index) => (
                        <NudgeCard
                          key={nudge.id}
                          nudge={nudge}
                          displayLabel={
                            getItemLabel?.(nudge, index) ??
                            `Followup ${index + 1}`
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    );
  }
);
BotFollowUps.displayName = "BotFollowUps";

export { BotFollowUps };
