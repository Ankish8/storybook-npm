import { useState } from "react";
import { Panel } from "@/components/ui/v2/panel";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [open, setOpen] = useState(true);
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Reopen profile
      </Button>
      <div className={open ? "flex h-56 min-w-0" : "flex h-0 min-w-0"}>
        <Panel
          open={open}
          aria-label="Contact profile"
          onClose={() => setOpen(false)}
          header={
            <div className="flex w-full items-center justify-between gap-3 p-3">
              <span className="text-sm font-medium text-v2-semantic-text-primary">
                Contact profile
              </span>
              <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          }
        >
          <p className="m-0 p-4 text-sm text-v2-semantic-text-secondary">
            Aditi Kumar · Active contact
          </p>
        </Panel>
      </div>
    </div>
  );
}
