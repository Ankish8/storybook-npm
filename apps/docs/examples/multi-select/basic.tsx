import { useState } from "react";
import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  { value: "billing", label: "Billing" },
  { value: "routing", label: "Call routing" },
  { value: "voicemail", label: "Voicemail" },
  { value: "recording", label: "Call recording" },
  { value: "analytics", label: "Analytics" },
];

export default function Basic() {
  const [features, setFeatures] = useState<string[]>(["routing"]);

  return (
    <div className="w-[360px] max-w-full">
      <MultiSelect
        label="Features"
        placeholder="Select features"
        options={options}
        value={features}
        onValueChange={setFeatures}
      />
    </div>
  );
}
