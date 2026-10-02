import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
export interface ScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
  variant?: "dark" | "subtle";
  showControls?: boolean;
}
const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
  (
    {
      orientation = "vertical",
      variant = "subtle",
      showControls = true,
      children,
      className,
      "aria-label": ariaLabel = "Scrollable content",
      onScroll,
      ...props
    },
    ref
  ) => {
    const viewport = React.useRef<HTMLDivElement>(null);
    const rail = React.useRef<HTMLDivElement>(null);
    const vertical = orientation === "vertical";
    const [metrics, setMetrics] = React.useState({
      ratio: 1,
      offset: 0,
      length: 0,
    });
    const measure = React.useCallback(() => {
      const el = viewport.current;
      if (!el) return;
      const visible = vertical ? el.clientHeight : el.clientWidth;
      const total = vertical ? el.scrollHeight : el.scrollWidth;
      const position = vertical ? el.scrollTop : el.scrollLeft;
      setMetrics({
        ratio: total ? Math.min(1, visible / total) : 1,
        length: rail.current
          ? vertical
            ? rail.current.clientHeight
            : rail.current.clientWidth
          : 0,
        offset: total > visible ? position / (total - visible) : 0,
      });
    }, [vertical]);
    React.useEffect(() => {
      measure();
      const el = viewport.current;
      if (!el) return;
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      if (rail.current) observer.observe(rail.current);
      if (el.firstElementChild) observer.observe(el.firstElementChild);
      return () => observer.disconnect();
    }, [measure, children]);
    const step = (direction: number) => {
      const el = viewport.current;
      if (!el) return;
      const amount =
        direction * (vertical ? el.clientHeight : el.clientWidth) * 0.7;
      el.scrollBy({
        top: vertical ? amount : 0,
        left: vertical ? 0 : amount,
        behavior: "smooth",
      });
    };
    const trackMove = (event: React.PointerEvent<HTMLDivElement>) => {
      const el = viewport.current;
      const track = rail.current;
      if (!el || !track) return;
      const rect = track.getBoundingClientRect();
      const start = vertical ? rect.top : rect.left;
      const length = vertical ? rect.height : rect.width;
      const cursor = vertical ? event.clientY : event.clientX;
      const thumbLength = Math.min(
        length,
        Math.max(32, length * metrics.ratio)
      );
      const proportion = Math.max(
        0,
        Math.min(
          1,
          (cursor - start - thumbLength / 2) / (length - thumbLength || 1)
        )
      );
      const max = vertical
        ? el.scrollHeight - el.clientHeight
        : el.scrollWidth - el.clientWidth;
      if (vertical) el.scrollTop = proportion * max;
      else el.scrollLeft = proportion * max;
      measure();
    };
    const thumbLength = Math.min(
      metrics.length,
      Math.max(32, metrics.length * metrics.ratio)
    );
    const thumbOffset = Math.max(
      0,
      metrics.offset * (metrics.length - thumbLength)
    );
    const control = (direction: number) => (
      <button
        type="button"
        aria-label={direction < 0 ? "Scroll backward" : "Scroll forward"}
        disabled={
          metrics.ratio >= 1 ||
          (direction < 0 ? metrics.offset <= 0 : metrics.offset >= 1)
        }
        onClick={() => step(direction)}
        className={cn(
          "flex shrink-0 items-center justify-center text-semantic-text-muted hover:bg-semantic-bg-hover disabled:opacity-40",
          vertical ? "h-8 w-4" : "h-4 w-8"
        )}
      >
        {vertical ? (
          direction < 0 ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )
        ) : direction < 0 ? (
          <ChevronLeft className="size-3" />
        ) : (
          <ChevronRight className="size-3" />
        )}
      </button>
    );
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex min-h-0 min-w-0 overflow-hidden",
          !vertical && "flex-col",
          className
        )}
        {...props}
      >
        <div
          ref={viewport}
          role="region"
          aria-label={ariaLabel}
          tabIndex={0}
          className={cn(
            "min-h-0 min-w-0 flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline focus-visible:[outline-width:1px] focus-visible:-outline-offset-1 focus-visible:outline-semantic-primary",
            vertical
              ? "overflow-y-auto overflow-x-hidden"
              : "overflow-x-auto overflow-y-hidden"
          )}
          onScroll={(event) => {
            measure();
            onScroll?.(event);
          }}
        >
          {children}
        </div>
        <div
          aria-hidden={metrics.ratio >= 1 || undefined}
          className={cn(
            "flex shrink-0 items-center",
            vertical ? "w-4 flex-col" : "h-4",
            variant === "dark"
              ? "border-solid border-semantic-border-layout bg-semantic-bg-ui"
              : "bg-semantic-bg-primary",
            variant === "dark" && (vertical ? "border-l" : "border-t")
          )}
        >
          {showControls && control(-1)}
          <div
            ref={rail}
            className="relative min-h-0 min-w-0 flex-1 self-stretch"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture?.(event.pointerId);
              trackMove(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture?.(event.pointerId))
                trackMove(event);
            }}
          >
            <div
              className={cn(
                "absolute rounded-lg bg-semantic-text-placeholder",
                vertical ? "left-1 w-2" : "top-1 h-2"
              )}
              style={
                vertical
                  ? {
                      height: thumbLength,
                      top: thumbOffset,
                    }
                  : {
                      width: thumbLength,
                      left: thumbOffset,
                    }
              }
            />
          </div>
          {showControls && control(1)}
        </div>
      </div>
    );
  }
);
Scrollbar.displayName = "Scrollbar";
export { Scrollbar };
