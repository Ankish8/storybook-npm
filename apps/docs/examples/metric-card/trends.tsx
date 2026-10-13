import { MetricCard } from "@/components/ui/v2/metric-card";

export default function Example() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <MetricCard
        label="Resolved conversations"
        value={128}
        trend={{ change: "12%", direction: "up", tone: "positive" }}
        comparison="Compared with yesterday"
      />
      <MetricCard
        label="Missed calls"
        value={6}
        trend={{ change: "25%", direction: "down", tone: "positive" }}
        comparison="Compared with yesterday"
      />
      <MetricCard
        label="Average wait"
        value="2m 18s"
        trend={{ change: "No change", direction: "flat", tone: "neutral" }}
      />
    </div>
  );
}
