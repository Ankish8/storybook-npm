import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
];

export default function SelectAll() {
  return (
    <div className="w-[360px] max-w-full">
      <MultiSelect
        label="Working days"
        placeholder="Select days"
        selectAllLabel="All days"
        options={options}
        defaultValue={["mon", "tue"]}
      />
    </div>
  );
}
