import { useState } from "react";
import {
  ActionButton,
  type ActionButtonState,
} from "@/components/ui/v2/action-button";

const run = () => new Promise((resolve) => setTimeout(resolve, 1200));

export default function StateChange() {
  const [state, setState] = useState<ActionButtonState>("idle");

  return (
    <div className="flex flex-col items-start gap-3">
      <ActionButton label="Save" onAction={run} onStateChange={setState} />
      <p role="status" className="m-0 text-sm text-[var(--v2-text-muted)]">
        State: <strong>{state}</strong>
      </p>
    </div>
  );
}
