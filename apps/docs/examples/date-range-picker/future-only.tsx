import { DateRangePicker } from "@/components/ui/v2/date-range-picker";

export default function FutureOnly() {
  return (
    <div className="w-[360px] max-w-full">
      <DateRangePicker aria-label="Leave dates" disablePastDates presets={[]} />
    </div>
  );
}
