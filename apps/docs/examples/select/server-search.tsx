import { useState } from "react";
import { SelectField } from "@/components/ui/v2/select";
const options = [
  { value: "none", label: "None" },
  { value: "basic", label: "Basic Auth" },
  { value: "bearer", label: "Bearer Token" },
  { value: "api-key", label: "API Key" },
  { value: "oauth2", label: "OAuth 2.0" },
];
export default function ServerSearch() {
  const [value, setValue] = useState("basic");
  const [query, setQuery] = useState("");
  const results = options.filter(
    (option) =>
      option.label.toLowerCase().includes(query.toLowerCase()) ||
      option.value === value
  );
  return (
    <div className="w-[360px] max-w-full">
      <SelectField
        label="Authentication"
        searchable
        value={value}
        onValueChange={setValue}
        searchValue={query}
        onSearchChange={setQuery}
        options={results}
        helperText="The parent owns the query and results."
      />
    </div>
  );
}
