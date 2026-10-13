import { useState } from "react";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/v2/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/v2/dropdown-menu";

export default function Basic() {
  const [result, setResult] = useState("Choose an action");
  return (
    <div className="flex flex-col items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Conversation actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onSelect={() => setResult("Edit selected")}>
            <Pencil aria-hidden="true" className="h-4 w-4" />
            Edit conversation
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setResult("Duplicate selected")}>
            <Copy aria-hidden="true" className="h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem
            destructive
            onSelect={() => setResult("Archive selected")}
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="m-0 text-sm text-semantic-text-muted" role="status">
        {result}
      </p>
    </div>
  );
}
