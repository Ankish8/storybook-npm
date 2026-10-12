import {
  DateRangePicker,
  type DateRangePreset,
} from "@/components/ui/v2/date-range-picker";

const today = () => new Date(new Date().setHours(0, 0, 0, 0));
const daysAgo = (days: number) => {
  const date = today();
  date.setDate(date.getDate() - days);
  return date;
};

const presets: DateRangePreset[] = [
  {
    label: "Last 24 hours",
    getRange: () => ({ start: daysAgo(1), end: today() }),
  },
  {
    label: "Last 14 days",
    getRange: () => ({ start: daysAgo(13), end: today() }),
  },
];

export default function CustomPresets() {
  return (
    <div className="w-[360px] max-w-full">
      <DateRangePicker aria-label="Report period" presets={presets} />
    </div>
  );
}
