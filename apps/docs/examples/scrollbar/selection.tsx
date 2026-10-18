import { useState } from "react";
import { Scrollbar } from "@/components/ui/v2/scrollbar";
export default function Example() {
  const [selected, setSelected] = useState("");
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Scrollbar
        aria-label="Assignable contacts"
        className="h-48 rounded-lg border border-v2-semantic-border-layout"
      >
        <div className="grid gap-2 p-3">
          {[
            "Emma",
            "Marcus",
            "Ava",
            "Mira",
            "Owen",
            "Leena",
            "Aditi",
            "Karan",
          ].map((name) => (
            <button
              type="button"
              key={name}
              aria-pressed={selected === name}
              onClick={() => setSelected(name)}
              className="rounded-lg border border-v2-semantic-border-layout bg-v2-semantic-bg-primary px-3 py-2 text-left text-sm text-v2-semantic-text-secondary"
            >
              {name}
            </button>
          ))}
        </div>
      </Scrollbar>
      <p className="m-0 text-xs text-v2-semantic-text-muted" role="status">
        {selected ? `Assigned to ${selected}` : "Choose a contact"}
      </p>
    </div>
  );
}
