import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

const numberStepFieldVariants = cva(
  "flex min-w-0 w-full flex-1",
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

function clampInt(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function parseOptionalInt(raw: string): number | null {
  if (raw === "") return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isNaN(n) ? null : n;
}

export interface NumberStepFieldProps
  extends Omit<
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

    /** Keeps focus on the input (not the button) so stepping after typing does not drop focus; also focuses the field when only the steppers are used so blur handlers run on leave. */
    const handleStepperPointerDown = (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      inputRef.current?.focus();
    };

    const atMax = value >= max;
    const atMin = value <= min;

    return (
      <div
        ref={ref}
        className={cn(numberStepFieldVariants({ layout: "default" }), className)}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-center rounded-md border border-solid border-semantic-border-input overflow-hidden focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]">
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
            className="rounded-none border-0 h-10 min-w-0 flex-1 bg-semantic-bg-primary px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          />
          {/* Steppers — markup matches Advanced Settings `ValidatedNumberSpinner` (advanced-settings-card.tsx) */}
          <div className="flex flex-col items-center shrink-0 gap-0.5 bg-semantic-bg-primary pl-0.5 pr-1.5">
            <button
              type="button"
              disabled={disabled || atMax}
              onPointerDown={handleStepperPointerDown}
              onClick={stepUp}
              aria-label={incrementAriaLabel ?? "Increase value"}
              className="flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronUp className="size-3" />
            </button>
            <button
              type="button"
              disabled={disabled || atMin}
              onPointerDown={handleStepperPointerDown}
              onClick={stepDown}
              aria-label={decrementAriaLabel ?? "Decrease value"}
              className="flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronDown className="size-3" />
            </button>
          </div>
          <span
            className="inline-flex h-10 items-center pl-3 pr-3.5 shrink-0 bg-semantic-bg-ui text-sm text-semantic-text-secondary"
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
