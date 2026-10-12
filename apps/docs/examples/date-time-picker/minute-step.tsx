import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

export default function MinuteStep() {
  return (
    <div className="w-[336px] max-w-full">
      <DateTimePicker
        label="Slot"
        minuteStep={15}
        showEndTime={false}
        helperText="Minutes step by 15."
      />
    </div>
  );
}
