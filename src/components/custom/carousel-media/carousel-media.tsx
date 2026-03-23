import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { Reply, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { CarouselMediaProps } from "./types";

const CarouselMedia = React.forwardRef<HTMLDivElement, CarouselMediaProps>(
  ({ className, cards, cardWidth = 260, imageHeight = 200, ...props }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(
      (cards?.length || 0) > 1
    );

    const updateScrollState = useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(
        el.scrollLeft < el.scrollWidth - el.clientWidth - 5
      );
    }, []);

    const scroll =
      (dir: "left" | "right") => (e: React.MouseEvent) => {
        e.stopPropagation();
        const scrollAmount = cardWidth + 12;
        scrollRef.current?.scrollBy({
          left: dir === "right" ? scrollAmount : -scrollAmount,
          behavior: "smooth",
        });
        setTimeout(updateScrollState, 350);
      };

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-3 overflow-x-auto px-3 pt-2 pb-3"
          style={{ scrollbarWidth: "none" }}
        >
          {cards?.map((card, i) => (
            <div
              key={i}
              className="shrink-0 bg-white rounded border border-semantic-border-layout overflow-hidden shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08)]"
              style={{ width: cardWidth }}
            >
              <img
                src={card.url}
                alt={card.title}
                className="w-full object-cover"
                style={{ height: imageHeight }}
              />
              <div className="px-3 pt-2.5 pb-2">
                <p className="m-0 text-[14px] font-semibold text-semantic-text-primary line-clamp-2">
                  {card.title}
                </p>
              </div>
              {card.buttons?.map((btn, j) => (
                <button
                  key={j}
                  onClick={btn.onClick}
                  className="flex items-center justify-center gap-2 w-full border-t border-semantic-border-layout text-[13px] font-semibold text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
                  style={{ height: 40 }}
                >
                  {btn.icon === "reply" && <Reply className="size-4" />}
                  {btn.icon === "link" && <ExternalLink className="size-4" />}
                  {btn.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {canScrollLeft && (
          <button
            onClick={scroll("left")}
            aria-label="Scroll left"
            className="absolute left-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors"
          >
            <ChevronLeft className="size-4 text-semantic-text-primary" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={scroll("right")}
            aria-label="Scroll right"
            className="absolute right-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center cursor-pointer hover:bg-semantic-bg-hover transition-colors"
          >
            <ChevronRight className="size-4 text-semantic-text-primary" />
          </button>
        )}
      </div>
    );
  }
);

CarouselMedia.displayName = "CarouselMedia";

export { CarouselMedia };
