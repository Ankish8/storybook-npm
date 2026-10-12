import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

export default function Form() {
  const [submitted, setSubmitted] = useState("");

  return (
    <form
      className="flex w-[336px] max-w-full flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(String(data.get("appointment") || ""));
      }}
    >
      <DateTimePicker
        name="appointment"
        label="Appointment"
        showEndTime={false}
        defaultValue={{ date: new Date(), startTime: "10:30:00", endTime: "" }}
      />
      <Button type="submit">Book</Button>
      <p role="status" className="m-0 text-xs text-[var(--v2-text-muted)]">
        {submitted ? `Submitted: ${submitted}` : "Nothing submitted yet."}
      </p>
    </form>
  );
}
