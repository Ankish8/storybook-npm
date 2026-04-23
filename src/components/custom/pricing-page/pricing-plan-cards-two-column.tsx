import * as React from "react";
import { cn } from "../../../lib/utils";

/** @see maintainer note on `pricing-page.tsx` — regenerate CLI registry after edits. */

/**
 * Two column responsive grid of plan cards: **1** column on narrow viewports, **2** from `min-[480px]`
 * up (**32px** gap, Figma `1119:3357`). Extra cards wrap to new rows — no horizontal scroll, even
 * with **5+** plans.
 *
 * **Registry / `tw-` prefix:** layout classes use `cn("...")` so `generate-registry` applies `tw-`.
 */
const twoColumnGrid = cn(
  "grid w-full min-w-0 max-w-full min-[480px]:grid-cols-2 grid-cols-1 items-stretch gap-8 overflow-x-hidden [&>div]:min-h-0 [&>div]:min-w-0"
);

export type PricingPlanCardsTwoColumnProps =
  React.HTMLAttributes<HTMLDivElement>;

const PricingPlanCardsTwoColumn = React.forwardRef<
  HTMLDivElement,
  PricingPlanCardsTwoColumnProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-testid="pricing-plan-cards-grid"
    data-pricing-plans-layout="two-column"
    className={cn(twoColumnGrid, className)}
    {...props}
  >
    {children}
  </div>
));

PricingPlanCardsTwoColumn.displayName = "PricingPlanCardsTwoColumn";

export { PricingPlanCardsTwoColumn };
