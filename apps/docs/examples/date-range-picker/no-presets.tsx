import { DateRangePicker } from "@/components/ui/v2/date-range-picker";

export default function NoPresets() {
  return (
    <div className="w-[360px] max-w-full">
      <DateRangePicker aria-label="Booking dates" presets={[]} />
    </div>
  );
}
