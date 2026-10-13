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
export default function ErrorExample() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("Choose an authentication method.");
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-3">
      <SelectField
        label="Authentication"
        required
        options={options}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          setError("");
        }}
        helperText="Choose how this webhook authenticates."
        error={error}
      />
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          setValue("");
          setError("Choose an authentication method.");
        }}
      >
        Show error
      </Button>
    </div>
  );
}
