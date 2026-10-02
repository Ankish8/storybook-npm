import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
export interface StepperStep {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
export interface StepperProps extends Omit<
  React.HTMLAttributes<HTMLOListElement>,
  "onChange"
> {
  steps: StepperStep[];
  currentStep?: number;
  onStepChange?: (index: number) => void;
  size?: "sm" | "md";
  orientation?: "horizontal" | "vertical";
  marker?: "numbered" | "icon";
  disabled?: boolean;
}
const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  (
    {
      steps,
      currentStep = 0,
      onStepChange,
      size = "md",
      orientation = "horizontal",
      marker = "numbered",
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const vertical = orientation === "vertical";
    const small = size === "sm";
    return (
      <ol
        ref={ref}
        aria-label="Progress steps"
        className={cn(
          "m-0 flex max-w-full list-none p-0 font-[family-name:var(--font-v2,Inter,sans-serif)] text-semantic-text-primary",
          vertical ? "flex-col gap-1" : "items-start gap-3",
          className
        )}
        {...props}
      >
        {steps.map((step, index) => {
          const unavailable = disabled || step.disabled;
          const label = (
            <div
              className={cn(
                "flex min-w-0 flex-col gap-0.5 rounded-lg",
                vertical ? "px-3 text-left" : "items-center text-center",
                small ? "text-xs leading-[15px]" : "text-sm leading-5"
              )}
            >
              <span className="font-semibold">{step.title}</span>
              {step.description && (
                <span className="font-normal text-semantic-text-muted">
                  {step.description}
                </span>
              )}
            </div>
          );
          const indicator = (
            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full border-[0.4px] border-solid border-semantic-border-layout bg-semantic-border-layout text-xs font-normal",
                small ? "size-5" : "size-6"
              )}
            >
              {marker === "numbered"
                ? index + 1
                : step.icon ||
                  (index < currentStep ? (
                    <Check className={small ? "size-3" : "size-4"} />
                  ) : (
                    <span className="size-1.5 rounded-full bg-semantic-text-secondary" />
                  ))}
            </span>
          );
          return (
            <li
              key={index}
              aria-current={index === currentStep ? "step" : undefined}
              className={cn(
                "relative flex min-w-0",
                vertical
                  ? "min-h-[78px] items-stretch gap-0"
                  : "flex-1 flex-col gap-3",
                unavailable && "opacity-50"
              )}
            >
              {vertical ? (
                <>
                  <div
                    className={cn(
                      "flex shrink-0 flex-col items-center gap-1.5",
                      small ? "w-5" : "w-6 pt-1"
                    )}
                  >
                    {indicator}
                    {index < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="w-0.5 min-h-8 flex-1 rounded-full bg-semantic-border-layout"
                      />
                    )}
                  </div>
                  {onStepChange ? (
                    <button
                      type="button"
                      disabled={unavailable}
                      aria-current={index === currentStep ? "step" : undefined}
                      onClick={() => onStepChange(index)}
                      className="min-w-0 self-start rounded-lg bg-transparent p-0 focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary disabled:cursor-not-allowed"
                    >
                      {label}
                    </button>
                  ) : (
                    label
                  )}
                </>
              ) : (
                <>
                  <div className="relative flex items-center justify-center">
                    {indicator}
                    {index < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[calc(50%+24px)] right-[calc(-50%+12px)] h-0.5 rounded-full bg-semantic-border-layout"
                      />
                    )}
                  </div>
                  {onStepChange ? (
                    <button
                      type="button"
                      disabled={unavailable}
                      aria-current={index === currentStep ? "step" : undefined}
                      onClick={() => onStepChange(index)}
                      className="min-w-0 rounded-lg bg-transparent p-0 focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary disabled:cursor-not-allowed"
                    >
                      {label}
                    </button>
                  ) : (
                    label
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    );
  }
);
Stepper.displayName = "Stepper";
export { Stepper };
