import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/v2/alert";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [open, setOpen] = useState(true);
  return (
    <div className="grid w-full max-w-md gap-3">
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Show message
      </Button>
      <Alert open={open} closable animateExit onClose={() => setOpen(false)}>
        <AlertTitle>Maintenance scheduled</AlertTitle>
        <AlertDescription>
          The workspace will pause for a few minutes.
        </AlertDescription>
      </Alert>
      <p className="m-0 text-xs text-semantic-text-muted" role="status">
        {open ? "Message visible" : "Message dismissed"}
      </p>
    </div>
  );
}
