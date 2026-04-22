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
 * Figma `1119:3357` — **32px** between plan cards (`gap-[32px]`).
 */
function equalWidthGridClass(cardCount: number): string {
  const base =
    "grid w-full min-w-0 items-stretch gap-8 [&>div]:min-h-0 [&>div]:min-w-0";

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
  /** Figma: 3–4 plans fit the 1200px row; **5+** use horizontal scroll (no scrollbar for ≤4). */
  const scrollMode = cardCount > 4;

  return (
    <div
      ref={ref}
      className={cn(
        "w-full min-w-0",
        scrollMode
          ? "overflow-x-auto overscroll-x-contain pb-1 [scrollbar-gutter:stable]"
          : "overflow-x-hidden",
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
                "gap-8",
                "snap-x snap-mandatory sm:snap-none",
                // Figma plan card `1119:3358` — `w-[342px]`; cap by viewport on narrow screens.
                "[&>div]:snap-start [&>div]:min-h-0 [&>div]:w-[min(21.375rem,calc(100vw-3rem))] [&>div]:max-w-full [&>div]:shrink-0",
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
