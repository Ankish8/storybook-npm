import { SelectField } from "@/components/ui/v2/select";
const options = [
  {
    value: "support",
    label:
      "Customer support team handling product questions and account requests",
  },
  {
    value: "sales",
    label: "Sales team handling enterprise plans and new customer onboarding",
  },
];
export default function LongLabels() {
  return (
    <div className="flex w-[300px] max-w-full flex-col gap-5">
      <SelectField
        label="Wrapped options"
        options={options}
        defaultValue="support"
      />
      <SelectField
        label="Truncated options"
        options={options}
        defaultValue="sales"
        truncateOptionText
      />
    </div>
  );
}
