import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "billing", label: "Billing" },
  { value: "onboarding", label: "Onboarding" },
  { value: "escalations", label: "Escalations" },
];

export default function SelectionLimit() {
  return (
    <div className="w-[360px] max-w-full">
      <MultiSelect
        label="Queues"
        placeholder="Pick up to 3"
        maxSelections={3}
        options={options}
        defaultValue={["sales", "support"]}
      />
    </div>
  );
}
