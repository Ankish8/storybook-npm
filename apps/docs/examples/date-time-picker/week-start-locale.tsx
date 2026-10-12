import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

export default function WeekStartLocale() {
  return (
    <div className="flex w-[336px] max-w-full flex-col gap-4">
      <DateTimePicker
        label="British English, Monday first"
        weekStartsOn={1}
        locale="en-GB"
        showEndTime={false}
      />
      <DateTimePicker
        label="Hindi"
        weekStartsOn={1}
        locale="hi-IN"
        showEndTime={false}
      />
    </div>
  );
}
