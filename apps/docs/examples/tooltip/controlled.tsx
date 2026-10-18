import { useState } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/v2/tooltip";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <TooltipProvider>
      <div className="grid gap-4">
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline">
              Assignment help
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Choose one teammate to own the conversation.
          </TooltipContent>
        </Tooltip>
        <Button size="sm" variant="ghost" onClick={() => setOpen(!open)}>
          {open ? "Hide help" : "Show help"}
        </Button>
        <p className="m-0 text-xs text-v2-semantic-text-muted" role="status">
          {open ? "Help open" : "Help closed"}
        </p>
      </div>
    </TooltipProvider>
  );
}
