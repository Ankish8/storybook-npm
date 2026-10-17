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
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";

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

// Outline rather than ring: it follows border-radius, takes no part in layout
// and is not clipped by the neighbouring cell's background.
const FOCUS_RING =
  "focus-visible:outline focus-visible:[outline-width:2px] focus-visible:outline-offset-1 focus-visible:outline-semantic-primary";
// Hover fills only where a real hover exists. On touch a tap would otherwise
// leave the fill stuck on the element until the next tap elsewhere.
const HOVER_FILL = "[@media(hover:hover)]:hover:bg-semantic-bg-hover";

// 32px hit area (36px on touch-sized viewports) around the 16px chevron; the
// old 24px button was below the minimum comfortable target.
// Arc header controls: a fill on hover (160ms), a quick press (.92 over 120ms) and a spring release (580ms).
const CALENDAR_NAV_BUTTON = `inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--v2-text-secondary,#5E5E5E)] [transition-property:background-color,color,transform] [transition-duration:160ms,160ms,580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] enabled:active:scale-[0.92] enabled:active:[transition-duration:160ms,160ms,120ms] motion-reduce:[transition-property:background-color,color] motion-reduce:enabled:active:scale-100 max-sm:size-9 ${HOVER_FILL}`;
// Month and year share one pill so the two read as a pair.
const CALENDAR_PILL = `inline-flex h-8 items-center gap-1 rounded-lg border border-solid border-semantic-border-layout px-3 text-sm font-medium text-[var(--v2-text-primary,#484848)] transition-colors ${HOVER_FILL}`;
const CALENDAR_PILL_CHEVRON =
  "size-3.5 text-[var(--v2-text-muted,#707070)] transition-transform [transition-duration:580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

// The range band is a ::before on the 32px cell wrapper rather than a child
// node, so a week row can cap both of its ends (and the range's own ends)
// without extra DOM. 28px tall from `sm` (the day circle is the 32px cell inset
// 2px), the full 32px below it where the circle is 32px.
const BAND_BASE =
  "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:right-0 before:content-[''] sm:before:inset-y-[2px]";
// At the range's own start/end the band begins at the circle's outer edge
// instead of the cell edge (the cell is wider than the circle), so it emerges
// from the circle without a pale halo. Week-row wraps stay flush with the grid.
const BAND_START_AT_CIRCLE =
  "before:left-[calc(50%-1rem)] sm:before:left-[calc(50%-14px)]";
const BAND_END_AT_CIRCLE =
  "before:right-[calc(50%-1rem)] sm:before:right-[calc(50%-14px)]";
const BAND_RANGE = "before:bg-semantic-info-surface";
// Lighter than the committed band and edged with dashes, so a not-yet-chosen
// end reads as provisional. Below `sm` the rows touch, so the preview is
// inset 1px there; otherwise two stacked rows would double their dashed edge.
const BAND_PREVIEW =
  "before:border-y before:border-dashed before:border-[color:var(--color-info-100)] before:bg-semantic-info-surface-subtle max-sm:before:inset-y-px";

// Month change motion. The grid only gets these classes after the user has
// navigated, so mounting the popover (which resets the month) never animates.
const MONTH_MOTION =
  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:[animation-duration:200ms] [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] motion-reduce:animate-[v2-fade-in_120ms_ease-out]";
const MONTH_MOTION_DIRECTION = {
  next: "motion-safe:slide-in-from-right-2",
  prev: "motion-safe:slide-in-from-left-2",
} as const;

type MonthDirection = keyof typeof MONTH_MOTION_DIRECTION | null;

