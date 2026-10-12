import { useState } from "react";
import { Input } from "@/components/ui/v2/input";

export default function Controlled() {
  const [value, setValue] = useState("Customer support");

  return (
    <div className="flex w-[360px] max-w-full flex-col gap-2">
      <Input
        aria-label="Team name"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p className="m-0 text-xs text-[var(--v2-text-muted)]">
        {value.length} {value.length === 1 ? "character" : "characters"}
      </p>
    </div>
  );
}
