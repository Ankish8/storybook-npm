import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { Modal } from "@/components/ui/v2/modal";
import { MultiSelect } from "@/components/ui/v2/multi-select";

const options = [
  { value: "asha", label: "Asha Verma" },
  { value: "rohan", label: "Rohan Mehta" },
  { value: "meera", label: "Meera Iyer" },
  { value: "kabir", label: "Kabir Singh" },
];

export default function InDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Add members
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Add members"
        description="Escape closes the list first, then the dialog."
        confirmButtonText="Add"
        cancelButtonText="Cancel"
        onConfirm={() => setOpen(false)}
      >
        <MultiSelect
          label="People"
          placeholder="Select people"
          searchable
          options={options}
        />
      </Modal>
    </>
  );
}
