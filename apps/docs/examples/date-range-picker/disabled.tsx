import { DateRangePicker } from "@/components/ui/v2/date-range-picker";

export default function Disabled() {
  return (
    <div className="w-[360px] max-w-full">
      <DateRangePicker
        aria-label="Report period"
        disabled
        defaultValue={{ start: new Date(), end: new Date() }}
      />
    </div>
  );
}
