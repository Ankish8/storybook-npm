import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/v2/button";
import { Modal } from "@/components/ui/v2/modal";

export default function Destructive() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete chat
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        size="xs"
        variant="destructive"
        icon={<Trash2 />}
        title="Delete chat?"
        description="This will permanently delete this chat conversation. This action cannot be undone."
        confirmButtonText="Delete"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}
