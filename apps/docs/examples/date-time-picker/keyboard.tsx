import { DateTimePicker } from "@/components/ui/v2/date-time-picker";

const keys: Array<[string, string]> = [
  [
    "Type",
    "Digits fill day, month, year, then the time; the field guards each segment",
  ],
  ["ArrowUp / ArrowDown", "Step the segment the cursor is in"],
  ["Alt + ArrowDown", "Open the calendar and move focus into it"],
  [
    "Arrow keys",
    "Move by day and week inside the calendar; the value changes only when you choose",
  ],
  ["PageUp / PageDown", "Previous or next month (hold Shift for a year)"],
  ["Enter", "Choose the focused day"],
  ["Escape", "Close and return to the calendar button"],
];

export default function Keyboard() {
  return (
    <div className="flex w-[420px] max-w-full flex-col gap-4">
      <DateTimePicker label="Appointment" showEndTime={false} />
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        {keys.map(([key, action]) => (
          <div key={key} className="contents">
            <dt className="font-medium text-[var(--v2-text-primary)]">{key}</dt>
            <dd className="m-0 text-[var(--v2-text-muted)]">{action}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
