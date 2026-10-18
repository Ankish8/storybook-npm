import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/v2/alert";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [connected, setConnected] = useState(false);
  return (
    <div className="grid w-full max-w-md gap-3">
      <Alert
        variant={connected ? "success" : "warning"}
        action={
          <Button size="sm" onClick={() => setConnected(!connected)}>
            {connected ? "Pause sync" : "Reconnect"}
          </Button>
        }
        secondaryAction={
          !connected && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConnected(true)}
            >
              Keep working locally
            </Button>
          )
        }
      >
        <AlertTitle>
          {connected ? "Workspace connected" : "Sync paused"}
        </AlertTitle>
        <AlertDescription>
          {connected
            ? "Your queued changes are ready to share."
            : "Three local changes are waiting for a connection."}
        </AlertDescription>
      </Alert>
      <p role="status" className="m-0 text-xs text-v2-semantic-text-muted">
        {connected ? "Local connection restored" : "Local connection paused"}
      </p>
    </div>
  );
}
