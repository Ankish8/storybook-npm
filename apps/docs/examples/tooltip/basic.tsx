import { Info } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/v2/tooltip";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline" aria-label="About assignment">
            <Info className="size-4" aria-hidden="true" />
            Assignment
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Conversations are assigned to the selected teammate.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
