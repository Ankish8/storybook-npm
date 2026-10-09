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
    const grabOffset = React.useRef<number | null>(null);
    const [metrics, setMetrics] = React.useState({
      ratio: 1,
      offset: 0,
      length: 0,
      position: 0,
      max: 0,
    });
    // Arc: the bar shows while scrolling (and lingers 900ms), while dragging, and on hover; it fades away at rest.
    const [scrolling, setScrolling] = React.useState(false);
    const [dragging, setDragging] = React.useState(false);
    const hideTimer = React.useRef<number | undefined>(undefined);
    React.useEffect(() => () => window.clearTimeout(hideTimer.current), []);
    const wake = React.useCallback(() => {
      setScrolling(true);
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setScrolling(false), 900);
    }, []);
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
        position,
        max: Math.max(0, total - visible),
      });
    }, [vertical]);
    React.useEffect(() => {
      measure();
      const el = viewport.current;
      if (!el) return;
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      if (rail.current) observer.observe(rail.current);
      if (el.firstElementChild) observer.observe(el.firstElementChild);
      return () => observer.disconnect();
    }, [measure, children]);
    // A mouse wheel over a horizontal strip moves it sideways, but only while there is room, so the page still scrolls at the ends.
    React.useEffect(() => {
      const el = viewport.current;
      if (!el || vertical) return;
      const wheel = (event: WheelEvent) => {
        if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY))
          return;
        const max = el.scrollWidth - el.clientWidth;
        const at = Math.abs(el.scrollLeft);
        if (
          max <= 0 ||
          (event.deltaY < 0 && at <= 0) ||
          (event.deltaY > 0 && at >= max - 0.5)
        )
          return;
        event.preventDefault();
        el.scrollLeft += event.deltaY;
      };
      el.addEventListener("wheel", wheel, { passive: false });
      return () => el.removeEventListener("wheel", wheel);
    }, [vertical]);
    const step = (direction: number) => {
      const el = viewport.current;
      if (!el) return;
      const amount =
        direction * (vertical ? el.clientHeight : el.clientWidth) * 0.7;
      el.scrollBy({
        top: vertical ? amount : 0,
        left: vertical ? 0 : amount,
        behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)")
          .matches
          ? "auto"
          : "smooth",
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
        Math.max(28, length * metrics.ratio)
      );
      const proportion = Math.max(
        0,
        Math.min(
          1,
          (cursor - start - (grabOffset.current ?? thumbLength / 2)) /
            (length - thumbLength || 1)
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
      Math.max(28, metrics.length * metrics.ratio)
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
          "flex shrink-0 items-center justify-center transition-colors [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none text-[var(--v2-text-muted,#707070)] hover:bg-semantic-bg-hover disabled:opacity-40",
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
    // "subtle" floats over the content like Arc's overlay bar; "dark" keeps a solid rail beside it.
    const overlay = variant !== "dark";
    // Each edge fades out by the length of content hidden past it, up to 28px, so it grows in with the first pixels of scroll.
    const fadeStart = Math.min(28, metrics.position);
    const fadeEnd = Math.min(28, metrics.max - metrics.position);
    return (
      <div
        ref={ref}
        data-scrolling={scrolling || dragging || undefined}
        className={cn(
          "group/scrollbar relative flex min-h-0 min-w-0 overflow-hidden",
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
          style={
            {
              "--v2-fade-start": `${fadeStart}px`,
              "--v2-fade-end": `${Math.max(0, fadeEnd)}px`,
            } as React.CSSProperties
          }
          className={cn(
            "min-h-0 min-w-0 flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline focus-visible:[outline-width:1px] focus-visible:-outline-offset-1 focus-visible:outline-semantic-primary",
            vertical
              ? "overflow-y-auto overflow-x-hidden [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_var(--v2-fade-start),#000_calc(100%_-_var(--v2-fade-end)),transparent)] [mask-image:linear-gradient(to_bottom,transparent,#000_var(--v2-fade-start),#000_calc(100%_-_var(--v2-fade-end)),transparent)]"
              : "overflow-x-auto overflow-y-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,#000_var(--v2-fade-start),#000_calc(100%_-_var(--v2-fade-end)),transparent)] [mask-image:linear-gradient(to_right,transparent,#000_var(--v2-fade-start),#000_calc(100%_-_var(--v2-fade-end)),transparent)]"
          )}
          onScroll={(event) => {
            measure();
            wake();
            onScroll?.(event);
          }}
        >
          {children}
        </div>
        <div
          aria-hidden={metrics.ratio >= 1 || undefined}
          className={cn(
            "group/track flex items-center",
            overlay
              ? cn(
                  "pointer-events-none absolute z-[1] opacity-0 transition-opacity [transition-duration:480ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  "group-data-[scrolling=true]/scrollbar:pointer-events-auto group-data-[scrolling=true]/scrollbar:opacity-100 group-data-[scrolling=true]/scrollbar:[transition-duration:160ms]",
                  "[@media(hover:hover)]:group-hover/scrollbar:pointer-events-auto [@media(hover:hover)]:group-hover/scrollbar:opacity-100 [@media(hover:hover)]:group-hover/scrollbar:[transition-duration:160ms]",
                  vertical
                    ? "inset-y-[3px] right-px flex-col"
                    : "inset-x-[3px] bottom-px",
                  // Without arrow buttons the track is Arc's 11px hit area; with them it is as wide as a button.
                  showControls
                    ? vertical
                      ? "inset-y-0 w-4"
                      : "inset-x-0 h-4"
                    : vertical
                      ? "w-[11px]"
                      : "h-[11px]",
                  // Nothing to scroll: keep the layout (so it can be measured) but never show or hit-test it.
                  metrics.ratio >= 1 && "invisible"
                )
              : cn(
                  "shrink-0 border-solid border-semantic-border-layout bg-semantic-bg-ui",
                  vertical ? "w-4 flex-col border-l" : "h-4 border-t"
                )
          )}
        >
          {showControls && control(-1)}
          <div
            ref={rail}
            className="relative min-h-0 min-w-0 flex-1 self-stretch touch-none"
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              event.preventDefault();
              const thumb =
                event.currentTarget.firstElementChild?.getBoundingClientRect();
              const cursor = vertical ? event.clientY : event.clientX;
              const start = thumb && (vertical ? thumb.top : thumb.left);
              const end = thumb && (vertical ? thumb.bottom : thumb.right);
              const onThumb =
                start !== undefined &&
                end !== undefined &&
                cursor >= start &&
                cursor <= end;
              if (!onThumb && start !== undefined && end !== undefined) {
                // Pressing the empty track pages toward the pointer, as in Arc.
                const el = viewport.current;
                if (!el) return;
                const page =
                  (vertical ? el.clientHeight : el.clientWidth) *
                  0.9 *
                  (cursor < start ? -1 : 1);
                el.scrollBy({
                  top: vertical ? page : 0,
                  left: vertical ? 0 : page,
                  behavior: window.matchMedia?.(
                    "(prefers-reduced-motion: reduce)"
                  ).matches
                    ? "auto"
                    : "smooth",
                });
                return;
              }
              grabOffset.current =
                onThumb && start !== undefined ? cursor - start : null;
              event.currentTarget.setPointerCapture?.(event.pointerId);
              setDragging(true);
              trackMove(event);
            }}
            onPointerUp={() => {
              grabOffset.current = null;
              setDragging(false);
              wake();
            }}
            onPointerCancel={() => {
              grabOffset.current = null;
              setDragging(false);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture?.(event.pointerId))
                trackMove(event);
            }}
          >
            <div
              className={cn(
                // The thumb is the hit area; its pill is 5px thick and thickens to 7px under the pointer.
                "absolute after:absolute after:rounded-lg after:bg-[color-mix(in_oklab,var(--v2-text-primary,#484848)_30%,transparent)] after:transition-[width,height,background-color] after:[transition-duration:160ms] after:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:after:transition-none after:content-['']",
                "[@media(hover:hover)]:group-hover/track:after:bg-[color-mix(in_oklab,var(--v2-text-primary,#484848)_46%,transparent)]",
                dragging &&
                  "after:bg-[color-mix(in_oklab,var(--v2-text-primary,#484848)_46%,transparent)]",
                vertical
                  ? "inset-x-0 after:inset-y-0 after:left-1/2 after:w-[5px] after:-translate-x-1/2 [@media(hover:hover)]:group-hover/track:after:w-[7px]"
                  : "inset-y-0 after:inset-x-0 after:top-1/2 after:h-[5px] after:-translate-y-1/2 [@media(hover:hover)]:group-hover/track:after:h-[7px]",
                dragging && (vertical ? "after:w-[7px]" : "after:h-[7px]")
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
