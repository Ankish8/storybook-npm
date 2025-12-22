import * as React from "react"

/**
 * Represents an individual event item
 */
export interface EventItem {
  /** Unique identifier for the event */
  id: string
  /** Display name of the event (e.g., "Call.Initiated") */
  name: string
  /** Description of when this event is triggered */
  description: string
  /** Group ID this event belongs to */
  group: string
}

/**
 * Represents a group of events
 */
export interface EventGroup {
  /** Unique identifier for the group */
  id: string
  /** Display name of the group (e.g., "In-Call Events") */
  name: string
  /** Description of the group */
  description: string
  /** Optional icon to display next to the group name */
  icon?: React.ReactNode
}

/**
 * Optional top-level category that can contain multiple groups
 */
export interface EventCategory {
  /** Unique identifier for the category */
  id: string
  /** Display name of the category (e.g., "Call Events (Voice)") */
  name: string
  /** Optional icon to display next to the category name */
  icon?: React.ReactNode
  /** Array of group IDs that belong to this category */
  groups: string[]
}

/**
 * Props for the EventSelector component
 */
export interface EventSelectorProps {
  // Data
  /** Array of event items */
  events: EventItem[]
  /** Array of event groups */
  groups: EventGroup[]
  /** Optional array of categories for top-level grouping */
  categories?: EventCategory[]

  // State (controlled mode)
  /** Array of selected event IDs (controlled) */
  selectedEvents?: string[]
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void

  // State (uncontrolled mode)
  /** Default selected events for uncontrolled usage */
  defaultSelectedEvents?: string[]

  // Customization
  /** Title displayed at the top (default: "Events") */
  title?: string
  /** Description displayed below the title */
  description?: string
  /** Message shown when a group has no events */
  emptyGroupMessage?: string
  /** Custom render function for empty group state (overrides emptyGroupMessage) */
  renderEmptyGroup?: (group: EventGroup) => React.ReactNode

  // Styling
  /** Additional CSS classes for the root element */
  className?: string
}

/**
 * Internal props for EventGroup component
 */
export interface EventGroupComponentProps {
  /** The group data */
  group: EventGroup
  /** Events that belong to this group */
  events: EventItem[]
  /** Currently selected event IDs */
  selectedEvents: string[]
  /** Callback to update selected events */
  onSelectionChange: (selectedIds: string[]) => void
  /** Message shown when group has no events */
  emptyGroupMessage?: string
  /** Custom render function for empty group state */
  renderEmptyGroup?: (group: EventGroup) => React.ReactNode
  /** Whether the accordion should be expanded by default (default: false) */
  defaultExpanded?: boolean
}

/**
 * Internal props for EventItem component
 */
export interface EventItemComponentProps {
  /** The event data */
  event: EventItem
  /** Whether this event is selected */
  isSelected: boolean
  /** Callback when selection changes */
  onSelectionChange: (selected: boolean) => void
}
