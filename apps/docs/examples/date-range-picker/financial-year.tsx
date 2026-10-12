import {
  DEFAULT_DATE_RANGE_PRESETS,
  DateRangePicker,
  getFinancialYearPresets,
} from "@/components/ui/v2/date-range-picker";

export default function FinancialYear() {
  return (
    <div className="w-[360px] max-w-full">
      <DateRangePicker
        aria-label="Report period"
        presets={[...DEFAULT_DATE_RANGE_PRESETS, ...getFinancialYearPresets()]}
      />
    </div>
  );
}
