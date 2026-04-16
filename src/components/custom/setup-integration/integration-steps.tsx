import * as React from "react"
import { cn } from "../../../lib/utils"

export type IntegrationStepsProps =
  React.HTMLAttributes<HTMLParagraphElement>

const IntegrationSteps = React.forwardRef<HTMLParagraphElement, IntegrationStepsProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "m-0 text-xs tracking-wide text-semantic-text-muted",
        className
      )}
      {...props}
    />
  )
)
IntegrationSteps.displayName = "IntegrationSteps"

export { IntegrationSteps }
