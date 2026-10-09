import { Button } from "@/components/ui/v2/button";
import { Modal } from "@/components/ui/v2/modal";

export default function WithTrigger() {
  return (
    <Modal
      trigger={<Button variant="secondary">Archive inbox</Button>}
      title="Archive this inbox?"
      description="It will stop receiving new conversations. You can restore it later."
      confirmButtonText="Archive"
      onConfirm={() => console.log("Archived")}
    />
  );
}
