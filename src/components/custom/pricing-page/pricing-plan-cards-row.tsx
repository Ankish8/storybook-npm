import * as React from "react";
import { cn } from "../../../lib/utils";

/** @see maintainer note on `pricing-page.tsx` — regenerate CLI registry after edits. */

const SCROLL_CARD_GAP_PX = 32;

export interface PricingPlanCardsRowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Column slots for the grid (from `planCardColumnCount` / `planCards.length` on `PricingPage`).
   * With **1–4** child cards, the row uses a responsive grid with this many columns (capped at 4)
   * so e.g. two plans can still use a **4-column** layout when `columnCount` is 4.
   * With **5+** children, this prop is ignored and cards use **horizontal scroll** (5th+ off-screen
   * until the user scrolls).
   */
  columnCount: number;
  /**
   * When **true** (default) and the row is in horizontal **scroll** mode (5+ cards), shows dot
   * pagination under the row and syncs the active dot with scroll position.
   */
  showPagination?: boolean;
}

/**
 * Equal `minmax(0,1fr)` columns: up to **4** columns; stack on small screens for readability.
 * Figma `1119:3357` — **32px** between plan cards (`gap-8`). Cards fill their grid track under the
 * plan max-width column so horizontal spacing is **only** the gutter, not side margins on each card.
 *
 * **Registry / `tw-` prefix:** The shared grid “base” must use `cn("...")`, not a raw string, so
 * `npm run generate-registry` prefixes it for host apps with `prefix: "tw-"`. See `pricing-page.tsx` note.
 */
const equalWidthGridBase = cn(
  "grid w-full min-w-0 items-stretch gap-8 [&>div]:min-h-0 [&>div]:min-w-0"
);

/**
 * One plan: 3-col grid on `md+` with the card in the **middle** column (matches Figma 3-card slot width
 * so it does not stretch full width). Narrow viewports: same max width as a grid track, centered.
 * Two plans: `flex` row with **1/3**-row card width and **gap-8** so the pair stays **centered** (not
 * 50% / 50% of the full row). Three or more plans: fall through to a normal column grid.
 */
function equalWidthGridClass(gridColumns: number, cardCount: number): string {
  if (cardCount === 1) {
    return cn(
      equalWidthGridBase,
      "grid-cols-1 justify-items-stretch md:grid-cols-3",
      "[&>div]:w-full [&>div]:max-w-[min(21.375rem,100%)] md:[&>div]:max-w-none",
      "[&>div]:mx-auto md:[&>div]:col-span-1 md:[&>div]:col-start-2",
      "md:[&>div]:flex-none"
    );
  }
  if (cardCount === 2) {
    return cn(
      "flex w-full min-w-0 min-[480px]:flex-row min-[480px]:flex-nowrap min-[480px]:justify-center",
      "flex-col items-stretch justify-center gap-8",
      "[&>div]:min-h-0 [&>div]:min-w-0",
      "[&>div]:w-full [&>div]:min-[480px]:w-[min(21.375rem,calc((100%-4rem)/3))] [&>div]:min-[480px]:shrink-0",
      "[&>div]:min-[480px]:flex-none"
    );
  }
  if (gridColumns <= 1) {
    return cn(equalWidthGridBase, "grid-cols-1");
  }
  if (gridColumns === 2) {
    return cn(equalWidthGridBase, "grid-cols-1 min-[480px]:grid-cols-2");
  }
  if (gridColumns === 3) {
    return cn(equalWidthGridBase, "grid-cols-1 md:grid-cols-3");
  }
  // gridColumns === 4 — one row of four from `md` up (3–4 plans in a single row on wide viewports)
  return cn(equalWidthGridBase, "grid-cols-1 md:grid-cols-4");
}

const PricingPlanCardsRow = React.forwardRef<
  HTMLDivElement,
  PricingPlanCardsRowProps
>(({ columnCount, className, showPagination = true, children, ...props }, ref) => {
  if (columnCount < 1) {
    return null;
  }

  const cardCount = React.Children.toArray(children).length;
  if (cardCount < 1) {
    return null;
  }

  /** **5+** plans: horizontal scroll; cards 1–4 stay in a single grid row from `md` (see `equalWidthGridClass`). */
  const scrollMode = cardCount > 4;

  const gridColumns = scrollMode
    ? 0
    : Math.min(Math.max(columnCount, cardCount), 4);

  return (
    <PricingPlanCardsRowScrollWithDots
      ref={ref}
      className={className}
      scrollMode={scrollMode}
      cardCount={cardCount}
      showPagination={showPagination}
      equalWidthClass={scrollMode ? "" : equalWidthGridClass(gridColumns, cardCount)}
      {...props}
    >
      {children}
    </PricingPlanCardsRowScrollWithDots>
  );
});

