import { useState } from "react";
import { Textarea } from "@/components/ui/v2/textarea";
import { Button } from "@/components/ui/v2/button";
export default function Validation() {
  const [invalid, setInvalid] = useState(false);
  return (
    <div className="flex w-[380px] max-w-full flex-col items-start gap-3">
      <Textarea
        wrapperClassName="w-full"
        label="Resolution"
        helperText="Explain how the issue was resolved."
        error={invalid ? "Add more detail before saving." : undefined}
        errorIcon
      />
      <Button variant="outline" onClick={() => setInvalid(!invalid)}>
        {invalid ? "Clear error" : "Show error"}
      </Button>
    </div>
  );
}
