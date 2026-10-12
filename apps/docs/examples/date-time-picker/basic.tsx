import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

export default function Basic() {
  return (
    <div className="w-[336px] max-w-full">
      <DateTimePicker
        label="Appointment"
        helperText="Choose a date and a start time."
        showEndTime={false}
      />
    </div>
  );
}
