import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  { value: "billing", label: "Billing" },
  { value: "routing", label: "Call routing" },
  { value: "voicemail", label: "Voicemail" },
  { value: "recording", label: "Call recording" },
];

export default function Uncontrolled() {
  return (
    <div className="w-[360px] max-w-full">
      <MultiSelect
        label="Features"
        options={options}
        defaultValue={["billing", "voicemail"]}
        onValueChange={(next) => console.log("selection", next)}
      />
    </div>
  );
}
