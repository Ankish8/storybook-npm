import { useState } from "react";
import {
  EmptyStates,
  type EmptyStatesValue,
} from "@/components/ui/v2/empty-states";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [view, setView] = useState<EmptyStatesValue>("no-results");
  const [result, setResult] = useState("");
  const outcomes = {
    "no-results": "Three contacts restored: Mira, Owen and Leena.",
    offline: "Connection restored. Three queued edits synced locally.",
    "caught-up": "Mira's conversation added to the local inbox.",
    "not-found": "Returned to the local workspace.",
  };
  return (
    <div className="grid w-full max-w-lg gap-3">
      {result ? (
        <div className="grid gap-3 rounded-xl border border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-5">
          <p
            role="status"
            className="m-0 text-sm text-v2-semantic-text-secondary"
          >
            {result}
          </p>
          <Button size="sm" variant="outline" onClick={() => setResult("")}>
            Reset {view} view
          </Button>
        </div>
      ) : (
        <EmptyStates
          size="sm"
          value={view}
          onValueChange={setView}
          onAction={(state) => setResult(outcomes[state])}
        />
      )}
    </div>
  );
}
