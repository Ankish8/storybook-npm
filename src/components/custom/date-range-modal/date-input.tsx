import * as React from "react";
import { createPortal } from "react-dom";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Calendar } from "./calendar";

export interface DateInputProps {
  label: string;
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  /** When this counter changes, the calendar closes (e.g. sibling field opened). */
  dismissSignal?: number;
  /** Called when the calendar opens (not when it closes). */
  onPopoverOpened?: () => void;
  /**
   * Mount the calendar inside this element (e.g. the dialog content node). Pass `null` until the
   * node exists. Omit when not inside a Radix modal (defaults to `document.body` with pointer-events
   * restored). Body-only popovers under a modal receive no clicks or wheel: the dialog sets
   * `pointer-events: none` on the body and only re-enables the dialog surface.
   */
  portalContainer?: HTMLElement | null;
}

function formatDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

/** Extra slack for native scrollbar hit-testing (target can be wrong or pierce “through” in some engines). */
const SCROLLBAR_SLOP = 20;

/** Scrollbar hits often don't set target inside the scrollable node; bbox + composedPath fixes that. */
function isPointerInsideElement(
  e: PointerEvent | MouseEvent,
  el: HTMLElement | null
): boolean {
  if (!el) return false;

  const t = e.target;
  if (t instanceof Node && el.contains(t)) return true;

  if (typeof e.composedPath === "function") {
    for (const node of e.composedPath()) {
      if (node === el) return true;
      if (node instanceof Node && el.contains(node)) return true;
    }
  }

  const { clientX, clientY } = e;
  const r = el.getBoundingClientRect();
  return (
    clientX >= r.left - SCROLLBAR_SLOP &&
    clientX <= r.right + SCROLLBAR_SLOP &&
    clientY >= r.top - SCROLLBAR_SLOP &&
    clientY <= r.bottom + SCROLLBAR_SLOP
  );
}

function DateInput({
  label,
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  minDate,
  maxDate,
  dismissSignal,
  onPopoverOpened,
  portalContainer,
}: DateInputProps) {
  const [open, setOpen] = React.useState(false);
  const [popoverStyle, setPopoverStyle] = React.useState<React.CSSProperties>({});
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const popoverScrollRef = React.useRef<HTMLDivElement>(null);

  const updatePopoverPosition = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const container = portalContainer ?? null;

    const rect = trigger.getBoundingClientRect();
    const popoverWidth = 288;
    const margin = 8;
    const gap = 4;
    const maxPopoverH = 340;

    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - popoverWidth - margin);
    }

    const vh = window.innerHeight;
    const belowTop = rect.bottom + gap;
    const roomBelow = Math.max(0, vh - margin - belowTop);
    const roomAbove = Math.max(0, rect.top - margin - gap);

    // Prefer the side with more room; opening above then clamping top to ~0 misplaces the popover.
    let top: number;
    let maxHeight: number;

    if (roomBelow >= roomAbove) {
      top = belowTop;
      maxHeight = Math.max(1, Math.min(maxPopoverH, roomBelow));
    } else {
      maxHeight = Math.max(1, Math.min(maxPopoverH, roomAbove));
      top = rect.top - gap - maxHeight;
      if (top < margin) {
        top = belowTop;
        maxHeight = Math.max(1, Math.min(maxPopoverH, roomBelow));
      }
    }

    if (container) {
      const cr = container.getBoundingClientRect();
      setPopoverStyle({
        position: "absolute",
        top: top - cr.top + container.scrollTop,
        left: left - cr.left + container.scrollLeft,
        width: popoverWidth,
        zIndex: 60,
        maxHeight,
      });
    } else {
      setPopoverStyle({
        position: "fixed",
        top,
        left,
        width: popoverWidth,
        zIndex: 10050,
        maxHeight,
      });
    }
  }, [portalContainer]);

  React.useEffect(() => {
    if (dismissSignal === undefined) return;
    setOpen(false);
  }, [dismissSignal]);

  React.useLayoutEffect(() => {
    if (!open) return;

    updatePopoverPosition();
    window.addEventListener("resize", updatePopoverPosition);
    document.addEventListener("scroll", updatePopoverPosition, true);
    return () => {
      window.removeEventListener("resize", updatePopoverPosition);
      document.removeEventListener("scroll", updatePopoverPosition, true);
    };
  }, [open, updatePopoverPosition]);

  // Stop propagation so native listeners on document (ours + host apps) don’t treat scrollbar as “outside”.
  React.useLayoutEffect(() => {
    if (!open) return;
    const outer = popoverRef.current;
    const scrollEl = popoverScrollRef.current;
    const stop = (ev: Event) => {
      ev.stopPropagation();
    };
    outer?.addEventListener("pointerdown", stop, false);
    outer?.addEventListener("mousedown", stop, false);
    scrollEl?.addEventListener("pointerdown", stop, false);
    scrollEl?.addEventListener("mousedown", stop, false);
    return () => {
      outer?.removeEventListener("pointerdown", stop, false);
      outer?.removeEventListener("mousedown", stop, false);
      scrollEl?.removeEventListener("pointerdown", stop, false);
      scrollEl?.removeEventListener("mousedown", stop, false);
    };
  }, [open]);

  // Close on outside click — mousedown is what scrollbar dragging uses reliably across engines.
  React.useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        isPointerInsideElement(e, containerRef.current) ||
        isPointerInsideElement(e, popoverRef.current) ||
        isPointerInsideElement(e, popoverScrollRef.current)
      ) {
        return;
      }
      setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleMouseDown);
    }
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  const useBodyPortal = portalContainer === undefined;
  const portalMount =
    typeof document !== "undefined"
      ? useBodyPortal
        ? document.body
        : portalContainer
      : null;

  const popover =
    open &&
    portalMount &&
    createPortal(
      <div
        ref={popoverRef}
        className={cn(
          "rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary shadow-lg flex flex-col min-h-0 overflow-hidden",
          useBodyPortal && "pointer-events-auto"
        )}
        style={popoverStyle}
        aria-label={`${label} calendar`}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          ref={popoverScrollRef}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-3 touch-pan-y"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Calendar
            value={value}
            onChange={(date) => {
              onChange(date);
              setOpen(false);
            }}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      </div>,
      portalMount
    );

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <label className="text-sm font-medium text-semantic-text-primary">
        {label}
      </label>
      <button
        ref={triggerRef}
        type="button"
        onClick={() =>
          setOpen((o) => {
            const next = !o;
            if (next) onPopoverOpened?.();
            return next;
          })
        }
        className={cn(
          "flex items-center justify-between gap-2 w-full px-3 py-2 rounded-md border border-solid text-sm transition-colors outline-none",
          "border-semantic-border-input bg-semantic-bg-primary text-semantic-text-primary",
          "hover:border-semantic-border-input-focus/50",
          open && "border-semantic-border-input-focus/50 shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
          !value && "text-semantic-text-muted"
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{value ? formatDate(value) : placeholder}</span>
        <CalendarIcon className="size-4 text-semantic-text-muted shrink-0" />
      </button>

      {popover}
    </div>
  );
}
DateInput.displayName = "DateInput";

export { DateInput };
