import { useState } from "react";
import { SelectField } from "@/components/ui/v2/select";
const options = [
  { value: "support", label: "Support team" },
  { value: "sales", label: "Sales team" },
  { value: "create", label: "Create a team…" },
];
export default function ActionItem() {
  const [value, setValue] = useState("support");
  const [notice, setNotice] = useState("");
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-3">
      <SelectField
        label="Team"
        options={options}
        value={value}
        onValueChange={setValue}
        interceptValue={(next) => next !== "create"}
        onSelect={(option) =>
          setNotice(
            option.value === "create"
              ? "A create-team flow can open here. Selection stays unchanged."
              : `Selected ${option.label}`
          )
        }
      />
      <p role="status" className="m-0 text-xs text-[var(--v2-text-muted)]">
        {notice || "Choose Create a team to see the interception."}
      </p>
    </div>
  );
}
