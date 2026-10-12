import { useState } from "react";
import { TextField } from "@/components/ui/v2/text-field";

export default function TextFieldExample() {
  const [value, setValue] = useState("support@myoperator.com");
  const invalid = !value.endsWith("@myoperator.com");

  return (
    <div className="w-[360px] max-w-full">
      <TextField
        label="Work email"
        required
        value={value}
        onChange={(event) => setValue(event.target.value)}
        helperText="Change the domain to see the error open."
        error={invalid ? "Must end in @myoperator.com" : undefined}
        clearable
        onClear={() => setValue("")}
      />
    </div>
  );
}
