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
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
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
      ...props
    },
    ref
  ) => {
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

    const atMax = value >= max;
    const atMin = value <= min;

    return (
      <div
        ref={ref}
        className={cn(numberStepFieldVariants({ layout: "default" }), className)}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-stretch rounded-md border border-solid border-semantic-border-input overflow-hidden focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]">
          <Input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            aria-label={ariaLabel}
            hideNumberSpinners
            className="rounded-none border-0 h-10 min-w-0 flex-1 bg-semantic-bg-primary px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          />
          {/* Inline steppers on the right inside the white field (before unit suffix) */}
          <div className="flex h-10 w-7 shrink-0 flex-col bg-semantic-bg-primary pr-0.5">
            <button
              type="button"
              disabled={disabled || atMax}
              onClick={stepUp}
              aria-label={incrementAriaLabel ?? "Increase value"}
              className="flex min-h-0 flex-1 items-center justify-center text-semantic-text-muted hover:bg-semantic-bg-hover hover:text-semantic-text-primary disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-semantic-primary"
            >
              <ChevronUp className="size-3.5" strokeWidth={2} />
            </button>
            <button
              type="button"
              disabled={disabled || atMin}
              onClick={stepDown}
              aria-label={decrementAriaLabel ?? "Decrease value"}
              className="flex min-h-0 flex-1 items-center justify-center text-semantic-text-muted hover:bg-semantic-bg-hover hover:text-semantic-text-primary disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-semantic-primary"
            >
              <ChevronDown className="size-3.5" strokeWidth={2} />
            </button>
          </div>
          <span
            className="inline-flex items-center px-2.5 shrink-0 bg-semantic-bg-ui text-sm text-semantic-text-secondary"
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
