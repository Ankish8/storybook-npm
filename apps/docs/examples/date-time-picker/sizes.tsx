import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

export default function Sizes() {
  return (
    <div className="flex flex-col gap-4">
      <DateTimePicker size="sm" label="Small" showEndTime={false} />
      <DateTimePicker size="default" label="Default" showEndTime={false} />
      <DateTimePicker size="lg" label="Large" showEndTime={false} />
    </div>
  );
}
