import { useEffect, useState } from "react";
import { MultiSelect } from "@/components/ui/v2/multi-select";

const DIRECTORY = [
  "Asha Verma",
  "Aditya Rao",
  "Meera Iyer",
  "Rohan Mehta",
  "Kabir Singh",
  "Riya Kapoor",
  "Sana Qureshi",
  "Vikram Nair",
].map((name) => ({ value: name.toLowerCase().replace(" ", "-"), label: name }));

export default function ServerSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(DIRECTORY);
  const [value, setValue] = useState<string[]>([]);

  // Stands in for a request: the field filters nothing itself once `searchQuery` is set.
  useEffect(() => {
    const timer = setTimeout(() => {
      setResults(
        DIRECTORY.filter((person) =>
          person.label.toLowerCase().includes(query.trim().toLowerCase())
        )
      );
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-[360px] max-w-full">
      <MultiSelect
        label="People"
        placeholder="Search people"
        searchable
        searchQuery={query}
        onSearchQueryChange={setQuery}
        options={[
          ...results,
          ...DIRECTORY.filter(
            (person) =>
              value.includes(person.value) &&
              !results.some((result) => result.value === person.value)
          ),
        ]}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}
