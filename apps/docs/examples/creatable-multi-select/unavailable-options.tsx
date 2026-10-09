import { useState } from "react";
import { CreatableMultiSelect } from "@/components/ui/v2/creatable-multi-select";

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "sarcastic", label: "Sarcastic", disabled: true },
  { value: "direct", label: "Direct" },
];

export default function UnavailableOptions() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <CreatableMultiSelect
      aria-label="Conversation tones"
      className="w-[420px] max-w-full"
      options={tones}
      value={value}
      onValueChange={setValue}
    />
  );
}
