import { useState } from "react";
import { Textarea } from "@/components/ui/v2/textarea";
export default function Limits() {
  const [value, setValue] = useState("");
  return (
    <div className="flex w-[380px] max-w-full flex-col gap-5">
      <Textarea
        label="Short summary"
        showCount
        maxLength={40}
        placeholder="Stops at 40 characters"
      />
      <Textarea
        label="Draft notes"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        showCount
        maxLength={40}
        enforceMaxLength={false}
        error={
          value.length > 40 ? "Shorten the notes before saving." : undefined
        }
        helperText="You can continue editing beyond the limit."
      />
    </div>
  );
}
