import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/v2/dropdown-menu";

export default function Controlled() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Non-modal actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setCount((value) => value + 1)}>
            Add a note
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="secondary"
        onClick={() => setCount((value) => value + 1)}
      >
        Outside action
      </Button>
      <p
        className="m-0 w-full text-center text-sm text-semantic-text-muted"
        role="status"
      >
        {count} actions · menu {open ? "open" : "closed"}
      </p>
    </div>
  );
}
