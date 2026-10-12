import { useState } from "react";
import { NumberStepField } from "@/components/ui/v2/number-step-field";

export default function HoursMinutes() {
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(30);

  return (
    <div className="flex w-[440px] max-w-full items-center gap-2">
      <NumberStepField
        aria-label="Delay hours"
        value={hours}
        onValueChange={setHours}
        min={0}
        max={23}
        suffix="hours"
      />
      <span aria-hidden="true" className="text-[var(--v2-text-muted)]">
        :
      </span>
      <NumberStepField
        aria-label="Delay minutes"
        value={minutes}
        onValueChange={setMinutes}
        min={0}
        max={59}
        suffix="minutes"
      />
    </div>
  );
}
