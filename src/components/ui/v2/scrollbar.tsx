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

const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));
const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
  (
    {
      orientation = "vertical",
      variant = "subtle",
      showControls = true,
      children,
      className,
      "aria-label": ariaLabel = "Scrollable content",
      onClick,
      onScroll,
      onKeyDown,
      onWheel,
      onWheelCapture,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture,
      ...props
    },
    ref
  ) => {
    const viewport = React.useRef<HTMLDivElement>(null);
    const rail = React.useRef<HTMLDivElement>(null);
    const thumb = React.useRef<HTMLDivElement>(null);
    const backwardControl = React.useRef<HTMLButtonElement>(null);
    const forwardControl = React.useRef<HTMLButtonElement>(null);
    const viewportId = React.useId();
    const vertical = orientation === "vertical";
    const hasWheelCallbacks = Boolean(onWheel || onWheelCapture);
    const grab = React.useRef<{ pointerId: number; offset: number } | null>(
      null
    );
    const wheelEvents = React.useRef(
      new WeakMap<
        WheelEvent,
        {
          capture?: React.WheelEvent<HTMLDivElement>;
          bubble?: React.WheelEvent<HTMLDivElement>;
        }
      >()
    );
    const [metrics, setMetrics] = React.useState({
      ratio: 1,
      length: 0,
      position: 0,
      max: 0,
      rtl: false,
    });
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
      const track = rail.current;
      if (!el || !track) return;
      const visible = vertical ? el.clientHeight : el.clientWidth;
      const total = vertical ? el.scrollHeight : el.scrollWidth;
      const max = Math.max(0, total - visible);
      const rtl = getComputedStyle(el).direction === "rtl";
      const position = clamp(
        vertical ? el.scrollTop : el.scrollLeft * (rtl ? -1 : 1),
        max
      );
      const next = {
        ratio: total > 0 ? Math.min(1, visible / total) : 1,
        length: vertical ? track.clientHeight : track.clientWidth,
        position,
        max,
        rtl,
      };
      setMetrics((previous) =>
        previous.ratio === next.ratio &&
        previous.length === next.length &&
        previous.position === next.position &&
        previous.max === next.max &&
        previous.rtl === next.rtl
          ? previous
          : next
      );
    }, [vertical]);

    React.useEffect(() => {
      const el = viewport.current;
      const track = rail.current;
      if (!el || !track) return;
      measure();
      const observer =
        typeof ResizeObserver === "undefined"
          ? undefined
          : new ResizeObserver(measure);
      const observeChildren = () => {
        observer?.disconnect();
        observer?.observe(el);
        observer?.observe(track);
        Array.from(el.children).forEach((child) => observer?.observe(child));
      };
      observeChildren();
      // Content can change overflow without changing the viewport's dimensions.
      const mutations = new MutationObserver(() => {
        observeChildren();
        measure();
      });
      mutations.observe(el, {
        childList: true,
        characterData: true,
        subtree: true,
      });
      window.addEventListener("resize", measure);
      return () => {
        observer?.disconnect();
        mutations.disconnect();
        window.removeEventListener("resize", measure);
      };
    }, [measure, children, props.dir]);

    React.useEffect(() => {
      const el = viewport.current;
      if (!el || (vertical && !hasWheelCallbacks)) return;
      const cancelWheel = (event: WheelEvent) => {
        const handlers = wheelEvents.current.get(event);
        if (
          handlers?.capture?.defaultPrevented ||
          handlers?.bubble?.defaultPrevented
        )
          event.preventDefault();
      };
      const wheel = (event: WheelEvent) => {
        if (!(event.target instanceof Node) || !el.contains(event.target))
          return;
        const handlers = wheelEvents.current.get(event);
        // React delegates wheel events passively. Wait for its bubble callbacks
        // before adapting the wheel, and honor their cancellation natively.
        if (
          handlers?.capture?.defaultPrevented ||
          handlers?.bubble?.defaultPrevented
        ) {
          event.preventDefault();
          return;
        }
        if (!handlers?.bubble) return;
        if (
          vertical ||
          event.defaultPrevented ||
          event.ctrlKey ||
          Math.abs(event.deltaX) >= Math.abs(event.deltaY)
        )
          return;
        const target =
          event.target instanceof Element
            ? event.target
            : event.target.parentElement;
        if (target?.closest('[data-slot="scrollbar-viewport"]') !== el) return;
        const max = Math.max(0, el.scrollWidth - el.clientWidth);
        const rtl = getComputedStyle(el).direction === "rtl";
        const position = clamp(el.scrollLeft * (rtl ? -1 : 1), max);
        const unit =
          event.deltaMode === 1
            ? parseFloat(getComputedStyle(el).lineHeight) || 16
            : event.deltaMode === 2
              ? el.clientWidth
              : 1;
        const next = clamp(position + event.deltaY * unit, max);
        // At either boundary the wheel can continue scrolling the page.
        if (Math.abs(next - position) < 0.5) return;
        event.preventDefault();
        el.scrollLeft = next * (rtl ? -1 : 1);
        measure();
        wake();
      };
      // Listen after React's delegate on each ancestor, including when a callback
      // stops propagation before the event can reach window.
      const targets: EventTarget[] = [];
      for (let node: Node | null = el.parentNode; node; node = node.parentNode)
        targets.push(node);
      targets.push(window);
      targets.forEach((target) => {
        target.addEventListener("wheel", cancelWheel as EventListener, {
          passive: false,
          capture: true,
        });
        target.addEventListener("wheel", wheel as EventListener, {
          passive: false,
        });
      });
      return () =>
        targets.forEach((target) => {
          target.removeEventListener(
            "wheel",
            cancelWheel as EventListener,
            true
          );
          target.removeEventListener("wheel", wheel as EventListener);
        });
    }, [vertical, hasWheelCallbacks, measure, wake]);

    const moveBy = (amount: number, behavior = scrollBehavior()) => {
      const el = viewport.current;
      if (!el) return;
      const rtl = getComputedStyle(el).direction === "rtl";
      el.scrollBy({
        top: vertical ? amount : 0,
        left: vertical ? 0 : amount * (rtl ? -1 : 1),
        behavior,
      });
      wake();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      const el = viewport.current;
      if (
        !el ||
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (event.target !== el && event.target !== rail.current)
      )
        return;
      const visible = vertical ? el.clientHeight : el.clientWidth;
      const max = Math.max(
        0,
        (vertical ? el.scrollHeight : el.scrollWidth) - visible
      );
      const rtl = getComputedStyle(el).direction === "rtl";
      const position = clamp(
        vertical ? el.scrollTop : el.scrollLeft * (rtl ? -1 : 1),
        max
      );
      let next: number;
      switch (event.key) {
        case "Home":
          next = 0;
          break;
        case "End":
          next = max;
          break;
        case "PageUp":
          next = position - visible * 0.9;
          break;
        case "PageDown":
          next = position + visible * 0.9;
          break;
        case " ":
          next = position + visible * 0.9 * (event.shiftKey ? -1 : 1);
          break;
        case "ArrowUp":
        case "ArrowDown":
          if (!vertical) return;
          next = position + (event.key === "ArrowUp" ? -40 : 40);
          break;
        case "ArrowLeft":
        case "ArrowRight":
          if (vertical) return;
          next =
            position + (event.key === "ArrowLeft" ? -40 : 40) * (rtl ? -1 : 1);
          break;
        default:
          return;
      }
      next = clamp(next, max);
      if (max <= 0 || next === position) return;
      event.preventDefault();
      if (vertical) el.scrollTop = next;
      else el.scrollLeft = next * (rtl ? -1 : 1);
      measure();
      wake();
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      const el = viewport.current;
      const track = rail.current;
      const pill = thumb.current;
      if (
        !el ||
        !track ||
        !pill ||
        event.defaultPrevented ||
        event.button !== 0 ||
        !(event.target instanceof Node) ||
        !track.contains(event.target) ||
        metrics.max <= 0
      )
        return;
      event.preventDefault();
      track.focus({ preventScroll: true });
      const rect = pill.getBoundingClientRect();
      const cursor = vertical ? event.clientY : event.clientX;
      const start = vertical ? rect.top : rect.left;
      const end = vertical ? rect.bottom : rect.right;
      if (cursor < start || cursor > end) {
        // A track press pages in the physical direction of the pointer.
        const direction =
          (cursor < start ? -1 : 1) * (!vertical && metrics.rtl ? -1 : 1);
        moveBy((vertical ? el.clientHeight : el.clientWidth) * 0.9 * direction);
        return;
      }
      grab.current = { pointerId: event.pointerId, offset: cursor - start };
      track.setPointerCapture?.(event.pointerId);
      setDragging(true);
      wake();
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event);
      const el = viewport.current;
      const track = rail.current;
      const state = grab.current;
      if (
        !el ||
        !track ||
        !state ||
        event.defaultPrevented ||
        event.pointerId !== state.pointerId
      )
        return;
      const rect = track.getBoundingClientRect();
      const length = vertical ? rect.height : rect.width;
      const size = Math.min(length, Math.max(28, length * metrics.ratio));
      const cursor = vertical ? event.clientY : event.clientX;
      const offset = clamp(
        cursor - (vertical ? rect.top : rect.left) - state.offset,
        Math.max(0, length - size)
      );
      const proportion = offset / (length - size || 1);
      if (vertical) el.scrollTop = proportion * metrics.max;
      else
        el.scrollLeft =
          (metrics.rtl ? 1 - proportion : proportion) *
          metrics.max *
          (metrics.rtl ? -1 : 1);
      measure();
    };

    const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
      const state = grab.current;
      if (!state || event.pointerId !== state.pointerId) return;
      grab.current = null;
      if (rail.current?.hasPointerCapture?.(event.pointerId))
        rail.current.releasePointerCapture?.(event.pointerId);
      setDragging(false);
      wake();
    };

    const overflowing = metrics.max > 0.5;
    const thumbLength = Math.min(
      metrics.length,
      Math.max(28, metrics.length * metrics.ratio)
    );
    const offset = metrics.max ? metrics.position / metrics.max : 0;
    const thumbOffset =
      (!vertical && metrics.rtl ? 1 - offset : offset) *
      Math.max(0, metrics.length - thumbLength);
    const control = (direction: number) => {
      const pointsBackward = direction < 0;
      const Icon = vertical
        ? pointsBackward
          ? ChevronUp
          : ChevronDown
        : pointsBackward !== metrics.rtl
          ? ChevronLeft
          : ChevronRight;
      return (
        <button
          ref={pointsBackward ? backwardControl : forwardControl}
          type="button"
          aria-label={pointsBackward ? "Scroll backward" : "Scroll forward"}
          aria-controls={viewportId}
          disabled={
            !overflowing ||
            (pointsBackward
              ? metrics.position <= 0.5
              : metrics.max - metrics.position <= 0.5)
          }
          className={cn(
            "flex shrink-0 items-center justify-center text-semantic-text-muted transition-colors [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none focus-visible:outline focus-visible:[outline-width:1px] focus-visible:-outline-offset-1 focus-visible:outline-semantic-primary [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:bg-semantic-bg-hover disabled:cursor-default disabled:opacity-40",
            vertical ? "h-8 w-4" : "h-4 w-8"
          )}
        >
          <Icon className="size-3" aria-hidden="true" />
        </button>
      );
    };
    const overlay = variant !== "dark";
    const fadeStart = Math.min(28, metrics.position);
    const fadeEnd = Math.min(28, Math.max(0, metrics.max - metrics.position));

    return (
      <div
        ref={ref}
        data-slot="scrollbar"
        data-orientation={orientation}
        data-scrolling={scrolling || dragging || undefined}
        className={cn(
          "group/scrollbar relative flex min-h-0 min-w-0 overflow-hidden",
          !vertical && "flex-col",
          className
        )}
        {...props}
        onClick={(event) => {
          onClick?.(event);
          const el = viewport.current;
          const button =
            event.target instanceof Element
              ? event.target.closest("button")
              : null;
          if (!el || event.defaultPrevented || !button || button.disabled)
            return;
          const direction =
            button === backwardControl.current
              ? -1
              : button === forwardControl.current
                ? 1
                : 0;
          if (direction)
            moveBy(
              direction * (vertical ? el.clientHeight : el.clientWidth) * 0.7
            );
        }}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => {
          onPointerUp?.(event);
          finishDrag(event);
        }}
        onPointerCancel={(event) => {
          onPointerCancel?.(event);
          finishDrag(event);
        }}
        onLostPointerCapture={(event) => {
          onLostPointerCapture?.(event);
          finishDrag(event);
        }}
        onWheelCapture={(event) => {
          wheelEvents.current.set(event.nativeEvent, { capture: event });
          onWheelCapture?.(event);
        }}
        onWheel={(event) => {
          const recorded = wheelEvents.current.get(event.nativeEvent);
          wheelEvents.current.set(event.nativeEvent, {
            ...recorded,
            bubble: event,
          });
          onWheel?.(event);
        }}
      >
        <div
          ref={viewport}
          id={viewportId}
          data-slot="scrollbar-viewport"
          role="region"
          aria-label={ariaLabel}
          aria-labelledby={props["aria-labelledby"]}
          aria-describedby={props["aria-describedby"]}
          tabIndex={0}
          style={
            {
              "--v2-fade-start": `${!vertical && metrics.rtl ? fadeEnd : fadeStart}px`,
              "--v2-fade-end": `${!vertical && metrics.rtl ? fadeStart : fadeEnd}px`,
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
          data-slot="scrollbar-track"
          aria-hidden={!overflowing || undefined}
          className={cn(
            "group/track flex items-center",
            overlay
              ? cn(
                  "pointer-events-none absolute z-[1] opacity-0 transition-opacity [transition-duration:480ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  "group-data-[scrolling=true]/scrollbar:pointer-events-auto group-data-[scrolling=true]/scrollbar:opacity-100 group-data-[scrolling=true]/scrollbar:[transition-duration:160ms]",
                  "group-focus-within/scrollbar:pointer-events-auto group-focus-within/scrollbar:opacity-100 group-focus-within/scrollbar:[transition-duration:160ms]",
                  "[@media(hover:hover)_and_(pointer:fine)]:group-hover/scrollbar:pointer-events-auto [@media(hover:hover)_and_(pointer:fine)]:group-hover/scrollbar:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/scrollbar:[transition-duration:160ms]",
                  vertical
                    ? "inset-y-[3px] right-px flex-col rtl:left-px rtl:right-auto"
                    : "inset-x-[3px] bottom-px",
                  showControls
                    ? vertical
                      ? "inset-y-0 w-4"
                      : "inset-x-0 h-4"
                    : vertical
                      ? "w-[11px]"
                      : "h-[11px]",
                  !overflowing && "invisible"
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
            data-slot="scrollbar-rail"
            role="scrollbar"
            aria-label={`${ariaLabel} scroll bar`}
            aria-controls={viewportId}
            aria-orientation={orientation}
            aria-valuemin={0}
            aria-valuemax={Math.round(metrics.max)}
            aria-valuenow={Math.round(metrics.position)}
            tabIndex={overflowing ? 0 : -1}
            className="relative min-h-0 min-w-0 flex-1 self-stretch touch-none focus-visible:outline focus-visible:[outline-width:1px] focus-visible:-outline-offset-1 focus-visible:outline-semantic-primary"
          >
            <div
              ref={thumb}
              data-slot="scrollbar-thumb"
              className={cn(
                "absolute after:absolute after:rounded-lg after:bg-[color-mix(in_oklab,var(--semantic-text-primary)_30%,transparent)] after:transition-[width,height,background-color] after:[transition-duration:160ms] after:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:after:transition-none after:content-['']",
                "[@media(hover:hover)_and_(pointer:fine)]:group-hover/track:after:bg-[color-mix(in_oklab,var(--semantic-text-primary)_46%,transparent)]",
                dragging &&
                  "after:bg-[color-mix(in_oklab,var(--semantic-text-primary)_46%,transparent)]",
                vertical
                  ? "inset-x-0 after:inset-y-0 after:left-1/2 after:w-[5px] after:-translate-x-1/2 [@media(hover:hover)_and_(pointer:fine)]:group-hover/track:after:w-[7px]"
                  : "inset-y-0 after:inset-x-0 after:top-1/2 after:h-[5px] after:-translate-y-1/2 [@media(hover:hover)_and_(pointer:fine)]:group-hover/track:after:h-[7px]",
                dragging && (vertical ? "after:w-[7px]" : "after:h-[7px]")
              )}
              style={
                vertical
                  ? { height: thumbLength, top: thumbOffset }
                  : { width: thumbLength, left: thumbOffset }
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
