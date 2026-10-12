import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  "Mumbai line",
  "Delhi line",
  "Bengaluru line",
  "Chennai line",
  "Pune line",
].map((label) => ({ value: label.toLowerCase(), label }));

export default function Summary() {
  return (
    <div className="w-[320px] max-w-full">
      <MultiSelect
        label="Lines"
        placeholder="Select lines"
        options={options}
        summaryLabel={(count) =>
          count === options.length ? "All lines" : `${count} lines selected`
        }
        defaultValue={["mumbai line", "delhi line", "pune line"]}
      />
    </div>
  );
}
