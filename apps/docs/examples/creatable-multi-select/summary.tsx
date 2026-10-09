import { useState } from "react";
import { CreatableMultiSelect } from "@/components/ui/v2/creatable-multi-select";

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "empathetic", label: "Empathetic" },
  { value: "direct", label: "Direct" },
];

export default function Summary() {
  const [value, setValue] = useState(["professional", "friendly"]);

  return (
    <CreatableMultiSelect
      aria-label="Conversation tones"
      className="w-[420px] max-w-full"
      options={tones}
      value={value}
      onValueChange={setValue}
      triggerDisplay="summary"
    />
  );
}
