import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { Modal } from "@/components/ui/v2/modal";

export default function Basic() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Pause notifications
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Pause notifications?"
        description="You can turn them back on at any time."
        confirmButtonText="Pause"
        cancelButtonText="Keep enabled"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}
