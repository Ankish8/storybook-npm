import { useState } from "react";
import { Switch } from "@/components/ui/v2/switch";

export default function Invalid() {
  const [enabled, setEnabled] = useState(false);
  return (
    <Switch
      label="Enable alerts"
      checked={enabled}
      onCheckedChange={setEnabled}
      aria-invalid={!enabled}
      description={
        enabled
          ? "Alerts are enabled."
          : "Enable alerts to continue with this notification setup."
      }
    />
  );
}
