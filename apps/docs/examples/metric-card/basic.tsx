import { MetricCard } from "@/components/ui/v2/metric-card";

export default function Example() {
  return (
    <MetricCard
      className="w-full max-w-sm"
      label="Resolved conversations"
      value={128}
      comparison="Today, across the support inbox"
    />
  );
}
