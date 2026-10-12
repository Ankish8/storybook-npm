import { DateRangePicker } from "@/components/ui/v2/date-range-picker";

const today = new Date();
const minDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 30
);

export default function DateLimits() {
  return (
    <div className="w-[360px] max-w-full">
      <DateRangePicker
        aria-label="Report period"
        minDate={minDate}
        maxDate={today}
      />
    </div>
  );
}
