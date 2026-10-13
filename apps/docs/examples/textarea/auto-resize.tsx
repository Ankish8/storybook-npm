import { useState } from "react";
import { Textarea } from "@/components/ui/v2/textarea";
import { Button } from "@/components/ui/v2/button";
export default function AutoResize() {
  const [value, setValue] = useState("");
  return (
    <div className="flex w-[380px] max-w-full flex-col items-start gap-3">
      <Textarea
        wrapperClassName="w-full"
        label="Growing notes"
        autoResize
        minRows={2}
        maxRows={6}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        helperText="Type or paste several lines, then reset."
      />
      <Button variant="outline" onClick={() => setValue("")}>
        Reset notes
      </Button>
    </div>
  );
}
