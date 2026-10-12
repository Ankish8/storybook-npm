import { useState } from "react";
import { NumberStepField } from "@/components/ui/v2/number-step-field";

export default function Labels() {
  const [value, setValue] = useState(5);

  return (
    <div className="w-[260px] max-w-full">
      <NumberStepField
        aria-label="Retry attempts"
        incrementAriaLabel="One more retry"
        decrementAriaLabel="One fewer retry"
        value={value}
        onValueChange={setValue}
        min={0}
        max={10}
        suffix="retries"
      />
    </div>
  );
}
