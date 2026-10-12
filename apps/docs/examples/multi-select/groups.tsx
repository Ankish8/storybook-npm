import { MultiSelect } from "@/components/ui/v2/multi-select";

const sections = [
  {
    label: "North",
    options: [
      { value: "delhi", label: "Delhi" },
      { value: "jaipur", label: "Jaipur" },
    ],
  },
  {
    label: "South",
    options: [
      { value: "bengaluru", label: "Bengaluru" },
      { value: "chennai", label: "Chennai" },
    ],
  },
  {
    label: "West",
    options: [
      { value: "mumbai", label: "Mumbai" },
      { value: "pune", label: "Pune" },
    ],
  },
];

export default function Groups() {
  return (
    <div className="w-[360px] max-w-full">
      <MultiSelect
        label="Regions"
        placeholder="Select cities"
        options={sections}
      />
    </div>
  );
}
