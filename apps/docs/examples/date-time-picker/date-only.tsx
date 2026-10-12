import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

export default function DateOnly() {
  return (
    <div className="w-[336px] max-w-full">
      <DateTimePicker variant="date-only" label="Date of birth" />
    </div>
  );
}
