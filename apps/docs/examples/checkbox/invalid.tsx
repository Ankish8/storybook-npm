import { useState } from "react";
import { Checkbox } from "@/components/ui/v2/checkbox";

export default function Invalid() {
  const [accepted, setAccepted] = useState(false);

  return (
    <Checkbox
      label="I agree to the terms"
      checked={accepted}
      onCheckedChange={(next) => setAccepted(next === true)}
      error={accepted ? undefined : "You must accept the terms to continue."}
    />
  );
}
