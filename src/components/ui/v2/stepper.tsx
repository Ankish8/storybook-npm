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
// Arc's springs ("snappy" 0.26s/0.12 and "smooth" 0.4s/0) are sampled as linear() easings, since this stepper is plain CSS.
// The marker is 28px (Arc) at md and 24px at sm; the 4px halo ring and the 2px connector keep their Arc proportions.
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
      style,
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
          "m-0 max-w-full list-none p-0 font-[family-name:var(--font-v2,Inter,sans-serif)] tracking-[-0.01em] text-[var(--v2-text-primary,#484848)]",
          small
            ? "[--v2-stepper-marker:1.5rem]"
            : "[--v2-stepper-marker:1.75rem]",
          vertical ? "flex flex-col" : "grid",
          className
        )}
        style={{
          // Horizontal steps share the width equally; the last one only takes what its label needs.
          ...(vertical
            ? null
            : {
                gridTemplateColumns:
                  steps.length > 1
                    ? `repeat(${steps.length - 1}, minmax(0, 1fr)) auto`
                    : "auto",
              }),
          ...style,
        }}
        {...props}
      >
        {steps.map((step, index) => {
          const unavailable = disabled || step.disabled;
          const complete = index < currentStep;
          const current = index === currentStep;
          const last = index === steps.length - 1;
          const label = (
            <div
              className={cn(
                "flex min-w-0 flex-col rounded-lg text-left",
                vertical && "pt-1"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium leading-5 text-[var(--v2-text-muted,#707070)] transition-colors [transition-duration:240ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  small && "text-xs leading-4",
                  complete && "text-[var(--v2-text-secondary,#5E5E5E)]",
                  current && "text-[var(--v2-text-primary,#484848)]"
                )}
              >
                {step.title}
              </span>
              {step.description && (
                <span className="pt-0.5 text-xs font-normal leading-[1.4] text-[var(--v2-text-muted,#707070)]">
                  {step.description}
                </span>
              )}
            </div>
          );
          // The number (or icon / dot) and the check share one spot: the check pops in and draws its stroke as the
          // step completes while the number shrinks away. A custom icon stays put.
          const showCheck = marker === "numbered" || !step.icon;
          const indicator = (
            <span
              aria-hidden="true"
              className="relative grid size-[var(--v2-stepper-marker)] shrink-0 place-items-center"
            >
              <span
                className={cn(
                  "absolute -inset-1 rounded-full bg-[color-mix(in_oklab,var(--semantic-primary)_10%,transparent)] transition-[transform,opacity] motion-reduce:transition-none",
                  current
                    ? "scale-100 opacity-100 [transition-delay:120ms,120ms] [transition-duration:500ms,160ms] [transition-timing-function:linear(0,0.0689,0.216,0.3825,0.5378,0.6687,0.7719,0.8492,0.9046,0.9428,0.9681,0.9841,0.9937,0.999,1.0017,1.0028,1.003,1.0027,1.0022,1.0017,1.0013,1.0009,1.0006,1.0004,1),cubic-bezier(0.22,1,0.36,1)]"
                    : "scale-[0.6] opacity-0 [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                )}
              />
              <span
                className={cn(
                  "relative grid size-full place-items-center rounded-full bg-semantic-bg-primary text-xs font-medium tabular-nums leading-none text-[var(--v2-text-muted,#707070)] shadow-[inset_0_0_0_1px_var(--color-neutral-300,#D5D7DA)] transition-[background-color,box-shadow,color] [transition-duration:240ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  current &&
                    "text-[var(--v2-text-primary,#484848)] shadow-[inset_0_0_0_1.5px_var(--semantic-primary)]",
                  complete &&
                    "bg-semantic-primary text-semantic-text-inverted shadow-[inset_0_0_0_1px_var(--semantic-primary)]"
                )}
              >
                <span
                  className={cn(
                    "col-start-1 row-start-1 grid place-items-center transition-[transform,opacity,filter] motion-reduce:transition-none",
                    complete && showCheck
                      ? "scale-50 opacity-0 blur-[2px] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                      : "scale-100 opacity-100 [filter:none] [transition-duration:500ms,160ms,160ms] [transition-timing-function:linear(0,0.0689,0.216,0.3825,0.5378,0.6687,0.7719,0.8492,0.9046,0.9428,0.9681,0.9841,0.9937,0.999,1.0017,1.0028,1.003,1.0027,1.0022,1.0017,1.0013,1.0009,1.0006,1.0004,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1)]"
                  )}
                >
                  {marker === "numbered"
                    ? index + 1
                    : step.icon || (
                        <span className="size-1.5 rounded-full bg-current" />
                      )}
                </span>
                {showCheck && (
                  <span
                    className={cn(
                      "col-start-1 row-start-1 grid place-items-center transition-[transform,opacity,filter] motion-reduce:transition-none",
                      complete
                        ? "scale-100 opacity-100 [filter:none] [transition-duration:500ms,160ms,160ms] [transition-timing-function:linear(0,0.0689,0.216,0.3825,0.5378,0.6687,0.7719,0.8492,0.9046,0.9428,0.9681,0.9841,0.9937,0.999,1.0017,1.0028,1.003,1.0027,1.0022,1.0017,1.0013,1.0009,1.0006,1.0004,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1)]"
                        : "scale-50 opacity-0 blur-[2px] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                    )}
                  >
                    <Check
                      className={small ? "size-3" : "size-3.5"}
                      strokeWidth={2.5}
                      pathLength={1}
                      // The stroke draws itself 40ms after the glyph starts to pop.
                      style={{
                        strokeDasharray: 1,
                        strokeDashoffset: complete ? 0 : 1,
                        transition: `stroke-dashoffset 240ms cubic-bezier(0.16,1,0.3,1) ${complete ? 40 : 0}ms`,
                      }}
                    />
                  </span>
                )}
              </span>
            </span>
          );
          const head = (
            <>
              {indicator}
              {onStepChange ? (
                <button
                  type="button"
                  disabled={unavailable}
                  aria-current={current ? "step" : undefined}
                  onClick={() => onStepChange(index)}
                  className="min-w-0 self-start rounded-lg bg-transparent p-0 focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-2 focus-visible:outline-semantic-primary disabled:cursor-not-allowed"
                >
                  {label}
                </button>
              ) : (
                label
              )}
            </>
          );
          return (
            <li
              key={index}
              aria-current={current ? "step" : undefined}
              className={cn(
                "relative min-w-0",
                vertical
                  ? "grid grid-cols-[var(--v2-stepper-marker)_minmax(0,1fr)] items-start gap-x-3"
                  : "flex flex-col items-start gap-3",
                // Room for the connector: 16px to the next step across, 20px between rows down.
                !last && (vertical ? "pb-5" : "pr-4"),
                unavailable && "opacity-50"
              )}
            >
              {!last && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute overflow-hidden rounded-full bg-semantic-border-layout",
                    vertical
                      ? "bottom-[calc(0.25rem_+_2px)] left-[calc(var(--v2-stepper-marker)/2_-_1px)] top-[calc(var(--v2-stepper-marker)_+_0.25rem_+_2px)] w-0.5"
                      : "left-[calc(var(--v2-stepper-marker)_+_0.5rem)] right-2 top-[calc(var(--v2-stepper-marker)/2_-_1px)] h-0.5"
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full bg-semantic-primary transition-transform [transition-duration:700ms] [transition-timing-function:linear(0,0.0432,0.1402,0.2575,0.3764,0.4867,0.584,0.667,0.7361,0.7925,0.838,0.8743,0.9029,0.9254,0.9428,0.9564,0.9668,0.9748,0.9809,0.9856,0.9892,0.9918,0.9939,0.9954,0.9966,0.9974,0.9981,0.9986,1)] motion-reduce:transition-none",
                      vertical ? "origin-top" : "origin-left",
                      complete
                        ? vertical
                          ? "scale-y-100"
                          : "scale-x-100"
                        : vertical
                          ? "scale-y-0"
                          : "scale-x-0"
                    )}
                  />
                </span>
              )}
              {head}
            </li>
          );
        })}
      </ol>
    );
  }
);
Stepper.displayName = "Stepper";
export { Stepper };
