import * as React from "react";
import { cn } from "../../../lib/utils";

/** @see maintainer note on `pricing-page.tsx` — regenerate CLI registry after edits. */

/**
 * Single column stack of plan cards (**32px** gap, Figma `1119:3357`). All cards stay in one
 * vertical column at every breakpoint — use when you want a reading order stack instead of the
 * default row (multi-column grid or horizontal scroll for 5+ plans).
 *
 * **Registry / `tw-` prefix:** layout classes use `cn("...")` so `generate-registry` applies `tw-`.
 */
const oneColumnGrid = cn(
  "grid w-full min-w-0 max-w-full grid-cols-1 items-stretch gap-8 overflow-x-hidden [&>div]:min-h-0 [&>div]:min-w-0"
);

export type PricingPlanCardsOneColumnProps =
  React.HTMLAttributes<HTMLDivElement>;

const PricingPlanCardsOneColumn = React.forwardRef<
  HTMLDivElement,
  PricingPlanCardsOneColumnProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-testid="pricing-plan-cards-grid"
    data-pricing-plans-layout="one-column"
    className={cn(oneColumnGrid, className)}
    {...props}
  >
    {children}
  </div>
));

PricingPlanCardsOneColumn.displayName = "PricingPlanCardsOneColumn";

export { PricingPlanCardsOneColumn };