// The summary line and the Today link rise in on the same quiet curve as the month grid; reduced motion fades only.
const SUMMARY_MOTION =
  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:[animation-duration:200ms] [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] motion-reduce:animate-[v2-fade-in_120ms_ease-out]";

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DEFAULT_LOCALE = "en-US";
// Two months sit side by side from this panel width, matching the preset rail plus 2 x 300px.
const TWO_MONTH_MIN_WIDTH = 712;
// A day that moves the roving focus keeps its place in the grid: the key is the data-date value.
type WeekStart = 0 | 1;
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
  "flex h-11 min-w-0 w-full items-center gap-2 rounded-lg border border-solid bg-semantic-bg-primary px-4 py-2 font-[family-name:var(--font-v2,Inter,sans-serif)] text-left text-sm font-normal text-[var(--v2-text-secondary,#5E5E5E)] outline-none transition-[border-color,box-shadow,background-color] duration-150 disabled:cursor-not-allowed disabled:bg-semantic-bg-ui disabled:border-semantic-border-layout disabled:shadow-none disabled:hover:border-semantic-border-layout",
  {
    variants: {
      state: {
        default:
          "border-semantic-border-input enabled:hover:border-[var(--color-primary-100,#C0C3CA)] focus:shadow-none",
        error:
          "border-semantic-error-primary shadow-[0_0_4px_0_rgba(240,68,56,0.4)]  ",
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
  /** Show a clear (x) button in the trigger once a range is selected. */
  clearable?: boolean;
  /** Called after the range is cleared. Fires alongside `onValueChange({})`. */
  onClear?: () => void;
  /** Accessible label for the clear button. Defaults to "Clear date range". */
  clearLabel?: string;
  /**
   * Number of months shown side by side. `"auto"` shows two when the page (or `portalContainer`) is at least 712px
   * wide and one otherwise. Defaults to 1, the layout every existing screen already uses.
   */
  months?: 1 | 2 | "auto";
  /** First day of the week: 0 is Sunday (default), 1 is Monday. */
  weekStartsOn?: 0 | 1;
  /**
   * BCP 47 locale for month names, weekday labels and the summary line, for example `"en-GB"` or `"hi-IN"`.
   * Without it the calendar keeps its English labels.
   */
  locale?: string;
  /** Show the summary line under the calendar ("7 Oct – 13 Oct 2026 · 7 days"). Defaults to true. */
  showSummary?: boolean;
  /**
   * Replace the summary text. `info.days` counts the inclusive days of a complete range, and `info.selecting`
   * is true while the end date is still to be picked. Use it to translate the line.
   */
  formatSummary?: (
    value: DateRangeValue,
    info: { days: number; selecting: boolean }
  ) => string;
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

function getMonthKey(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

// Two ranges describe the same days. A missing end only matches a missing end,
// and an entirely empty range matches nothing.
function isSameRange(a: DateRangeValue, b: DateRangeValue) {
  if (!a.start && !a.end) return false;

  const sameStart = a.start ? isSameDay(a.start, b.start) : !b.start;
  const sameEnd = a.end ? isSameDay(a.end, b.end) : !b.end;

  return sameStart && sameEnd;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getCalendarDays(month: Date, weekStartsOn: WeekStart = 0) {
  const firstDay = startOfMonth(month);
  const gridStart = new Date(firstDay);
  gridStart.setDate(
    firstDay.getDate() - ((firstDay.getDay() - weekStartsOn + 7) % 7)
  );

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

function isMonthSelectable(
  year: number,
  monthIndex: number,
  minDate?: Date,
  maxDate?: Date
) {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  if (minDate && isBeforeDay(lastDay, minDate)) return false;
  if (maxDate && isAfterDay(firstDay, maxDate)) return false;

  return true;
}

function clampRange(
  range: DateRangeValue,
  minDate?: Date,
  maxDate?: Date
): DateRangeValue | null {
  let { start, end } = range;

  // The window and the preset don't overlap at all — clamping would collapse
  // the range onto the boundary day, which is not what the preset means.
  if (end && minDate && isBeforeDay(end, minDate)) return null;
  if (start && maxDate && isAfterDay(start, maxDate)) return null;

  if (start && minDate && isBeforeDay(start, minDate)) start = minDate;
  if (end && maxDate && isAfterDay(end, maxDate)) end = maxDate;

  // The whole preset sits outside the allowed window — nothing to select.
  if (start && end && isAfterDay(start, end)) return null;

  return { start, end };
}

function isPointerInsideElement(
  event: MouseEvent | PointerEvent,
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

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

// The data-date attribute on each day button: the grid's roving focus finds its target by it.
function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function fromDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// A month step keeps the day of the month where it can and lands on the last day of a shorter month.
function addMonthsClamped(date: Date, months: number) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0
  ).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return target;
}

function getWeekdayLabels(weekStartsOn: WeekStart, locale?: string) {
  const formatter = locale
    ? new Intl.DateTimeFormat(locale, { weekday: "short" })
    : null;

  return Array.from({ length: 7 }, (_, index) => {
    const dayOfWeek = (weekStartsOn + index) % 7;
    if (!formatter || !locale) return weekDays[dayOfWeek];

    // 1 Jan 2023 is a Sunday.
    const label = formatter.format(new Date(2023, 0, 1 + dayOfWeek));
    return locale.toLowerCase().startsWith("en") ? label.slice(0, 2) : label;
  });
}

function getMonthName(monthIndex: number, locale?: string) {
  if (!locale) return MONTH_LONG_NAMES[monthIndex];

  return new Intl.DateTimeFormat(locale, { month: "long" }).format(
    new Date(2023, monthIndex, 1)
  );
}

function countDays(start: Date, end: Date) {
  const startUtc = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  return Math.round(Math.abs(endUtc - startUtc) / 86400000) + 1;
}

// "7 Oct" without a locale (day first, like the trigger), the locale's own short form with one.
function formatDayMonth(date: Date, locale?: string) {
  if (!locale) return `${date.getDate()} ${MONTH_SHORT_NAMES[date.getMonth()]}`;

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatDayMonthYear(date: Date, locale?: string) {
  if (!locale) return formatDateShort(date);

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Compact trigger text for `formatRange`: "7 – 13 Oct 2026" inside one month, "28 Sep – 3 Oct 2026" inside one
 * year, and both years in full when they differ. A single day reads "7 Oct 2026".
 */
export function formatDateRangeCompact(
  value: DateRangeValue,
  locale?: string
): string {
  const { start, end } = value;
  const only = start ?? end;
  if (!start || !end) return only ? formatDayMonthYear(only, locale) : "";
  if (isSameDay(start, end)) return formatDayMonthYear(start, locale);
  if (start.getFullYear() !== end.getFullYear()) {
    return `${formatDayMonthYear(start, locale)} – ${formatDayMonthYear(end, locale)}`;
  }
  if (start.getMonth() === end.getMonth() && !locale) {
    return `${start.getDate()} – ${formatDayMonthYear(end, locale)}`;
  }

  return `${formatDayMonth(start, locale)} – ${formatDayMonthYear(end, locale)}`;
}

function defaultSummary(
  value: DateRangeValue,
  info: { days: number; selecting: boolean },
  locale?: string
) {
  const { start, end } = value;
  if (!start) return "Select a start date";
  if (info.selecting) {
    return `${formatDayMonthYear(start, locale)} · Select an end date`;
  }
  if (!end || isSameDay(start, end)) {
    return `${formatDayMonthYear(start, locale)} · 1 day`;
  }

  const range = formatDateRangeCompact(value, locale);

  return `${range} · ${info.days} days`;
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

/**
 * DEFAULT_DATE_RANGE_PRESETS plus Last 90 days, This quarter and Year to date, for reporting screens that look
 * further back. Pass it as `presets`.
 */
export const EXTENDED_DATE_RANGE_PRESETS: DateRangePreset[] = [
  ...DEFAULT_DATE_RANGE_PRESETS,
  {
    label: "Last 90 days",
    getRange: () => {
      const today = startOfDay(new Date());
      return { start: addDays(today, -89), end: today };
    },
  },
  {
    label: "This quarter",
    getRange: () => {
      const today = startOfDay(new Date());
      const quarterStart = new Date(
        today.getFullYear(),
        Math.floor(today.getMonth() / 3) * 3,
        1
      );
      return { start: quarterStart, end: today };
    },
  },
  {
    label: "Year to date",
    getRange: () => {
      const today = startOfDay(new Date());
      return { start: new Date(today.getFullYear(), 0, 1), end: today };
    },
  },
];

/**
 * "This financial year" and "Last financial year" presets. The year starts in `startMonth` (0-11), April (3) by
 * default, as in India. Spread them after the other presets: `[...DEFAULT_DATE_RANGE_PRESETS, ...getFinancialYearPresets()]`.
 */
export function getFinancialYearPresets(startMonth = 3): DateRangePreset[] {
  const currentYearStart = (today: Date) =>
    new Date(
      today.getMonth() >= startMonth
        ? today.getFullYear()
        : today.getFullYear() - 1,
      startMonth,
      1
    );

  return [
    {
      label: "This financial year",
      getRange: () => {
        const today = startOfDay(new Date());
        return { start: currentYearStart(today), end: today };
      },
    },
    {
      label: "Last financial year",
      getRange: () => {
        const start = currentYearStart(startOfDay(new Date()));
        const lastStart = new Date(start.getFullYear() - 1, startMonth, 1);
        return {
          start: lastStart,
          end: new Date(start.getFullYear(), startMonth, 0),
        };
      },
    },
  ];
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
      clearable = false,
      onClear,
      clearLabel = "Clear date range",
      months = 1,
      weekStartsOn = 0,
      locale,
      showSummary = true,
      formatSummary,
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
    // Month and year share one slot so opening either closes the other —
    // two independent uncontrolled menus can otherwise sit open at once.
    const [openMenu, setOpenMenu] = React.useState<"month" | "year" | null>(
      null
    );
    const [visibleMonth, setVisibleMonth] = React.useState(() =>
      startOfMonth(currentValue.start ?? currentValue.end ?? new Date())
    );
    // Day under the pointer (or keyboard focus) while the second click is
    // pending. Purely visual: it paints the preview band and never feeds the
    // draft, so nothing is announced or committed by hovering.
    const [previewDay, setPreviewDay] = React.useState<Date | null>(null);
    // The one day button in the grid that is a tab stop (roving tabindex); arrow keys move it.
    const [focusDay, setFocusDay] = React.useState<Date>(() =>
      startOfDay(currentValue.start ?? currentValue.end ?? new Date())
    );
    const pendingFocusRef = React.useRef<Date | null>(null);
    // Set when the trigger was activated from the keyboard, so the panel hands focus to the grid.
    const focusOnOpenRef = React.useRef(false);
    const [panelBoundaryWidth, setPanelBoundaryWidth] = React.useState(() =>
      typeof window !== "undefined" ? window.innerWidth : 1024
    );

    // Direction of the last month change, derived while rendering ("store the
    // previous value in state") so the new grid mounts with its slide class in
    // the same commit — an effect would paint one frame without it. `open` is
    // part of the snapshot because opening resets the visible month and
    // mounting the popover must not play the month motion.
    const visibleMonthKey = getMonthKey(visibleMonth);
    const [monthMotion, setMonthMotion] = React.useState<{
      key: number;
      open: boolean;
      direction: MonthDirection;
    }>({ key: visibleMonthKey, open, direction: null });
    if (monthMotion.open !== open) {
      setMonthMotion({ key: visibleMonthKey, open, direction: null });
    } else if (monthMotion.key !== visibleMonthKey) {
      setMonthMotion({
        key: visibleMonthKey,
        open,
        direction: visibleMonthKey > monthMotion.key ? "next" : "prev",
      });
    }

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
          apply({ availableHeight, availableWidth, rects, elements }) {
            const maxHeight = Math.max(
              1,
              Math.min(MAX_POPOVER_HEIGHT, availableHeight)
            );
            elements.floating.style.setProperty(
              "--date-range-picker-trigger-width",
              `${Math.max(0, Math.min(rects.reference.width, availableWidth))}px`
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
    const monthCount =
      months === "auto"
        ? panelBoundaryWidth >= TWO_MONTH_MIN_WIDTH
          ? 2
          : 1
        : months;
    const visibleMonths = React.useMemo(
      () =>
        Array.from({ length: monthCount }, (_, index) =>
          addMonths(visibleMonth, index)
        ),
      [visibleMonth, monthCount]
    );
    const weekdayLabels = React.useMemo(
      () => getWeekdayLabels(weekStartsOn, locale),
      [weekStartsOn, locale]
    );
    const displayValue = (formatRange ?? defaultFormatRange)(currentValue);
    const showClear = clearable && !disabled && Boolean(displayValue);
    const effectiveMinDate = React.useMemo(() => {
      if (!disablePastDates) return minDate;

      const today = startOfDay(new Date());
      if (!minDate) return today;

      return isBeforeDay(minDate, today) ? today : minDate;
    }, [disablePastDates, minDate]);
    // Year list is centred on the visible year but never offers a year that
    // has no selectable day in it.
    const yearOptions = React.useMemo(() => {
      const centre = visibleMonth.getFullYear();
      const all = Array.from(
        { length: YEAR_OPTIONS_SPAN * 2 + 1 },
        (_, index) => centre - YEAR_OPTIONS_SPAN + index
      );

      return all.filter(
        (year) =>
          !(effectiveMinDate && year < effectiveMinDate.getFullYear()) &&
          !(maxDate && year > maxDate.getFullYear())
      );
    }, [visibleMonth, effectiveMinDate, maxDate]);
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
      const resetMonth = startOfMonth(
        latestValue.start ?? latestValue.end ?? new Date()
      );
      setDraftValue(latestValue);
      setPendingEnd(false);
      setPreviewDay(null);
      setOpenMenu(null);
      setFocusDay(
        startOfDay(latestValue.start ?? latestValue.end ?? new Date())
      );
      setVisibleMonth(resetMonth);
      // Same batch as the month reset: the render-time derivation above then
      // sees an unchanged key and leaves the direction empty.
      setMonthMotion({ key: getMonthKey(resetMonth), open, direction: null });
    }, [open]);

    React.useEffect(() => {
      if (!open) return;

      const handlePointerDown = (event: PointerEvent) => {
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
          // Escape must hand focus back to the trigger, otherwise focus is
          // stranded on a node that is about to unmount.
          triggerRef.current?.focus();
        }
      };

      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
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

    // Radix dismisses the open menu on the same pointerdown that would toggle
    // the sibling trigger, so its own toggle is swallowed and switching menus
    // takes two clicks. Drive the slot from the trigger directly and
    // preventDefault so Radix's toggle stays out of it.
    const toggleCalendarMenu = (menu: "month" | "year") => {
      setOpenMenu((current) => (current === menu ? null : menu));
    };

    const handlePresetClick = (preset: DateRangePreset) => {
      const range = clampRange(preset.getRange(), effectiveMinDate, maxDate);
      if (!range) return;

      commitValue(range);
      setOpen(false);
      triggerRef.current?.focus();
    };

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      // The clear button sits on top of the trigger; without this the click
      // bubbles to the wrapper and the calendar pops open on clear.
      event.stopPropagation();

      const cleared: DateRangeValue = { start: undefined, end: undefined };
      setDraftValue(cleared);
      setPendingEnd(false);
      commitValue(cleared);
      onClear?.();
      setOpen(false);
      triggerRef.current?.focus();
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
      setPreviewDay(null);
      commitValue(nextValue);
      setOpen(false);
      triggerRef.current?.focus();
    };

    // "auto" months need the width the panel can use; it is re-read while the panel is open.
    React.useEffect(() => {
      if (!open || months !== "auto") return;

      const measure = () =>
        setPanelBoundaryWidth(
          portalContainer?.clientWidth || window.innerWidth
        );
      measure();
      window.addEventListener("resize", measure);

      return () => window.removeEventListener("resize", measure);
    }, [open, months, portalContainer]);

    const isDayDisabled = (day: Date) =>
      Boolean(
        (effectiveMinDate && isBeforeDay(day, effectiveMinDate)) ||
        (maxDate && isAfterDay(day, maxDate))
      );
    const isInVisibleMonths = (day: Date) =>
      visibleMonths.some(
        (month) =>
          month.getFullYear() === day.getFullYear() &&
          month.getMonth() === day.getMonth()
      );
    // The grid has exactly one tab stop: the focused day while it is on screen and selectable, otherwise today,
    // otherwise the first selectable day of the first month.
    const rovingDay = (() => {
      if (isInVisibleMonths(focusDay) && !isDayDisabled(focusDay)) {
        return focusDay;
      }

      const today = startOfDay(new Date());
      if (isInVisibleMonths(today) && !isDayDisabled(today)) return today;

      const firstMonth = visibleMonths[0];
      const days = getCalendarDays(firstMonth, weekStartsOn).filter(
        (day) => day.getMonth() === firstMonth.getMonth()
      );

      return days.find((day) => !isDayDisabled(day)) ?? days[0];
    })();

    // Move the roving focus, paging to the month that holds the target when it is off screen. The focus itself is
    // applied once that month has rendered (see the effect below).
    const moveFocus = (target: Date) => {
      if (isDayDisabled(target)) return;

      const targetKey = getMonthKey(target);
      const firstKey = getMonthKey(visibleMonth);
      if (targetKey < firstKey) {
        setVisibleMonth(startOfMonth(target));
      } else if (targetKey > firstKey + monthCount - 1) {
        setVisibleMonth(addMonths(startOfMonth(target), -(monthCount - 1)));
      }

      pendingFocusRef.current = target;
      setFocusDay(target);
    };

    React.useEffect(() => {
      const target = pendingFocusRef.current;
      if (!target || !open) return;

      pendingFocusRef.current = null;
      popoverRef.current
        ?.querySelector<HTMLElement>(`[data-date="${toDateKey(target)}"]`)
        ?.focus();
    }, [focusDay, visibleMonth, open]);

    // Opened from the keyboard: hand focus to the grid so Tab, Shift+Tab and the arrows work straight away.
    React.useEffect(() => {
      if (!open || !isPositioned || !focusOnOpenRef.current) return;

      focusOnOpenRef.current = false;
      popoverRef.current
        ?.querySelector<HTMLElement>('[data-date][tabindex="0"]')
        ?.focus();
    }, [open, isPositioned]);

    const handleGridKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      const dayButton = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-date]"
      );
      if (!dayButton?.dataset.date) return;

      const from = fromDateKey(dayButton.dataset.date);
      const rowStart = addDays(from, -((from.getDay() - weekStartsOn + 7) % 7));
      let target: Date;

      switch (event.key) {
        case "ArrowLeft":
          target = addDays(from, -1);
          break;
        case "ArrowRight":
          target = addDays(from, 1);
          break;
        case "ArrowUp":
          target = addDays(from, -7);
          break;
        case "ArrowDown":
          target = addDays(from, 7);
          break;
        case "Home":
          target = rowStart;
          break;
        case "End":
          target = addDays(rowStart, 6);
          break;
        case "PageUp":
          target = addMonthsClamped(from, event.shiftKey ? -12 : -1);
          break;
        case "PageDown":
          target = addMonthsClamped(from, event.shiftKey ? 12 : 1);
          break;
        default:
          return;
      }

      event.preventDefault();
      moveFocus(target);
    };

    const handleRailKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const buttons = Array.from(
        event.currentTarget.querySelectorAll<HTMLButtonElement>(
          "button:not(:disabled)"
        )
      );
      const index = buttons.indexOf(
        document.activeElement as HTMLButtonElement
      );
      if (index < 0) return;

      let next: number;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        next = (index + 1) % buttons.length;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        next = (index - 1 + buttons.length) % buttons.length;
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = buttons.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      buttons[next]?.focus();
    };

    // The panel is a portal at the end of the page, so Tab would otherwise leave it for the browser chrome:
    // from its last (or first, with Shift) control focus returns to the trigger instead.
    const handlePopoverKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>
    ) => {
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        popoverRef.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), [tabindex]"
        ) ?? []
      ).filter((element) => element.tabIndex >= 0);
      if (focusable.length === 0) return;

      const active = document.activeElement;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (
        (event.shiftKey && active === first) ||
        (!event.shiftKey && active === last)
      ) {
        event.preventDefault();
        triggerRef.current?.focus();
      }
    };

    const selectingEnd = pendingEnd;
    const summaryDays =
      draftValue.start && draftValue.end
        ? countDays(draftValue.start, draftValue.end)
        : draftValue.start
          ? 1
          : 0;
    const summaryInfo = { days: summaryDays, selecting: selectingEnd };
    const summaryText = formatSummary
      ? formatSummary(draftValue, summaryInfo)
      : defaultSummary(draftValue, summaryInfo, locale);
    const todayStart = startOfDay(new Date());
    const showTodayLink =
      !isInVisibleMonths(todayStart) && !isDayDisabled(todayStart);

    // The provisional range runs from the first click to the day under the
    // pointer, in whichever order they fall. Before the first click (and after
    // the commit) there is nothing to preview.
    const previewAnchor = pendingEnd ? draftValue.start : undefined;
    const previewIsReversed =
      !!previewAnchor && !!previewDay && isBeforeDay(previewDay, previewAnchor);
    const previewLow =
      previewAnchor && previewDay
        ? previewIsReversed
          ? previewDay
          : previewAnchor
        : null;
    const previewHigh =
      previewAnchor && previewDay
        ? previewIsReversed
          ? previewAnchor
          : previewDay
        : null;
    const selectedPresetIndex = presets.findIndex((preset) => {
      const range = clampRange(preset.getRange(), effectiveMinDate, maxDate);

      return range !== null && isSameRange(range, currentValue);
    });

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
            // Arc panel: grows in from 95% and 8px above on the snappy spring (350ms), settling like the trigger it came from.
            "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.95] motion-safe:slide-in-from-top-2 origin-top-left motion-safe:[animation-duration:350ms] [--arc-snappy:linear(0,.0506,.1667,.2966,.4251,.5482,.6476,.7298,.7994,.8508,.8924,.922,.9442,.9613,.973,.9815,.9877,.9918,.9947,.9967,1)] [animation-timing-function:var(--arc-snappy)] motion-reduce:animate-[v2-fade-in_120ms_ease-out]",
            // Below `sm` the panel is a fixed compact width (the presets scroll inside it); it used to
            // stretch to the full length of the preset row.
            "flex flex-col max-sm:w-[19rem] font-[family-name:var(--font-v2,Inter,sans-serif)] rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary shadow-[0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045)] text-[var(--v2-text-secondary,#5E5E5E)] overflow-y-auto overflow-x-hidden overscroll-contain pointer-events-auto",
            "[scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:var(--semantic-border-secondary)_transparent]",
            "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-semantic-border-secondary"
          )}
          style={{
            ...floatingStyles,
            minWidth:
              presets.length === 0
                ? "var(--date-range-picker-trigger-width)"
                : undefined,
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
          onKeyDown={handlePopoverKeyDown}
        >
          <div className="flex flex-col sm:flex-row">
            {presets.length > 0 && (
              <div
                onKeyDown={handleRailKeyDown}
                className="flex shrink-0 gap-0.5 border-solid border-semantic-border-layout p-2 max-sm:w-full max-sm:flex-row max-sm:overflow-x-auto max-sm:border-b sm:w-[8.5rem] sm:flex-col sm:border-r"
              >
                {presets.map((preset, presetIndex) => {
                  const presetDisabled =
                    clampRange(preset.getRange(), effectiveMinDate, maxDate) ===
                    null;
                  const presetSelected = presetIndex === selectedPresetIndex;

                  return (
                    <button
                      key={preset.label}
                      type="button"
                      disabled={presetDisabled}
                      aria-current={presetSelected ? "true" : undefined}
                      className={cn(
                        "shrink-0 whitespace-nowrap rounded px-2.5 py-1.5 text-left text-sm [transition:color_160ms_cubic-bezier(0.22,1,0.36,1),background-color_160ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none max-sm:border max-sm:border-solid max-sm:border-semantic-border-layout sm:flex sm:h-8 sm:w-full sm:items-center sm:py-0",
                        FOCUS_RING,
                        presetSelected
                          ? "bg-semantic-info-surface font-medium text-[var(--v2-text-primary,#484848)]"
                          : cn(
                              "text-[var(--v2-text-secondary,#5E5E5E)]",
                              HOVER_FILL
                            ),
                        presetDisabled &&
                          "cursor-not-allowed opacity-40 [@media(hover:hover)]:hover:bg-transparent"
                      )}
                      onClick={() => handlePresetClick(preset)}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/*
              Each month is 276px: the header's widest month ("September" + chevron + 32px arrows) needs
              ~268px, and any narrower would resize the panel as you page between months.
            */}
            <div className="min-w-0 flex-1 p-2 touch-pan-y">
              <div
                className={cn(
                  "flex",
                  monthCount > 1
                    ? "flex-col gap-2 sm:flex-row sm:gap-4"
                    : "flex-col"
                )}
              >
                {visibleMonths.map((month, monthIndex) => {
                  const days = getCalendarDays(month, weekStartsOn);
                  const monthKey = getMonthKey(month);
                  const showPrev = monthIndex === 0;
                  const showNext = monthIndex === monthCount - 1;
                  const spacer = (
                    <span aria-hidden="true" className="size-8 shrink-0" />
                  );

                  return (
                    <div
                      key={monthIndex}
                      className="min-w-0 flex-1 sm:min-w-[276px]"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        {showPrev ? (
                          <button
                            type="button"
                            aria-label="Previous month"
                            className={cn(CALENDAR_NAV_BUTTON, FOCUS_RING)}
                            onClick={() =>
                              setVisibleMonth((current) =>
                                addMonths(current, -1)
                              )
                            }
                          >
                            <ChevronLeft
                              className="size-4"
                              aria-hidden="true"
                            />
                          </button>
                        ) : (
                          spacer
                        )}

                        {monthIndex === 0 ? (
                          <div
                            id={`${triggerId}-calendar-heading`}
                            aria-live="polite"
                            className="flex items-center gap-2"
                          >
                            <DropdownMenu
                              modal={false}
                              open={openMenu === "month"}
                              onOpenChange={(nextOpen) =>
                                setOpenMenu((current) => {
                                  if (nextOpen) return "month";
                                  // Clicking the other trigger dismisses this menu
                                  // *after* the other one has opened — only clear the
                                  // slot if it is still ours.
                                  return current === "month" ? null : current;
                                })
                              }
                            >
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  data-calendar-menu="month"
                                  onPointerDown={(event) =>
                                    event.preventDefault()
                                  }
                                  onClick={() => toggleCalendarMenu("month")}
                                  className={cn(CALENDAR_PILL, FOCUS_RING)}
                                >
                                  {MONTH_LONG_NAMES[visibleMonth.getMonth()]}
                                  <ChevronDown
                                    className={cn(
                                      CALENDAR_PILL_CHEVRON,
                                      openMenu === "month" && "rotate-180"
                                    )}
                                    aria-hidden="true"
                                  />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="start"
                                // Closing must not pull focus back to the trigger: the
                                // sibling menu opening in the same click would then see
                                // focus land outside itself and dismiss immediately.
                                onCloseAutoFocus={(event) =>
                                  event.preventDefault()
                                }
                                className={cn(
                                  CALENDAR_DROPDOWN_Z_INDEX,
                                  "max-h-[240px] overflow-y-auto"
                                )}
                              >
                                {MONTH_LONG_NAMES.map((label, monthIndex) => (
                                  <DropdownMenuItem
                                    key={label}
                                    disabled={
                                      !isMonthSelectable(
                                        visibleMonth.getFullYear(),
                                        monthIndex,
                                        effectiveMinDate,
                                        maxDate
                                      )
                                    }
                                    onSelect={() =>
                                      setVisibleMonth(
                                        startOfMonth(
                                          new Date(
                                            visibleMonth.getFullYear(),
                                            monthIndex,
                                            1
                                          )
                                        )
                                      )
                                    }
                                  >
                                    {label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu
                              modal={false}
                              open={openMenu === "year"}
                              onOpenChange={(nextOpen) =>
                                setOpenMenu((current) => {
                                  if (nextOpen) return "year";
                                  // Clicking the other trigger dismisses this menu
                                  // *after* the other one has opened — only clear the
                                  // slot if it is still ours.
                                  return current === "year" ? null : current;
                                })
                              }
                            >
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  data-calendar-menu="year"
                                  onPointerDown={(event) =>
                                    event.preventDefault()
                                  }
                                  onClick={() => toggleCalendarMenu("year")}
                                  className={cn(CALENDAR_PILL, FOCUS_RING)}
                                >
                                  {visibleMonth.getFullYear()}
                                  <ChevronDown
                                    className={cn(
                                      CALENDAR_PILL_CHEVRON,
                                      openMenu === "year" && "rotate-180"
                                    )}
                                    aria-hidden="true"
                                  />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="start"
                                // Closing must not pull focus back to the trigger: the
                                // sibling menu opening in the same click would then see
                                // focus land outside itself and dismiss immediately.
                                onCloseAutoFocus={(event) =>
                                  event.preventDefault()
                                }
                                className={cn(
                                  CALENDAR_DROPDOWN_Z_INDEX,
                                  "max-h-[240px] overflow-y-auto"
                                )}
                              >
                                {yearOptions.map((year) => (
                                  <DropdownMenuItem
                                    key={year}
                                    onSelect={() =>
                                      setVisibleMonth(
                                        startOfMonth(
                                          new Date(
                                            year,
                                            visibleMonth.getMonth(),
                                            1
                                          )
                                        )
                                      )
                                    }
                                  >
                                    {year}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ) : (
                          <div className="min-w-0 truncate text-sm font-medium text-[var(--v2-text-primary,#484848)]">
                            {getMonthName(month.getMonth(), locale)}{" "}
                            {month.getFullYear()}
                          </div>
                        )}

                        {showNext ? (
                          <button
                            type="button"
                            aria-label="Next month"
                            className={cn(CALENDAR_NAV_BUTTON, FOCUS_RING)}
                            onClick={() =>
                              setVisibleMonth((current) =>
                                addMonths(current, 1)
                              )
                            }
                          >
                            <ChevronRight
                              className="size-4"
                              aria-hidden="true"
                            />
                          </button>
                        ) : (
                          spacer
                        )}
                      </div>

                      <div
                        role="grid"
                        aria-label={`${getMonthName(month.getMonth(), locale)} ${month.getFullYear()}`}
                        onKeyDown={handleGridKeyDown}
                      >
                        {/* Static: only the day rows below re-mount (and slide) per month. */}
                        <div role="row" className="grid w-full grid-cols-7">
                          {weekdayLabels.map((day, dayOfWeek) => (
                            <div
                              key={dayOfWeek}
                              role="columnheader"
                              className="flex h-8 items-center justify-center text-xs font-medium text-[var(--v2-text-muted,#707070)] sm:h-6"
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                        <div
                          role="rowgroup"
                          key={monthKey}
                          className={cn(
                            "w-full",
                            monthMotion.direction && [
                              MONTH_MOTION,
                              MONTH_MOTION_DIRECTION[monthMotion.direction],
                            ]
                          )}
                          onPointerLeave={() => setPreviewDay(null)}
                          onBlur={(event) => {
                            if (
                              !event.currentTarget.contains(event.relatedTarget)
                            ) {
                              setPreviewDay(null);
                            }
                          }}
                        >
                          {Array.from({ length: 6 }, (_, rowIndex) => (
                            <div
                              key={rowIndex}
                              role="row"
                              className="grid w-full grid-cols-7"
                            >
                              {days
                                .slice(rowIndex * 7, rowIndex * 7 + 7)
                                .map((day, columnIndex) => {
                                  const isCurrentMonth =
                                    day.getMonth() === month.getMonth();

                                  // With two months on screen the neighbouring month's days belong to the other grid.
                                  if (monthCount > 1 && !isCurrentMonth) {
                                    return (
                                      <div
                                        key={day.toISOString()}
                                        role="gridcell"
                                        aria-hidden="true"
                                        className="h-8"
                                      />
                                    );
                                  }

                                  const isToday = isSameDay(day, new Date());
                                  const { start, end } = draftValue;
                                  const hasRange =
                                    !!start && !!end && !isSameDay(start, end);
                                  const isRangeStart = isSameDay(day, start);
                                  const isRangeEnd = isSameDay(day, end);
                                  const isBetween =
                                    hasRange &&
                                    !!start &&
                                    !!end &&
                                    isAfterDay(day, start) &&
                                    isBeforeDay(day, end);
                                  const isInBand =
                                    hasRange &&
                                    (isRangeStart || isRangeEnd || isBetween);
                                  const isInPreview =
                                    !isInBand &&
                                    !!previewLow &&
                                    !!previewHigh &&
                                    !isSameDay(previewLow, previewHigh) &&
                                    !isBeforeDay(day, previewLow) &&
                                    !isAfterDay(day, previewHigh);
                                  const isPreviewEnd =
                                    !!previewDay &&
                                    !!previewAnchor &&
                                    isSameDay(day, previewDay) &&
                                    !isSameDay(day, previewAnchor);
                                  const isSelectedEdge =
                                    isRangeStart || isRangeEnd;
                                  // The column alone says where a week row wraps (the first column follows
                                  // weekStartsOn): the band is capped there as well as at the range's own ends.
                                  const hasBand = isInBand || isInPreview;
                                  const isBandStart =
                                    hasBand &&
                                    isSameDay(
                                      day,
                                      isInPreview ? previewLow : start
                                    );
                                  const isBandEnd =
                                    hasBand &&
                                    isSameDay(
                                      day,
                                      isInPreview ? previewHigh : end
                                    );
                                  const isDisabled = isDayDisabled(day);
                                  const dayLabel = day.toLocaleDateString(
                                    locale ?? DEFAULT_LOCALE,
                                    {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  );

                                  return (
                                    <div
                                      key={day.toISOString()}
                                      role="gridcell"
                                      aria-selected={
                                        isSelectedEdge || isBetween
                                      }
                                      className={cn(
                                        "relative flex h-8 items-center justify-center",
                                        hasBand && BAND_BASE,
                                        isInBand && BAND_RANGE,
                                        isInPreview && BAND_PREVIEW,
                                        hasBand &&
                                          (columnIndex === 0 || isBandStart) &&
                                          "before:rounded-l-full",
                                        hasBand &&
                                          (columnIndex === 6 || isBandEnd) &&
                                          "before:rounded-r-full",
                                        isBandStart && BAND_START_AT_CIRCLE,
                                        isBandEnd && BAND_END_AT_CIRCLE
                                      )}
                                    >
                                      <button
                                        type="button"
                                        data-date={toDateKey(day)}
                                        tabIndex={
                                          isSameDay(day, rovingDay) ? 0 : -1
                                        }
                                        aria-label={dayLabel}
                                        aria-pressed={isSelectedEdge}
                                        aria-current={
                                          isToday ? "date" : undefined
                                        }
                                        disabled={isDisabled}
                                        className={cn(
                                          "relative z-[1] flex h-8 w-full max-w-8 items-center justify-center rounded-full text-sm [font-variant-numeric:tabular-nums] [transition-property:color,background-color,transform] [transition-duration:160ms,160ms,120ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] enabled:active:scale-90 motion-reduce:[transition-property:color,background-color] motion-reduce:enabled:active:scale-100 sm:h-[28px] sm:max-w-[28px]",
                                          FOCUS_RING,
                                          "focus-visible:z-10",
                                          isSelectedEdge
                                            ? "bg-semantic-primary text-semantic-text-inverted font-medium"
                                            : cn(
                                                isCurrentMonth
                                                  ? "text-[var(--v2-text-secondary,#5E5E5E)]"
                                                  : "text-[var(--v2-text-muted,#707070)]",
                                                // The provisional end is outlined, not filled:
                                                // it only becomes a selected circle on click.
                                                isPreviewEnd
                                                  ? "ring-1 ring-inset ring-semantic-primary"
                                                  : HOVER_FILL
                                              ),
                                          isDisabled &&
                                            "opacity-40 cursor-not-allowed pointer-events-none"
                                        )}
                                        onClick={() => {
                                          if (isDisabled) return;

                                          setFocusDay(day);
                                          handleDayClick(day);
                                        }}
                                        onPointerEnter={(event) => {
                                          // A touch "hover" is just the tap that is about to
                                          // commit; previewing it would flash a band.
                                          if (
                                            pendingEnd &&
                                            event.pointerType !== "touch"
                                          ) {
                                            setPreviewDay(day);
                                          }
                                        }}
                                        onFocus={() => {
                                          setFocusDay(day);
                                          if (pendingEnd) setPreviewDay(day);
                                        }}
                                      >
                                        {day.getDate()}
                                        {isToday && (
                                          <span
                                            className={cn(
                                              "absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full max-sm:bottom-[3px]",
                                              isSelectedEdge
                                                ? "bg-semantic-text-inverted"
                                                : "bg-semantic-primary"
                                            )}
                                          />
                                        )}
                                      </button>
                                    </div>
                                  );
                                })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {showSummary && (
                <div className="mt-1.5 flex min-h-9 items-center justify-between gap-3 border-t border-solid border-semantic-border-layout px-1 pt-2">
                  <div
                    role="status"
                    aria-live="polite"
                    className="min-w-0 flex-1 text-sm leading-5 text-[var(--v2-text-secondary,#5E5E5E)]"
                  >
                    <span
                      key={summaryText}
                      className={cn("block truncate", SUMMARY_MOTION)}
                    >
                      {summaryText}
                    </span>
                  </div>
                  {showTodayLink && (
                    <button
                      type="button"
                      className={cn(
                        "shrink-0 rounded px-2 py-1 text-sm font-medium text-[var(--v2-text-primary,#484848)] [transition:background-color_160ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                        SUMMARY_MOTION,
                        FOCUS_RING,
                        HOVER_FILL
                      )}
                      onClick={() => {
                        setVisibleMonth(startOfMonth(todayStart));
                        setFocusDay(todayStart);
                      }}
                    >
                      Today
                    </button>
                  )}
                </div>
              )}
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
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"]}
          aria-describedby={props["aria-describedby"]}
          aria-invalid={props["aria-invalid"] ?? state === "error"}
          className={cn(
            dateRangePickerTriggerVariants({ state }),
            open && state !== "error" && "border-semantic-primary shadow-none",
            !displayValue && "text-[var(--v2-text-placeholder,#707070)]",
            showClear && "pr-11",
            triggerClassName
          )}
          onClick={(event) => {
            // A click with no pointer (Enter or Space) is a keyboard open: the grid takes focus.
            focusOnOpenRef.current = !open && event.detail === 0;
            setOpen(!open);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && !open) {
              event.preventDefault();
              focusOnOpenRef.current = true;
              setOpen(true);
            }
          }}
        >
          <FigmaCalendarIcon className="size-[18px] shrink-0 text-[var(--v2-text-secondary,#5E5E5E)]" />
          <span
            title={displayValue || placeholder}
            className={cn(
              "min-w-0 flex-1 truncate",
              !displayValue && "font-normal",
              triggerLabelClassName
            )}
          >
            {displayValue || placeholder}
          </span>
        </button>

        {showClear && (
          <button
            type="button"
            aria-label={clearLabel}
            className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-sm text-[var(--v2-text-secondary,#5E5E5E)] outline-none transition-colors hover:text-[var(--v2-text-primary,#484848)] focus-visible:ring-2 focus-visible:ring-semantic-border-focus"
            onClick={handleClear}
          >
            <X className="size-4" />
          </button>
        )}

        {popover}
      </div>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker, dateRangePickerTriggerVariants };
