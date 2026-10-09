import { useState } from "react";
import { CreatableMultiSelect } from "@/components/ui/v2/creatable-multi-select";

const tones = [
  { value: "tone_pro", label: "Professional" },
  { value: "tone_friendly", label: "Friendly" },
  { value: "tone_direct", label: "Direct" },
];

export default function ValuesAndLabels() {
  const [value, setValue] = useState(["tone_pro"]);

  return (
    <div className="flex w-[420px] max-w-full flex-col gap-3">
      <CreatableMultiSelect
        aria-label="Conversation tones"
        options={tones}
        value={value}
        onValueChange={setValue}
      />
      <p role="status" className="m-0 text-xs text-[var(--v2-text-muted)]">
        Stored: {JSON.stringify(value)}
      </p>
    </div>
  );
}
