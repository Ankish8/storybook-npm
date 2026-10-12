import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

export default function CloseOnSelect() {
  return (
    <div className="w-[336px] max-w-full">
      <DateTimePicker label="Due date" variant="date-only" closeOnSelect />
    </div>
  );
}
