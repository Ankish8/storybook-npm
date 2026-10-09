import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/v2/button";
import { Modal } from "@/components/ui/v2/modal";

export default function WithIcon() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Share project
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        icon={<Share2 />}
        title="Share this project?"
        description="Anyone with the link will be able to view and edit it."
        confirmButtonText="Share"
        cancelButtonText="Not now"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}
