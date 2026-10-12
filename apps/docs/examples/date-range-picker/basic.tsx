import { DateRangePicker } from "@/components/ui/v2/date-range-picker";

export default function Basic() {
  return (
    <div className="w-[360px] max-w-full">
      <DateRangePicker
        aria-label="Report period"
        placeholder="Choose a date range"
      />
    </div>
  );
}
