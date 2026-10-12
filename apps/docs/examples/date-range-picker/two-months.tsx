import {
  DateRangePicker,
  EXTENDED_DATE_RANGE_PRESETS,
} from "@/components/ui/v2/date-range-picker";

export default function TwoMonths() {
  return (
    <div className="w-[360px] max-w-full">
      <DateRangePicker
        aria-label="Report period"
        months="auto"
        presets={EXTENDED_DATE_RANGE_PRESETS}
      />
    </div>
  );
}
