import { useState } from "react";
import { NumberStepField } from "@/components/ui/v2/number-step-field";

export default function Step() {
  const [value, setValue] = useState(20);

  return (
    <div className="flex w-[280px] max-w-full flex-col gap-2">
      <NumberStepField
        aria-label="Volume"
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        step={5}
        largeStep={25}
        suffix="%"
      />
      <p className="m-0 text-xs text-[var(--v2-text-muted)]">
        Arrows and the chevrons move by 5; PageUp, PageDown and Shift+Arrow by
        25.
      </p>
    </div>
  );
}
