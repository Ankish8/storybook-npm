import { useId, useState } from "react";
import { Button } from "@/components/ui/v2/button";
import {
  DateRangePicker,
  type DateRangeValue,
} from "@/components/ui/v2/date-range-picker";

export default function Form() {
  const id = useId();
  const [range, setRange] = useState<DateRangeValue>({});
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && !(range.start && range.end);

  return (
    <form
      className="flex w-[360px] max-w-full flex-col gap-1.5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <p
        id={`${id}-label`}
        className="m-0 text-sm font-medium text-[var(--v2-text-primary)]"
      >
        Report period
      </p>
      <DateRangePicker
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-hint`}
        value={range}
        onValueChange={setRange}
        state={invalid ? "error" : "default"}
      />
      <p
        id={`${id}-hint`}
        className={
          invalid
            ? "m-0 text-xs text-v2-semantic-error-text"
            : "m-0 text-xs text-[var(--v2-text-muted)]"
        }
      >
        {invalid
          ? "Choose a start and end date."
          : "Choose the period to include in the report."}
      </p>
      <div className="mt-2">
        <Button type="submit">Run report</Button>
      </div>
    </form>
  );
}
