import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  "Billing",
  "Call routing",
  "Voicemail",
  "Call recording",
  "Analytics",
  "Webhooks",
  "Contacts",
].map((label) => ({ value: label.toLowerCase(), label }));

export default function MaxVisible() {
  return (
    <div className="w-[320px] max-w-full">
      <MultiSelect
        label="Features"
        placeholder="Select features"
        maxVisible={2}
        options={options}
        defaultValue={["billing", "call routing", "voicemail", "analytics"]}
      />
    </div>
  );
}
