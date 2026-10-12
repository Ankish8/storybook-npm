import { useState } from "react";
import { DateRangePicker } from "@/components/ui/v2/date-range-picker";

export default function Clearable() {
  const [cleared, setCleared] = useState(0);

  return (
    <div className="flex w-[360px] max-w-full flex-col gap-3">
      <DateRangePicker
        aria-label="Report period"
        clearable
        clearLabel="Clear the report period"
        onClear={() => setCleared((count) => count + 1)}
        defaultValue={{ start: new Date(), end: new Date() }}
      />
      <p className="m-0 text-sm text-[var(--v2-text-muted)]">
        Cleared {cleared} {cleared === 1 ? "time" : "times"}.
      </p>
    </div>
  );
}
