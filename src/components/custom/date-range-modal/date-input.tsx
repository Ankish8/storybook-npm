import * as React from "react";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
  type Strategy,
} from "@floating-ui/react-dom";
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
  /** Mount the floating calendar inside a containing layer, such as Radix DialogContent. */
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
const POPOVER_WIDTH = 288;
const POPOVER_MARGIN = 8;
const POPOVER_GAP = 4;
const MAX_POPOVER_HEIGHT = 340;
const POPOVER_SCROLL_HEIGHT_VAR = "--date-range-calendar-scroll-height";
const CALENDAR_PLACEMENT: Placement = "bottom-start";

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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const popoverScrollRef = React.useRef<HTMLDivElement | null>(null);
  const usesContainerPortal = portalContainer !== undefined;
  const floatingStrategy: Strategy = usesContainerPortal ? "absolute" : "fixed";
  const floatingMiddleware = React.useMemo(
    () => [
      offset(POPOVER_GAP),
      flip({ padding: POPOVER_MARGIN }),
      shift({ padding: POPOVER_MARGIN }),
      size({
        padding: POPOVER_MARGIN,
        apply({ availableHeight, elements }) {
          const maxHeight = Math.max(
            1,
            Math.min(MAX_POPOVER_HEIGHT, availableHeight)
          );
          elements.floating.style.setProperty(
            POPOVER_SCROLL_HEIGHT_VAR,
            `${maxHeight}px`
          );
        },
      }),
    ],
    []
  );
  const { refs, floatingStyles, isPositioned } = useFloating<HTMLButtonElement>(
    {
      open,
      placement: CALENDAR_PLACEMENT,
      strategy: floatingStrategy,
      transform: false,
      middleware: floatingMiddleware,
      whileElementsMounted: (reference, floating, update) =>
        autoUpdate(reference, floating, update, { animationFrame: true }),
    }
  );

  const setTriggerRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      refs.setReference(node);
    },
    [refs]
  );

  const setPopoverRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      popoverRef.current = node;
      popoverScrollRef.current = node;
      refs.setFloating(node);
    },
    [refs]
  );
  const handleTriggerClick = React.useCallback(() => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      onPopoverOpened?.();
    }
  }, [onPopoverOpened, open]);

  React.useEffect(() => {
    if (dismissSignal === undefined) return;
    setOpen(false);
  }, [dismissSignal]);

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

  const portalMount =
    typeof document !== "undefined"
      ? usesContainerPortal
        ? portalContainer
        : document.body
      : null;

  const popover =
    open &&
    portalMount &&
    createPortal(
      <div
        ref={setPopoverRef}
        data-date-range-calendar=""
        data-date-range-calendar-scroll=""
        className={cn(
          "rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary shadow-lg flex flex-col min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain pointer-events-auto",
          "[scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:var(--semantic-border-secondary)_transparent]",
          "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-semantic-border-secondary"
        )}
        style={{
          ...floatingStyles,
          width: POPOVER_WIDTH,
          maxHeight: `var(${POPOVER_SCROLL_HEIGHT_VAR}, min(${MAX_POPOVER_HEIGHT}px, calc(100dvh - ${
            POPOVER_MARGIN * 2
          }px)))`,
          zIndex: 10050,
          visibility: isPositioned ? undefined : "hidden",
        }}
        aria-label={`${label} calendar`}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div
          className="p-3 touch-pan-y"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
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
        ref={setTriggerRef}
        type="button"
        onClick={handleTriggerClick}
        className={cn(
          "flex items-center justify-between gap-2 w-full px-3 py-2 rounded-md border border-solid text-sm transition-colors outline-none",
          "border-semantic-border-input bg-semantic-bg-primary text-semantic-text-primary",
          "hover:border-semantic-border-input-focus/50",
          open &&
            "border-semantic-border-input-focus/50 shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
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
