import * as React from "react";
import { cn } from "../../../lib/utils";

/** @see maintainer note on `pricing-page.tsx` — regenerate CLI registry after edits. */

/**
 * Single column stack of plan cards (**32px** gap). Cards keep the same
 * readable width used by the default plan grid instead of stretching full row.
 *
 * **Registry / `tw-` prefix:** layout classes use `cn("...")` so `generate-registry` applies `tw-`.
 */
const oneColumnGrid = cn(
  "grid w-full min-w-0 max-w-full grid-cols-1 justify-items-center gap-8 overflow-x-hidden [&>div]:min-h-0 [&>div]:min-w-0 [&>div]:w-full [&>div]:max-w-[min(21.375rem,100%)]"
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
