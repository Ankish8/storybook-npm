import { useState } from "react";
import { ButtonGroup } from "@/components/ui/v2/button-group";

export default function Selection() {
  const [range, setRange] = useState("week");

  return (
    <div className="flex flex-col items-center gap-3">
      <ButtonGroup
        label="Date range"
        variant="toggle"
        value={range}
        onValueChange={setRange}
        items={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ]}
      />
      <p role="status" className="m-0 text-sm text-[var(--v2-text-muted)]">
        Showing the last {range}
      </p>
    </div>
  );
}
