import { useState } from "react";
import { MetricCard } from "@/components/ui/v2/metric-card";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [value, setValue] = useState(128);
  const [motion, setMotion] = useState(true);
  return (
    <div className="grid w-full max-w-sm gap-3">
      <MetricCard
        label="Resolved conversations"
        value={value}
        animateValue={motion}
        comparison="Local demo total"
      />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setValue(value + 1)}>
          Resolve one
        </Button>
        <Button size="sm" variant="outline" onClick={() => setValue(128)}>
          Reset
        </Button>
      </div>
      <label className="flex items-center gap-2 text-xs text-v2-semantic-text-secondary">
        <input
          type="checkbox"
          checked={motion}
          onChange={(event) => setMotion(event.target.checked)}
        />
        Animate value changes
      </label>
      <p className="m-0 text-xs text-v2-semantic-text-muted" role="status">
        {value} conversations resolved
      </p>
    </div>
  );
}
