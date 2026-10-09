import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/v2/button";
import { Modal } from "@/components/ui/v2/modal";

export default function TypeToConfirm() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete webhook
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        size="xs"
        variant="destructive"
        icon={<Trash2 />}
        title="Delete this webhook?"
        description="This permanently removes the webhook and its delivery history."
        requireText="DELETE"
        confirmButtonText="Delete"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}
