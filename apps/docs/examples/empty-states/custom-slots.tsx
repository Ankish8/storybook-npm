import { useState } from "react";
import { WifiOff } from "lucide-react";
import { EmptyStates } from "@/components/ui/v2/empty-states";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="grid w-full max-w-lg gap-3">
      <EmptyStates
        defaultValue="offline"
        size="sm"
        states={{
          offline: {
            title: "Work saved on this device",
            description: "Reconnect when you're ready to share it.",
            icon: <WifiOff />,
            actions: (
              <Button size="sm" onClick={() => setSaved(!saved)}>
                {saved ? "Pause again" : "Resume local sync"}
              </Button>
            ),
          },
          "not-found": { actions: null },
        }}
      />
      <p role="status" className="m-0 text-xs text-v2-semantic-text-muted">
        {saved ? "Local sync resumed" : "Local sync paused"}
      </p>
    </div>
  );
}
