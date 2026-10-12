import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

export default function TimeRange() {
  return (
    <div className="w-[336px] max-w-full">
      <DateTimePicker
        label="Call window"
        helperText="Start and end time on the chosen day."
        defaultValue={{
          date: new Date(),
          startTime: "10:30:00",
          endTime: "11:30:00",
        }}
      />
    </div>
  );
}
