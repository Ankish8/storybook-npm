import { useState } from "react";
import { Checkbox } from "@/components/ui/v2/checkbox";

export default function Controlled() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex flex-col items-start gap-3">
      <Checkbox
        label="Email notifications"
        checked={enabled}
        onCheckedChange={(next) => setEnabled(next === true)}
      />
      <p className="m-0 text-sm text-[var(--v2-text-muted)]">
        Status: <strong>{enabled ? "Enabled" : "Disabled"}</strong>
      </p>
    </div>
  );
}
