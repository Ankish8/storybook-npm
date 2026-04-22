import * as React from "react";
import { cn } from "../../../lib/utils";

export interface PricingPlanCardsRowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of plan cards (used to build responsive column spans).
   * Typically matches `planCards.length`.
   */
  columnCount: number;
}

/**
 * Responsive class map: stack on small screens, 2-up from `sm`, full row on `xl`
 * (or `lg` for 3) so we avoid a horizontal scrollbar on mobile.
 * Desktop: ~32px gaps (`gap-8`); smaller gaps on narrow viewports.
 */
function planCardsResponsiveGridClass(columnCount: number): string {
  if (columnCount <= 1) {
    return "grid-cols-1";
  }
  if (columnCount === 2) {
    return "grid-cols-1 sm:grid-cols-2";
  }
  if (columnCount === 3) {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  }
  if (columnCount === 4) {
    // 1 col → 2-up from sm → single row of 4 from xl
    return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4";
  }
  if (columnCount === 5) {
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5";
  }
  // 6+ — three columns from md, six across only on very wide viewports
  return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6";
}

const PricingPlanCardsRow = React.forwardRef<
  HTMLDivElement,
  PricingPlanCardsRowProps
>(({ columnCount, className, children, ...props }, ref) => {
  if (columnCount < 1) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn("w-full min-w-0", className)}
      {...props}
    >
      <div
        data-testid="pricing-plan-cards-grid"
        className={cn(
          "grid w-full min-w-0 items-stretch",
          "gap-4 sm:gap-5 md:gap-6 lg:gap-8",
          planCardsResponsiveGridClass(columnCount)
        )}
      >
        {children}
      </div>
    </div>
  );
});

PricingPlanCardsRow.displayName = "PricingPlanCardsRow";

export { PricingPlanCardsRow };
