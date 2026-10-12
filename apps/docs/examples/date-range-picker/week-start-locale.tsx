import { DateRangePicker } from "@/components/ui/v2/date-range-picker";

export default function WeekStartLocale() {
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-3">
      <DateRangePicker
        aria-label="Report period (British English, Monday first)"
        weekStartsOn={1}
        locale="en-GB"
      />
      <DateRangePicker
        aria-label="Report period (Hindi)"
        weekStartsOn={1}
        locale="hi-IN"
      />
    </div>
  );
}
