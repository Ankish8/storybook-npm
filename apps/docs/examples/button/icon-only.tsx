import { Plus, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/v2/button";

export default function IconOnly() {
  return (
    <>
      <Button size="icon-sm" variant="secondary" aria-label="Add">
        <Plus />
      </Button>
      <Button size="icon" variant="secondary" aria-label="Settings">
        <Settings />
      </Button>
      <Button size="icon-lg" variant="destructive" aria-label="Delete">
        <Trash2 />
      </Button>
    </>
  );
}
