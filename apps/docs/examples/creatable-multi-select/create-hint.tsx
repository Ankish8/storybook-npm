import { useState } from "react";
import { CreatableMultiSelect } from "@/components/ui/v2/creatable-multi-select";

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "empathetic", label: "Empathetic" },
];

export default function CreateHint() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <CreatableMultiSelect
      aria-label="Conversation tones"
      className="w-[420px] max-w-full"
      options={tones}
      value={value}
      onValueChange={setValue}
      createHintText="Type to create a custom tone"
    />
  );
}
