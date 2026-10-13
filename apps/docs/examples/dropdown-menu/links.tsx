import { Button } from "@/components/ui/v2/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/v2/dropdown-menu";

export default function Links() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Documentation</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild description="Open the import instructions">
          <a href="#import">Import component</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="#examples">Browse examples</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
