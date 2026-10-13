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
            Retention rate
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={10}>
          Customers retained in this period.
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
