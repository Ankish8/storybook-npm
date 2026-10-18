import { useId, useState } from "react";
import { CreatableMultiSelect } from "@/components/ui/v2/creatable-multi-select";

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "empathetic", label: "Empathetic" },
];

export default function ErrorState() {
  const [value, setValue] = useState<string[]>([]);
  const labelId = useId();
  const messageId = useId();
  const invalid = value.length === 0;

  return (
    <div className="flex w-[420px] max-w-full flex-col gap-1.5">
      <p
        id={labelId}
        className="m-0 text-sm font-medium text-[var(--v2-text-primary)]"
      >
        Conversation tones
      </p>
      <CreatableMultiSelect
        aria-labelledby={labelId}
        aria-describedby={invalid ? messageId : undefined}
        options={tones}
        value={value}
        onValueChange={setValue}
        state={invalid ? "error" : "default"}
      />
      {invalid && (
        <p id={messageId} className="m-0 text-xs text-v2-semantic-error-text">
          Choose at least one tone.
        </p>
      )}
    </div>
  );
}
