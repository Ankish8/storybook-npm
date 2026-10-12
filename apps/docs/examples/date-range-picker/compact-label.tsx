import {
  DateRangePicker,
  formatDateRangeCompact,
} from "@/components/ui/v2/date-range-picker";

export default function CompactLabel() {
  return (
    <div className="w-[360px] max-w-full">
      <DateRangePicker
        aria-label="Report period"
        clearable
        formatRange={(range) => formatDateRangeCompact(range)}
        defaultValue={{
          start: new Date(new Date().getFullYear(), new Date().getMonth(), 7),
          end: new Date(new Date().getFullYear(), new Date().getMonth(), 13),
        }}
      />
    </div>
  );
}
