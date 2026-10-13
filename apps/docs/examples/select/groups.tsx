import { SelectField } from "@/components/ui/v2/select";
const options = [
  { value: "support", label: "Support agents", group: "People" },
  { value: "managers", label: "Managers", group: "People" },
  { value: "sales", label: "Sales team", group: "Teams" },
  { value: "archive", label: "Archived team", group: "Teams", disabled: true },
];
export default function Groups() {
  return (
    <div className="w-[360px] max-w-full">
      <SelectField
        label="Routing"
        searchable
        separateGroups
        options={options}
      />
    </div>
  );
}
