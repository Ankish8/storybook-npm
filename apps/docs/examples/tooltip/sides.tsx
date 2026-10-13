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
      <div className="flex max-w-xs flex-wrap justify-center gap-3">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline">
                {side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>Assignment help</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