type RowInnerProps = {
  children: React.ReactNode;
  scrollMode: boolean;
  cardCount: number;
  showPagination: boolean;
  equalWidthClass: string;
} & React.HTMLAttributes<HTMLDivElement>;

const PricingPlanCardsRowScrollWithDots = React.forwardRef<
  HTMLDivElement,
  RowInnerProps
>(({ scrollMode, cardCount, showPagination, equalWidthClass, className, children, ...props }, ref) => {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const showDots =
    scrollMode && showPagination && cardCount > 1;

  const setScrollRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      scrollerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref]
  );

  const updateActiveFromScroll = React.useCallback(() => {
    if (!scrollMode) return;
    const scroller = scrollerRef.current;
    const track = scroller?.querySelector<HTMLElement>(
      "[data-testid=\"pricing-plan-cards-grid\"]"
    );
    const firstCard = track?.firstElementChild as HTMLElement | null | undefined;
    if (!scroller || !firstCard) return;
    const step = firstCard.offsetWidth + SCROLL_CARD_GAP_PX;
    if (step <= 0) return;
    const i = Math.round(scroller.scrollLeft / step);
    setActiveIndex(Math.min(Math.max(0, i), cardCount - 1));
  }, [scrollMode, cardCount]);

  React.useEffect(() => {
    if (!showDots) return;
    updateActiveFromScroll();
  }, [showDots, updateActiveFromScroll, children]);

  const goToIndex = (index: number) => {
    const scroller = scrollerRef.current;
    const track = scroller?.querySelector<HTMLElement>(
      "[data-testid=\"pricing-plan-cards-grid\"]"
    );
    const el = track?.children[index] as HTMLElement | undefined;
    if (el && scroller) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  };

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col">
      <div
        ref={setScrollRef}
        onScroll={scrollMode ? updateActiveFromScroll : undefined}
        className={cn(
          "w-full min-w-0",
          scrollMode
            ? "overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-gutter:stable]"
            : "overflow-x-hidden",
          className
        )}
        role={scrollMode ? "region" : undefined}
        aria-label={scrollMode ? "Plan options" : undefined}
        {...props}
      >
        <div
          data-testid="pricing-plan-cards-grid"
          data-pricing-plans-layout={scrollMode ? "scroll" : "grid"}
          className={cn(
            scrollMode
              ? [
                  "flex w-max min-w-full flex-nowrap items-stretch",
                  "gap-8",
                  "snap-x snap-mandatory sm:snap-none",
                  "[&>div]:snap-start [&>div]:min-h-0 [&>div]:w-[min(21.375rem,calc(100vw-3rem))] [&>div]:max-w-full [&>div]:shrink-0",
                ]
              : equalWidthClass
          )}
        >
          {children}
        </div>
      </div>
      {showDots && (
        <nav
          className="mt-3 flex w-full min-w-0 items-center justify-center gap-1.5 pb-0 pt-1"
          aria-label="Plan card pages"
          data-testid="pricing-plan-cards-pagination"
        >
          {Array.from({ length: cardCount }, (_, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                "size-2.5 min-h-[10px] min-w-[10px] rounded-full border-0 p-0 transition-colors",
                "focus-visible:ring-2 focus-visible:ring-semantic-border-focus focus-visible:ring-offset-2 focus-visible:outline-none",
                i === activeIndex
                  ? "bg-semantic-primary"
                  : "bg-semantic-border-layout hover:bg-semantic-text-muted"
              )}
              aria-label={`Show plan ${i + 1} of ${cardCount}`}
              aria-current={i === activeIndex ? "true" : undefined}
              onClick={() => goToIndex(i)}
            />
          ))}
        </nav>
      )}
    </div>
  );
});

PricingPlanCardsRowScrollWithDots.displayName = "PricingPlanCardsRowScrollWithDots";

PricingPlanCardsRow.displayName = "PricingPlanCardsRow";

export { PricingPlanCardsRow };
