import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { Input } from "@/components/ui/v2/input";
import { Modal } from "@/components/ui/v2/modal";

export default function Form() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Ada Lovelace");
  const [email, setEmail] = useState("ada@example.com");

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Edit profile
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Edit profile"
        description="Make changes to your profile here."
        confirmButtonText="Save"
        confirmDisabled={!name.trim() || !email.includes("@")}
        showCloseButton
        onConfirm={() => setOpen(false)}
      >
        <div className="grid gap-2">
          <label htmlFor="profile-name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="profile-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="profile-email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
