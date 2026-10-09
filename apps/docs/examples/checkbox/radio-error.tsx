import { useState } from "react";
import { Radio, RadioGroup } from "@/components/ui/v2/checkbox";

export default function RadioError() {
  const [size, setSize] = useState("");

  return (
    <RadioGroup
      name="shirt"
      label="T-shirt size"
      value={size}
      onValueChange={setSize}
      error={size ? undefined : "Choose a size to continue."}
    >
      <Radio value="small" label="Small" />
      <Radio value="medium" label="Medium" />
      <Radio value="large" label="Large" />
    </RadioGroup>
  );
}
