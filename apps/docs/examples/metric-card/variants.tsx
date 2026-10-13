import { MetricCard } from "@/components/ui/v2/metric-card";

export default function Example() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <MetricCard label="Resolved today" value={128} />
      <MetricCard variant="subtle" label="Waiting for reply" value={14} />
    </div>
  );
}
