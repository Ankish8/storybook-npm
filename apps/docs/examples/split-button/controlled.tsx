import { useState } from "react";
import { SplitButton } from "@/components/ui/v2/split-button";

export default function Controlled() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("Nothing chosen yet");

  return (
    <div className="flex flex-col items-start gap-3">
      <SplitButton
        label="Export"
        open={open}
        onOpenChange={setOpen}
        actions={["CSV", "PDF", "Excel"].map((format) => ({
          label: format,
          onSelect: () => setLast(`Exported as ${format}`),
        }))}
      />
      <p role="status" className="m-0 text-sm text-[var(--v2-text-muted)]">
        {last} · menu {open ? "open" : "closed"}
      </p>
    </div>
  );
}
