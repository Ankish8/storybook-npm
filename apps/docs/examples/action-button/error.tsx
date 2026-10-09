import { useState } from "react";
import { ActionButton } from "@/components/ui/v2/action-button";

export default function WithError() {
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col items-start gap-3">
      <ActionButton
        label="Save changes"
        errorLabel="Saving failed"
        onAction={async () => {
          await new Promise((resolve) => setTimeout(resolve, 800));
          setAttempts((count) => count + 1);
          // Fail the first try so the retry path is visible.
          if (attempts === 0) throw new Error("The server did not respond.");
          setMessage("");
        }}
        onActionError={(error) =>
          setMessage(error instanceof Error ? error.message : "Failed.")
        }
      />
      <p
        role="status"
        className="m-0 min-h-5 text-sm text-[var(--v2-text-muted)]"
      >
        {message}
      </p>
    </div>
  );
}
