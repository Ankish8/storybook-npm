import { MetricCard } from "@/components/ui/v2/metric-card";

export default function Example() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <MetricCard
          key={size}
          size={size}
          label={`Resolved · ${size}`}
          value={128}
          comparison="Today"
        />
      ))}
    </div>
  );
}
