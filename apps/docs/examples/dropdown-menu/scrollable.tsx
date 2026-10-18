import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/v2/dropdown-menu";

export default function Scrollable() {
  const [selection, setSelection] = useState("Choose a queue");
  return (
    <div className="flex flex-col items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Queue actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          {Array.from({ length: 18 }, (_, index) => (
            <DropdownMenuItem
              key={index}
              onSelect={() => setSelection(`Queue ${index + 1} selected`)}
            >
              {`Queue ${index + 1}`}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="m-0 text-sm text-v2-semantic-text-muted" role="status">
        {selection}
      </p>
    </div>
  );
}
