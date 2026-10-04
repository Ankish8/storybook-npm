import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

const numberStepFieldVariants = cva(
  "group flex min-w-0 w-full flex-1 font-[family-name:var(--font-v2,Inter,sans-serif)]",
  {
    variants: {
      layout: {
        default: "",
      },
    },
    defaultVariants: {
      layout: "default",
    },
  }
);

/** Holding a stepper: first repeat after 400ms, then every 60ms, until release, leave or a bound. */
const REPEAT_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 60;

function clampInt(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function parseOptionalInt(raw: string): number | null {
  if (raw === "") return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isNaN(n) ? null : n;
}

export interface NumberStepFieldProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "children" | "onBlur"
> {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Trailing label inside the field (e.g. `hour`, `minutes`). */
  suffix: string;
  disabled?: boolean;
  "aria-label"?: string;
  incrementAriaLabel?: string;
  decrementAriaLabel?: string;
  /** Called when the number input loses focus (e.g. validation). */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const NumberStepField = React.forwardRef<HTMLDivElement, NumberStepFieldProps>(
  (
    {
      className,
      value,
      onValueChange,
      min = 0,
      max = Number.MAX_SAFE_INTEGER,
      step = 1,
      suffix,
      disabled,
      "aria-label": ariaLabel,
      incrementAriaLabel,
      decrementAriaLabel,
      onBlur,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleChange = (raw: string) => {
      const parsed = parseOptionalInt(raw);
      if (parsed === null) return;
      onValueChange(clampInt(parsed, min, max));
    };

    const stepUp = () => {
      onValueChange(clampInt(value + step, min, max));
    };

    const stepDown = () => {
      onValueChange(clampInt(value - step, min, max));
    };

    // Hold to repeat. The timers read the latest props through a ref so a controlled parent that re-renders
    // between ticks is respected (and stepping stops at the bounds like a single click would).
    const latest = React.useRef({ value, min, max, step, onValueChange });
    React.useEffect(() => {
      latest.current = { value, min, max, step, onValueChange };
    });
    const delayTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const repeatTimer = React.useRef<ReturnType<typeof setInterval> | null>(
      null
    );
    // True once a hold has produced repeats: the click that follows the release must not step again.
    // `releasedAt` lets a stale flag (a hold that left the button, so no click came) expire instead of
    // swallowing a later keyboard click.
    const heldRepeat = React.useRef(false);
    const releasedAt = React.useRef(0);

    const stopRepeat = React.useCallback(() => {
      if (delayTimer.current) clearTimeout(delayTimer.current);
      if (repeatTimer.current) clearInterval(repeatTimer.current);
      delayTimer.current = null;
      repeatTimer.current = null;
    }, []);
    React.useEffect(() => stopRepeat, [stopRepeat]);

    const startRepeat = (direction: 1 | -1) => {
      stopRepeat();
      heldRepeat.current = false;
      releasedAt.current = 0;
      const tick = () => {
        const current = latest.current;
        const next = clampInt(
          current.value + direction * current.step,
          current.min,
          current.max
        );
        if (next === current.value) {
          stopRepeat();
          return;
        }
        heldRepeat.current = true;
        // Advance our own copy too: ticks can run before the parent has re-rendered, and without this they
        // would all compute the same next value.
        current.value = next;
        current.onValueChange(next);
      };
      delayTimer.current = setTimeout(() => {
        tick();
        repeatTimer.current = setInterval(tick, REPEAT_INTERVAL_MS);
      }, REPEAT_DELAY_MS);
    };

    const endRepeat = () => {
      stopRepeat();
      if (heldRepeat.current && releasedAt.current === 0) {
        releasedAt.current = Date.now();
      }
    };

    /** Click path: keyboard activation, tests and short presses. A press that already repeated is not stepped again. */
    const handleStepClick = (step: () => void) => () => {
      if (heldRepeat.current) {
        const fresh =
          releasedAt.current === 0 || Date.now() - releasedAt.current < 600;
        heldRepeat.current = false;
        releasedAt.current = 0;
        if (fresh) return;
      }
      step();
    };

    /** Keeps focus on the input (not the button) so stepping after typing does not drop focus; also focuses the field when only the steppers are used so blur handlers run on leave. */
    const handleStepperPointerDown =
      (direction: 1 | -1) => (e: React.PointerEvent) => {
        if (disabled) return;
        e.preventDefault();
        inputRef.current?.focus();
        if ((e.button ?? 0) === 0) startRepeat(direction);
      };

    const atMax = value >= max;
    const atMin = value <= min;

    return (
      <div
        ref={ref}
        className={cn(
          numberStepFieldVariants({ layout: "default" }),
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex h-10 min-w-0 flex-1 items-center rounded-lg border border-solid border-semantic-border-layout overflow-hidden transition-[border-color,box-shadow] duration-150",
            !disabled &&
              "group-hover:[&:not(:focus-within)]:border-[var(--color-primary-100)] group-focus-within:border-semantic-border-accent group-focus-within:shadow-[0_0_4px_rgba(39,171,184,0.4)]"
          )}
        >
          <Input
            ref={inputRef}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            aria-label={ariaLabel}
            hideNumberSpinners
            className="rounded-none border-0 h-full min-w-0 flex-1 bg-semantic-bg-primary px-4 py-2.5 leading-[normal] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none shadow-none"
          />
          {/* Steppers: each chevron is a half-height tile (24 x 19 in the 38px field) so the pointer target is
              about 4x the 12px icon; markup otherwise matches Advanced Settings `ValidatedNumberSpinner`
              (advanced-settings-card.tsx). The tile fill only shows on hover, so at rest it looks like bare chevrons. */}
          <div className="flex h-full w-7 shrink-0 flex-col bg-semantic-bg-primary px-0.5">
            <button
              type="button"
              disabled={disabled || atMax}
              onPointerDown={handleStepperPointerDown(1)}
              onPointerUp={endRepeat}
              onPointerLeave={endRepeat}
              onPointerCancel={endRepeat}
              onClick={handleStepClick(stepUp)}
              aria-label={incrementAriaLabel ?? "Increase value"}
              className="flex w-full flex-1 items-center justify-center rounded text-[var(--v2-text-muted,#707070)] [transition-property:color,background-color,transform] [transition-duration:180ms,150ms,180ms] [transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1)),ease-out,var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] enabled:[@media(hover:hover)]:hover:bg-semantic-bg-ui enabled:[@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)] active:[transition-duration:80ms,150ms,80ms] active:scale-[0.96] motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronUp className="size-3" />
            </button>
            <button
              type="button"
              disabled={disabled || atMin}
              onPointerDown={handleStepperPointerDown(-1)}
              onPointerUp={endRepeat}
              onPointerLeave={endRepeat}
              onPointerCancel={endRepeat}
              onClick={handleStepClick(stepDown)}
              aria-label={decrementAriaLabel ?? "Decrease value"}
              className="flex w-full flex-1 items-center justify-center rounded text-[var(--v2-text-muted,#707070)] [transition-property:color,background-color,transform] [transition-duration:180ms,150ms,180ms] [transition-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1)),ease-out,var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] enabled:[@media(hover:hover)]:hover:bg-semantic-bg-ui enabled:[@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)] active:[transition-duration:80ms,150ms,80ms] active:scale-[0.96] motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronDown className="size-3" />
            </button>
          </div>
          <span
            className="inline-flex h-full items-center px-4 shrink-0 bg-semantic-bg-ui text-sm leading-[normal] text-[var(--v2-text-muted,#707070)]"
            aria-hidden
          >
            {suffix}
          </span>
        </div>
      </div>
    );
  }
);
NumberStepField.displayName = "NumberStepField";

export { NumberStepField, numberStepFieldVariants };
