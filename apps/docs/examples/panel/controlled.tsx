import { useState } from "react";
import { Panel } from "@/components/ui/v2/panel";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Open contact details
      </Button>
      <div className={open ? "flex h-72 min-w-0" : "flex h-0 min-w-0"}>
        <Panel
          open={open}
          onClose={() => setOpen(false)}
          title="Contact details"
        >
          <p className="m-0 p-4 text-sm text-semantic-text-secondary">
            Aditi Kumar · Support inbox
          </p>
        </Panel>
      </div>
      <p className="m-0 text-xs text-semantic-text-muted" role="status">
        {open ? "Contact panel open" : "Contact panel closed"}
      </p>
    </div>
  );
}
