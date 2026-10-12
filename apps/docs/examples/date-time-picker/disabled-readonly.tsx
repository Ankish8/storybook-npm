import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

const value = { date: new Date(), startTime: "10:30:00", endTime: "" };

export default function DisabledReadOnly() {
  return (
    <div className="flex w-[336px] max-w-full flex-col gap-4">
      <DateTimePicker
        label="Disabled"
        disabled
        defaultValue={value}
        showEndTime={false}
      />
      <DateTimePicker
        label="Read only"
        readOnly
        defaultValue={value}
        showEndTime={false}
      />
    </div>
  );
}
