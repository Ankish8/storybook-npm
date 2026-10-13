import { SelectField } from "@/components/ui/v2/select";
const options = [
  { value: "support", label: "Support agents", group: "People" },
  { value: "managers", label: "Managers", group: "People" },
  { value: "sales", label: "Sales team", group: "Teams" },
  { value: "archive", label: "Archived team", group: "Teams", disabled: true },
];
export default function Searchable() {
  return (
    <div className="w-[360px] max-w-full">
      <SelectField
        label="Route calls to"
        searchable
        searchPlaceholder="Search people or teams…"
        defaultValue="support"
        options={options}
        helperText="Disabled options are skipped by keyboard navigation."
      />
    </div>
  );
}
