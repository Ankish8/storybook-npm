import { MetricCard } from "@/components/ui/v2/metric-card";

export default function Example() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <MetricCard label="Revenue" value="₹24,500" />
      <MetricCard label="First response" value="2m 18s" />
      <MetricCard label="Resolution rate" value={96.4} suffix="%" />
    </div>
  );
}
