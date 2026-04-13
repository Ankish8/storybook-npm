import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { Reply, ExternalLink, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { CarouselCard, CarouselMediaProps } from "./types";

/* ── CardMedia ──
 * Per-card media renderer. Owns its own <video> ref + playing state so each
 * card plays independently — extracted as a subcomponent so the parent
 * carousel doesn't need to track refs keyed by index.
 */
function CardMedia({ card, height }: { card: CarouselCard; height: number }) {
  const isVideo = card.mediaType === "video";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!isVideo) {
    return (
      <img
        src={card.url}
        alt={card.title}
        className="w-full object-cover"
        style={{ height }}
      />
    );
  }

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <video
        ref={videoRef}
        src={card.url}
        poster={card.thumbnailUrl}
        playsInline
        muted
        onEnded={() => setPlaying(false)}
        aria-label={card.title}
        className="w-full h-full object-cover pointer-events-none"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className={cn(
          "absolute inset-0 flex items-center justify-center cursor-pointer border-none bg-transparent p-0 transition-opacity",
          playing && "opacity-0 hover:opacity-100"
        )}
      >
        <span className="size-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          {playing ? (
            <Pause className="size-5 text-white fill-white" />
          ) : (
            <Play className="size-5 text-white fill-white ml-0.5" />
          )}
        </span>
      </button>
    </div>
  );
}

const CarouselMedia = React.forwardRef(
  ({ className, cards, cardWidth = 260, imageHeight = 200, ...props }: CarouselMediaProps, ref: React.Ref<HTMLDivElement>) => {
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
              className="shrink-0 bg-white rounded border border-solid border-semantic-border-layout overflow-hidden shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08)]"
              style={{ width: cardWidth }}
            >
              <CardMedia card={card} height={imageHeight} />
              <div className="px-3 pt-2.5 pb-2">
                <p className="m-0 text-[14px] font-semibold text-semantic-text-primary line-clamp-2">
                  {card.title}
                </p>
              </div>
              {card.buttons?.map((btn, j) => (
                <button
                  key={j}
                  onClick={btn.onClick}
                  className="flex items-center justify-center gap-2 w-full border-t border-solid border-semantic-border-layout text-[13px] font-semibold text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
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
