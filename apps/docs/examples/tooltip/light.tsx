import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "@/components/ui/v2/tooltip";
import { Button } from "@/components/ui/v2/button";

export default function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline">
            Assignment help
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="light">
          Choose one teammate to own the conversation.
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
