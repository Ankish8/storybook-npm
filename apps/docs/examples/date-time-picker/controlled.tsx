import { useState } from "react";
import {
  DateTimePicker,
  type DateTimePickerValue,
} from "@/components/ui/v2/date-time-picker";

export default function Controlled() {
  const [value, setValue] = useState<DateTimePickerValue>({
    date: new Date(),
    startTime: "10:30:00",
    endTime: "",
  });

  return (
    <div className="flex w-[336px] max-w-full flex-col gap-3">
      <DateTimePicker
        label="Appointment"
        value={value}
        onValueChange={setValue}
        showEndTime={false}
      />
      <p className="m-0 text-sm text-[var(--v2-text-muted)]">
        {value.date
          ? `${value.date.toDateString()} at ${value.startTime || "no time yet"}`
          : "No date chosen yet."}
      </p>
    </div>
  );
}
