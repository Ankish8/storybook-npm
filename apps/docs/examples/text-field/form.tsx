import { TextField } from "@/components/ui/v2/text-field";
import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
export default function Form() {
  const [saved, setSaved] = useState<string | null>(null);
  return (
    <form
      className="grid w-full max-w-sm gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(
          String(new FormData(event.currentTarget).get("workspace") ?? "")
        );
      }}
    >
      <TextField
        label="Workspace name"
        name="workspace"
        defaultValue="Support"
        minLength={3}
        helperText="Use at least 3 characters, then press Enter."
      />
      <Button type="submit" size="sm">
        Save workspace
      </Button>
      <p role="status" className="m-0 text-xs text-semantic-text-muted">
        {saved === null
          ? "Changes stay in this example."
          : `Saved locally: ${saved}`}
      </p>
    </form>
  );
}
