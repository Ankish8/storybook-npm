import * as React from "react";

import { cn } from "../../../../lib/utils";
import { DateRangePicker } from "../../../ui/date-range-picker";
import type { CallLogsDateRangeFilterProps } from "./types";

/**
 * CallLogsDateRangeFilter is the Call Logs page's "Date Range" filter — a
 * thin wrapper around the shared `DateRangePicker` with a Call Logs default
 * baked in: future dates are blocked (`maxDate` defaults to today) since
 * call history can't exist for a date that hasn't happened yet. Everything
 * else (presets, calendar, trigger styling) is inherited from
 * `DateRangePicker` unchanged.
 *
 * @example
 * ```tsx
 * <CallLogsDateRangeFilter
 *   value={range}
 *   onValueChange={setRange}
 * />
 * ```
 */
const CallLogsDateRangeFilter = React.forwardRef<
  HTMLDivElement,
  CallLogsDateRangeFilterProps
>(({ allowFutureDates = false, triggerClassName, ...props }, ref) => {
  const maxDate = allowFutureDates ? undefined : new Date();

  return (
    <DateRangePicker
      ref={ref}
      maxDate={maxDate}
      triggerClassName={cn(
        "h-[42px] rounded border-semantic-border-layout text-sm font-semibold text-semantic-text-secondary",
        triggerClassName
      )}
      {...props}
    />
  );
});
CallLogsDateRangeFilter.displayName = "CallLogsDateRangeFilter";

export { CallLogsDateRangeFilter };
