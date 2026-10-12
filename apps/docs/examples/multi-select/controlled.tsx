import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  { value: "billing", label: "Billing" },
  { value: "routing", label: "Call routing" },
  { value: "voicemail", label: "Voicemail" },
  { value: "recording", label: "Call recording" },
];

export default function Controlled() {
  const [value, setValue] = useState<string[]>(["billing"]);

  return (
    <div className="flex w-[360px] max-w-full flex-col gap-3">
      <MultiSelect
        label="Features"
        options={options}
        value={value}
        onValueChange={setValue}
      />
      <div className="flex items-center justify-between gap-3">
        <p role="status" className="m-0 text-xs text-[var(--v2-text-muted)]">
          value: [{value.join(", ")}]
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setValue(options.map((option) => option.value))}
        >
          Select everything
        </Button>
      </div>
    </div>
  );
}
