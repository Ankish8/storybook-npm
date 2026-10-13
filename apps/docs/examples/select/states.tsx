import { SelectField } from "@/components/ui/v2/select";
const options = [
  { value: "none", label: "None" },
  { value: "basic", label: "Basic Auth" },
  { value: "bearer", label: "Bearer Token" },
  { value: "api-key", label: "API Key" },
  { value: "oauth2", label: "OAuth 2.0" },
];
export default function States() {
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-5">
      <SelectField
        label="Disabled"
        options={options}
        defaultValue="basic"
        disabled
      />
      <SelectField
        label="Loading"
        options={options}
        placeholder="Loading methods…"
        loading
      />
    </div>
  );
}
