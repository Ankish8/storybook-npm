import { DateRangePicker } from "@/components/ui/v2/date-range-picker";

const keys: Array<[string, string]> = [
  [
    "Enter or ArrowDown",
    "Open the picker from the field; focus lands on the calendar",
  ],
  ["Arrow keys", "Move by day and by week"],
  ["Home / End", "First or last day of the week"],
  ["PageUp / PageDown", "Previous or next month (hold Shift for a year)"],
  ["Enter or Space", "Choose the start, then the end"],
  ["Escape", "Close and return to the field"],
];

export default function Keyboard() {
  return (
    <div className="flex w-[420px] max-w-full flex-col gap-4">
      <DateRangePicker aria-label="Report period" />
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
