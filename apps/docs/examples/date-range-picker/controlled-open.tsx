import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { DateRangePicker } from "@/components/ui/v2/date-range-picker";

export default function ControlledOpen() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-[360px] max-w-full flex-col items-start gap-3">
      <Button variant="secondary" onClick={() => setOpen((value) => !value)}>
        {open ? "Close the picker" : "Open the picker"}
      </Button>
      <DateRangePicker
        aria-label="Report period"
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
