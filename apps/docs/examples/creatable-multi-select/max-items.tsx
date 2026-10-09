import { useState } from "react";
import { CreatableMultiSelect } from "@/components/ui/v2/creatable-multi-select";

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "empathetic", label: "Empathetic" },
  { value: "direct", label: "Direct" },
  { value: "enthusiastic", label: "Enthusiastic" },
];

export default function MaxItems() {
  const [value, setValue] = useState(["professional"]);

  return (
    <CreatableMultiSelect
      aria-label="Conversation tones"
      className="w-[420px] max-w-full"
      options={tones}
      value={value}
      onValueChange={setValue}
      maxItems={3}
    />
  );
}
