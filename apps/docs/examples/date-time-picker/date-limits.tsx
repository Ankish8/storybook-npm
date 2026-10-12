import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

const today = new Date();
const minDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7
);
const maxDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 30
);

export default function DateLimits() {
  return (
    <div className="flex w-[336px] max-w-full flex-col gap-4">
      <DateTimePicker
        label="Within a window"
        minDate={minDate}
        maxDate={maxDate}
        showEndTime={false}
      />
      <DateTimePicker
        label="Future only"
        disablePastDates
        showEndTime={false}
      />
    </div>
  );
}
