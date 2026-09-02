import * as React from "react";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size as floatingSize,
  useFloating,
  type Placement,
  type Strategy,
} from "@floating-ui/react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const DEFAULT_PLACEHOLDER = "Date Range";
const POPOVER_MARGIN = 8;
const POPOVER_GAP = 4;
const MAX_POPOVER_HEIGHT = 420;
const POPOVER_SCROLL_HEIGHT_VAR = "--date-range-picker-scroll-height";
const CALENDAR_PLACEMENT: Placement = "bottom-start";
// Above the calendar popover's own z-index (10050) so the month/year
// dropdowns render on top of it rather than behind.
const CALENDAR_DROPDOWN_Z_INDEX = "z-[10060]";
const YEAR_OPTIONS_SPAN = 10;

const weekDays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const MONTH_SHORT_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTH_LONG_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dateRangePickerTriggerVariants = cva(
  "flex h-10 w-full items-center gap-2 rounded-lg border border-solid border-semantic-border-input bg-semantic-bg-primary px-4 py-2.5 text-left text-sm text-semantic-text-primary outline-none transition-colors hover:border-semantic-border-input-focus/50 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "",
        error:
          "border-semantic-error-primary hover:border-semantic-error-primary",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export interface DateRangeValue {
  start?: Date;
  end?: Date;
}

export interface DateRangePreset {
  label: string;
  getRange: () => DateRangeValue;
}

export interface DateRangePickerProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">,
    Pick<VariantProps<typeof dateRangePickerTriggerVariants>, "state"> {
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onValueChange?: (value: DateRangeValue) => void;
  /** Trigger placeholder text when no range is selected. Defaults to "Date Range". */
  placeholder?: string;
  /**
   * Presets shown in the left column. Defaults to
   * Today/Yesterday/Last 7 days/Last 30 days/This month/Last month.
   * Pass an empty array to hide the presets column entirely.
   */
  presets?: DateRangePreset[];
  minDate?: Date;
  maxDate?: Date;
  disablePastDates?: boolean;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  portalContainer?: HTMLElement | null;
  /** Custom display formatter for the trigger's filled-state text. Defaults to "D MMM YYYY - D MMM YYYY". */
  formatRange?: (value: DateRangeValue) => string;
  /** Additional className merged onto the trigger button (overrides base trigger styling) */
  triggerClassName?: string;
  /** Additional className merged onto the trigger's label span — e.g. `"hidden sm:inline"` to collapse to an icon-only button below a breakpoint */
  triggerLabelClassName?: string;
}

function normalizeValue(value?: DateRangeValue): DateRangeValue {
  return { start: value?.start, end: value?.end };
}

function isSameDay(a?: Date, b?: Date) {
  if (!a || !b) return false;

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isBeforeDay(date: Date, minDate: Date) {
  return startOfDay(date).getTime() < startOfDay(minDate).getTime();
}

function isAfterDay(date: Date, maxDate: Date) {
  return startOfDay(date).getTime() > startOfDay(maxDate).getTime();
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getCalendarDays(month: Date) {
  const firstDay = startOfMonth(month);
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

function isPointerInsideElement(
  event: MouseEvent,
  element: HTMLElement | null
) {
  if (!element) return false;

  const target = event.target;
  if (target instanceof Node && element.contains(target)) return true;

  if (typeof event.composedPath === "function") {
    return event
      .composedPath()
      .some((node) => node instanceof Node && element.contains(node));
  }

  return false;
}

function formatDateShort(date: Date) {
  return `${date.getDate()} ${MONTH_SHORT_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function defaultFormatRange(value: DateRangeValue) {
  if (value.start && value.end) {
    return `${formatDateShort(value.start)} - ${formatDateShort(value.end)}`;
  }
  if (value.start) return formatDateShort(value.start);
  if (value.end) return formatDateShort(value.end);

  return "";
}

/**
 * Default presets shown in the DateRangePicker's left column. Exported so
 * consumers can reference, filter, or extend the list.
 */
export const DEFAULT_DATE_RANGE_PRESETS: DateRangePreset[] = [
  {
    label: "Today",
    getRange: () => {
      const today = startOfDay(new Date());
      return { start: today, end: today };
    },
  },
  {
    label: "Yesterday",
    getRange: () => {
      const yesterday = startOfDay(addDays(new Date(), -1));
      return { start: yesterday, end: yesterday };
    },
  },
  {
    label: "Last 7 days",
    getRange: () => {
      const today = startOfDay(new Date());
      return { start: addDays(today, -6), end: today };
    },
  },
  {
    label: "Last 30 days",
    getRange: () => {
      const today = startOfDay(new Date());
      return { start: addDays(today, -29), end: today };
    },
  },
  {
    label: "This month",
    getRange: () => {
      const today = startOfDay(new Date());
      return { start: startOfMonth(today), end: today };
    },
  },
  {
    label: "Last month",
    getRange: () => {
      const start = addMonths(startOfMonth(new Date()), -1);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      return { start, end };
    },
  },
];

function FigmaCalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 1.5V4.5M12 1.5V4.5M2.25 7.5H15.75M3.75 3H14.25C15.0784 3 15.75 3.67157 15.75 4.5V15C15.75 15.8284 15.0784 16.5 14.25 16.5H3.75C2.92157 16.5 2.25 15.8284 2.25 15V4.5C2.25 3.67157 2.92157 3 3.75 3Z"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      className,
      state,
      value,
      defaultValue,
      onValueChange,
      placeholder = DEFAULT_PLACEHOLDER,
      presets = DEFAULT_DATE_RANGE_PRESETS,
      minDate,
      maxDate,
      disablePastDates = false,
      disabled = false,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      portalContainer,
      formatRange,
      triggerClassName,
      triggerLabelClassName,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const triggerId = id ?? generatedId;
    const isValueControlled = value !== undefined;
    const isOpenControlled = controlledOpen !== undefined;
    const [internalValue, setInternalValue] = React.useState(() =>
      normalizeValue(defaultValue)
    );
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const currentValue = normalizeValue(
      isValueControlled ? value : internalValue
    );
    const open = isOpenControlled ? controlledOpen : internalOpen;

    // Draft state — the calendar operates on a working copy of the range so
    // that Cancel can discard in-progress selections and Apply commits them.
    const [draftValue, setDraftValue] = React.useState<DateRangeValue>(
      () => currentValue
    );
    // Tracks whether the next day click should complete the range (true) or
    // start a new one (false). Drives the "click 1 = start, click 2 = end,
    // click 3 = restart" cycle.
    const [pendingEnd, setPendingEnd] = React.useState(false);
    const [visibleMonth, setVisibleMonth] = React.useState(() =>
      startOfMonth(currentValue.start ?? currentValue.end ?? new Date())
    );

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const popoverRef = React.useRef<HTMLDivElement | null>(null);
    const usesContainerPortal = portalContainer !== undefined;
    const floatingStrategy: Strategy = usesContainerPortal
      ? "absolute"
      : "fixed";
    const floatingMiddleware = React.useMemo(
      () => [
        offset(POPOVER_GAP),
        flip({ padding: POPOVER_MARGIN }),
        shift({ padding: POPOVER_MARGIN }),
        floatingSize({
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
    const { refs, floatingStyles, isPositioned } =
      useFloating<HTMLButtonElement>({
        open,
        placement: CALENDAR_PLACEMENT,
        strategy: floatingStrategy,
        transform: false,
        middleware: floatingMiddleware,
        whileElementsMounted: (reference, floating, update) =>
          autoUpdate(reference, floating, update, { animationFrame: true }),
      });
    const calendarDays = React.useMemo(
      () => getCalendarDays(visibleMonth),
      [visibleMonth]
    );
    const displayValue = (formatRange ?? defaultFormatRange)(currentValue);
    const effectiveMinDate = React.useMemo(() => {
      if (!disablePastDates) return minDate;

      const today = startOfDay(new Date());
      if (!minDate) return today;

      return isBeforeDay(minDate, today) ? today : minDate;
    }, [disablePastDates, minDate]);
    const portalMount =
      typeof document !== "undefined"
        ? usesContainerPortal
          ? portalContainer
          : document.body
        : null;

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (!isOpenControlled) {
          setInternalOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
      },
      [isOpenControlled, onOpenChange]
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
        refs.setFloating(node);
      },
      [refs]
    );

    // Reset the draft to the last committed value (and jump the calendar to
    // that month) each time the popover opens, so a Cancel from a previous
    // session never leaks into the next one.
    const currentValueRef = React.useRef(currentValue);
    React.useEffect(() => {
      currentValueRef.current = currentValue;
    });

    React.useEffect(() => {
      if (!open) return;

      const latestValue = currentValueRef.current;
      setDraftValue(latestValue);
      setPendingEnd(false);
      setVisibleMonth(
        startOfMonth(latestValue.start ?? latestValue.end ?? new Date())
      );
    }, [open]);

    React.useEffect(() => {
      if (!open) return;

      const handlePointerDown = (event: MouseEvent) => {
        if (
          !isPointerInsideElement(event, rootRef.current) &&
          !isPointerInsideElement(event, popoverRef.current)
        ) {
          setOpen(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [open, setOpen]);

    const commitValue = React.useCallback(
      (nextValue: DateRangeValue) => {
        if (!isValueControlled) {
          setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
      [isValueControlled, onValueChange]
    );

    const handlePresetClick = (preset: DateRangePreset) => {
      const range = preset.getRange();
      commitValue(range);
      setOpen(false);
    };

    const handleDayClick = (day: Date) => {
      if (!pendingEnd) {
        setDraftValue({ start: day, end: day });
        setPendingEnd(true);
        return;
      }

      // Second click completes the range — commit and close immediately,
      // the same way a preset does, since there's no Apply step anymore.
      const start = draftValue.start ?? day;
      const nextValue = isBeforeDay(day, start)
        ? { start: day, end: start }
        : { start, end: day };

      setDraftValue(nextValue);
      setPendingEnd(false);
      commitValue(nextValue);
      setOpen(false);
    };

    const popover =
      open &&
      !disabled &&
      portalMount &&
      createPortal(
        <div
          ref={setPopoverRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${triggerId}-calendar-heading`}
          className={cn(
            "flex flex-col rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary shadow-lg overflow-y-auto overflow-x-hidden overscroll-contain pointer-events-auto",
            "[scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:var(--semantic-border-secondary)_transparent]",
            "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-semantic-border-secondary"
          )}
          style={{
            ...floatingStyles,
            maxWidth: `calc(100vw - ${POPOVER_MARGIN * 2}px)`,
            maxHeight: `var(${POPOVER_SCROLL_HEIGHT_VAR}, min(${MAX_POPOVER_HEIGHT}px, calc(100dvh - ${
              POPOVER_MARGIN * 2
            }px)))`,
            zIndex: 10050,
            visibility: isPositioned ? undefined : "hidden",
          }}
          onPointerDown={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          <div className="flex flex-row">
            {presets.length > 0 && (
              <div className="flex w-36 shrink-0 flex-col gap-0.5 border-r border-solid border-semantic-border-layout p-3">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="w-full rounded px-2 py-1.5 text-left text-sm text-semantic-text-primary transition-colors hover:bg-semantic-bg-hover"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            <div className="min-w-[272px] flex-1 p-3 touch-pan-y">
              <div className="mb-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  className="p-1 rounded hover:bg-semantic-bg-hover text-semantic-text-secondary transition-colors"
                  onClick={() =>
                    setVisibleMonth((month) => addMonths(month, -1))
                  }
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>

                <div
                  id={`${triggerId}-calendar-heading`}
                  className="flex items-center gap-2"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="rounded border border-solid border-semantic-border-layout px-3 py-1.5 text-sm font-semibold text-semantic-text-primary transition-colors hover:bg-semantic-bg-hover"
                      >
                        {MONTH_LONG_NAMES[visibleMonth.getMonth()]}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className={cn(CALENDAR_DROPDOWN_Z_INDEX, "max-h-[240px] overflow-y-auto")}
                    >
                      {MONTH_LONG_NAMES.map((label, monthIndex) => (
                        <DropdownMenuItem
                          key={label}
                          onSelect={() =>
                            setVisibleMonth(
                              startOfMonth(
                                new Date(visibleMonth.getFullYear(), monthIndex, 1)
                              )
                            )
                          }
                        >
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded border border-solid border-semantic-border-layout px-3 py-1.5 text-sm font-semibold text-semantic-text-primary transition-colors hover:bg-semantic-bg-hover"
                      >
                        {visibleMonth.getFullYear()}
                        <ChevronDown
                          className="size-3.5 text-semantic-text-muted"
                          aria-hidden="true"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className={cn(CALENDAR_DROPDOWN_Z_INDEX, "max-h-[240px] overflow-y-auto")}
                    >
                      {Array.from(
                        { length: YEAR_OPTIONS_SPAN * 2 + 1 },
                        (_, index) => visibleMonth.getFullYear() - YEAR_OPTIONS_SPAN + index
                      ).map((year) => (
                        <DropdownMenuItem
                          key={year}
                          onSelect={() =>
                            setVisibleMonth(
                              startOfMonth(new Date(year, visibleMonth.getMonth(), 1))
                            )
                          }
                        >
                          {year}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <button
                  type="button"
                  aria-label="Next month"
                  className="p-1 rounded hover:bg-semantic-bg-hover text-semantic-text-secondary transition-colors"
                  onClick={() =>
                    setVisibleMonth((month) => addMonths(month, 1))
                  }
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-7">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="flex h-8 items-center justify-center text-xs font-medium text-semantic-text-muted"
                  >
                    {day}
                  </div>
                ))}
                {calendarDays.map((day) => {
                  const isCurrentMonth =
                    day.getMonth() === visibleMonth.getMonth();
                  const isToday = isSameDay(day, new Date());
                  const { start, end } = draftValue;
                  const hasRange = !!start && !!end && !isSameDay(start, end);
                  const isRangeStart = isSameDay(day, start);
                  const isRangeEnd = isSameDay(day, end);
                  const isBetween =
                    hasRange &&
                    !!start &&
                    !!end &&
                    isAfterDay(day, start) &&
                    isBeforeDay(day, end);
                  const isInBand =
                    hasRange && (isRangeStart || isRangeEnd || isBetween);
                  const isSelectedEdge = isRangeStart || isRangeEnd;
                  const isDisabled =
                    (effectiveMinDate &&
                      isBeforeDay(day, effectiveMinDate)) ||
                    (maxDate && isAfterDay(day, maxDate));
                  const dayLabel = day.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "relative flex h-8 items-center justify-center",
                        isInBand && "bg-semantic-info-surface",
                        isRangeStart && hasRange && "rounded-l-full",
                        isRangeEnd && hasRange && "rounded-r-full"
                      )}
                    >
                      <button
                        type="button"
                        aria-label={dayLabel}
                        aria-pressed={isSelectedEdge}
                        aria-current={isToday ? "date" : undefined}
                        disabled={!!isDisabled}
                        className={cn(
                          "relative flex size-8 items-center justify-center rounded-full text-xs transition-colors",
                          isSelectedEdge
                            ? "bg-semantic-primary text-semantic-text-inverted font-semibold"
                            : isCurrentMonth
                              ? "text-semantic-text-primary hover:bg-semantic-bg-hover"
                              : "text-semantic-text-muted hover:bg-semantic-bg-hover",
                          isDisabled &&
                            "opacity-40 cursor-not-allowed pointer-events-none"
                        )}
                        onClick={() => {
                          if (isDisabled) return;

                          handleDayClick(day);
                        }}
                      >
                        {day.getDate()}
                        {isToday && !isSelectedEdge && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-semantic-primary" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        portalMount
      );

    return (
      <div
        ref={(node) => {
          rootRef.current = node;

          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
          }
        }}
        className={cn("relative inline-block w-full max-w-full", className)}
        {...props}
      >
        <button
          ref={setTriggerRef}
          id={triggerId}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            dateRangePickerTriggerVariants({ state }),
            open &&
              state !== "error" &&
              "border-semantic-border-input-focus/50 shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
            !displayValue && "text-semantic-text-placeholder",
            triggerClassName
          )}
          onClick={() => setOpen(!open)}
        >
          <FigmaCalendarIcon className="size-[18px] shrink-0 text-semantic-text-secondary" />
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              !displayValue && "font-normal",
              triggerLabelClassName
            )}
          >
            {displayValue || placeholder}
          </span>
        </button>

        {popover}
      </div>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker, dateRangePickerTriggerVariants };
