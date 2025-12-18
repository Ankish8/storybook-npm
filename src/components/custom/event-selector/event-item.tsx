import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "../../ui/checkbox";
import type { EventItemComponentProps } from "./types";

/**
 * Individual event item with checkbox
 */
export const EventItemComponent = React.forwardRef<
  HTMLDivElement,
  EventItemComponentProps & React.HTMLAttributes<HTMLDivElement>
>(({ event, isSelected, onSelectionChange, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-start gap-3 py-2 pl-8 pr-4", className)}
      {...props}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onSelectionChange(checked === true)}
        aria-label={`Select ${event.name}`}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[#333333]">{event.name}</div>
        <div className="text-sm text-[#6B7280] mt-0.5 leading-relaxed">
          {event.description}
        </div>
      </div>
    </div>
  );
});
EventItemComponent.displayName = "EventItemComponent";
