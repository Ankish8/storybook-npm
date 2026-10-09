import { useState } from "react";
import { CreatableMultiSelect } from "@/components/ui/v2/creatable-multi-select";

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "empathetic", label: "Empathetic" },
];

export default function TrackDraft() {
  const [value, setValue] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  return (
    <div className="flex w-[420px] max-w-full flex-col gap-3">
      <CreatableMultiSelect
        aria-label="Conversation tones"
        options={tones}
        value={value}
        onValueChange={setValue}
        onInputValueChange={setDraft}
      />
      <p role="status" className="m-0 text-xs text-[var(--v2-text-muted)]">
        Draft: {draft ? `“${draft}”` : "nothing typed"}
      </p>
    </div>
  );
}
