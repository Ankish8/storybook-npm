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
          <Button size="sm" variant="outline">
            About response time
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Response time counts business hours from the first incoming message
          until the first teammate reply.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
