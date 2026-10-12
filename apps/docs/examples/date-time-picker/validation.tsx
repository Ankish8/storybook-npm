import { useState } from "react";
import {
  DateTimePicker,
  type DateTimePickerValue,
} from "@/components/ui/v2/date-time-picker";

export default function Validation() {
  const [value, setValue] = useState<DateTimePickerValue>({
    startTime: "",
    endTime: "",
  });

  return (
    <div className="w-[336px] max-w-full">
      <DateTimePicker
        label="Appointment"
        required
        value={value}
        onValueChange={setValue}
        showEndTime={false}
        error={value.date ? undefined : "Choose a date to continue."}
        helperText="Choose a date and a start time."
      />
    </div>
  );
}
