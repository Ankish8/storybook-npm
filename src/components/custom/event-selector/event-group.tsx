import * as React from "react"
import { cn } from "@/lib/utils"
import { Checkbox, type CheckedState } from "../../ui/checkbox"
import {
  Collapsible,
  CollapsibleItem,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../ui/collapsible"
import { EventItemComponent } from "./event-item"
import type { EventGroupComponentProps } from "./types"

/**
 * Event group with collapsible section and group-level checkbox
 */
export const EventGroupComponent = React.forwardRef<
  HTMLDivElement,
  EventGroupComponentProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      group,
      events,
      selectedEvents,
      onSelectionChange,
      emptyGroupMessage = "No events available",
      renderEmptyGroup,
      className,
      ...props
    },
    ref
  ) => {
    // Calculate selection state for this group
    const groupEventIds = events.map((e) => e.id)
    const selectedInGroup = groupEventIds.filter((id) =>
      selectedEvents.includes(id)
    )
    const allSelected = groupEventIds.length > 0 && selectedInGroup.length === groupEventIds.length
    const someSelected = selectedInGroup.length > 0 && selectedInGroup.length < groupEventIds.length

    const checkboxState: CheckedState = allSelected
      ? true
      : someSelected
      ? "indeterminate"
      : false

    const selectedCount = selectedInGroup.length

    // Handle group checkbox click
    const handleGroupCheckbox = () => {
      if (allSelected) {
        // Deselect all events in this group
        onSelectionChange(selectedEvents.filter((id) => !groupEventIds.includes(id)))
      } else {
        // Select all events in this group
        const newSelection = [...selectedEvents]
        groupEventIds.forEach((id) => {
          if (!newSelection.includes(id)) {
            newSelection.push(id)
          }
        })
        onSelectionChange(newSelection)
      }
    }

    // Handle individual event selection
    const handleEventSelection = (eventId: string, selected: boolean) => {
      if (selected) {
        onSelectionChange([...selectedEvents, eventId])
      } else {
        onSelectionChange(selectedEvents.filter((id) => id !== eventId))
      }
    }

    return (
      <div
        ref={ref}
        className={cn("bg-[#F9FAFB] rounded-lg", className)}
        {...props}
      >
        <Collapsible type="multiple">
          <CollapsibleItem value={group.id}>
            <CollapsibleTrigger
              showChevron={true}
              className="w-full p-4 hover:bg-[#F3F4F6] rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  checked={checkboxState}
                  onCheckedChange={handleGroupCheckbox}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select all ${group.name}`}
                />
                <div className="flex flex-col items-start text-left flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {group.icon && (
                      <span className="text-[#6B7280]">{group.icon}</span>
                    )}
                    <span className="font-medium text-[#333333]">
                      {group.name}
                    </span>
                  </div>
                  <span className="text-sm text-[#6B7280] mt-0.5">
                    {group.description}
                  </span>
                </div>
                {selectedCount > 0 && (
                  <span className="text-sm text-[#6B7280] whitespace-nowrap">
                    {selectedCount} Selected
                  </span>
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-t border-[#E5E7EB]">
                {events.length > 0 ? (
                  events.map((event) => (
                    <EventItemComponent
                      key={event.id}
                      event={event}
                      isSelected={selectedEvents.includes(event.id)}
                      onSelectionChange={(selected) =>
                        handleEventSelection(event.id, selected)
                      }
                    />
                  ))
                ) : renderEmptyGroup ? (
                  <div className="py-4 px-8">
                    {renderEmptyGroup(group)}
                  </div>
                ) : (
                  <div className="py-4 px-8 text-sm text-[#6B7280] italic">
                    {emptyGroupMessage}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </CollapsibleItem>
        </Collapsible>
      </div>
    )
  }
)
EventGroupComponent.displayName = "EventGroupComponent"
