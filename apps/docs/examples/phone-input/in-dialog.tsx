import { useState } from "react";
import { PhoneInput } from "@/components/ui/v2/phone-input";
import { Modal } from "@/components/ui/v2/modal";
import { Button } from "@/components/ui/v2/button";
export default function InDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Edit contact
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Contact number"
        description="The country picker stays attached to the field."
        confirmButtonText="Done"
        onConfirm={() => setOpen(false)}
      >
        <div className="space-y-2">
          <label
            htmlFor="dialog-phone"
            className="text-sm font-medium text-v2-semantic-text-primary"
          >
            Mobile number
          </label>
          <PhoneInput
            id="dialog-phone"
            countrySelector
            autoComplete="tel-national"
          />
        </div>
      </Modal>
    </>
  );
}
