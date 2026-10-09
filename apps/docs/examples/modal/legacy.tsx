import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { DeleteConfirmationModal, FormModal } from "@/components/ui/v2/modal";

// v1 code keeps working: only the import path changes.
export default function LegacyNames() {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setEditing(true)}>
        FormModal
      </Button>
      <Button variant="destructive" onClick={() => setDeleting(true)}>
        DeleteConfirmationModal
      </Button>
      <FormModal
        open={editing}
        onOpenChange={setEditing}
        title="Edit profile"
        onSave={() => setEditing(false)}
      >
        <p className="m-0 text-sm">The v1 FormModal props still work.</p>
      </FormModal>
      <DeleteConfirmationModal
        open={deleting}
        onOpenChange={setDeleting}
        itemName="webhook"
        onConfirm={() => setDeleting(false)}
      />
    </>
  );
}
