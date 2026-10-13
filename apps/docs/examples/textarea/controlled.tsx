import { useState } from "react";
import { Textarea } from "@/components/ui/v2/textarea";
import { Button } from "@/components/ui/v2/button";
export default function Controlled() {
  const [value, setValue] = useState("The customer requested a callback.");
  return (
    <div className="flex w-[380px] max-w-full flex-col items-start gap-3">
      <Textarea
        wrapperClassName="w-full"
        label="Notes"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        showCount
        maxLength={160}
      />
      <Button variant="outline" onClick={() => setValue("")}>
        Clear notes
      </Button>
    </div>
  );
}
