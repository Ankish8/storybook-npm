import { useState } from "react";
import { Checkbox, type CheckedState } from "@/components/ui/v2/checkbox";

const FILES = ["Report.pdf", "Invoice.pdf", "Notes.txt"];

export default function Indeterminate() {
  const [selected, setSelected] = useState<string[]>(["Report.pdf"]);
  const all: CheckedState =
    selected.length === FILES.length
      ? true
      : selected.length === 0
        ? false
        : "indeterminate";

  return (
    <div className="flex flex-col items-start gap-3">
      <Checkbox
        label="Select all"
        checked={all}
        onCheckedChange={(next) => setSelected(next === true ? FILES : [])}
      />
      <div className="flex flex-col gap-3 pl-8">
        {FILES.map((file) => (
          <Checkbox
            key={file}
            label={file}
            checked={selected.includes(file)}
            onCheckedChange={(next) =>
              setSelected((current) =>
                next === true
                  ? [...current, file]
                  : current.filter((item) => item !== file)
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
