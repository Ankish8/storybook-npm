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
import { ChevronLeft, ChevronRight, Clock2, X } from "lucide-react";

import { cn } from "@/lib/utils";

const DEFAULT_START_TIME = "10:30:00";
const DEFAULT_END_TIME = "12:30:00";
const DEFAULT_PLACEHOLDER = "--/--/-- -- : --";
const POPOVER_WIDTH = 336;
const POPOVER_MARGIN = 8;
const POPOVER_GAP = 4;
const MAX_POPOVER_HEIGHT = 420;
const POPOVER_SCROLL_HEIGHT_VAR = "--date-time-picker-scroll-height";
const POPOVER_WIDTH_VAR = "--date-time-picker-popover-width";
const CALENDAR_PLACEMENT: Placement = "bottom-start";
const YEAR_RANGE_BEFORE = 100;
const YEAR_RANGE_AFTER = 10;

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthNames = Array.from({ length: 12 }, (_, monthIndex) =>
  new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    new Date(2026, monthIndex, 1)
  )
);
const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const dateTimePickerVariants = cva("relative inline-block w-full max-w-full", {
  variants: {
    size: {
      sm: "sm:w-[280px]",
      default: "sm:w-[336px]",
      lg: "sm:w-[360px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const dateTimePickerTriggerVariants = cva(
  "flex w-full items-center justify-between border border-solid border-semantic-border-input bg-semantic-bg-primary text-left text-semantic-text-primary outline-none transition-colors hover:border-semantic-border-input-focus/50 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-9 gap-2 rounded-lg px-3 py-2 text-sm",
        default: "h-10 gap-2 rounded-lg px-4 py-2.5 text-sm",
        lg: "h-10 gap-2 rounded-lg px-4 py-2.5 text-sm",
      },
      state: {
        default: "",
        error:
          "border-semantic-error-primary hover:border-semantic-error-primary",
      },
    },
    defaultVariants: {
      size: "default",
      state: "default",
    },
  }
);

export interface DateTimePickerValue {
  date?: Date;
  startTime: string;
  endTime: string;
}

export interface DateTimePickerProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">,
    VariantProps<typeof dateTimePickerVariants>,
    Pick<VariantProps<typeof dateTimePickerTriggerVariants>, "state"> {
  value?: DateTimePickerValue;
  defaultValue?: DateTimePickerValue;
  onValueChange?: (value: DateTimePickerValue) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  showEndTime?: boolean;
  showClear?: boolean;
  closeOnSelect?: boolean;
  startTimeLabel?: string;
  endTimeLabel?: string;
  minDate?: Date;
  maxDate?: Date;
  disablePastDates?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  portalContainer?: HTMLElement | null;
}

