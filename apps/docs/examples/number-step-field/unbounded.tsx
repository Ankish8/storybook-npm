import { useState } from "react";
import { NumberStepField } from "@/components/ui/v2/number-step-field";

export default function Unbounded() {
  const [seats, setSeats] = useState(9);

  return (
    <div className="flex w-[280px] max-w-full flex-col gap-2">
      <NumberStepField
        aria-label="Seats"
        value={seats}
        onValueChange={setSeats}
        min={1}
        suffix={seats === 1 ? "seat" : "seats"}
      />
      <p className="m-0 text-xs text-[var(--v2-text-muted)]">
        Step from 9 to 10: the new place opens as the ones wheel turns over.
      </p>
    </div>
  );
}
