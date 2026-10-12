import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

export default function Seconds() {
  return (
    <div className="w-[336px] max-w-full">
      <DateTimePicker
        label="Event time"
        showSeconds
        showEndTime={false}
        defaultValue={{ date: new Date(), startTime: "10:30:15", endTime: "" }}
      />
    </div>
  );
}
