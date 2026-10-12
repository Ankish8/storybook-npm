import { useState } from "react";
import { NumberStepField } from "@/components/ui/v2/number-step-field";

export default function Keyboard() {
  const [value, setValue] = useState(12);

  return (
    <div className="flex w-[300px] max-w-full flex-col gap-3">
      <NumberStepField
        aria-label="Threshold"
        value={value}
        onValueChange={setValue}
        min={0}
        max={50}
        suffix="calls"
      />
      <ul className="m-0 flex list-none flex-col gap-1 p-0 text-xs text-[var(--v2-text-muted)]">
        <li>ArrowUp / ArrowDown step by one; hold a chevron to repeat</li>
        <li>PageUp / PageDown or Shift+Arrow step by ten</li>
        <li>Home and End jump to 0 and 50 (outside a typed edit)</li>
        <li>Enter applies what you typed; Escape puts the old value back</li>
        <li>At a limit the value strains and the limit is announced</li>
      </ul>
    </div>
  );
}
