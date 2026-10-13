import { SelectField } from "@/components/ui/v2/select";
export default function Empty() {
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-5">
      <SelectField
        label="Agents"
        options={[]}
        emptyMessage="No agents yet. Add an agent before choosing one."
      />
      <SelectField
        label="Search methods"
        searchable
        options={[{ value: "basic", label: "Basic Auth" }]}
        helperText="Search for a method that is not listed to see the empty result."
      />
    </div>
  );
}
