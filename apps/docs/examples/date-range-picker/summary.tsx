import { DateRangePicker } from "@/components/ui/v2/date-range-picker";

export default function Summary() {
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-3">
      <DateRangePicker
        aria-label="Report period"
        formatSummary={(_, { days, selecting }) =>
          selecting ? "Pick the last day" : `${days} days selected`
        }
      />
      <DateRangePicker aria-label="Without a summary" showSummary={false} />
    </div>
  );
}
