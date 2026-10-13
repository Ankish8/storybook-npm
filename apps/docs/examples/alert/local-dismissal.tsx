import { useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/v2/alert";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [version, setVersion] = useState(0);
  return (
    <div className="grid w-full max-w-md gap-3">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setVersion((value) => value + 1)}
      >
        Reset alert
      </Button>
      <Alert key={version} closable defaultOpen animateExit>
        <AlertTitle>Review the workspace settings</AlertTitle>
      </Alert>
    </div>
  );
}
