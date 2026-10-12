import {
  DEFAULT_DATE_RANGE_PRESETS,
  DateRangePicker,
} from "@/components/ui/v2/date-range-picker";

export default function Presets() {
  return (
    <div className="w-[360px] max-w-full">
      <DateRangePicker
        aria-label="Report period"
        presets={DEFAULT_DATE_RANGE_PRESETS}
        defaultValue={{
          start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          end: new Date(),
        }}
      />
    </div>
  );
}
