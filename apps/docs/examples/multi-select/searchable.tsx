import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
].map((city) => ({ value: city.toLowerCase(), label: city }));

export default function Searchable() {
  return (
    <div className="w-[360px] max-w-full">
      <MultiSelect
        label="Cities"
        placeholder="Select cities"
        searchable
        searchPlaceholder="Search cities"
        options={options}
      />
    </div>
  );
}
