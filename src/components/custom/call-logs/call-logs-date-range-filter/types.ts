import type { DateRangePickerProps } from "../../../ui/date-range-picker";

export interface CallLogsDateRangeFilterProps
  extends Omit<DateRangePickerProps, "maxDate"> {
  /**
   * Whether future dates can be selected. Call history can't exist for a
   * date that hasn't happened yet, so this defaults to `false` (today is
   * the latest selectable date). Set `true` to lift that restriction.
   */
  allowFutureDates?: boolean;
}
