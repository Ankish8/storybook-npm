import { useState } from "react";
import {
  DateRangePicker,
  type DateRangeValue,
} from "@/components/ui/v2/date-range-picker";

export default function Controlled() {
  const [range, setRange] = useState<DateRangeValue>({});

  return (
    <div className="flex w-[360px] max-w-full flex-col gap-3">
      <DateRangePicker
        aria-label="Report period"
        value={range}
        onValueChange={setRange}
        clearable
      />
      <p className="m-0 text-sm text-[var(--v2-text-muted)]">
        {range.start && range.end
          ? `${range.start.toDateString()} to ${range.end.toDateString()}`
          : "No range chosen yet."}
      </p>
    </div>
  );
}
