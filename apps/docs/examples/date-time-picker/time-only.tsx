import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

export default function TimeOnly() {
  return (
    <div className="w-[336px] max-w-full">
      <DateTimePicker
        variant="time-only"
        label="Reminder time"
        showEndTime={false}
      />
    </div>
  );
}
