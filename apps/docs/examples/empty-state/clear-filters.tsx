import { useState } from "react";
import { EmptyState } from "@/components/ui/v2/empty-state";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [filtered, setFiltered] = useState(true);
  return (
    <div className="grid w-full max-w-md gap-3">
      {filtered ? (
        <EmptyState
          size="sm"
          illustration="no-results"
          title="No matching contacts"
          description="Clear the inactive-contact filter to see your team."
          actions={
            <Button size="sm" onClick={() => setFiltered(false)}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          <ul className="m-0 space-y-2 pl-5">
            <li>Mira Shah</li>
            <li>Owen Lee</li>
            <li>Leena Rao</li>
          </ul>
          <Button size="sm" variant="outline" onClick={() => setFiltered(true)}>
            Apply filter again
          </Button>
        </div>
      )}
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        {filtered ? "No matches" : "Three contacts restored"}
      </p>
    </div>
  );
}
