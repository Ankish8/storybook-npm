import * as React from "react";
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
  /** Existing behavior allows all enabled steps. Opt in to revisiting completed steps only. */
  navigation?: "all" | "completed";
}

// CSS springs keep the registry dependency-free. The path itself is normalized,
// so dashoffset 1 → 0 draws the entire tick rather than one SVG user unit.
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
      navigation = "all",
      className,
      style,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const vertical = orientation === "vertical";
    const small = size === "sm";
    const [travel, setTravel] = React.useState({
      from: currentStep,
      to: currentStep,
    });
    // Remember the previous controlled value without an effect's extra frame.
    if (travel.to !== currentStep) {
      setTravel({ from: travel.to, to: currentStep });
    }
    const delayAt = (index: number) => {
      if (currentStep > travel.from) {
        return index >= travel.from && index < currentStep
          ? (index - travel.from) * 80
          : 0;
      }
      return index >= currentStep && index < travel.from
        ? (travel.from - index - 1) * 80
        : 0;
    };
    function handleKeyDown(event: React.KeyboardEvent<HTMLOListElement>) {
      onKeyDown?.(event);
      if (event.defaultPrevented || !onStepChange) return;
      const keys = vertical
        ? ["ArrowUp", "ArrowDown", "Home", "End"]
        : ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(event.key)) return;
      const targets = Array.from(
        event.currentTarget.querySelectorAll<HTMLButtonElement>(
          "button[data-step-action]:not(:disabled)"
        )
      );
      const at = targets.indexOf(event.target as HTMLButtonElement);
      if (at < 0) return;
      event.preventDefault();
      const rtl =
        !vertical && getComputedStyle(event.currentTarget).direction === "rtl";
      const backward = vertical
        ? event.key === "ArrowUp"
        : event.key === (rtl ? "ArrowRight" : "ArrowLeft");
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? targets.length - 1
            : Math.max(
                0,
                Math.min(targets.length - 1, at + (backward ? -1 : 1))
              );
      targets[next]?.focus();
    }
    return (
      <ol
        ref={ref}
        aria-label="Progress steps"
        className={cn(
          "m-0 max-w-full list-none p-0 font-[family-name:var(--font-v2,Inter,sans-serif)] tracking-[-0.01em] text-v2-semantic-text-primary",
          small
            ? "[--v2-stepper-marker:1.5rem]"
            : "[--v2-stepper-marker:1.75rem]",
          vertical ? "flex flex-col" : "grid",
          className
        )}
        style={
          {
            ...(vertical
              ? null
              : {
                  gridTemplateColumns:
                    steps.length > 1
                      ? `repeat(${steps.length - 1}, minmax(0, 1fr)) auto`
                      : "auto",
                }),
            "--v2-stepper-ring-delay": `${Math.max(0, Math.abs(currentStep - travel.from) - 1) * 80 + 120}ms`,
            ...style,
          } as React.CSSProperties
        }
        onKeyDown={handleKeyDown}
        {...props}
      >
        {steps.map((step, index) => {
          const complete = index < currentStep;
          const current = index === currentStep;
          const unavailable =
            disabled ||
            step.disabled ||
            (navigation === "completed" && !complete);
          const last = index === steps.length - 1;
          const showCheck = marker === "numbered" || !step.icon;
          const label = (
            <span
              className={cn(
                "flex min-w-0 flex-col rounded-lg text-start [overflow-wrap:anywhere]",
                vertical && "pt-1"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium leading-5 text-v2-semantic-text-muted transition-colors [transition-duration:240ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  small && "text-xs leading-4",
                  complete && "text-v2-semantic-text-secondary",
                  current && "text-v2-semantic-text-primary"
                )}
              >
                {step.title}
              </span>
              {step.description && (
                <span className="pt-0.5 text-xs font-normal leading-[1.4] text-v2-semantic-text-muted">
                  {step.description}
                </span>
              )}
            </span>
          );
          const indicator = (
            <span
              aria-hidden="true"
              className="relative grid size-[var(--v2-stepper-marker)] shrink-0 place-items-center"
            >
              <span
                className={cn(
                  "absolute -inset-1 rounded-full bg-[color-mix(in_oklab,var(--v2-semantic-primary,var(--semantic-primary))_10%,transparent)] transition-[transform,opacity] motion-reduce:transition-none",
                  current
                    ? "scale-100 opacity-100 [transition-delay:var(--v2-stepper-ring-delay)] [transition-duration:500ms,160ms] [transition-timing-function:linear(0,0.0689,0.216,0.3825,0.5378,0.6687,0.7719,0.8492,0.9046,0.9428,0.9681,0.9841,0.9937,0.999,1.0017,1.0028,1.003,1.0027,1.0022,1.0017,1.0013,1.0009,1.0006,1.0004,1),cubic-bezier(0.22,1,0.36,1)]"
                    : "scale-[0.6] opacity-0 [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                )}
              />
              <span
                className={cn(
                  "relative grid size-full place-items-center rounded-full bg-v2-semantic-bg-primary text-xs font-medium tabular-nums leading-none text-v2-semantic-text-muted shadow-[inset_0_0_0_1px_var(--v2-semantic-border-layout,var(--semantic-border-layout))] transition-[background-color,box-shadow,color,transform] [transition-duration:240ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  current &&
                    "text-v2-semantic-text-primary shadow-[inset_0_0_0_1.5px_var(--v2-indicator,var(--semantic-primary))]",
                  complete &&
                    "bg-v2-semantic-primary text-v2-semantic-text-inverted shadow-[inset_0_0_0_1px_var(--v2-semantic-primary,var(--semantic-primary))]",
                  onStepChange &&
                    !unavailable &&
                    "group-active:scale-[0.94] motion-reduce:group-active:scale-100",
                  onStepChange &&
                    !unavailable &&
                    complete &&
                    "[@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-v2-semantic-primary-hover"
                )}
              >
                <span
                  className={cn(
                    "col-start-1 row-start-1 grid place-items-center transition-[transform,opacity,filter] [transition-delay:var(--v2-stepper-travel-delay)] motion-reduce:transition-none",
                    complete && showCheck
                      ? "scale-50 opacity-0 blur-[2px] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                      : "scale-100 opacity-100 [filter:none] [transition-duration:500ms,160ms,160ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
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
                      "col-start-1 row-start-1 grid place-items-center transition-[transform,opacity,filter] [transition-delay:var(--v2-stepper-travel-delay)] motion-reduce:transition-none",
                      complete
                        ? "scale-100 opacity-100 [filter:none] [transition-duration:500ms,160ms,160ms] [transition-timing-function:linear(0,0.0689,0.216,0.3825,0.5378,0.6687,0.7719,0.8492,0.9046,0.9428,0.9681,0.9841,0.9937,0.999,1.0017,1.0028,1.003,1.0027,1.0022,1.0017,1.0013,1.0009,1.0006,1.0004,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1)]"
                        : "scale-50 opacity-0 blur-[2px] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                    )}
                  >
                    <svg
                      className={small ? "size-3" : "size-3.5"}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M5.5 12.5l4.25 4.25L18.5 8"
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={complete ? 0 : 1}
                        className={cn(
                          "transition-[stroke-dashoffset] [transition-duration:300ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                          complete
                            ? "[transition-delay:calc(var(--v2-stepper-travel-delay)_+_40ms)]"
                            : "[transition-delay:var(--v2-stepper-travel-delay)]"
                        )}
                      />
                    </svg>
                  </span>
                )}
              </span>
            </span>
          );
          const headClass = cn(
            "min-w-0",
            vertical
              ? "grid grid-cols-[var(--v2-stepper-marker)_minmax(0,1fr)] items-start gap-x-3"
              : "flex flex-col items-start gap-3"
          );
          return (
            <li
              key={index}
              aria-current={current ? "step" : undefined}
              data-state={
                complete ? "complete" : current ? "current" : "upcoming"
              }
              className={cn(
                "relative min-w-0",
                !last && (vertical ? "pb-5" : "pe-4"),
                (disabled || step.disabled) && "opacity-50"
              )}
              style={
                {
                  "--v2-stepper-travel-delay": `${delayAt(index)}ms`,
                } as React.CSSProperties
              }
            >
              {!last && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute overflow-hidden rounded-full bg-v2-semantic-border-layout",
                    vertical
                      ? "bottom-[calc(0.25rem_+_2px)] start-[calc(var(--v2-stepper-marker)/2_-_1px)] top-[calc(var(--v2-stepper-marker)_+_0.25rem_+_2px)] w-0.5"
                      : "start-[calc(var(--v2-stepper-marker)_+_0.5rem)] end-2 top-[calc(var(--v2-stepper-marker)/2_-_1px)] h-0.5"
                  )}
                >
                  <span
                    key={orientation}
                    className={cn(
                      "absolute inset-0 rounded-full bg-[var(--v2-indicator,var(--semantic-primary))] transition-transform [transition-duration:700ms] [transition-delay:var(--v2-stepper-travel-delay)] [transition-timing-function:linear(0,0.0432,0.1402,0.2575,0.3764,0.4867,0.584,0.667,0.7361,0.7925,0.838,0.8743,0.9029,0.9254,0.9428,0.9564,0.9668,0.9748,0.9809,0.9856,0.9892,0.9918,0.9939,0.9954,0.9966,0.9974,0.9981,0.9986,1)] motion-reduce:transition-none",
                      vertical ? "origin-top" : "origin-left rtl:origin-right",
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
              {onStepChange ? (
                <button
                  type="button"
                  disabled={unavailable}
                  data-step-action=""
                  aria-current={current ? "step" : undefined}
                  aria-description={
                    complete
                      ? "Completed"
                      : current
                        ? "Current step"
                        : "Not started"
                  }
                  onClick={() => onStepChange(index)}
                  className={cn(
                    headClass,
                    "group w-full rounded-lg border-0 bg-transparent p-0 text-start focus-visible:outline focus-visible:[outline-width:2px] focus-visible:outline-offset-2 focus-visible:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))] disabled:cursor-default"
                  )}
                >
                  {indicator}
                  {label}
                </button>
              ) : (
                <span className={headClass}>
                  {indicator}
                  {label}
                </span>
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
