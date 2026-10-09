import { useState } from "react";
import { CreatableMultiSelect } from "@/components/ui/v2/creatable-multi-select";

export default function FreeText() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <CreatableMultiSelect
      aria-label="Keywords"
      className="w-[420px] max-w-full"
      value={value}
      onValueChange={setValue}
      placeholder="Add a keyword"
      createHintText="Type a keyword and press Enter"
    />
  );
}
