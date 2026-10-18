import { useState } from "react";
import { NumberStepField } from "@/components/ui/v2/number-step-field";

export default function ErrorExample() {
  const [minutes, setMinutes] = useState(0);
  const invalid = minutes === 0;

  return (
    <div className="flex w-[280px] max-w-full flex-col gap-2">
      <NumberStepField
        aria-label="Reminder"
        value={minutes}
        onValueChange={setMinutes}
        min={0}
        max={59}
        suffix="minutes"
        state={invalid ? "error" : "default"}
        aria-describedby="reminder-error"
      />
      <p
        id="reminder-error"
        role={invalid ? "alert" : undefined}
        className="m-0 text-xs text-v2-semantic-error-text"
      >
        {invalid ? "Choose at least 1 minute." : ""}
      </p>
    </div>
  );
}
