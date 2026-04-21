import * as React from "react";
import { cn } from "../../../lib/utils";

export interface PricingPlanCardsRowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of equal-width columns in a single row. Typically matches
   * `planCards.length` so every plan appears in one row with consistent width.
   */
  columnCount: number;
}

/**
 * Lays out plan cards in one horizontal row: equal-width columns that scale with
 * the container, with horizontal scrolling on narrow viewports when the row
 * cannot fit. Does not alter {@link PricingCard} styling — only outer layout.
 */
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
      className={cn(
        "w-full max-w-[1091px] mx-auto overflow-x-auto",
        className
      )}
      {...props}
    >
      <div
        data-testid="pricing-plan-cards-grid"
        className="grid w-full min-w-0 gap-4 sm:gap-6 md:gap-8"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(240px, 1fr))`,
        }}
      >
        {children}
      </div>
    </div>
  );
});

PricingPlanCardsRow.displayName = "PricingPlanCardsRow";

export { PricingPlanCardsRow };
