import { TextField } from "@/components/ui/v2/text-field";
import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
export default function Validation() {
  const [invalid, setInvalid] = useState(false);
  return (
    <div className="grid w-full max-w-sm gap-4">
      <TextField
        label="Workspace name"
        defaultValue="Hi"
        helperText="Use at least 3 characters."
        error={
          invalid
            ? "This name is too short. Use at least 3 characters."
            : undefined
        }
      />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setInvalid(!invalid)}
      >
        {invalid ? "Show helper" : "Show error"}
      </Button>
    </div>
  );
}
