import * as React from "react"
import { cn } from "../../../lib/utils"

export type IntegrationAssistantSectionProps =
  React.HTMLAttributes<HTMLDivElement>

/**
 * Layout wrapper for the assistant strip, transcript, and composer.
 * Use inside any container (page, panel, modal body).
 */
const IntegrationAssistantSection = React.forwardRef<
  HTMLDivElement,
  IntegrationAssistantSectionProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-h-0 flex-1 flex-col", className)}
    {...props}
  />
))
IntegrationAssistantSection.displayName = "IntegrationAssistantSection"

export { IntegrationAssistantSection }
