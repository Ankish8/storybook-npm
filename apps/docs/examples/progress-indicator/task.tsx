import { useState } from "react";
import { ProgressIndicator } from "@/components/ui/v2/progress-indicator";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [value, setValue] = useState(20);
  return (
    <div className="grid w-full max-w-sm gap-4">
      <p className="m-0 text-sm font-medium text-semantic-text-primary">
        Import contacts
      </p>
      <ProgressIndicator
        className="w-full"
        value={value}
        aria-label="Contact import"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => setValue(Math.min(100, value + 20))}
          disabled={value === 100}
        >
          Import next batch
        </Button>
        <Button size="sm" variant="outline" onClick={() => setValue(100)}>
          Finish
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setValue(0)}>
          Reset
        </Button>
      </div>
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        {value === 100
          ? "Import complete"
          : `${value} of 100 contacts imported locally`}
      </p>
    </div>
  );
}
