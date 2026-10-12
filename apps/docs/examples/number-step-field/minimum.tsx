import { useState } from "react";
import { NumberStepField } from "@/components/ui/v2/number-step-field";

export default function Minimum() {
  const [value, setValue] = useState(30);

  return (
    <div className="flex w-[280px] max-w-full flex-col gap-2">
      <NumberStepField
        aria-label="Timeout"
        value={value}
        onValueChange={setValue}
        min={10}
        max={120}
        suffix="seconds"
      />
      <p className="m-0 text-xs text-[var(--v2-text-muted)]">
        Select the number and type 25: the 2 is held, not turned into 10.
      </p>
    </div>
  );
}
