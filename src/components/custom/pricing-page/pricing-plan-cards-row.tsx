import * as React from "react";
import { cn } from "../../../lib/utils";

export interface PricingPlanCardsRowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of plan cards (used for validation). Typically matches `planCards.length`.
   * **1–4 cards:** full-width grid (3/4 across one row from `md` up). **5+:** horizontal scroll.
   */
  columnCount: number;
}

/**
 * Equal `minmax(0,1fr)` columns: full width on `md+`; stack on small screens for readability.
 * Gaps: 16px → 24px for `sm+` to match the 24px spec on tablet/desktop.
 */
function equalWidthGridClass(cardCount: number): string {
  const base =
    "grid w-full min-w-0 items-stretch gap-4 sm:gap-6 [&>div]:min-h-0 [&>div]:min-w-0";

  if (cardCount === 1) {
    return cn(base, "grid-cols-1");
  }
  if (cardCount === 2) {
    return cn(
      base,
      "min-[480px]:grid-cols-2 grid-cols-1"
    );
  }
  if (cardCount === 3) {
    return cn(
      base,
      "md:grid-cols-3 grid-cols-1"
    );
  }
  if (cardCount === 4) {
    // Same as three-up: one column on small screens, four equal `fr` columns from `md` up.
    return cn(base, "md:grid-cols-4 grid-cols-1");
  }
  return base;
}

const PricingPlanCardsRow = React.forwardRef<
  HTMLDivElement,
  PricingPlanCardsRowProps
>(({ columnCount, className, children, ...props }, ref) => {
  if (columnCount < 1) {
    return null;
  }

  const cardCount = React.Children.toArray(children).length;
  if (cardCount < 1) {
    return null;
  }
  /** Scroll only when more than four cards. */
  const scrollMode = cardCount > 4;

  return (
    <div
      ref={ref}
      className={cn(
        "w-full min-w-0",
        scrollMode &&
          "overflow-x-auto overscroll-x-contain pb-1 [scrollbar-gutter:stable]",
        className
      )}
      {...props}
    >
      <div
        data-testid="pricing-plan-cards-grid"
        className={cn(
          scrollMode
            ? [
                "flex w-max min-w-full flex-nowrap items-stretch",
                "gap-4 sm:gap-6",
                "snap-x snap-mandatory sm:snap-none",
                "[&>div]:snap-start [&>div]:min-h-0 [&>div]:min-w-0 [&>div]:w-[min(20rem,calc(100vw-2rem))] sm:[&>div]:w-[min(21.375rem,calc(100vw-3rem))] [&>div]:max-w-full [&>div]:shrink-0",
              ]
            : equalWidthGridClass(cardCount)
        )}
      >
        {children}
      </div>
    </div>
  );
});

PricingPlanCardsRow.displayName = "PricingPlanCardsRow";

export { PricingPlanCardsRow };
