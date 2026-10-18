import { useState } from "react";
import { MetricCard } from "@/components/ui/v2/metric-card";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [details, setDetails] = useState(false);
  return (
    <MetricCard
      className="w-full max-w-sm"
      label="Resolved this week"
      value={840}
      comparison="Up from 720 last week"
      graphic={
        <svg
          role="img"
          aria-label="Resolved conversations increased over the week"
          viewBox="0 0 240 48"
          className="h-12 w-full fill-none stroke-v2-semantic-success-primary"
          strokeWidth="2"
        >
          <path d="M2 42 L38 36 L76 38 L114 23 L152 28 L190 12 L238 5" />
        </svg>
      }
    >
      <Button size="sm" variant="outline" onClick={() => setDetails(!details)}>
        {details ? "Hide details" : "View details"}
      </Button>
      {details && (
        <p className="m-0 mt-3 text-sm text-v2-semantic-text-secondary">
          The support team resolved 120 more conversations this week.
        </p>
      )}
    </MetricCard>
  );
}
