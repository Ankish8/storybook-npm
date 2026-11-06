import * as React from "react"
import { cva } from "class-variance-authority"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Circle indicator (20px for every status, per Figma).
 * - current: white fill, dark outline, dark number
 * - pending: transparent, light outline (primary-100 #C0C3CA — no semantic token), muted number
 * - completed: solid dark fill holding a white check
 */
const stepperIndicatorVariants = cva(
  "flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full border-[0.8px] border-solid text-xs font-semibold",
  {
    variants: {
      status: {
        pending:
          "border-[var(--color-primary-100)] bg-transparent text-semantic-text-muted",
        current:
          "border-semantic-border-primary bg-semantic-bg-primary text-semantic-text-secondary",
        completed:
          "border-semantic-text-secondary bg-semantic-text-secondary text-semantic-text-inverted",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
)

const stepperLabelVariants = cva("m-0 whitespace-nowrap text-sm font-semibold leading-5", {
  variants: {
    status: {
      pending: "text-semantic-text-muted",
      current: "text-semantic-text-secondary",
      completed: "text-semantic-text-muted",
    },
  },
  defaultVariants: {
    status: "pending",
  },
})

export type StepperStatus = "pending" | "current" | "completed"

export interface StepperStep {
  /** Unique key for the step. Falls back to the index. */
  id?: string
  /** Step label, e.g. "Call Flow" */
  label: React.ReactNode
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  /** Ordered steps */
  steps: StepperStep[]
  /** Zero-based index of the current step. Earlier steps render as completed. */
  currentStep?: number
}

/**
 * Horizontal multi-step progress indicator with completed, current and pending steps.
 *
 * @example
 * ```tsx
 * <Stepper
 *   steps={[{ label: "Call Flow" }, { label: "Campaign Details" }]}
 *   currentStep={1}
 * />
 * ```
 */
const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  ({ className, steps, currentStep = 0, ...props }, ref) => (
    <ol
      ref={ref}
      aria-label="Progress"
      className={cn(
        "m-0 flex h-12 list-none items-center gap-3 overflow-x-auto border-0 border-b border-solid border-semantic-border-layout bg-semantic-bg-primary px-4 py-2 sm:px-6",
        className
      )}
      {...props}
    >
      {steps.map((step, index) => {
        const status: StepperStatus =
          index < currentStep
            ? "completed"
            : index === currentStep
              ? "current"
              : "pending"
        return (
          <React.Fragment key={step.id ?? index}>
            {index > 0 && (
              <li
                role="presentation"
                aria-hidden="true"
                data-slot="connector"
                className="h-px w-10 shrink-0 bg-semantic-border-layout"
              />
            )}
            <li
              data-status={status}
              aria-current={status === "current" ? "step" : undefined}
              className="flex shrink-0 items-center gap-2"
            >
              <span className={stepperIndicatorVariants({ status })}>
                {status === "completed" ? (
                  <Check
                    aria-hidden="true"
                    strokeWidth={3}
                    className="size-2.5"
                  />
                ) : (
                  index + 1
                )}
              </span>
              <p className={cn("m-0", stepperLabelVariants({ status }))}>
                {step.label}
              </p>
              {status === "completed" && (
                <span className="sr-only">(completed)</span>
              )}
            </li>
          </React.Fragment>
        )
      })}
    </ol>
  )
)
Stepper.displayName = "Stepper"

export { Stepper, stepperIndicatorVariants, stepperLabelVariants }
