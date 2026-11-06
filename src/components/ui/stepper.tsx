import * as React from "react"
import { cva } from "class-variance-authority"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Circle indicator. Pending and current share the muted look (per Figma);
 * completed swaps to a larger success-tinted circle holding a check icon.
 */
const stepperIndicatorVariants = cva(
  "flex shrink-0 items-center justify-center overflow-hidden rounded-full",
  {
    variants: {
      status: {
        pending:
          "size-5 bg-semantic-text-placeholder text-xs font-semibold text-semantic-text-inverted",
        current:
          "size-5 bg-semantic-text-placeholder text-xs font-semibold text-semantic-text-inverted",
        completed: "size-6 bg-semantic-success-surface",
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
      pending: "text-semantic-text-placeholder",
      current: "text-semantic-text-placeholder",
      completed: "text-semantic-text-primary",
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
                    className="size-4 text-semantic-success-primary"
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
