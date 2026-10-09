import { useId, useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { CreatableMultiSelect } from "@/components/ui/v2/creatable-multi-select";

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "empathetic", label: "Empathetic" },
  { value: "direct", label: "Direct" },
];

export default function Form() {
  const [value, setValue] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState("");
  const labelId = useId();
  const messageId = useId();
  const invalid = submitted && value.length === 0;

  return (
    <form
      className="flex w-[420px] max-w-full flex-col gap-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        const labels = value.map(
          (item) => tones.find((tone) => tone.value === item)?.label ?? item
        );
        setSaved(labels.length ? `Saved: ${labels.join(", ")}` : "");
      }}
    >
      <div className="flex flex-col gap-1.5">
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
          onValueChange={(next) => {
            setValue(next);
            setSaved("");
          }}
          state={invalid ? "error" : "default"}
        />
        {invalid && (
          <p id={messageId} className="m-0 text-xs text-semantic-error-text">
            Choose at least one tone.
          </p>
        )}
      </div>
      <Button type="submit">Save tones</Button>
      {saved && (
        <p role="status" className="m-0 text-sm text-semantic-success-text">
          {saved}
        </p>
      )}
    </form>
  );
}
