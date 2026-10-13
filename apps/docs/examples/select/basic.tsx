import { SelectField } from "@/components/ui/v2/select";
const options = [
  { value: "none", label: "None" },
  { value: "basic", label: "Basic Auth" },
  { value: "bearer", label: "Bearer Token" },
  { value: "api-key", label: "API Key" },
  { value: "oauth2", label: "OAuth 2.0" },
];
export default function Basic() {
  return (
    <div className="w-[360px] max-w-full">
      <SelectField
        label="Authentication"
        placeholder="Select a method"
        options={options}
        helperText="Choose how this webhook authenticates."
      />
    </div>
  );
}
