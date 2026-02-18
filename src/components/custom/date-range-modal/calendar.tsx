import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

const DAYS_OF_WEEK = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export interface CalendarProps {
  value?: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBeforeDay(a: Date, b: Date): boolean {
  const aD = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bD = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return aD < bD;
}

function isAfterDay(a: Date, b: Date): boolean {
  const aD = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bD = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return aD > bD;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function Calendar({ value, onChange, minDate, maxDate }: CalendarProps) {
  const today = new Date();
  const initial = value ?? today;

  const [viewYear, setViewYear] = React.useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(initial.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth);

  // Previous month fill days
  const prevMonthDays = getDaysInMonth(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1
  );

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const cells: { day: number; currentMonth: boolean; date: Date }[] = [];

  // Fill leading days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day: d, currentMonth: false, date: new Date(prevYear, prevMonth, d) });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true, date: new Date(viewYear, viewMonth, d) });
  }

  // Fill trailing days from next month
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    for (let d = 1; d <= 7 - remainder; d++) {
      cells.push({ day: d, currentMonth: false, date: new Date(nextYear, nextMonth, d) });
    }
  }

  return (
    <div className="select-none w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 rounded hover:bg-semantic-bg-hover text-semantic-text-secondary transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <span className="text-sm font-semibold text-semantic-text-primary">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 rounded hover:bg-semantic-bg-hover text-semantic-text-secondary transition-colors"
          aria-label="Next month"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-semantic-text-muted py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map(({ day, currentMonth, date }, idx) => {
          const isToday = currentMonth && isSameDay(date, today);
          const isSelected = value ? isSameDay(date, value) : false;
          const isDisabled =
            (minDate && isBeforeDay(date, minDate)) ||
            (maxDate && isAfterDay(date, maxDate));

          return (
            <button
              key={idx}
              type="button"
              disabled={!!isDisabled}
              onClick={() => {
                if (!isDisabled) onChange(date);
              }}
              className={cn(
                "relative flex items-center justify-center size-8 mx-auto rounded-full text-xs transition-colors",
                isSelected
                  ? "bg-semantic-primary text-semantic-text-inverted font-semibold"
                  : currentMonth
                  ? "text-semantic-text-primary hover:bg-semantic-bg-hover"
                  : "text-semantic-text-muted hover:bg-semantic-bg-hover",
                isDisabled && "opacity-40 cursor-not-allowed pointer-events-none"
              )}
              aria-label={date.toDateString()}
              aria-pressed={isSelected}
              aria-current={isToday ? "date" : undefined}
            >
              {day}
              {isToday && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-semantic-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
