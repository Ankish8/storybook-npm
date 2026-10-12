import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  { value: "asha", label: "Asha Verma", caption: "Support" },
  { value: "rohan", label: "Rohan Mehta", caption: "Sales" },
  { value: "meera", label: "Meera Iyer", caption: "Support" },
  { value: "kabir", label: "Kabir Singh", caption: "Billing" },
];

export default function Detailed() {
  return (
    <div className="w-[400px] max-w-full">
      <MultiSelect
        label="Assign to"
        placeholder="Select agents"
        optionVariant="detailed"
        options={options}
      />
    </div>
  );
}
