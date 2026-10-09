import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { Modal, ModalAction } from "@/components/ui/v2/modal";

export default function CustomFooter() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        What's new
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="What's new"
        description="Modals now follow the shadcn dialog layout, and one component replaces four."
        footer={
          <ModalAction onClick={() => setOpen(false)}>Got it</ModalAction>
        }
      />
    </>
  );
}
