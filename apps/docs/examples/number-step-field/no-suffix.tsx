import { useState } from "react";
import { NumberStepField } from "@/components/ui/v2/number-step-field";

export default function NoSuffix() {
  const [value, setValue] = useState(42);

  return (
    <div className="w-[200px] max-w-full">
      <NumberStepField
        aria-label="Quantity"
        value={value}
        onValueChange={setValue}
        min={0}
        max={99}
      />
    </div>
  );
}
