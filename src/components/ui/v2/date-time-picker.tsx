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
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

const DEFAULT_START_TIME = "10:30:00";
/**
 * What the time columns show while no time is selected. Clearing the value
 * returns the picker to this state, so an unset time always reads 12:00 AM
 * rather than re-proposing the sample default.
 */
const UNSET_TIME = "00:00:00";
const DEFAULT_MINUTE_STEP = 5;
const DEFAULT_SECOND_STEP = 5;
const TIME_COLUMN_MAX_HEIGHT = 168;
const DEFAULT_PLACEHOLDER = "--/--/---- --:-- --";
/**
 * Masks used when only one half of a date-time value is filled in. The trigger
 * keeps both segments in place so the field reads as "date selected, time still
 * missing" rather than silently collapsing to a single value.
 */
const DATE_SEGMENT_MASK = "--/--/----";
const TIME_SEGMENT_MASK = "--:-- --";
const TIME_SEGMENT_MASK_WITH_SECONDS = "--:--:-- --";
const POPOVER_WIDTH = 288;
// Match the field width while preserving a usable calendar at narrow sizes.
// Floating UI still limits the panel to the available viewport.
const MIN_POPOVER_WIDTH = 264;
const POPOVER_MARGIN = 8;
const POPOVER_GAP = 4;
const MAX_POPOVER_HEIGHT = 500;
const POPOVER_SCROLL_HEIGHT_VAR = "--date-time-picker-scroll-height";
const POPOVER_WIDTH_VAR = "--date-time-picker-popover-width";
const CALENDAR_PLACEMENT: Placement = "bottom-start";
const YEAR_RANGE_BEFORE = 100;
const YEAR_RANGE_AFTER = 10;
// Outline rather than ring: it follows border-radius, takes no part in layout
// and is not clipped by the neighbouring cell's background.
const FOCUS_RING =
  "focus-visible:outline focus-visible:[outline-width:2px] focus-visible:outline-offset-1 focus-visible:outline-semantic-primary";
// List rows sit inside scrolling columns that clip at their edge, so their ring
// is drawn inside the row instead of outside it.
const FOCUS_RING_INSET =
  "focus-visible:outline focus-visible:[outline-width:2px] focus-visible:outline-offset-[-2px] focus-visible:outline-semantic-primary";
// Hover fills only where a real hover exists. On touch a tap would otherwise
// leave the fill stuck on the element until the next tap elsewhere.
const HOVER_FILL = "[@media(hover:hover)]:hover:bg-semantic-bg-hover";
const HOVER_BORDER =
  "[@media(hover:hover)]:hover:border-[var(--color-primary-100,#C0C3CA)]";

// Same geometry as the DateRangePicker's calendar header so the two pickers
// read as one family: 32px nav hit areas (36px on touch-sized viewports) and
// 32px pills with a chevron that turns while the list is open.
// Arc header controls: a fill on hover (160ms), a quick press (.96 over 120ms) and a spring release (580ms).
const CALENDAR_NAV_BUTTON = `inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--v2-text-secondary,#5E5E5E)] [transition-property:background-color,color,transform] [transition-duration:160ms,160ms,580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] enabled:active:scale-[0.96] enabled:active:[transition-duration:160ms,160ms,120ms] motion-reduce:[transition-property:background-color,color] motion-reduce:enabled:active:scale-100 max-sm:size-9 ${HOVER_FILL}`;
const CALENDAR_DROPDOWN_TRIGGER_CLASS = `h-8 min-w-0 w-full rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary px-2 text-sm font-medium text-[var(--v2-text-primary,#484848)] outline-none transition-colors ${HOVER_FILL}`;

// Arc popup surfaces grow in on the snappy spring (visualDuration .26, bounce .12; sampled, settling in 350ms): the calendar
// from 95% and 8px above, menus from 97% and 6px above. Positioned panels use transform: false, so the keyframes own transform.
const ARC_SNAPPY =
  "[--arc-snappy:linear(0,.0506,.1667,.2966,.4251,.5482,.6476,.7298,.7994,.8508,.8924,.922,.9442,.9613,.973,.9815,.9877,.9918,.9947,.9967,1)]";
const POPOVER_MOTION = `motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.95] motion-safe:slide-in-from-top-2 origin-top-left motion-safe:[animation-duration:350ms] ${ARC_SNAPPY} [animation-timing-function:var(--arc-snappy)] motion-reduce:animate-[v2-fade-in_120ms_ease-out]`;
const MENU_MOTION = `motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.97] motion-safe:slide-in-from-top-1.5 origin-top-left motion-safe:[animation-duration:350ms] ${ARC_SNAPPY} [animation-timing-function:var(--arc-snappy)] motion-reduce:animate-[v2-fade-in_120ms_ease-out]`;
const POPUP_SHADOW =
  "shadow-[0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045)]";
const CHEVRON_TURN =
  "transition-transform [transition-duration:580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

// Month change motion. The grid only gets these classes after the user has
// navigated, so mounting the popover never animates.
const MONTH_MOTION =
  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:[animation-duration:200ms] [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] motion-reduce:animate-[v2-fade-in_120ms_ease-out]";
const MONTH_MOTION_DIRECTION = {
  next: "motion-safe:slide-in-from-right-2",
  prev: "motion-safe:slide-in-from-left-2",
} as const;

type MonthDirection = keyof typeof MONTH_MOTION_DIRECTION | null;

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DEFAULT_LOCALE = "en-US";
type WeekStart = 0 | 1;

// The today link and the grid's height share one quiet curve; reduced motion drops the height tween.
const TODAY_ROW_MOTION =
  "grid [transition:grid-template-rows_200ms_var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1)),opacity_160ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition:opacity_120ms_ease-out]";
const monthNames = Array.from({ length: 12 }, (_, monthIndex) =>
  new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    new Date(2026, monthIndex, 1)
  )
);
const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const dateTimePickerVariants = cva(
  "relative inline-block w-full max-w-full font-[family-name:var(--font-v2,Inter,sans-serif)]",
  {
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
  }
);

const dateTimePickerTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-lg border border-solid bg-semantic-bg-primary font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal text-left text-[var(--v2-text-secondary,#5E5E5E)] outline-none transition-[border-color,box-shadow,background-color] duration-150",
  {
    variants: {
      size: {
        sm: "h-11 gap-2 px-4 py-2 text-sm",
        default: "h-11 gap-2 px-4 py-2 text-sm",
        lg: "h-11 gap-2 px-4 py-2 text-sm",
      },
      state: {
        default:
          "border-semantic-border-input hover:border-[var(--color-primary-100,#C0C3CA)] focus-within:shadow-none",
        error:
          "border-semantic-error-primary shadow-[0_0_4px_0_rgba(240,68,56,0.4)]  ",
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
  /** Empty string until a time is explicitly selected */
  startTime: string;
  /** Empty string until a time is explicitly selected */
  endTime: string;
}

export interface DateTimePickerProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">,
    VariantProps<typeof dateTimePickerVariants>,
    Pick<VariantProps<typeof dateTimePickerTriggerVariants>, "state"> {
  value?: Partial<DateTimePickerValue>;
  defaultValue?: Partial<DateTimePickerValue>;
  onValueChange?: (value: DateTimePickerValue) => void;
  /** Label text displayed above the trigger */
  label?: string;
  /** Shows a red asterisk next to the label when true */
  required?: boolean;
  /** Additional class for the label */
  labelClassName?: string;
  /** Helper text displayed below the picker */
  helperText?: string;
  /** Error message — shows red text below and drives state="error" */
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  showEndTime?: boolean;
  showSeconds?: boolean;
  minuteStep?: number;
  secondStep?: number;
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
  /** First day of the week in the calendar: 0 is Sunday (default), 1 is Monday. */
  weekStartsOn?: 0 | 1;
  /**
   * BCP 47 locale for the calendar's month names, weekday labels and day labels, for example `"en-GB"` or
   * `"hi-IN"`. The typed date field keeps its day/month/year format. Without it the labels stay English.
   */
  locale?: string;
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
    startTime: value?.startTime ?? "",
    endTime: value?.endTime ?? "",
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

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
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

// Floating sub-dropdowns (Month / Year / Time) are portaled to document.body
// so they escape the popover's overflow clipping. Because they live outside the
// popover in the DOM, the picker's own outside-click handler can't recognize
// them via `contains`. Tagging each portaled panel with this attribute lets the
// handler detect clicks that land inside an open sub-dropdown.
const DROPDOWN_MARKER_ATTR = "data-dtp-dropdown";
const DROPDOWN_GAP = 4;
const DROPDOWN_MARGIN = 8;
const DROPDOWN_MAX_HEIGHT = 256;
const DROPDOWN_Z_INDEX = 10060;
const DROPDOWN_PLACEMENT: Placement = "bottom-start";
const DROPDOWN_WIDTH_VAR = "--date-time-picker-dropdown-width";
const DROPDOWN_HEIGHT_VAR = "--date-time-picker-dropdown-height";

function isPointerInsideDropdown(event: MouseEvent) {
  const target = event.target;

  return (
    target instanceof Element &&
    target.closest(`[${DROPDOWN_MARKER_ATTR}]`) !== null
  );
}

// Shared floating + dismissal behavior for the Month, Year, and Time dropdowns.
// Each instance positions its panel against its trigger, mirrors the picker's
// portal strategy, and closes itself on an outside click or Escape — without
// collapsing the parent picker (Escape is captured so it doesn't bubble to the
// picker's own Escape handler).
function useFloatingDropdown({
  open,
  onOpenChange,
  strategy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy: Strategy;
}) {
  const middleware = React.useMemo(
    () => [
      offset(DROPDOWN_GAP),
      flip({ padding: DROPDOWN_MARGIN }),
      shift({ padding: DROPDOWN_MARGIN }),
      floatingSize({
        padding: DROPDOWN_MARGIN,
        apply({ availableHeight, rects, elements }) {
          const maxHeight = Math.max(
            1,
            Math.min(DROPDOWN_MAX_HEIGHT, availableHeight)
          );
          elements.floating.style.setProperty(
            DROPDOWN_HEIGHT_VAR,
            `${maxHeight}px`
          );
          elements.floating.style.setProperty(
            DROPDOWN_WIDTH_VAR,
            `${rects.reference.width}px`
          );
        },
      }),
    ],
    []
  );

  const floating = useFloating<HTMLButtonElement>({
    open,
    placement: DROPDOWN_PLACEMENT,
    strategy,
    transform: false,
    middleware,
    whileElementsMounted: (reference, floatingEl, update) =>
      autoUpdate(reference, floatingEl, update, { animationFrame: true }),
  });

  const { refs, floatingStyles, isPositioned } = floating;

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const reference = refs.reference.current as HTMLElement | null;
      if (
        !isPointerInsideElement(event, reference) &&
        !isPointerInsideElement(event, refs.floating.current)
      ) {
        onOpenChange(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Capture phase + stopPropagation keeps Escape from also reaching the
        // picker's handler, so it dismisses just this dropdown.
        event.stopPropagation();
        onOpenChange(false);
      }
    };

    // Capture phase: the popover container calls stopPropagation on its own
    // mousedown, which would otherwise swallow clicks inside it before they
    // reach a bubble-phase document listener. Listening on capture runs this
    // handler top-down — before that stopPropagation — so clicks anywhere
    // outside the dropdown (including elsewhere in the popover) dismiss it.
    document.addEventListener("mousedown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open, onOpenChange, refs]);

  const setReference = React.useCallback(
    (node: HTMLButtonElement | null) => refs.setReference(node),
    [refs]
  );
  const setFloating = React.useCallback(
    (node: HTMLDivElement | null) => refs.setFloating(node),
    [refs]
  );

  return { setReference, setFloating, floatingStyles, isPositioned };
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

/* A time reads as odometer wheels: a pick rolls the digits in the direction of change (up when the time
   moves later, down when earlier), 12 to 1 and 59 to 00 turn one place instead of rewinding, and AM / PM
   swaps as a word. The text itself stays in the DOM for assistive tech and tests (see TimeField). */
const WHEEL_SPRING = {
  type: "spring",
  visualDuration: 0.32,
  bounce: 0.12,
} as const;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function TimeGlyph({
  position,
  digit,
}: {
  position: MotionValue<number>;
  digit: number;
}) {
  // Every style reads the wheel directly: a chained transform can lag a frame and leave the wheel blank on a jump.
  const offset = (current: number) =>
    ((((digit - current) % 10) + 15) % 10) - 5;
  const y = useTransform(position, (current) => `${offset(current) * 1.05}em`);
  const opacity = useTransform(position, (current) =>
    Math.max(0, 1 - Math.abs(offset(current)) ** 1.5 * 1.1)
  );
  const visibility = useTransform(position, (current) =>
    Math.abs(offset(current)) >= 1 ? "hidden" : "visible"
  );
  const filter = useTransform(position, (current) => {
    const distance = Math.abs(offset(current));
    return distance < 0.02 || distance >= 1
      ? "none"
      : `blur(${(distance * 3).toFixed(2)}px)`;
  });
  return (
    <motion.span
      className="absolute inset-0 flex items-center justify-center"
      style={{ y, opacity, filter, visibility }}
    >
      {digit}
    </motion.span>
  );
}

function TimeWheel({ digit, direction }: { digit: number; direction: 1 | -1 }) {
  const reduced = useReducedMotion();
  const position = useMotionValue(digit);
  const wheel = React.useRef({ digit, target: digit });
  React.useLayoutEffect(() => {
    const state = wheel.current;
    if (state.digit === digit) return;
    // Turn the way the time moved, unless that is more than half a turn: then take the short way round.
    let delta =
      direction > 0
        ? (digit - state.digit + 10) % 10
        : -((state.digit - digit + 10) % 10);
    if (Math.abs(delta) > 5) delta -= Math.sign(delta) * 10;
    state.target += delta;
    state.digit = digit;
    if (reduced) position.jump(state.target);
    else animate(position, state.target, WHEEL_SPRING);
  }, [digit, direction, position, reduced]);
  return (
    <>
      {/* Sizes the column: tabular digits are all as wide as a 0. */}
      <span className="invisible">0</span>
      {DIGITS.map((item) => (
        <TimeGlyph key={item} position={position} digit={item} />
      ))}
    </>
  );
}

const meridiemRise: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: `${direction * 0.45}em`,
    filter: "blur(2px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transitionEnd: { filter: "none" },
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: `${direction * -0.45}em`,
    filter: "blur(2px)",
    transition: { duration: 0.12 },
  }),
};

/** "10:30 AM" or "10:30:15 AM" as wheels, a colon and a sliding AM / PM. Purely visual (aria-hidden). */
function RollingTime({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const match = /^(\d{2}(?::\d{2}){1,2}) (AM|PM)$/.exec(text);
  // Later times are bigger numbers, and PM is later than AM.
  const order = match
    ? Number((match[1] ?? "").replace(/\D/g, "")) +
      (match[2] === "PM" ? 1e7 : 0)
    : 0;
  const [trail, setTrail] = React.useState<{
    order: number;
    direction: 1 | -1;
  }>({ order, direction: 1 });
  if (trail.order !== order) {
    setTrail({ order, direction: order > trail.order ? 1 : -1 });
  }
  const direction: 1 | -1 =
    trail.order === order ? trail.direction : order > trail.order ? 1 : -1;

  if (!match) return <span aria-hidden="true">{text}</span>;
  const [, clock = "", meridiem = "AM"] = match;
  return (
    <span
      aria-hidden="true"
      data-rolling-time=""
      className="inline-flex items-center whitespace-nowrap"
    >
      {[...clock].map((char, index) =>
        /\d/.test(char) ? (
          <span
            key={index}
            className="relative inline-flex justify-center [font-variant-numeric:tabular-nums]"
          >
            <TimeWheel digit={Number(char)} direction={direction} />
          </span>
        ) : (
          <span key={index}>{char}</span>
        )
      )}
      <span className="relative ml-1 inline-flex">
        {reduced ? (
          meridiem
        ) : (
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.span
              key={meridiem}
              custom={direction}
              variants={meridiemRise}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {meridiem}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
    </span>
  );
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
  showSeconds: boolean,
  maskMissingSegments = false
) {
  if (variant === "date-only") {
    return formatDateOnlyForDisplay(value.date);
  }

  if (variant === "time-only") {
    if (!value.startTime && !value.endTime) return "";

    return showEndTime
      ? `${formatTimeForDisplay(value.startTime || UNSET_TIME, showSeconds)} - ${formatTimeForDisplay(value.endTime || UNSET_TIME, showSeconds)}`
      : formatTimeForDisplay(value.startTime || UNSET_TIME, showSeconds);
  }

  const datePart = formatDateOnlyForDisplay(value.date);
  const timePart = value.startTime
    ? formatTimeForDisplay(value.startTime, showSeconds)
    : "";

  if (!datePart && !timePart) return "";

  // Both segments are visible in the `date-time` variant, so a half-filled value
  // renders the missing half as its own placeholder mask instead of collapsing —
  // otherwise a date-only selection reads as a complete value.
  if (maskMissingSegments) {
    const timeMask = showSeconds
      ? TIME_SEGMENT_MASK_WITH_SECONDS
      : TIME_SEGMENT_MASK;

    return [datePart || DATE_SEGMENT_MASK, timePart || timeMask].join(" ");
  }

  return [datePart, timePart].filter(Boolean).join(" ");
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
    const yearResult = consumeDigits(`${monthResult.rest}${yearPart}`, 4);
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

function isPotentiallyValidTimeDigits(
  timeDigits: string,
  showSeconds: boolean
) {
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
  if (
    !isPotentiallyValidTimeDigits(timeDigits, showSeconds) ||
    meridiem === null
  ) {
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
  const { dateDigits, dateValue, isValid } =
    splitTypedDateInput(normalizedValue);
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

  const normalizedValue = value.toUpperCase().replace(/[^0-9\s/:APM-]/g, "");
  const { dateDigits, dateValue, isComplete, isValid, restValue } =
    splitTypedDateInput(normalizedValue);
  const limitedDateDigits = dateDigits.slice(0, 8);

  if (!limitedDateDigits) return "";
  if (!isValid) return previousValue;

  const formattedTime = isComplete
    ? formatTimeInput(restValue, showSeconds)
    : "";
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
  nextDate.setHours(
    Number(hourValue),
    Number(minuteValue),
    Number(secondValue)
  );

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
    .padStart(2, "0")}:${nextDate.getSeconds().toString().padStart(2, "0")}`;

  return {
    date: startOfDay(nextDate),
    startTime,
    segment,
  };
}

type Meridiem = "AM" | "PM";

function padTime(value: number) {
  return value.toString().padStart(2, "0");
}

function buildTimeRange(max: number, step: number) {
  const safeStep = Math.max(1, Math.floor(step));
  const values: number[] = [];
  for (let value = 0; value <= max; value += safeStep) {
    values.push(value);
  }

  return values;
}

function decomposeTime(time: string) {
  const normalizedTime = parseTimePart(time) ?? DEFAULT_START_TIME;
  const [hour = "0", minute = "0", second = "0"] = normalizedTime.split(":");
  const hourNumber = Number(hour);

  return {
    hour12: hourNumber % 12 || 12,
    minute: Number(minute),
    second: Number(second),
    meridiem: (hourNumber >= 12 ? "PM" : "AM") as Meridiem,
  };
}

function composeTime(
  hour12: number,
  minute: number,
  second: number,
  meridiem: Meridiem
) {
  const normalizedHour12 = hour12 % 12;
  const hour = meridiem === "PM" ? normalizedHour12 + 12 : normalizedHour12;

  return `${padTime(hour)}:${padTime(minute)}:${padTime(second)}`;
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
  showEndTime: boolean
) {
  const startTime = value.startTime || UNSET_TIME;
  const endTime = value.endTime || UNSET_TIME;

  if (variant === "time-only") {
    if (!value.startTime && !value.endTime) return "";

    return showEndTime ? `${startTime}/${endTime}` : startTime;
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

  if (!value.startTime) return `${year}-${month}-${day}`;

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

function FigmaClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 4.5V9L11.25 11.25M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9Z"
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
  portalMount,
  strategy,
}: {
  id: string;
  label: string;
  value: string;
  options: CalendarDropdownOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValueChange: (value: string) => void;
  portalMount: HTMLElement | null;
  strategy: Strategy;
}) {
  const selectedOption = options.find((option) => option.value === value);
  const { setReference, setFloating, floatingStyles, isPositioned } =
    useFloatingDropdown({
      open,
      onOpenChange,
      strategy,
    });

  return (
    <div className="relative min-w-0 flex-1">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <button
        ref={setReference}
        id={id}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={`${id}-options`}
        data-value={value}
        className={cn(
          CALENDAR_DROPDOWN_TRIGGER_CLASS,
          FOCUS_RING,
          "inline-flex items-center justify-between gap-2"
        )}
        onClick={() => onOpenChange(!open)}
      >
        <span>{selectedOption?.label ?? value}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-[var(--v2-text-muted,#707070)]",
            CHEVRON_TURN,
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {open &&
        portalMount &&
        createPortal(
          <div
            ref={setFloating}
            id={`${id}-options`}
            role="listbox"
            aria-label={`${label} options`}
            data-dtp-dropdown=""
            className={cn(
              MENU_MOTION,
              POPUP_SHADOW,
              "flex flex-col gap-0.5 overflow-y-auto rounded-md border border-solid border-semantic-border-layout bg-semantic-bg-primary font-[family-name:var(--font-v2,Inter,sans-serif)] p-1 [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-semantic-border-secondary [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
            )}
            style={{
              ...floatingStyles,
              width: `var(${DROPDOWN_WIDTH_VAR}, auto)`,
              maxHeight: `var(${DROPDOWN_HEIGHT_VAR}, ${DROPDOWN_MAX_HEIGHT}px)`,
              zIndex: DROPDOWN_Z_INDEX,
              visibility: isPositioned ? undefined : "hidden",
            }}
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
                  "flex w-full shrink-0 items-center rounded-md border border-solid px-2 py-1.5 text-left text-sm disabled:cursor-not-allowed disabled:opacity-40",
                  FOCUS_RING_INSET,
                  option.value === value
                    ? "border-semantic-info-border bg-semantic-info-surface font-medium text-[var(--v2-text-primary,#484848)]"
                    : cn(
                        "border-transparent text-[var(--v2-text-secondary,#5E5E5E)]",
                        HOVER_FILL
                      )
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
          </div>,
          portalMount
        )}
    </div>
  );
}

interface TimeColumnOption {
  key: string;
  label: string;
  selected: boolean;
}

// Instant, so reduced motion needs no special case. offsetTop is measured from
// the list (it is `relative`) and ignores the panel's zoom-in transform, which
// getBoundingClientRect would not.
function scrollRowToCentre(list: HTMLElement, row: HTMLElement) {
  list.scrollTop = row.offsetTop - (list.clientHeight - row.offsetHeight) / 2;
}

function TimeColumn({
  header,
  ariaLabel,
  options,
  onSelect,
}: {
  header: string;
  ariaLabel: string;
  options: TimeColumnOption[];
  onSelect: (key: string) => void;
}) {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const selectedRef = React.useRef<HTMLButtonElement | null>(null);

  // Layout effect: the centred position is in place before the first paint,
  // so the list never shows its unscrolled top first. Open-only: later
  // selections keep the list where the user left it.
  React.useLayoutEffect(() => {
    if (listRef.current && selectedRef.current) {
      scrollRowToCentre(listRef.current, selectedRef.current);
    }
  }, []);

  // Additive to the Tab/click behaviour: inside a focused column the arrows
  // step the selection (like clicking the neighbour) and Home/End jump to the
  // ends. Modified keys are left to the browser.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;

    const rows = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]')
    );
    if (rows.length === 0) return;

    const focusedIndex = rows.indexOf(event.target as HTMLButtonElement);
    const currentIndex =
      focusedIndex >= 0
        ? focusedIndex
        : options.findIndex((option) => option.selected);
    const lastIndex = rows.length - 1;
    let nextIndex: number;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = lastIndex;
    else if (event.key === "ArrowDown") {
      nextIndex = currentIndex < 0 ? 0 : Math.min(lastIndex, currentIndex + 1);
    } else {
      nextIndex = currentIndex < 0 ? lastIndex : Math.max(0, currentIndex - 1);
    }

    // Keep the arrows from scrolling the column or the popover underneath.
    event.preventDefault();
    const nextRow = rows[nextIndex];
    const nextOption = options[nextIndex];
    if (!nextRow || !nextOption) return;

    if (nextIndex !== currentIndex) onSelect(nextOption.key);
    nextRow.focus({ preventScroll: true });
    scrollRowToCentre(event.currentTarget, nextRow);
  };

  return (
    <div className="flex min-w-0 flex-col border-r border-solid border-semantic-border-layout last:border-r-0">
      <div className="border-b border-solid border-semantic-border-layout px-1 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-[var(--v2-text-muted,#707070)]">
        {header}
      </div>
      <div
        ref={listRef}
        role="listbox"
        aria-label={ariaLabel}
        className="relative flex flex-col overflow-y-auto px-1 py-0 [scroll-snap-type:y_proximity] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-semantic-border-secondary [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
        style={{ maxHeight: `${TIME_COLUMN_MAX_HEIGHT}px` }}
        onKeyDown={handleKeyDown}
      >
        {options.map((option) => (
          <button
            key={option.key}
            ref={option.selected ? selectedRef : undefined}
            type="button"
            role="option"
            aria-selected={option.selected}
            className={cn(
              "flex h-9 shrink-0 items-center justify-center rounded-md border-0 bg-transparent px-1 text-sm [font-variant-numeric:tabular-nums] [scroll-snap-align:center] [transition:background-color_80ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              FOCUS_RING_INSET,
              option.selected
                ? "bg-semantic-bg-hover font-medium text-[var(--v2-text-primary,#484848)]"
                : cn("text-[var(--v2-text-secondary,#5E5E5E)]", HOVER_FILL)
            )}
            onClick={() => onSelect(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TimeField({
  id,
  label,
  value,
  showSeconds,
  minuteStep,
  secondStep,
  open,
  onOpenChange,
  onChange,
  portalMount,
  strategy,
  inline = false,
}: {
  id: string;
  label: string;
  value: string;
  showSeconds: boolean;
  minuteStep: number;
  secondStep: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (time: string) => void;
  portalMount: HTMLElement | null;
  strategy: Strategy;
  inline?: boolean;
}) {
  const { hour12, minute, second, meridiem } = decomposeTime(value);
  const { setReference, setFloating, floatingStyles, isPositioned } =
    useFloatingDropdown({
      open,
      onOpenChange,
      strategy,
    });
  // When seconds are hidden they are not editable, so normalize to :00 on any
  // change rather than carrying a stale seconds value forward.
  const effectiveSecond = showSeconds ? second : 0;
  const hourOptions = React.useMemo<TimeColumnOption[]>(
    () =>
      Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => ({
        key: hour.toString(),
        label: padTime(hour),
        selected: hour === hour12,
      })),
    [hour12]
  );
  const minuteOptions = React.useMemo<TimeColumnOption[]>(
    () =>
      buildTimeRange(59, minuteStep).map((minuteValue) => ({
        key: minuteValue.toString(),
        label: padTime(minuteValue),
        selected: minuteValue === minute,
      })),
    [minute, minuteStep]
  );
  const secondOptions = React.useMemo<TimeColumnOption[]>(
    () =>
      buildTimeRange(59, secondStep).map((secondValue) => ({
        key: secondValue.toString(),
        label: padTime(secondValue),
        selected: secondValue === second,
      })),
    [second, secondStep]
  );
  const meridiemOptions: TimeColumnOption[] = [
    { key: "AM", label: "AM", selected: meridiem === "AM" },
    { key: "PM", label: "PM", selected: meridiem === "PM" },
  ];

  const columns = (
    <>
      <TimeColumn
        header="Hours"
        ariaLabel={`${label} hours`}
        options={hourOptions}
        onSelect={(key) =>
          onChange(composeTime(Number(key), minute, effectiveSecond, meridiem))
        }
      />
      <TimeColumn
        header="Minutes"
        ariaLabel={`${label} minutes`}
        options={minuteOptions}
        onSelect={(key) =>
          onChange(composeTime(hour12, Number(key), effectiveSecond, meridiem))
        }
      />
      {showSeconds && (
        <TimeColumn
          header="Seconds"
          ariaLabel={`${label} seconds`}
          options={secondOptions}
          onSelect={(key) =>
            onChange(composeTime(hour12, minute, Number(key), meridiem))
          }
        />
      )}
      <TimeColumn
        header="AM/PM"
        ariaLabel={`${label} meridiem`}
        options={meridiemOptions}
        onSelect={(key) =>
          onChange(
            composeTime(hour12, minute, effectiveSecond, key as Meridiem)
          )
        }
      />
    </>
  );

  return (
    <div className="flex flex-col gap-1.5">
      <span
        id={`${id}-label`}
        className="block text-sm font-medium text-[var(--v2-text-primary,#484848)]"
      >
        {label}
      </span>
      {inline ? (
        <div
          role="group"
          aria-labelledby={`${id}-label`}
          className={cn(
            "grid min-w-0 overflow-hidden rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary",
            showSeconds ? "grid-cols-4" : "grid-cols-3"
          )}
        >
          {columns}
        </div>
      ) : (
        <button
          ref={setReference}
          id={id}
          type="button"
          aria-label={label}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex h-11 w-full items-center gap-[9px] rounded border border-solid border-semantic-border-input bg-semantic-bg-primary px-3 text-left text-sm text-[var(--v2-text-secondary,#5E5E5E)] outline-none [transition:border-color_160ms_cubic-bezier(0.22,1,0.36,1),background-color_160ms_cubic-bezier(0.22,1,0.36,1),box-shadow_160ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            HOVER_BORDER,
            FOCUS_RING,
            open &&
              "border-semantic-primary shadow-[0_0_0_1px_rgba(43,188,202,0.15)]"
          )}
          onClick={() => onOpenChange(!open)}
        >
          <Clock2
            className="size-4 shrink-0 text-[var(--v2-text-muted,#707070)]"
            aria-hidden="true"
          />
          <span className="m-0 min-w-0 flex-1 truncate">
            {/* The text for assistive tech (and anything that reads the DOM); the wheels are for the eye. */}
            <span className="sr-only">
              {formatTimeForDisplay(value, showSeconds)}
            </span>
            <RollingTime text={formatTimeForDisplay(value, showSeconds)} />
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-[var(--v2-text-muted,#707070)]",
              CHEVRON_TURN,
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
      )}
      {open &&
        portalMount &&
        createPortal(
          <div
            ref={setFloating}
            role="listbox"
            aria-label={`${label} options`}
            data-dtp-dropdown=""
            className={cn(
              MENU_MOTION,
              POPUP_SHADOW,
              "grid overflow-hidden rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary font-[family-name:var(--font-v2,Inter,sans-serif)]",
              showSeconds ? "grid-cols-4" : "grid-cols-3"
            )}
            style={{
              ...floatingStyles,
              width: `var(${DROPDOWN_WIDTH_VAR}, auto)`,
              zIndex: DROPDOWN_Z_INDEX,
              visibility: isPositioned ? undefined : "hidden",
            }}
          >
            {columns}
          </div>,
          portalMount
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
      label,
      required,
      labelClassName,
      helperText,
      error,
      placeholder: placeholderProp,
      disabled = false,
      readOnly = false,
      name,
      showEndTime = true,
      showSeconds,
      minuteStep = DEFAULT_MINUTE_STEP,
      secondStep = DEFAULT_SECOND_STEP,
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
      weekStartsOn = 0,
      locale,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const triggerId = id ?? generatedId;
    const pickerVariant = variant ?? "date-time";
    const resolvedState = error ? "error" : state;
    const showCalendar = pickerVariant !== "time-only";
    const showTimeFields = pickerVariant !== "date-only";
    const resolvedShowEndTime = showTimeFields && showEndTime;
    const isValueControlled = value !== undefined;
    const isOpenControlled = controlledOpen !== undefined;
    const [internalValue, setInternalValue] = React.useState(() =>
      normalizeValue(defaultValue)
    );
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const currentValue = normalizeValue(
      isValueControlled ? value : internalValue
    );
    const resolvedStartTime = currentValue.startTime || UNSET_TIME;
    const resolvedEndTime = currentValue.endTime || UNSET_TIME;
    const resolvedShowSeconds =
      showSeconds ??
      (timeHasVisibleSeconds(currentValue.startTime) ||
        (resolvedShowEndTime && timeHasVisibleSeconds(currentValue.endTime)));
    const placeholder =
      placeholderProp ??
      getDefaultPlaceholder(pickerVariant, resolvedShowSeconds);
    const open = isOpenControlled ? controlledOpen : internalOpen;
    const [visibleMonth, setVisibleMonth] = React.useState(() =>
      startOfMonth(currentValue.date ?? new Date())
    );
    // Direction of the last month change, derived while rendering ("store the
    // previous value in state") so the new grid mounts with its slide class in
    // the same commit; an effect would paint one frame without it. Whether the
    // popover is showing is part of the snapshot so that mounting it, even
    // with a stale direction from the last session, never plays the motion.
    const isPopoverShown = open && !disabled && !readOnly;
    const visibleMonthKey = getMonthKey(visibleMonth);
    const [monthMotion, setMonthMotion] = React.useState<{
      key: number;
      shown: boolean;
      direction: MonthDirection;
    }>({ key: visibleMonthKey, shown: isPopoverShown, direction: null });
    if (monthMotion.shown !== isPopoverShown) {
      setMonthMotion({
        key: visibleMonthKey,
        shown: isPopoverShown,
        direction: null,
      });
    } else if (monthMotion.key !== visibleMonthKey) {
      setMonthMotion({
        key: visibleMonthKey,
        shown: isPopoverShown,
        direction: visibleMonthKey > monthMotion.key ? "next" : "prev",
      });
    }
    const [dateInputValue, setDateInputValue] = React.useState(() =>
      formatValueForDisplay(
        currentValue,
        pickerVariant,
        resolvedShowEndTime,
        resolvedShowSeconds,
        true
      )
    );
    const [isDateInputFocused, setIsDateInputFocused] = React.useState(false);
    // The one day button in the grid that is a tab stop (roving tabindex); arrow keys move it.
    const [focusDay, setFocusDay] = React.useState<Date>(() =>
      startOfDay(currentValue.date ?? new Date())
    );
    const pendingFocusRef = React.useRef<Date | null>(null);
    // Set when the calendar button or Alt+ArrowDown asked for the grid, so the panel hands focus to it once open.
    const focusOnOpenRef = React.useRef(false);
    const keyboardActivationRef = React.useRef(false);
    const calendarButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLDivElement | null>(null);
    const popoverRef = React.useRef<HTMLDivElement | null>(null);
    const [openCalendarDropdown, setOpenCalendarDropdown] =
      React.useState<CalendarDropdownKind | null>(null);
    const [openTimeField, setOpenTimeField] = React.useState<
      "start" | "end" | null
    >(null);
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
          apply({ availableHeight, availableWidth, elements, rects }) {
            const maxHeight = Math.max(
              1,
              Math.min(MAX_POPOVER_HEIGHT, availableHeight)
            );
            const maxWidth = availableWidth;
            const width = Math.max(
              1,
              Math.min(
                Math.max(rects.reference.width, MIN_POPOVER_WIDTH),
                maxWidth
              )
            );
            elements.floating.style.setProperty(
              POPOVER_SCROLL_HEIGHT_VAR,
              `${maxHeight}px`
            );
            elements.floating.style.setProperty(
              POPOVER_WIDTH_VAR,
              `${width}px`
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
      () => getCalendarDays(visibleMonth, weekStartsOn),
      [visibleMonth, weekStartsOn]
    );
    const weekdayLabels = React.useMemo(
      () => getWeekdayLabels(weekStartsOn, locale),
      [weekStartsOn, locale]
    );
    const calendarMonthNames = React.useMemo(
      () =>
        locale
          ? Array.from({ length: 12 }, (_, monthIndex) =>
              new Intl.DateTimeFormat(locale, { month: "short" }).format(
                new Date(2026, monthIndex, 1)
              )
            )
          : monthNames,
      [locale]
    );
    const calendarMonthFormatter = React.useMemo(
      () =>
        locale
          ? new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" })
          : monthFormatter,
      [locale]
    );
    // The cell of the selected day on the 6-week grid (-1 when it is outside it): the disc's position.
    const selectedCell = currentValue.date
      ? calendarDays.findIndex((day) => isSameDay(day, currentValue.date))
      : -1;
    const errorId = `${triggerId}-error`;
    const helperId = `${triggerId}-helper`;
    const describedBy = error ? errorId : helperText ? helperId : undefined;
    // Unmasked — this is what the typing path reads and writes. The masked variant
    // below is render-only; letting a mask reach `dateInputValue` would feed
    // "--/--/----" straight into the typed-input sanitizers.
    const displayValue = formatValueForDisplay(
      currentValue,
      pickerVariant,
      resolvedShowEndTime,
      resolvedShowSeconds
    );
    const maskedDisplayValue = formatValueForDisplay(
      currentValue,
      pickerVariant,
      resolvedShowEndTime,
      resolvedShowSeconds,
      true
    );
    const hasValue = Boolean(
      currentValue.date ||
      currentValue.startTime ||
      (resolvedShowEndTime && currentValue.endTime)
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
        if (nextOpen && (disabled || readOnly)) return;

        if (!nextOpen) {
          setOpenCalendarDropdown(null);
          setOpenTimeField(null);
        }

        if (!isOpenControlled) {
          setInternalOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
      },
      [disabled, isOpenControlled, onOpenChange, readOnly]
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
        setDateInputValue(maskedDisplayValue);
      }
    }, [maskedDisplayValue, isDateInputFocused]);

    React.useEffect(() => {
      if (!open) return;

      const handlePointerDown = (event: MouseEvent) => {
        if (
          !isPointerInsideElement(event, rootRef.current) &&
          !isPointerInsideElement(event, popoverRef.current) &&
          !isPointerInsideDropdown(event)
        ) {
          setOpen(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          // Focus inside the panel would be stranded on a node about to unmount: hand it back to the button.
          if (popoverRef.current?.contains(document.activeElement)) {
            calendarButtonRef.current?.focus();
          }
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
      setOpenTimeField(null);
      setOpenCalendarDropdown(null);
      setVisibleMonth(startOfMonth(new Date()));
      updateValue({
        date: undefined,
        startTime: "",
        endTime: "",
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
      [currentValue, effectiveMinDate, maxDate, pickerVariant, updateValue]
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
          updateValue({ ...currentValue, startTime: "" });
          return;
        }

        if (typedTime) {
          updateValue({ ...currentValue, startTime: typedTime });
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
          startTime: typedDateTime.startTime || currentValue.startTime,
        });
        updateVisibleMonth(typedDateTime.date);
      }
    };

    const handleTypedDateKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (pickerVariant === "time-only") return;

      // Alt+ArrowDown (the combobox convention) opens the calendar and moves focus into its grid.
      if (event.altKey && event.key === "ArrowDown") {
        event.preventDefault();
        focusOnOpenRef.current = true;
        if (open) {
          focusOnOpenRef.current = false;
          focusGrid();
        } else {
          setOpen(true);
        }
        return;
      }

      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

      const direction = event.key === "ArrowUp" ? 1 : -1;
      const cursorPosition =
        event.currentTarget.selectionStart ?? dateInputValue.length;
      const inputElement = event.currentTarget;
      const steppedDateTime = stepDateTimeInputValue(
        dateInputValue,
        cursorPosition,
        direction,
        resolvedStartTime,
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
          resolvedShowSeconds,
          true
        )
      );
    };

    React.useEffect(() => {
      if (open) setFocusDay(startOfDay(currentValue.date ?? new Date()));
      // Opening is the only moment the roving day restarts from the selection.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const isInVisibleMonth = (day: Date) =>
      day.getFullYear() === visibleMonth.getFullYear() &&
      day.getMonth() === visibleMonth.getMonth();
    // The grid has exactly one tab stop: the focused day while it is on screen and selectable, otherwise the
    // selected day, otherwise today, otherwise the first selectable day of the month.
    const rovingDay = (() => {
      const usable = (day?: Date): day is Date =>
        !!day &&
        isInVisibleMonth(day) &&
        isSelectableDay(day, effectiveMinDate, maxDate);

      if (usable(focusDay)) return focusDay;
      if (usable(currentValue.date)) return currentValue.date;

      const today = startOfDay(new Date());
      if (usable(today)) return today;

      const days = calendarDays.filter(isInVisibleMonth);
      return (
        days.find((day) => isSelectableDay(day, effectiveMinDate, maxDate)) ??
        days[0]
      );
    })();

    // Move the roving focus, paging to the month that holds the target. Paging with the keyboard only changes the
    // month on screen: the value changes when a day is chosen, not when focus passes over it.
    const moveFocus = (target: Date) => {
      if (!isSelectableDay(target, effectiveMinDate, maxDate)) return;

      if (getMonthKey(target) !== visibleMonthKey) {
        setVisibleMonth(startOfMonth(target));
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

    const focusGrid = () => {
      popoverRef.current
        ?.querySelector<HTMLElement>('[data-date][tabindex="0"]')
        ?.focus();
    };

    // Asked for from the keyboard: hand focus to the grid so the arrows work straight away.
    React.useEffect(() => {
      if (!open || !isPositioned || !focusOnOpenRef.current) return;

      focusOnOpenRef.current = false;
      focusGrid();
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

    // The panel is a portal at the end of the page, so Tab would otherwise leave it for the browser chrome:
    // from its last (or first, with Shift) control focus returns to the calendar button instead.
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
      if (
        (event.shiftKey && active === focusable[0]) ||
        (!event.shiftKey && active === focusable[focusable.length - 1])
      ) {
        event.preventDefault();
        calendarButtonRef.current?.focus();
      }
    };

    const todayStart = startOfDay(new Date());
    const showTodayLink =
      showCalendar &&
      !isInVisibleMonth(todayStart) &&
      isSelectableDay(todayStart, effectiveMinDate, maxDate);

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
          aria-labelledby={
            showCalendar ? `${triggerId}-calendar-heading` : undefined
          }
          aria-label={showCalendar ? undefined : "Time picker"}
          className={cn(
            POPOVER_MOTION,
            POPUP_SHADOW,
            "rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary font-[family-name:var(--font-v2,Inter,sans-serif)] text-[var(--v2-text-secondary,#5E5E5E)] flex flex-col min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain pointer-events-auto",
            "[scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:var(--semantic-border-secondary)_transparent]",
            "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-semantic-border-secondary"
          )}
          style={{
            ...floatingStyles,
            width: `var(${POPOVER_WIDTH_VAR}, min(${POPOVER_WIDTH}px, calc(100vw - ${
              POPOVER_MARGIN * 2
            }px)))`,
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
          {showCalendar && (
            <div className="p-3 touch-pan-y">
              <div className="mb-2.5 flex min-h-8 items-center justify-between gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  className={cn(CALENDAR_NAV_BUTTON, FOCUS_RING)}
                  onClick={() =>
                    syncCalendarMonthAndValue(addMonths(visibleMonth, -1))
                  }
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <CalendarDropdown
                    id={`${triggerId}-month`}
                    label="Month"
                    value={visibleMonth.getMonth().toString()}
                    portalMount={portalMount}
                    strategy={floatingStrategy}
                    open={openCalendarDropdown === "month"}
                    onOpenChange={(nextOpen) =>
                      setOpenCalendarDropdown(nextOpen ? "month" : null)
                    }
                    options={calendarMonthNames.map((monthName, monthIndex) => {
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
                    portalMount={portalMount}
                    strategy={floatingStrategy}
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
                        new Date(Number(nextYear), visibleMonth.getMonth(), 1)
                      );
                    }}
                  />
                  <div
                    id={`${triggerId}-calendar-heading`}
                    aria-live="polite"
                    className="sr-only"
                  >
                    {calendarMonthFormatter.format(visibleMonth)}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Next month"
                  className={cn(CALENDAR_NAV_BUTTON, FOCUS_RING)}
                  onClick={() =>
                    syncCalendarMonthAndValue(addMonths(visibleMonth, 1))
                  }
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>

              {/* One labelled grid per month: the weekday row is static, only the rowgroup of days re-mounts (and slides) per month. */}
              <div
                role="grid"
                aria-label={calendarMonthFormatter.format(visibleMonth)}
                onKeyDown={handleGridKeyDown}
              >
                <div role="row" className="mb-1 grid grid-cols-7 gap-x-0.5">
                  {weekdayLabels.map((day, dayOfWeek) => (
                    <div
                      key={dayOfWeek}
                      role="columnheader"
                      className="flex h-6 items-center justify-center text-xs font-medium text-[var(--v2-text-muted,#707070)]"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div
                  role="rowgroup"
                  key={visibleMonthKey}
                  className={cn(
                    "relative grid grid-cols-7 gap-0.5",
                    monthMotion.direction && [
                      MONTH_MOTION,
                      MONTH_MOTION_DIRECTION[monthMotion.direction],
                    ]
                  )}
                >
                  {/* Arc's selected disc: one layer per month, one cell in size, placed by week and weekday under the day buttons, so a new pick glides to its day on the morph spring (visualDuration .42, bounce .16, 506ms) and the selection entering or leaving the grid grows or fades it. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 aspect-square w-[calc((100%-12px)/7)] rounded-full bg-semantic-primary will-change-transform [--arc-morph:linear(0,.0308,.1027,.1959,.2972,.3979,.4971,.5827,.6582,.7233,.7785,.8246,.8625,.8933,.9182,.9379,.9534,.9655,.9753,.9823,.9876,.9915,.9944,.9965,1)] [--arc-snappy:linear(0,.0506,.1667,.2966,.4251,.5482,.6476,.7298,.7994,.8508,.8924,.922,.9442,.9613,.973,.9815,.9877,.9918,.9947,.9967,1)] [transition:transform_506ms_var(--arc-morph),opacity_160ms_cubic-bezier(0.22,1,0.36,1),scale_350ms_var(--arc-snappy)] motion-reduce:[transition:none]"
                    style={{
                      transform: `translate(calc(${selectedCell % 7} * (100% + 2px)), calc(${Math.floor(selectedCell / 7)} * (100% + 2px)))`,
                      opacity: selectedCell >= 0 ? 1 : 0,
                      scale: selectedCell >= 0 ? 1 : 0.6,
                    }}
                  />
                  {/* Rows and cells are layout-free (display: contents): the days stay one 7-column CSS grid, so the selected disc keeps its maths. */}
                  {Array.from({ length: 6 }, (_, rowIndex) => (
                    <div key={rowIndex} role="row" className="contents">
                      {calendarDays
                        .slice(rowIndex * 7, rowIndex * 7 + 7)
                        .map((day) => {
                          const isCurrentMonth =
                            day.getMonth() === visibleMonth.getMonth();
                          const isSelected = isSameDay(day, currentValue.date);
                          const isToday = isSameDay(day, new Date());
                          const isDisabled =
                            (effectiveMinDate &&
                              isBeforeDay(day, effectiveMinDate)) ||
                            (maxDate && isAfterDay(day, maxDate));
                          const dayLabel = day.toLocaleDateString(
                            locale ?? DEFAULT_LOCALE,
                            { month: "long", day: "numeric", year: "numeric" }
                          );

                          return (
                            <div
                              key={day.toISOString()}
                              role="gridcell"
                              aria-selected={isSelected}
                              className="contents"
                            >
                              <button
                                type="button"
                                data-date={toDateKey(day)}
                                tabIndex={isSameDay(day, rovingDay) ? 0 : -1}
                                onFocus={() => setFocusDay(day)}
                                aria-label={dayLabel}
                                aria-pressed={isSelected}
                                aria-current={isToday ? "date" : undefined}
                                disabled={!!isDisabled}
                                className={cn(
                                  // Arc day: a square cell (the column width) with a 14px number; hover fills the circle, press scales it .94.
                                  "relative z-[1] grid aspect-square w-full min-w-0 place-items-center rounded-full p-0 text-sm leading-none [font-variant-numeric:tabular-nums] [transition-property:color,background-color,transform] [transition-duration:160ms,160ms,580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] enabled:active:scale-[0.94] enabled:active:[transition-duration:160ms,160ms,100ms] motion-reduce:[transition-property:color,background-color] motion-reduce:enabled:active:scale-100",
                                  FOCUS_RING,
                                  "focus-visible:z-10",
                                  isSelected
                                    ? "text-semantic-text-inverted font-medium"
                                    : cn(
                                        isCurrentMonth
                                          ? "text-[var(--v2-text-secondary,#5E5E5E)]"
                                          : "text-[var(--v2-text-muted,#707070)]",
                                        HOVER_FILL
                                      ),
                                  isToday && !isSelected && "font-medium",
                                  isDisabled &&
                                    "opacity-40 cursor-not-allowed pointer-events-none"
                                )}
                                onClick={() => {
                                  if (isDisabled) return;

                                  setFocusDay(day);
                                  updateValue({ ...currentValue, date: day });
                                  if (closeOnSelect) {
                                    setOpen(false);
                                  }
                                }}
                              >
                                {/* Outside days dim their number, not the button, so the disc arriving on one keeps its strength. */}
                                <span
                                  className={cn(
                                    "relative",
                                    !isCurrentMonth &&
                                      !isSelected &&
                                      "opacity-80"
                                  )}
                                >
                                  {day.getDate()}
                                  {isToday && (
                                    <span className="absolute left-1/2 top-[calc(100%+4px)] -ml-0.5 size-1 rounded-full bg-current" />
                                  )}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Today: slides open only when the month on screen is not today's. */}
              <div
                aria-hidden={!showTodayLink}
                className={cn(
                  TODAY_ROW_MOTION,
                  showTodayLink
                    ? "mt-2 [grid-template-rows:1fr] opacity-100"
                    : "[grid-template-rows:0fr] opacity-0"
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      tabIndex={showTodayLink ? 0 : -1}
                      className={cn(
                        "rounded px-2 py-1 text-sm font-medium text-[var(--v2-text-primary,#484848)] [transition:background-color_160ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {showTimeFields && (
            <div
              className={cn(
                "space-y-2.5 bg-semantic-bg-primary p-3",
                showCalendar &&
                  "border-t border-solid border-semantic-border-layout"
              )}
            >
              <TimeField
                id={`${triggerId}-start-time`}
                label={startTimeLabel}
                inline={!showCalendar}
                value={resolvedStartTime}
                showSeconds={resolvedShowSeconds}
                minuteStep={minuteStep}
                secondStep={secondStep}
                portalMount={portalMount}
                strategy={floatingStrategy}
                open={openTimeField === "start"}
                onOpenChange={(nextOpen) =>
                  setOpenTimeField(nextOpen ? "start" : null)
                }
                onChange={(startTime) =>
                  updateValue({ ...currentValue, startTime })
                }
              />

              {resolvedShowEndTime && (
                <TimeField
                  id={`${triggerId}-end-time`}
                  label={endTimeLabel}
                  inline={!showCalendar}
                  value={resolvedEndTime}
                  showSeconds={resolvedShowSeconds}
                  minuteStep={minuteStep}
                  secondStep={secondStep}
                  portalMount={portalMount}
                  strategy={floatingStrategy}
                  open={openTimeField === "end"}
                  onOpenChange={(nextOpen) =>
                    setOpenTimeField(nextOpen ? "end" : null)
                  }
                  onChange={(endTime) =>
                    updateValue({ ...currentValue, endTime })
                  }
                />
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
              resolvedShowEndTime
            )}
          />
        )}
        {label && (
          <label
            htmlFor={triggerId}
            className={cn(
              "mb-1.5 block text-sm font-medium text-[var(--v2-text-primary,#484848)]",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-semantic-error-primary ml-0.5">*</span>
            )}
          </label>
        )}
        <div
          ref={setTriggerRef}
          className={cn(
            dateTimePickerTriggerVariants({ size, state: resolvedState }),
            open &&
              resolvedState !== "error" &&
              "border-semantic-primary shadow-none",
            !displayValue && "text-[var(--v2-text-placeholder,#707070)]",
            disabled &&
              "cursor-not-allowed bg-semantic-bg-ui border-semantic-border-layout text-[var(--v2-text-muted,#707070)] shadow-none hover:border-semantic-border-layout focus-within:shadow-none"
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
            aria-expanded={open && !disabled && !readOnly}
            aria-invalid={resolvedState === "error" || undefined}
            aria-describedby={describedBy}
            aria-label={
              pickerVariant === "date-only"
                ? "Date"
                : pickerVariant === "time-only"
                  ? "Time"
                  : "Date and time"
            }
            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--v2-text-secondary,#5E5E5E)] outline-none placeholder:text-[var(--v2-text-placeholder,#707070)] disabled:cursor-not-allowed read-only:cursor-not-allowed"
            onFocus={() => {
              setIsDateInputFocused(true);
              // Drop the placeholder masks while editing so the sanitizers only
              // ever see real date/time characters.
              setDateInputValue(displayValue);
              setOpen(true);
            }}
            onClick={() => setOpen(true)}
            onChange={handleTypedDateChange}
            onKeyDown={handleTypedDateKeyDown}
            onBlur={handleTypedDateBlur}
          />
          {pickerVariant === "date-time" &&
            resolvedShowEndTime &&
            currentValue.endTime && (
              <span
                data-slot="date-time-end-time"
                className="shrink-0 whitespace-nowrap text-sm text-[var(--v2-text-secondary,#5E5E5E)]"
                aria-label={`${endTimeLabel}: ${formatTimeForDisplay(currentValue.endTime, resolvedShowSeconds)}`}
              >
                –{" "}
                {formatTimeForDisplay(
                  currentValue.endTime,
                  resolvedShowSeconds
                )}
              </span>
            )}
          {showClear &&
            (hasValue || dateInputValue) &&
            !disabled &&
            !readOnly && (
              <button
                type="button"
                aria-label="Clear date"
                className="inline-flex size-5 items-center justify-center rounded transition-colors duration-150 text-[var(--v2-text-muted,#707070)] [@media(hover:hover)]:hover:bg-semantic-bg-hover [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)]"
                onClick={clearValue}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          <button
            type="button"
            disabled={disabled || readOnly}
            aria-label={showCalendar ? "Open calendar" : "Open time picker"}
            className="inline-flex shrink-0 items-center justify-center rounded transition-colors duration-150 text-[var(--v2-text-muted,#707070)] [@media(hover:hover)]:hover:bg-semantic-bg-hover [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)] disabled:cursor-not-allowed"
            ref={calendarButtonRef}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                keyboardActivationRef.current = true;
              }
            }}
            onBlur={() => {
              keyboardActivationRef.current = false;
            }}
            onClick={() => {
              const byKeyboard = keyboardActivationRef.current;
              keyboardActivationRef.current = false;

              // From the keyboard the button hands focus to the calendar grid (the input already opened it on
              // focus, so a toggle here would close what the reader is trying to reach).
              if (byKeyboard && showCalendar) {
                if (open) {
                  focusGrid();
                } else {
                  focusOnOpenRef.current = true;
                  setOpen(true);
                }
                return;
              }

              setOpen(!open);
            }}
          >
            {showCalendar ? (
              <FigmaCalendarIcon
                className={cn(size === "sm" ? "size-4" : "size-[18px]")}
              />
            ) : (
              <FigmaClockIcon
                className={cn(size === "sm" ? "size-4" : "size-[18px]")}
              />
            )}
          </button>
        </div>

        {(error || helperText) && (
          <div className="mt-1">
            {error ? (
              <span
                id={errorId}
                role="alert"
                className="text-xs text-semantic-error-text motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1 motion-safe:[animation-duration:160ms] [animation-timing-function:var(--v2-ease-out,cubic-bezier(0.16,1,0.3,1))] motion-reduce:animate-[v2-fade-in_120ms_ease-out]"
              >
                {error}
              </span>
            ) : (
              <span
                id={helperId}
                className="text-xs text-[var(--v2-text-muted,#707070)]"
              >
                {helperText}
              </span>
            )}
          </div>
        )}

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
