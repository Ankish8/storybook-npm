import { useState } from "react";
import { NumberStepField } from "@/components/ui/v2/number-step-field";

export default function Basic() {
  const [hours, setHours] = useState(2);

  return (
    <div className="w-[240px] max-w-full">
      <NumberStepField
        aria-label="Delay"
        value={hours}
        onValueChange={setHours}
        min={0}
        max={23}
        suffix="hours"
      />
    </div>
  );
}