function normalizeValue(
  value?: Partial<DateTimePickerValue>
): DateTimePickerValue {
  return {
    date: value?.date,
    startTime: value?.startTime ?? DEFAULT_START_TIME,
    endTime: value?.endTime ?? DEFAULT_END_TIME,
  };
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

function getMonthKey(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

function isMonthBefore(date: Date, minDate: Date) {
  return getMonthKey(date) < getMonthKey(minDate);
}

function isMonthAfter(date: Date, maxDate: Date) {
  return getMonthKey(date) > getMonthKey(maxDate);
}

function clampMonth(date: Date, minDate?: Date, maxDate?: Date) {
  if (minDate && isMonthBefore(date, minDate)) return startOfMonth(minDate);
  if (maxDate && isMonthAfter(date, maxDate)) return startOfMonth(maxDate);

  return startOfMonth(date);
}

function getYearOptions(visibleMonth: Date, minDate?: Date, maxDate?: Date) {
  const currentYear = new Date().getFullYear();
  const selectedYear = visibleMonth.getFullYear();
  const startYear = Math.min(
    minDate?.getFullYear() ?? currentYear - YEAR_RANGE_BEFORE,
    selectedYear
  );
  const endYear = Math.max(
    maxDate?.getFullYear() ?? currentYear + YEAR_RANGE_AFTER,
    selectedYear
  );

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index
  );
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

function formatTimeForDisplay(time: string) {
  const [hour = "0", minute = "0"] = time.split(":");
  const hourNumber = Number(hour);
  const suffix = hourNumber >= 12 ? "PM" : "AM";
  const hour12 = hourNumber % 12 || 12;

  return `${hour12.toString().padStart(2, "0")}:${minute.padStart(2, "0")} ${suffix}`;
}

function formatDateForDisplay(date?: Date, time?: string) {
  if (!date) return "";

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  const formattedTime = formatTimeForDisplay(time ?? DEFAULT_START_TIME);

  return `${day}/${month}/${year} ${formattedTime}`;
}

function parseDatePart(datePart: string) {
  const isoMatch = datePart.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const dayFirstMatch = datePart.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  const [, yearValue, isoMonthValue, isoDayValue] = isoMatch ?? [];
  const [, dayValue, monthValue, dayFirstYearValue] = dayFirstMatch ?? [];

  const year = Number(yearValue ?? dayFirstYearValue);
  const month = Number(isoMonthValue ?? monthValue);
  const day = Number(isoDayValue ?? dayValue);

  if (!year || !month || !day) return null;

  const parsedDate = new Date(year, month - 1, day);
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  return parsedDate;
}

function parseTimePart(timePart?: string) {
  if (!timePart) return undefined;

  const timeMatch = timePart
    .trim()
    .match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!timeMatch) return null;

  const [, hourValue, minuteValue, secondValue = "00", meridiem] = timeMatch;
  let hour = Number(hourValue);
  const minute = Number(minuteValue);
  const second = Number(secondValue);

  if (
    minute > 59 ||
    second > 59 ||
    (meridiem ? hour < 1 || hour > 12 : hour > 23)
  ) {
    return null;
  }

  if (meridiem) {
    const normalizedMeridiem = meridiem.toUpperCase();
    if (normalizedMeridiem === "AM") {
      hour = hour === 12 ? 0 : hour;
    } else {
      hour = hour === 12 ? 12 : hour + 12;
    }
  }

  return `${hour.toString().padStart(2, "0")}:${minuteValue}:${secondValue}`;
}

function parseTypedDateTime(value: string) {
  const typedValue = value.trim();
  if (!typedValue) return undefined;

  const typedMatch = typedValue.match(
    /^(\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{4})(?:\s+(.+))?$/
  );
  if (!typedMatch) return null;

  const [, datePart, timePart] = typedMatch;
  const date = parseDatePart(datePart);
  const startTime = parseTimePart(timePart);

  if (!date || startTime === null) return null;

  return { date, startTime };
}

function formatHiddenValue(value: DateTimePickerValue) {
  if (!value.date) return "";

  const month = (value.date.getMonth() + 1).toString().padStart(2, "0");
  const day = value.date.getDate().toString().padStart(2, "0");
  const year = value.date.getFullYear();

  return `${year}-${month}-${day}T${value.startTime}`;
}

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
        d="M6 1.5V4.5M12 1.5V4.5M2.25 6.375H15.75M3.75 3H14.25C15.0784 3 15.75 3.67157 15.75 4.5V15C15.75 15.8284 15.0784 16.5 14.25 16.5H3.75C2.92157 16.5 2.25 15.8284 2.25 15V4.5C2.25 3.67157 2.92157 3 3.75 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DateTimePicker = React.forwardRef<HTMLDivElement, DateTimePickerProps>(
  (
    {
      className,
      size,
      state,
      value,
      defaultValue,
      onValueChange,
      placeholder = DEFAULT_PLACEHOLDER,
      disabled = false,
      readOnly = false,
      name,
      showEndTime = true,
      showClear = true,
      closeOnSelect = false,
      startTimeLabel = "Start Time",
      endTimeLabel = "End Time",
      minDate,
      maxDate,
      disablePastDates = false,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      portalContainer,
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
    const [visibleMonth, setVisibleMonth] = React.useState(() =>
      startOfMonth(currentValue.date ?? new Date())
    );
    const [dateInputValue, setDateInputValue] = React.useState(() =>
      formatDateForDisplay(currentValue.date, currentValue.startTime)
    );
    const [isDateInputFocused, setIsDateInputFocused] = React.useState(false);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLDivElement | null>(null);
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
          apply({ availableHeight, elements, rects }) {
            const maxHeight = Math.max(
              1,
              Math.min(MAX_POPOVER_HEIGHT, availableHeight)
            );
            elements.floating.style.setProperty(
              POPOVER_SCROLL_HEIGHT_VAR,
              `${maxHeight}px`
            );
            elements.floating.style.setProperty(
              POPOVER_WIDTH_VAR,
              `${rects.reference.width}px`
            );
          },
        }),
      ],
      []
    );
    const { refs, floatingStyles, isPositioned } = useFloating<HTMLDivElement>({
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
    const displayValue = formatDateForDisplay(
      currentValue.date,
      currentValue.startTime
    );
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
      (node: HTMLDivElement | null) => {
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

    React.useEffect(() => {
      if (currentValue.date) {
        setVisibleMonth(startOfMonth(currentValue.date));
      }
    }, [currentValue.date]);

    React.useEffect(() => {
      if (!isDateInputFocused) {
        setDateInputValue(displayValue);
      }
    }, [displayValue, isDateInputFocused]);

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

    const updateValue = React.useCallback(
      (nextValue: DateTimePickerValue) => {
        if (!isValueControlled) {
          setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
      [isValueControlled, onValueChange]
    );

    const clearValue = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (readOnly) return;

      setDateInputValue("");
      updateValue({
        date: undefined,
        startTime: currentValue.startTime,
        endTime: currentValue.endTime,
      });
    };

    const yearOptions = React.useMemo(
      () => getYearOptions(visibleMonth, effectiveMinDate, maxDate),
      [effectiveMinDate, maxDate, visibleMonth]
    );

    const updateVisibleMonth = React.useCallback(
      (nextMonth: Date) => {
        setVisibleMonth(clampMonth(nextMonth, effectiveMinDate, maxDate));
      },
      [effectiveMinDate, maxDate]
    );

    const handleTypedDateChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const nextInputValue = event.target.value;
      setDateInputValue(nextInputValue);

      const typedDateTime = parseTypedDateTime(nextInputValue);
      if (typedDateTime === undefined) {
        updateValue({ ...currentValue, date: undefined });
        return;
      }

      if (
        typedDateTime &&
        !(
          effectiveMinDate && isBeforeDay(typedDateTime.date, effectiveMinDate)
        ) &&
        !(maxDate && isAfterDay(typedDateTime.date, maxDate))
      ) {
        updateValue({
          ...currentValue,
          date: typedDateTime.date,
          startTime: typedDateTime.startTime ?? currentValue.startTime,
        });
        updateVisibleMonth(typedDateTime.date);
      }
    };

    const handleTypedDateBlur = () => {
      setIsDateInputFocused(false);
      setDateInputValue(
        formatDateForDisplay(currentValue.date, currentValue.startTime)
      );
    };

    const popover =
      open &&
      !disabled &&
      !readOnly &&
      portalMount &&
      createPortal(
        <div
          ref={setPopoverRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${triggerId}-calendar-heading`}
          className={cn(
            "rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary shadow-lg flex flex-col min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain pointer-events-auto",
            "[scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:var(--semantic-border-secondary)_transparent]",
            "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-semantic-border-secondary"
          )}
          style={{
            ...floatingStyles,
            width: `var(${POPOVER_WIDTH_VAR}, ${POPOVER_WIDTH}px)`,
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
          <div className="p-3 touch-pan-y">
            <div className="mb-3 flex items-center justify-between gap-2">
              <button
                type="button"
                aria-label="Previous month"
                className="p-1 rounded hover:bg-semantic-bg-hover text-semantic-text-secondary transition-colors"
                onClick={() => updateVisibleMonth(addMonths(visibleMonth, -1))}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <div className="flex min-w-0 items-center gap-2">
                <label className="sr-only" htmlFor={`${triggerId}-month`}>
                  Month
                </label>
                <select
                  id={`${triggerId}-month`}
                  aria-label="Month"
                  value={visibleMonth.getMonth()}
                  className="h-8 rounded-md border border-solid border-semantic-border-input bg-semantic-bg-primary px-2 text-sm font-medium text-semantic-text-primary outline-none transition-colors hover:border-semantic-border-input-focus/50 focus:border-semantic-border-input-focus/50"
                  onChange={(event) =>
                    updateVisibleMonth(
                      new Date(
                        visibleMonth.getFullYear(),
                        Number(event.target.value),
                        1
                      )
                    )
                  }
                >
                  {monthNames.map((monthName, monthIndex) => {
                    const optionMonth = new Date(
                      visibleMonth.getFullYear(),
                      monthIndex,
                      1
                    );
                    const isDisabled =
                      (effectiveMinDate &&
                        isMonthBefore(optionMonth, effectiveMinDate)) ||
                      (maxDate && isMonthAfter(optionMonth, maxDate));

                    return (
                      <option
                        key={monthName}
                        value={monthIndex}
                        disabled={!!isDisabled}
                      >
                        {monthName}
                      </option>
                    );
                  })}
                </select>
                <label className="sr-only" htmlFor={`${triggerId}-year`}>
                  Year
                </label>
                <select
                  id={`${triggerId}-year`}
                  aria-label="Year"
                  value={visibleMonth.getFullYear()}
                  className="h-8 rounded-md border border-solid border-semantic-border-input bg-semantic-bg-primary px-2 text-sm font-medium text-semantic-text-primary outline-none transition-colors hover:border-semantic-border-input-focus/50 focus:border-semantic-border-input-focus/50"
                  onChange={(event) =>
                    updateVisibleMonth(
                      new Date(
                        Number(event.target.value),
                        visibleMonth.getMonth(),
                        1
                      )
                    )
                  }
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div id={`${triggerId}-calendar-heading`} className="sr-only">
                  {monthFormatter.format(visibleMonth)}
                </div>
              </div>
              <button
                type="button"
                aria-label="Next month"
                className="p-1 rounded hover:bg-semantic-bg-hover text-semantic-text-secondary transition-colors"
                onClick={() => updateVisibleMonth(addMonths(visibleMonth, 1))}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-7">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="flex size-8 items-center justify-center text-xs font-medium text-semantic-text-muted"
                >
                  {day}
                </div>
              ))}
              {calendarDays.map((day) => {
                const isCurrentMonth =
                  day.getMonth() === visibleMonth.getMonth();
                const isSelected = isSameDay(day, currentValue.date);
                const isToday = isSameDay(day, new Date());
                const isDisabled =
                  (effectiveMinDate && isBeforeDay(day, effectiveMinDate)) ||
                  (maxDate && isAfterDay(day, maxDate));
                const dayLabel = day.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    aria-label={dayLabel}
                    aria-pressed={isSelected}
                    aria-current={isToday ? "date" : undefined}
                    disabled={!!isDisabled}
                    className={cn(
                      "relative flex items-center justify-center size-8 mx-auto rounded-full text-xs transition-colors",
                      isSelected
                        ? "bg-semantic-primary text-semantic-text-inverted font-semibold"
                        : isCurrentMonth
                          ? "text-semantic-text-primary hover:bg-semantic-bg-hover"
                          : "text-semantic-text-muted hover:bg-semantic-bg-hover",
                      isDisabled &&
                        "opacity-40 cursor-not-allowed pointer-events-none"
                    )}
                    onClick={() => {
                      if (isDisabled) return;

                      updateValue({ ...currentValue, date: day });
                      if (closeOnSelect) {
                        setOpen(false);
                      }
                    }}
                  >
                    {day.getDate()}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-semantic-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 border-t border-solid border-semantic-border-layout bg-semantic-bg-primary p-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${triggerId}-start-time`}
                className="block text-sm font-semibold text-semantic-text-primary"
              >
                {startTimeLabel}
              </label>
              <div className="relative">
                <Clock2
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-semantic-text-muted"
                  aria-hidden="true"
                />
                <input
                  id={`${triggerId}-start-time`}
                  type="time"
                  step="1"
                  value={currentValue.startTime}
                  className="h-8 w-full rounded-md border border-solid border-semantic-border-input bg-semantic-bg-primary pl-9 pr-3 text-sm text-semantic-text-primary outline-none transition-colors hover:border-semantic-border-input-focus/50 focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
                  onChange={(event) =>
                    updateValue({
                      ...currentValue,
                      startTime: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            {showEndTime && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`${triggerId}-end-time`}
                  className="block text-sm font-semibold text-semantic-text-primary"
                >
                  {endTimeLabel}
                </label>
                <div className="relative">
                  <Clock2
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-semantic-text-muted"
                    aria-hidden="true"
                  />
                  <input
                    id={`${triggerId}-end-time`}
                    type="time"
                    step="1"
                    value={currentValue.endTime}
                    className="h-8 w-full rounded-md border border-solid border-semantic-border-input bg-semantic-bg-primary pl-9 pr-3 text-sm text-semantic-text-primary outline-none transition-colors hover:border-semantic-border-input-focus/50 focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
                    onChange={(event) =>
                      updateValue({
                        ...currentValue,
                        endTime: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
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
        className={cn(dateTimePickerVariants({ size, className }))}
        {...props}
      >
        {name && (
          <input
            type="hidden"
            name={name}
            value={formatHiddenValue(currentValue)}
          />
        )}
        <div
          ref={setTriggerRef}
          className={cn(
            dateTimePickerTriggerVariants({ size, state }),
            open &&
              state !== "error" &&
              "border-semantic-border-input-focus/50 shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
            !displayValue && "text-semantic-text-placeholder"
          )}
        >
          <input
            id={triggerId}
            type="text"
            disabled={disabled}
            readOnly={readOnly}
            value={dateInputValue}
            placeholder={placeholder}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label="Date and time"
            className="min-w-0 flex-1 bg-transparent text-sm text-semantic-text-primary outline-none placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed read-only:cursor-not-allowed"
            onFocus={() => {
              setIsDateInputFocused(true);
              setOpen(true);
            }}
            onClick={() => setOpen(true)}
            onChange={handleTypedDateChange}
            onBlur={handleTypedDateBlur}
          />
          {showClear && displayValue && !disabled && !readOnly && (
            <button
              type="button"
              aria-label="Clear date"
              className="inline-flex size-5 items-center justify-center rounded text-semantic-text-muted hover:bg-semantic-bg-hover hover:text-semantic-text-primary"
              onClick={clearValue}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            disabled={disabled || readOnly}
            aria-label="Open calendar"
            className="inline-flex shrink-0 items-center justify-center rounded text-semantic-text-muted hover:bg-semantic-bg-hover hover:text-semantic-text-primary disabled:cursor-not-allowed"
            onClick={() => setOpen(!open)}
          >
            <FigmaCalendarIcon
              className={cn(size === "sm" ? "size-4" : "size-[18px]")}
            />
          </button>
        </div>

        {popover}
      </div>
    );
  }
);
DateTimePicker.displayName = "DateTimePicker";

export {
  DateTimePicker,
  dateTimePickerTriggerVariants,
  dateTimePickerVariants,
  formatDateForDisplay,
  formatTimeForDisplay,
};
