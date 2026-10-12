import { useState } from "react";
import { NumberStepField } from "@/components/ui/v2/number-step-field";

export default function Negative() {
  const [value, setValue] = useState(0);

  return (
    <div className="w-[240px] max-w-full">
      <NumberStepField
        aria-label="Temperature offset"
        value={value}
        onValueChange={setValue}
        min={-10}
        max={10}
        suffix="°C"
      />
    </div>
  );
}
