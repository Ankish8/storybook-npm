import { TextField } from "@/components/ui/v2/text-field";
import { useState } from "react";
export default function Controlled() {
  const [value, setValue] = useState("Customer support");
  return (
    <TextField
      label="Workspace name"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue("")}
      returnFocusOnClear
      clearable
      maxLength={32}
      showCount
      helperText="Keep it short and recognizable."
      wrapperClassName="w-full max-w-sm"
    />
  );
}
