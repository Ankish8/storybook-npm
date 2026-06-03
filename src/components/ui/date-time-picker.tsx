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
const DEFAULT_PLACEHOLDER = "--/--/---- --:-- --";
const POPOVER_WIDTH = 336;
const POPOVER_MARGIN = 8;
const POPOVER_GAP = 4;
const MAX_POPOVER_HEIGHT = 420;
const POPOVER_SCROLL_HEIGHT_VAR = "--date-time-picker-scroll-height";
const POPOVER_WIDTH_VAR = "--date-time-picker-popover-width";
const CALENDAR_PLACEMENT: Placement = "bottom-start";
const YEAR_RANGE_BEFORE = 100;
const YEAR_RANGE_AFTER = 10;
const CALENDAR_DROPDOWN_TRIGGER_CLASS =
  "h-9 min-w-[90px] rounded-md border border-solid border-semantic-border-input bg-semantic-bg-primary px-3 text-sm text-semantic-text-primary outline-none transition-colors hover:border-semantic-border-input-focus/50 focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]";
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
    variant: {
      "date-time": "",
      "date-only": "",
      "time-only": "",
    },
    size: {
      sm: "sm:w-[280px]",
      default: "sm:w-[336px]",
      lg: "sm:w-[360px]",
    },
  },
  defaultVariants: {
    variant: "date-time",
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
  showSeconds?: boolean;
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

type DateTimePickerVariant = NonNullable<
  VariantProps<typeof dateTimePickerVariants>["variant"]
>;
type CalendarDropdownKind = "month" | "year";

interface CalendarDropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
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

function isSelectableDay(date: Date, minDate?: Date, maxDate?: Date) {
  return (
    !(minDate && isBeforeDay(date, minDate)) &&
    !(maxDate && isAfterDay(date, maxDate))
  );
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

function timeHasVisibleSeconds(time?: string) {
  const [, , second = "00"] = (time ?? "").split(":");
  return /^\d{1,2}$/.test(second) && Number(second) !== 0;
}

function formatTimeForDisplay(time: string, showSeconds = false) {
  const [hour = "0", minute = "0", second = "00"] = time.split(":");
  const hourNumber = Number(hour);
  const suffix = hourNumber >= 12 ? "PM" : "AM";
  const hour12 = hourNumber % 12 || 12;
  const normalizedSecond = second.padStart(2, "0");
  const formattedTime = showSeconds
    ? `${hour12.toString().padStart(2, "0")}:${minute.padStart(2, "0")}:${normalizedSecond}`
    : `${hour12.toString().padStart(2, "0")}:${minute.padStart(2, "0")}`;

  return `${formattedTime} ${suffix}`;
}

function formatDateForDisplay(date?: Date, time?: string, showSeconds = false) {
  if (!date) return "";

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  const formattedTime = formatTimeForDisplay(
    time ?? DEFAULT_START_TIME,
    showSeconds
  );

  return `${day}/${month}/${year} ${formattedTime}`;
}

function formatDateOnlyForDisplay(date?: Date) {
  if (!date) return "";

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatValueForDisplay(
  value: DateTimePickerValue,
  variant: DateTimePickerVariant,
  showEndTime: boolean,
  hasTimeValue: boolean,
  showSeconds: boolean
) {
  if (variant === "date-only") {
    return formatDateOnlyForDisplay(value.date);
  }

  if (variant === "time-only") {
    if (!hasTimeValue) return "";

    return showEndTime
      ? `${formatTimeForDisplay(value.startTime, showSeconds)} - ${formatTimeForDisplay(value.endTime, showSeconds)}`
      : formatTimeForDisplay(value.startTime, showSeconds);
  }

  return formatDateForDisplay(value.date, value.startTime, showSeconds);
}

function getDefaultPlaceholder(
  variant: DateTimePickerVariant,
  showSeconds: boolean
) {
  if (variant === "date-only") return "--/--/----";
  if (variant === "time-only") {
    return showSeconds ? "--:--:-- --" : "--:-- --";
  }

  if (showSeconds) return "--/--/---- --:--:-- --";

  return DEFAULT_PLACEHOLDER;
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

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getPotentialMaxDay(month: number, year?: number) {
  if (month === 2 && year === undefined) return 29;
  if (month === 2) return getDaysInMonth(year ?? 2000, month);
  if ([4, 6, 9, 11].includes(month)) return 30;

  return 31;
}

function isPotentiallyValidDateParts(
  dayValue: string,
  monthValue: string,
  yearValue: string
) {
  const day = Number(dayValue);
  const month = Number(monthValue);
  const year = Number(yearValue);

  if (dayValue.length === 1 && day > 3) return false;
  if (dayValue.length === 2 && (day < 1 || day > 31)) return false;
  if (monthValue.length === 1 && month > 1) return false;
  if (monthValue.length === 2 && (month < 1 || month > 12)) return false;
  if (yearValue.length === 4 && year < 1000) return false;

  if (dayValue.length === 2 && monthValue.length === 2) {
    const maxDay = getPotentialMaxDay(
      month,
      yearValue.length === 4 ? year : undefined
    );
    if (day > maxDay) return false;
  }

  return true;
}

function isPotentiallyValidDateDigits(dateDigits: string) {
  return isPotentiallyValidDateParts(
    dateDigits.slice(0, 2),
    dateDigits.slice(2, 4),
    dateDigits.slice(4, 8)
  );
}

function formatDateDigits(dateDigits: string) {
  const day = dateDigits.slice(0, 2);
  const month = dateDigits.slice(2, 4);
  const year = dateDigits.slice(4, 8);

  if (dateDigits.length <= 2) {
    return dateDigits.length === 2 ? `${day}/` : day;
  }

  if (dateDigits.length <= 4) {
    return `${day}/${dateDigits.length === 4 ? `${month}/` : month}`;
  }

  return `${day}/${month}/${year}`;
}

function formatSegmentedDateInput(
  dateSource: string,
  day: string,
  month: string,
  year: string
) {
  const separatorCount = dateSource.match(/[/-]/g)?.length ?? 0;
  const shouldShowMonth = separatorCount >= 1 || !!month || !!year;
  const shouldShowYear = separatorCount >= 2 || !!year;

  return [
    day,
    shouldShowMonth ? month : undefined,
    shouldShowYear ? year : undefined,
  ]
    .filter((part): part is string => part !== undefined)
    .join("/");
}

function consumeDigits(source: string, maxLength: number) {
  let digits = "";
  let endIndex = source.length;

  for (let index = 0; index < source.length; index += 1) {
    if (!/\d/.test(source[index])) continue;

    digits += source[index];
    if (digits.length === maxLength) {
      endIndex = index + 1;
      break;
    }
  }

  return {
    digits,
    rest: source.slice(endIndex),
  };
}

function splitTypedDateInput(value: string) {
  const firstSpaceIndex = value.search(/\s/);
  const dateSource =
    firstSpaceIndex === -1 ? value : value.slice(0, firstSpaceIndex);
  const restValue =
    firstSpaceIndex === -1 ? "" : value.slice(firstSpaceIndex + 1);

  if (/[/-]/.test(dateSource)) {
    const [dayPart = "", monthPart = "", yearPart = ""] =
      dateSource.split(/[/-]/);
    const dayResult = consumeDigits(dayPart, 2);
    const monthResult = consumeDigits(`${dayResult.rest}${monthPart}`, 2);
    const yearResult = consumeDigits(
      `${monthResult.rest}${yearPart}`,
      4
    );
    const day = dayResult.digits;
    const month = monthResult.digits;
    const year = yearResult.digits;

    return {
      dateDigits: `${day}${month}${year}`,
      dateValue: formatSegmentedDateInput(dateSource, day, month, year),
      isComplete: !!day && !!month && year.length === 4,
      isValid: isPotentiallyValidDateParts(day, month, year),
      restValue: [yearResult.rest, restValue].filter(Boolean).join(" "),
    };
  }

  let dateDigits = "";
  let dateEndIndex = value.length;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (/\d/.test(character)) {
      dateDigits += character;
      if (dateDigits.length === 8) {
        dateEndIndex = index + 1;
        break;
      }
    }
  }

  return {
    dateDigits,
    dateValue: formatDateDigits(dateDigits),
    isComplete: dateDigits.length === 8,
    isValid: isPotentiallyValidDateDigits(dateDigits),
    restValue: value.slice(dateEndIndex),
  };
}

function isPotentiallyValidTimeDigits(timeDigits: string, showSeconds: boolean) {
  const hourValue = timeDigits.slice(0, 2);
  const minuteValue = timeDigits.slice(2, 4);
  const secondValue = showSeconds ? timeDigits.slice(4, 6) : "";
  const hour = Number(hourValue);
  const minute = Number(minuteValue);
  const second = Number(secondValue);

  if (hourValue.length === 1 && hour > 1) return false;
  if (hourValue.length === 2 && (hour < 1 || hour > 12)) return false;
  if (minuteValue.length === 1 && minute > 5) return false;
  if (minuteValue.length === 2 && minute > 59) return false;
  if (showSeconds && secondValue.length === 1 && second > 5) return false;
  if (showSeconds && secondValue.length === 2 && second > 59) return false;

  return true;
}

function formatMeridiemInput(letters: string) {
  if (!letters) return "";
  if ("AM".startsWith(letters)) return letters;
  if ("PM".startsWith(letters)) return letters;

  return null;
}

function formatTimeInput(restValue: string, showSeconds: boolean) {
  const normalizedValue = restValue.toUpperCase();
  const maxTimeDigits = showSeconds ? 6 : 4;
  const timeDigits = normalizedValue.replace(/\D/g, "").slice(0, maxTimeDigits);
  const meridiemLetters = normalizedValue.replace(/[^A-Z]/g, "");
  const meridiem = formatMeridiemInput(meridiemLetters.slice(0, 2));

  if (!timeDigits && !meridiem) return "";
  if (!isPotentiallyValidTimeDigits(timeDigits, showSeconds) || meridiem === null) {
    return null;
  }

  let timeValue = timeDigits.slice(0, 2);
  if (timeDigits.length > 2) {
    timeValue = `${timeValue}:${timeDigits.slice(2, 4)}`;
  }
  if (showSeconds && timeDigits.length > 4) {
    timeValue = `${timeValue}:${timeDigits.slice(4, 6)}`;
  }

  return [timeValue, meridiem].filter(Boolean).join(" ");
}

function sanitizeTypedDateInput(value: string, previousValue: string) {
  const trimmedValue = value.trimStart();
  if (/^[A-Za-z]/.test(trimmedValue)) return previousValue;

  const normalizedValue = value.toUpperCase().replace(/[^0-9\s/-]/g, "");
  const { dateDigits, dateValue, isValid } = splitTypedDateInput(normalizedValue);
  const limitedDateDigits = dateDigits.slice(0, 8);

  if (!limitedDateDigits) return "";
  if (!isValid) return previousValue;

  return dateValue;
}

function sanitizeTypedTimeInput(
  value: string,
  previousValue: string,
  showSeconds: boolean
) {
  const trimmedValue = value.trimStart();
  if (/^[A-Za-z]/.test(trimmedValue) && !/^[AP]/i.test(trimmedValue)) {
    return previousValue;
  }

  const normalizedValue = value.toUpperCase().replace(/[^0-9\s:APM]/g, "");
  const formattedTime = formatTimeInput(normalizedValue, showSeconds);
  if (formattedTime === null) return previousValue;

  return formattedTime;
}

function sanitizeTypedDateTimeInput(
  value: string,
  previousValue: string,
  showSeconds: boolean
) {
  const trimmedValue = value.trimStart();
  if (/^[A-Za-z]/.test(trimmedValue)) return previousValue;

  const normalizedValue = value
    .toUpperCase()
    .replace(/[^0-9\s/:APM-]/g, "");
  const { dateDigits, dateValue, isComplete, isValid, restValue } =
    splitTypedDateInput(normalizedValue);
  const limitedDateDigits = dateDigits.slice(0, 8);

  if (!limitedDateDigits) return "";
  if (!isValid) return previousValue;

  const formattedTime = isComplete ? formatTimeInput(restValue, showSeconds) : "";
  if (formattedTime === null) return previousValue;

  return [dateValue, formattedTime].filter(Boolean).join(" ");
}

type DateTimeInputSegment =
  | "day"
  | "month"
  | "year"
  | "hour"
  | "minute"
  | "second"
  | "meridiem";

function getDateTimeInputSegmentRanges(showSeconds: boolean) {
  return showSeconds
    ? ({
        day: [0, 2],
        month: [3, 5],
        year: [6, 10],
        hour: [11, 13],
        minute: [14, 16],
        second: [17, 19],
        meridiem: [20, 22],
      } satisfies Record<DateTimeInputSegment, readonly [number, number]>)
    : ({
        day: [0, 2],
        month: [3, 5],
        year: [6, 10],
        hour: [11, 13],
        minute: [14, 16],
        second: [17, 19],
        meridiem: [17, 19],
      } satisfies Record<DateTimeInputSegment, readonly [number, number]>);
}

function getDateTimeInputSegment(
  cursorPosition: number,
  showSeconds: boolean
): DateTimeInputSegment {
  const ranges = getDateTimeInputSegmentRanges(showSeconds);

  if (cursorPosition <= ranges.day[1]) return "day";
  if (cursorPosition <= ranges.month[1]) return "month";
  if (cursorPosition <= ranges.year[1]) return "year";
  if (cursorPosition <= ranges.hour[1]) return "hour";
  if (cursorPosition <= ranges.minute[1]) {
    return "minute";
  }
  if (showSeconds && cursorPosition <= ranges.second[1]) {
    return "second";
  }

  return "meridiem";
}

function clampDateToMonth(year: number, month: number, day: number) {
  return new Date(year, month, Math.min(day, getDaysInMonth(year, month + 1)));
}

function stepDateTimeInputValue(
  value: string,
  cursorPosition: number,
  direction: 1 | -1,
  fallbackTime: string,
  showSeconds: boolean
) {
  const typedDateTime = parseTypedDateTime(value);
  if (!typedDateTime) return null;

  const segment = getDateTimeInputSegment(cursorPosition, showSeconds);
  const nextDate = new Date(typedDateTime.date);
  const [hourValue = "0", minuteValue = "0", secondValue = "00"] = (
    typedDateTime.startTime ?? fallbackTime
  ).split(":");
  nextDate.setHours(Number(hourValue), Number(minuteValue), Number(secondValue));

  if (segment === "day") {
    nextDate.setDate(nextDate.getDate() + direction);
  } else if (segment === "month") {
    const day = nextDate.getDate();
    const steppedMonth = clampDateToMonth(
      nextDate.getFullYear(),
      nextDate.getMonth() + direction,
      day
    );
    nextDate.setFullYear(
      steppedMonth.getFullYear(),
      steppedMonth.getMonth(),
      steppedMonth.getDate()
    );
  } else if (segment === "year") {
    const day = nextDate.getDate();
    const steppedYear = clampDateToMonth(
      nextDate.getFullYear() + direction,
      nextDate.getMonth(),
      day
    );
    nextDate.setFullYear(
      steppedYear.getFullYear(),
      steppedYear.getMonth(),
      steppedYear.getDate()
    );
  } else if (segment === "hour") {
    nextDate.setHours(nextDate.getHours() + direction);
  } else if (segment === "minute") {
    nextDate.setMinutes(nextDate.getMinutes() + direction);
  } else if (segment === "second") {
    nextDate.setSeconds(nextDate.getSeconds() + direction);
  } else {
    nextDate.setHours(nextDate.getHours() + 12 * direction);
  }

  const startTime = `${nextDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${nextDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${nextDate
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  return {
    date: startOfDay(nextDate),
    startTime,
    segment,
  };
}

function formatTimeForTimeInput(time: string, showSeconds: boolean) {
  const normalizedTime = parseTimePart(time) ?? DEFAULT_START_TIME;
  const [hour = "00", minute = "00", second = "00"] = normalizedTime.split(":");

  return showSeconds ? `${hour}:${minute}:${second}` : `${hour}:${minute}`;
}

function normalizeTimeInputValue(time: string, fallbackTime: string) {
  return parseTimePart(time) ?? parseTimePart(fallbackTime) ?? DEFAULT_START_TIME;
}

function openNativeTimePicker(input: HTMLInputElement | null) {
  if (!input) return;

  input.focus();

  const showPicker = (
    input as HTMLInputElement & { showPicker?: () => void }
  ).showPicker;
  if (!showPicker) return;

  try {
    showPicker.call(input);
  } catch {
    input.focus();
  }
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

function parseTypedDate(value: string) {
  const typedValue = value.trim();
  if (!typedValue) return undefined;

  const typedMatch = typedValue.match(
    /^(\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{4})$/
  );
  if (!typedMatch) return null;

  return parseDatePart(typedValue);
}

function formatHiddenValue(
  value: DateTimePickerValue,
  variant: DateTimePickerVariant,
  showEndTime: boolean,
  hasTimeValue: boolean
) {
  if (variant === "time-only") {
    if (!hasTimeValue) return "";

    return showEndTime ? `${value.startTime}/${value.endTime}` : value.startTime;
  }

  if (!value.date) return "";

  if (variant === "date-only") {
    const month = (value.date.getMonth() + 1).toString().padStart(2, "0");
    const day = value.date.getDate().toString().padStart(2, "0");
    const year = value.date.getFullYear();

    return `${year}-${month}-${day}`;
  }

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

function CalendarDropdown({
  id,
  label,
  value,
  options,
  open,
  onOpenChange,
  onValueChange,
}: {
  id: string;
  label: string;
  value: string;
  options: CalendarDropdownOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValueChange: (value: string) => void;
}) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={`${id}-options`}
        data-value={value}
        className={cn(
          CALENDAR_DROPDOWN_TRIGGER_CLASS,
          "inline-flex items-center justify-between gap-2"
        )}
        onClick={() => onOpenChange(!open)}
      >
        <span>{selectedOption?.label ?? value}</span>
        <ChevronRight
          className={cn("size-3 transition-transform", open && "-rotate-90")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          id={`${id}-options`}
          role="listbox"
          aria-label={`${label} options`}
          className="absolute left-0 top-full z-10 mt-1 max-h-52 min-w-full overflow-y-auto rounded-md border border-solid border-semantic-border-layout bg-semantic-bg-primary p-1 shadow-lg"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-label={option.label}
              aria-selected={option.value === value}
              disabled={option.disabled}
              className={cn(
                "flex w-full items-center rounded px-2 py-1.5 text-left text-sm text-semantic-text-primary transition-colors hover:bg-semantic-bg-hover disabled:cursor-not-allowed disabled:opacity-40",
                option.value === value && "bg-semantic-primary text-semantic-text-inverted"
              )}
              onClick={() => {
                if (option.disabled) return;

                onValueChange(option.value);
                onOpenChange(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const DateTimePicker = React.forwardRef<HTMLDivElement, DateTimePickerProps>(
  (
    {
      className,
      variant,
      size,
      state,
      value,
      defaultValue,
      onValueChange,
      placeholder: placeholderProp,
      disabled = false,
      readOnly = false,
      name,
      showEndTime = true,
      showSeconds,
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
    const pickerVariant = variant ?? "date-time";
    const showCalendar = pickerVariant !== "time-only";
    const showTimeFields = pickerVariant !== "date-only";
    const resolvedShowEndTime = showTimeFields && showEndTime;
    const isValueControlled = value !== undefined;
    const isOpenControlled = controlledOpen !== undefined;
    const [internalValue, setInternalValue] = React.useState(() =>
      normalizeValue(defaultValue)
    );
    const [internalHasTimeValue, setInternalHasTimeValue] = React.useState(() =>
      Boolean(defaultValue?.date || defaultValue?.startTime || defaultValue?.endTime)
    );
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const currentValue = normalizeValue(
      isValueControlled ? value : internalValue
    );
    const hasTimeValue = isValueControlled
      ? Boolean(value?.date || value?.startTime || value?.endTime)
      : internalHasTimeValue;
    const resolvedShowSeconds =
      showSeconds ??
      (timeHasVisibleSeconds(currentValue.startTime) ||
        (resolvedShowEndTime && timeHasVisibleSeconds(currentValue.endTime)));
    const placeholder =
      placeholderProp ?? getDefaultPlaceholder(pickerVariant, resolvedShowSeconds);
    const open = isOpenControlled ? controlledOpen : internalOpen;
    const [visibleMonth, setVisibleMonth] = React.useState(() =>
      startOfMonth(currentValue.date ?? new Date())
    );
    const [dateInputValue, setDateInputValue] = React.useState(() =>
      formatValueForDisplay(
        currentValue,
        pickerVariant,
        resolvedShowEndTime,
        hasTimeValue,
        resolvedShowSeconds
      )
    );
    const [isDateInputFocused, setIsDateInputFocused] = React.useState(false);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLDivElement | null>(null);
    const popoverRef = React.useRef<HTMLDivElement | null>(null);
    const startTimeInputRef = React.useRef<HTMLInputElement | null>(null);
    const endTimeInputRef = React.useRef<HTMLInputElement | null>(null);
    const [openCalendarDropdown, setOpenCalendarDropdown] =
      React.useState<CalendarDropdownKind | null>(null);
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
    const displayValue = formatValueForDisplay(
      currentValue,
      pickerVariant,
      resolvedShowEndTime,
      hasTimeValue,
      resolvedShowSeconds
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
        if (!nextOpen) {
          setOpenCalendarDropdown(null);
        }

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
      (
        nextValue: DateTimePickerValue,
        options?: { hasTimeValue?: boolean }
      ) => {
        if (!isValueControlled) {
          setInternalValue(nextValue);
          if (options?.hasTimeValue !== undefined) {
            setInternalHasTimeValue(options.hasTimeValue);
          }
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
      }, { hasTimeValue: false });
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

    const syncCalendarMonthAndValue = React.useCallback(
      (nextMonth: Date) => {
        const clampedMonth = clampMonth(nextMonth, effectiveMinDate, maxDate);
        setVisibleMonth(clampedMonth);

        if (pickerVariant === "time-only" || !currentValue.date) return;

        const selectedDay = currentValue.date.getDate();
        const daysInTargetMonth = getDaysInMonth(
          clampedMonth.getFullYear(),
          clampedMonth.getMonth() + 1
        );

        if (selectedDay > daysInTargetMonth) {
          const fallbackDate = new Date(
            clampedMonth.getFullYear(),
            clampedMonth.getMonth(),
            1
          );

          if (!isSelectableDay(fallbackDate, effectiveMinDate, maxDate)) {
            updateValue({ ...currentValue, date: undefined });
            return;
          }

          updateValue({ ...currentValue, date: fallbackDate });
          return;
        }

        const nextSelectedDate = new Date(
          clampedMonth.getFullYear(),
          clampedMonth.getMonth(),
          selectedDay
        );

        if (!isSelectableDay(nextSelectedDate, effectiveMinDate, maxDate)) {
          updateValue({ ...currentValue, date: undefined });
          return;
        }

        if (!isSameDay(currentValue.date, nextSelectedDate)) {
          updateValue({ ...currentValue, date: nextSelectedDate });
        }
      },
      [
        currentValue,
        effectiveMinDate,
        maxDate,
        pickerVariant,
        updateValue,
      ]
    );

    const handleTypedDateChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (pickerVariant === "time-only") {
        const nextInputValue = sanitizeTypedTimeInput(
          event.target.value,
          dateInputValue,
          resolvedShowSeconds
        );
        setDateInputValue(nextInputValue);

        if (
          nextInputValue === dateInputValue &&
          event.target.value !== dateInputValue
        ) {
          event.currentTarget.value = nextInputValue;
          return;
        }

        const typedTime = parseTimePart(nextInputValue);
        if (typedTime === undefined) {
          updateValue({ ...currentValue, date: undefined }, { hasTimeValue: false });
          return;
        }

        if (typedTime) {
          updateValue(
            {
              ...currentValue,
              startTime: typedTime,
            },
            { hasTimeValue: true }
          );
        }

        return;
      }

      if (pickerVariant === "date-only") {
        const nextInputValue = sanitizeTypedDateInput(
          event.target.value,
          dateInputValue
        );
        setDateInputValue(nextInputValue);

        if (
          nextInputValue === dateInputValue &&
          event.target.value !== dateInputValue
        ) {
          event.currentTarget.value = nextInputValue;
          return;
        }

        const typedDate = parseTypedDate(nextInputValue);
        if (typedDate === undefined) {
          updateValue({ ...currentValue, date: undefined });
          return;
        }

        if (
          typedDate &&
          !(effectiveMinDate && isBeforeDay(typedDate, effectiveMinDate)) &&
          !(maxDate && isAfterDay(typedDate, maxDate))
        ) {
          updateValue({ ...currentValue, date: typedDate });
          updateVisibleMonth(typedDate);
        }

        return;
      }

      const nextInputValue = sanitizeTypedDateTimeInput(
        event.target.value,
        dateInputValue,
        resolvedShowSeconds
      );
      setDateInputValue(nextInputValue);

      if (
        nextInputValue === dateInputValue &&
        event.target.value !== dateInputValue
      ) {
        event.currentTarget.value = nextInputValue;
        return;
      }

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

    const handleTypedDateKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (pickerVariant === "time-only") return;
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

      const direction = event.key === "ArrowUp" ? 1 : -1;
      const cursorPosition =
        event.currentTarget.selectionStart ?? dateInputValue.length;
      const inputElement = event.currentTarget;
      const steppedDateTime = stepDateTimeInputValue(
        dateInputValue,
        cursorPosition,
        direction,
        currentValue.startTime,
        resolvedShowSeconds
      );

      if (!steppedDateTime) return;
      if (
        (effectiveMinDate &&
          isBeforeDay(steppedDateTime.date, effectiveMinDate)) ||
        (maxDate && isAfterDay(steppedDateTime.date, maxDate))
      ) {
        return;
      }

      event.preventDefault();

      const nextInputValue = formatDateForDisplay(
        steppedDateTime.date,
        steppedDateTime.startTime,
        resolvedShowSeconds
      );
      const dateTimeInputSegmentRanges =
        getDateTimeInputSegmentRanges(resolvedShowSeconds);
      const [selectionStart, selectionEnd] =
        dateTimeInputSegmentRanges[steppedDateTime.segment];
      const resolvedInputValue =
        pickerVariant === "date-only"
          ? formatDateOnlyForDisplay(steppedDateTime.date)
          : nextInputValue;

      setDateInputValue(resolvedInputValue);
      updateValue({
        ...currentValue,
        date: steppedDateTime.date,
        startTime:
          pickerVariant === "date-only"
            ? currentValue.startTime
            : steppedDateTime.startTime,
      });
      updateVisibleMonth(steppedDateTime.date);

      window.requestAnimationFrame(() => {
        inputElement.setSelectionRange(selectionStart, selectionEnd);
      });
    };

    const handleTypedDateBlur = () => {
      setIsDateInputFocused(false);
      setDateInputValue(
        formatValueForDisplay(
          currentValue,
          pickerVariant,
          resolvedShowEndTime,
          hasTimeValue,
          resolvedShowSeconds
        )
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
          aria-labelledby={showCalendar ? `${triggerId}-calendar-heading` : undefined}
          aria-label={showCalendar ? undefined : "Time picker"}
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
          {showCalendar && (
            <div className="p-3 touch-pan-y">
              <div className="mb-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  className="p-1 rounded hover:bg-semantic-bg-hover text-semantic-text-secondary transition-colors"
                  onClick={() =>
                    syncCalendarMonthAndValue(addMonths(visibleMonth, -1))
                  }
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                <div className="flex min-w-0 items-center gap-1.5">
                  <CalendarDropdown
                    id={`${triggerId}-month`}
                    label="Month"
                    value={visibleMonth.getMonth().toString()}
                    open={openCalendarDropdown === "month"}
                    onOpenChange={(nextOpen) =>
                      setOpenCalendarDropdown(nextOpen ? "month" : null)
                    }
                    options={monthNames.map((monthName, monthIndex) => {
                      const optionMonth = new Date(
                        visibleMonth.getFullYear(),
                        monthIndex,
                        1
                      );
                      const isDisabled =
                        (effectiveMinDate &&
                          isMonthBefore(optionMonth, effectiveMinDate)) ||
                        (maxDate && isMonthAfter(optionMonth, maxDate));

                      return {
                        value: monthIndex.toString(),
                        label: monthName,
                        disabled: !!isDisabled,
                      };
                    })}
                    onValueChange={(nextMonth) => {
                      syncCalendarMonthAndValue(
                        new Date(
                          visibleMonth.getFullYear(),
                          Number(nextMonth),
                          1
                        )
                      );
                    }}
                  />
                  <CalendarDropdown
                    id={`${triggerId}-year`}
                    label="Year"
                    value={visibleMonth.getFullYear().toString()}
                    open={openCalendarDropdown === "year"}
                    onOpenChange={(nextOpen) =>
                      setOpenCalendarDropdown(nextOpen ? "year" : null)
                    }
                    options={yearOptions.map((year) => ({
                      value: year.toString(),
                      label: year.toString(),
                    }))}
                    onValueChange={(nextYear) => {
                      syncCalendarMonthAndValue(
                        new Date(
                          Number(nextYear),
                          visibleMonth.getMonth(),
                          1
                        )
                      );
                    }}
                  />
                  <div id={`${triggerId}-calendar-heading`} className="sr-only">
                    {monthFormatter.format(visibleMonth)}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Next month"
                  className="p-1 rounded hover:bg-semantic-bg-hover text-semantic-text-secondary transition-colors"
                  onClick={() =>
                    syncCalendarMonthAndValue(addMonths(visibleMonth, 1))
                  }
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
          )}

          {showTimeFields && (
            <div
              className={cn(
                "space-y-3 bg-semantic-bg-primary p-3",
                showCalendar &&
                  "border-t border-solid border-semantic-border-layout"
              )}
            >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${triggerId}-start-time`}
                className="block text-sm font-semibold text-semantic-text-primary"
              >
                {startTimeLabel}
              </label>
              <div
                className="relative cursor-pointer"
                onClick={() => openNativeTimePicker(startTimeInputRef.current)}
              >
                <Clock2
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-semantic-text-muted"
                  aria-hidden="true"
                />
                <input
                  ref={startTimeInputRef}
                  id={`${triggerId}-start-time`}
                  type="time"
                  step={resolvedShowSeconds ? "1" : "60"}
                  value={formatTimeForTimeInput(
                    currentValue.startTime,
                    resolvedShowSeconds
                  )}
                  className="h-8 w-full rounded-md border border-solid border-semantic-border-input bg-semantic-bg-primary pl-9 pr-3 text-sm text-semantic-text-primary outline-none transition-colors hover:border-semantic-border-input-focus/50 focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
                  onChange={(event) =>
                    updateValue(
                      {
                        ...currentValue,
                        startTime: normalizeTimeInputValue(
                          event.target.value,
                          currentValue.startTime
                        ),
                      },
                      { hasTimeValue: true }
                    )
                  }
                />
              </div>
            </div>

            {resolvedShowEndTime && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`${triggerId}-end-time`}
                  className="block text-sm font-semibold text-semantic-text-primary"
                >
                  {endTimeLabel}
                </label>
                <div
                  className="relative cursor-pointer"
                  onClick={() => openNativeTimePicker(endTimeInputRef.current)}
                >
                  <Clock2
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-semantic-text-muted"
                    aria-hidden="true"
                  />
                  <input
                    ref={endTimeInputRef}
                    id={`${triggerId}-end-time`}
                    type="time"
                    step={resolvedShowSeconds ? "1" : "60"}
                    value={formatTimeForTimeInput(
                      currentValue.endTime,
                      resolvedShowSeconds
                    )}
                    className="h-8 w-full rounded-md border border-solid border-semantic-border-input bg-semantic-bg-primary pl-9 pr-3 text-sm text-semantic-text-primary outline-none transition-colors hover:border-semantic-border-input-focus/50 focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
                    onChange={(event) =>
                      updateValue(
                        {
                          ...currentValue,
                          endTime: normalizeTimeInputValue(
                            event.target.value,
                            currentValue.endTime
                          ),
                        },
                        { hasTimeValue: true }
                      )
                    }
                  />
                </div>
              </div>
            )}
            </div>
          )}
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
            value={formatHiddenValue(
              currentValue,
              pickerVariant,
              resolvedShowEndTime,
              hasTimeValue
            )}
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
            aria-label={
              pickerVariant === "date-only"
                ? "Date"
                : pickerVariant === "time-only"
                  ? "Time"
                  : "Date and time"
            }
            className="min-w-0 flex-1 bg-transparent text-sm text-semantic-text-primary outline-none placeholder:text-semantic-text-placeholder disabled:cursor-not-allowed read-only:cursor-not-allowed"
            onFocus={() => {
              setIsDateInputFocused(true);
              setOpen(true);
            }}
            onClick={() => setOpen(true)}
            onChange={handleTypedDateChange}
            onKeyDown={handleTypedDateKeyDown}
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
            aria-label={showCalendar ? "Open calendar" : "Open time picker"}
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
