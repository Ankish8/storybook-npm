import { useState } from "react";
import {
  EmptyStates,
  type EmptyStatesValue,
} from "@/components/ui/v2/empty-states";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [view, setView] = useState<EmptyStatesValue>("offline");
  return (
    <div className="grid w-full max-w-lg gap-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setView("offline")}>
          Show offline
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setView("caught-up")}
        >
          Show caught up
        </Button>
      </div>
      <EmptyStates
        size="sm"
        value={view}
        onValueChange={setView}
        tabListLabel="Workspace recovery views"
      />
      <p role="status" className="m-0 text-xs text-v2-semantic-text-muted">
        Selected: {view}
      </p>
    </div>
  );
}
