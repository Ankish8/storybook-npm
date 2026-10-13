import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { SelectField } from "@/components/ui/v2/select";
const options = [
  { value: "none", label: "None" },
  { value: "basic", label: "Basic Auth" },
  { value: "bearer", label: "Bearer Token" },
  { value: "api-key", label: "API Key" },
  { value: "oauth2", label: "OAuth 2.0" },
];
export default function Controlled() {
  const [value, setValue] = useState("basic");
  const [picked, setPicked] = useState("Basic Auth");
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-3">
      <SelectField
        label="Authentication"
        options={options}
        value={value}
        onValueChange={setValue}
        onSelect={(option) => setPicked(option.label)}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setValue("bearer")}
        >
          Use bearer token
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setValue("")}>
          Clear
        </Button>
      </div>
      <p role="status" className="m-0 text-xs text-[var(--v2-text-muted)]">
        Value: {value || "empty"} · Last pick: {picked}
      </p>
    </div>
  );
}
