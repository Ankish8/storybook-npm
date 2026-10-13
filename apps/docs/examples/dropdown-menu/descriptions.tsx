import { Button } from "@/components/ui/v2/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/v2/dropdown-menu";
import { DropdownMenuShortcut } from "@/components/ui/v2/dropdown-menu";

export default function Descriptions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Workspace tools</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuItem
          description="Review your team's current conversation assignment rules"
          suffix="New"
        >
          Assignment rules
        </DropdownMenuItem>
        <DropdownMenuItem>
          Search conversations<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled
          description="Available to workspace administrators"
        >
          Billing settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
