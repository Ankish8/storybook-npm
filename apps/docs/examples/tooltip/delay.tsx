import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/v2/tooltip";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  return (
    <TooltipProvider delayDuration={500}>
      <div className="flex flex-wrap gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline">
              500ms delay
            </Button>
          </TooltipTrigger>
          <TooltipContent>Uses the provider delay.</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline">
              Immediate
            </Button>
          </TooltipTrigger>
          <TooltipContent>Uses an individual delay override.</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
