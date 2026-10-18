import { useState } from "react";
import { Switch } from "@/components/ui/v2/switch";

export default function Controlled() {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex flex-col items-start gap-4">
      <Switch
        label="Auto-save drafts"
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <p role="status" className="m-0 text-sm text-v2-semantic-text-muted">
        Auto-save is {enabled ? "on" : "off"}.
      </p>
    </div>
  );
}
