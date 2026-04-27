import * as React from "react";
import { cn } from "../../../lib/utils";

/** @see maintainer note on `pricing-page.tsx` — regenerate CLI registry after edits. */

const SCROLL_CARD_GAP_PX = 32;

export interface PricingPlanCardsRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Column slots for the grid (from `planCardColumnCount` / `planCards.length`
   * on `PricingPage`). With 1-4 child cards, this controls responsive columns
   * (capped at 4). With 5+ cards, the row switches to horizontal scroll.
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
 * One plan: full-width featured card so the page does not look empty.
 * Two plans: balanced two-up grid with wider cards. Three or more plans:
 * fall through to a normal column grid.
 */
function equalWidthGridClass(gridColumns: number, cardCount: number): string {
  if (cardCount === 1) {
    return cn(
      equalWidthGridBase,
      "grid-cols-1",
      "[&>div]:w-full [&>div]:max-w-full"
    );
  }
  if (cardCount === 2) {
    return cn(
      equalWidthGridBase,
      "grid-cols-1 min-[640px]:grid-cols-2",
      "[&>div]:w-full [&>div]:max-w-full"
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
>(
  (
    { columnCount, className, showPagination = true, children, ...props },
    ref
  ) => {
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
        columnCount={columnCount}
        layoutColumnCount={scrollMode ? cardCount : gridColumns}
        showPagination={showPagination}
        equalWidthClass={
          scrollMode ? "" : equalWidthGridClass(gridColumns, cardCount)
        }
        {...props}
      >
        {children}
      </PricingPlanCardsRowScrollWithDots>
    );
  }
);

type RowInnerProps = {
  children: React.ReactNode;
  scrollMode: boolean;
  cardCount: number;
  columnCount: number;
  layoutColumnCount: number;
  showPagination: boolean;
  equalWidthClass: string;
} & React.HTMLAttributes<HTMLDivElement>;

const PricingPlanCardsRowScrollWithDots = React.forwardRef<
  HTMLDivElement,
  RowInnerProps
>(
  (
    {
      scrollMode,
      cardCount,
      columnCount,
      layoutColumnCount,
      showPagination,
      equalWidthClass,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const scrollerRef = React.useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const showDots = scrollMode && showPagination && cardCount > 1;

    const setScrollRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        scrollerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    const updateActiveFromScroll = React.useCallback(() => {
      if (!scrollMode) return;
      const scroller = scrollerRef.current;
      const track = scroller?.querySelector<HTMLElement>(
        '[data-testid="pricing-plan-cards-grid"]'
      );
      const firstCard = track?.firstElementChild as
        | HTMLElement
        | null
        | undefined;
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
        '[data-testid="pricing-plan-cards-grid"]'
      );
      const el = track?.children[index] as HTMLElement | undefined;
      if (el && scroller) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
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
            data-column-count={columnCount}
            data-layout-column-count={layoutColumnCount}
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
  }
);

PricingPlanCardsRowScrollWithDots.displayName =
  "PricingPlanCardsRowScrollWithDots";

PricingPlanCardsRow.displayName = "PricingPlanCardsRow";

export { PricingPlanCardsRow };
