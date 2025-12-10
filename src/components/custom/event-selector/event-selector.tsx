import * as React from "react"
import { cn } from "@/lib/utils"
import { EventGroupComponent } from "./event-group"
import type { EventSelectorProps, EventCategory, EventGroup } from "./types"

/**
 * EventSelector - A component for selecting webhook events
 *
 * Install via CLI:
 * ```bash
 * npx myoperator-ui add event-selector
 * ```
 *
 * Or import directly from npm:
 * ```tsx
 * import { EventSelector } from "@myoperator/ui"
 * ```
 *
 * @example
 * ```tsx
 * <EventSelector
 *   events={events}
 *   groups={groups}
 *   selectedEvents={selected}
 *   onSelectionChange={setSelected}
 * />
 * ```
 */
export const EventSelector = React.forwardRef<HTMLDivElement, EventSelectorProps>(
  (
    {
      events,
      groups,
      categories,
      selectedEvents: controlledSelected,
      onSelectionChange,
      defaultSelectedEvents = [],
      title = "Events",
      description = "Select which events should trigger this webhook",
      emptyGroupMessage,
      renderEmptyGroup,
      className,
      ...props
    },
    ref
  ) => {
    // Controlled vs uncontrolled state
    const [internalSelected, setInternalSelected] = React.useState<string[]>(
      defaultSelectedEvents
    )

    const isControlled = controlledSelected !== undefined
    const selectedEvents = isControlled ? controlledSelected : internalSelected

    const handleSelectionChange = React.useCallback(
      (newSelection: string[]) => {
        if (!isControlled) {
          setInternalSelected(newSelection)
        }
        onSelectionChange?.(newSelection)
      },
      [isControlled, onSelectionChange]
    )

    // Get events for a specific group
    const getEventsForGroup = (groupId: string) => {
      return events.filter((event) => event.group === groupId)
    }

    // Get groups for a specific category
    const getGroupsForCategory = (category: EventCategory): EventGroup[] => {
      return category.groups
        .map((groupId) => groups.find((g) => g.id === groupId))
        .filter((g): g is EventGroup => g !== undefined)
    }

    // Calculate total selected count
    const totalSelected = selectedEvents.length

    // Render groups without categories
    const renderGroups = (groupsToRender: EventGroup[]) => {
      return groupsToRender.map((group) => (
        <EventGroupComponent
          key={group.id}
          group={group}
          events={getEventsForGroup(group.id)}
          selectedEvents={selectedEvents}
          onSelectionChange={handleSelectionChange}
          emptyGroupMessage={emptyGroupMessage}
          renderEmptyGroup={renderEmptyGroup}
        />
      ))
    }

    // Render categories with nested groups
    const renderCategories = () => {
      // Ensure categories is an array before using array methods
      if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return renderGroups(groups)
      }

      // Get groups that belong to categories
      const groupsInCategories = new Set(categories.flatMap((c) => c.groups))

      // Get orphan groups (not in any category)
      const orphanGroups = groups.filter((g) => !groupsInCategories.has(g.id))

      return (
        <>
          {categories.map((category) => {
            const categoryGroups = getGroupsForCategory(category)
            const categoryEventIds = categoryGroups.flatMap((g) =>
              getEventsForGroup(g.id).map((e) => e.id)
            )
            const selectedInCategory = categoryEventIds.filter((id) =>
              selectedEvents.includes(id)
            )

            return (
              <div
                key={category.id}
                className="border border-[#E5E7EB] rounded-lg overflow-hidden"
              >
                {/* Category Header - no checkbox, just label */}
                <div className="flex items-center justify-between p-4 bg-white border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    {category.icon && (
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F3F4F6]">
                        {category.icon}
                      </div>
                    )}
                    <span className="font-medium text-[#333333]">
                      {category.name}
                    </span>
                  </div>
                  {selectedInCategory.length > 0 && (
                    <span className="text-sm text-[#6B7280]">
                      {selectedInCategory.length} Selected
                    </span>
                  )}
                </div>
                {/* Category Groups */}
                <div className="divide-y divide-[#E5E7EB]">
                  {renderGroups(categoryGroups)}
                </div>
              </div>
            )
          })}
          {/* Render orphan groups outside categories */}
          {orphanGroups.length > 0 && renderGroups(orphanGroups)}
        </>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#333333]">{title}</h3>
            {description && (
              <p className="text-sm text-[#6B7280] mt-1">{description}</p>
            )}
          </div>
          <span className="text-sm font-medium text-[#333333]">
            {totalSelected} Selected
          </span>
        </div>

        {/* Groups */}
        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden divide-y divide-[#E5E7EB]">
          {renderCategories()}
        </div>
      </div>
    )
  }
)
EventSelector.displayName = "EventSelector"
