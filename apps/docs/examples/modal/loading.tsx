import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { Modal } from "@/components/ui/v2/modal";

export default function Loading() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Publish
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Publish changes?"
        description="Your changes go live for everyone straight away."
        confirmButtonText="Publish"
        loading={saving}
        onConfirm={() => {
          setSaving(true);
          setTimeout(() => {
            setSaving(false);
            setOpen(false);
          }, 1500);
        }}
      />
    </>
  );
}
