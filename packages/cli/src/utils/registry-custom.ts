// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run: npm run generate-registry
// Category: custom

import type { Registry } from './registry-types'

// Helper to check if a string looks like Tailwind CSS classes
function looksLikeTailwindClasses(str: string): boolean {
  // Skip empty strings
  if (!str || !str.trim()) return false

  // Skip obvious non-class values (common prop values)
  const nonClassValues = [
    'button', 'submit', 'reset', 'text', 'email', 'password', 'number', 'tel', 'url', 'search',
    'checkbox', 'radio', 'file', 'hidden', 'image', 'color', 'date', 'time', 'datetime-local',
    'default', 'error', 'warning', 'success', 'info', 'primary', 'secondary', 'tertiary',
    'destructive', 'outline', 'ghost', 'link', 'dashed', 'solid', 'none',
    'open', 'closed', 'true', 'false', 'null', 'undefined',
    'single', 'multiple', 'listbox', 'combobox', 'menu', 'menuitem', 'option', 'switch',
    'small', 'medium', 'large', 'sm', 'md', 'lg', 'xl', '2xl',
    'top', 'bottom', 'left', 'right', 'center', 'start', 'end',
    'horizontal', 'vertical', 'both', 'auto',
    'asc', 'desc', 'ascending', 'descending',
  ]
  if (nonClassValues.includes(str.toLowerCase())) return false

  // Skip displayName values (PascalCase component names)
  if (/^[A-Z][a-zA-Z]*$/.test(str)) return false

  // Skip strings that look like paths or imports
  if (str.startsWith('@') || str.startsWith('.') || str.startsWith('/') || str.includes('::')) return false

  // Skip npm package names - but NOT if they look like Tailwind utility classes
  // Tailwind utilities typically have patterns like: prefix-value (text-xs, bg-blue, p-4)
  const tailwindUtilityPrefixes = ['text', 'bg', 'p', 'm', 'px', 'py', 'mx', 'my', 'pt', 'pb', 'pl', 'pr', 'mt', 'mb', 'ml', 'mr', 'w', 'h', 'min', 'max', 'gap', 'space', 'border', 'rounded', 'shadow', 'opacity', 'font', 'leading', 'tracking', 'z', 'inset', 'top', 'bottom', 'left', 'right', 'flex', 'grid', 'col', 'row', 'justify', 'items', 'content', 'self', 'place', 'order', 'float', 'clear', 'object', 'overflow', 'overscroll', 'scroll', 'list', 'appearance', 'cursor', 'pointer', 'resize', 'select', 'fill', 'stroke', 'table', 'caption', 'transition', 'duration', 'ease', 'delay', 'animate', 'transform', 'origin', 'scale', 'rotate', 'translate', 'skew', 'accent', 'caret', 'outline', 'ring', 'blur', 'brightness', 'contrast', 'grayscale', 'hue', 'invert', 'saturate', 'sepia', 'backdrop', 'divide', 'sr', 'not', 'snap', 'touch', 'will', 'aspect', 'container', 'columns', 'break', 'box', 'isolation', 'mix', 'filter', 'drop', 'size']

  // Check if it looks like a Tailwind utility (prefix-value pattern) before npm check
  if (str.includes('-') && !str.includes(' ')) {
    const prefix = str.split('-')[0]
    if (tailwindUtilityPrefixes.includes(prefix)) {
      return true  // This is a Tailwind class, not npm package
    }
  }

  // Skip npm package names (but we already caught Tailwind utilities above)
  if (/^(@[a-z0-9-]+\/)?[a-z][a-z0-9-]*$/.test(str) && !str.includes(' ')) return false

  // Check if any word looks like a Tailwind class
  const words = str.split(/\s+/)
  return words.some(cls => {
    if (!cls) return false

    // Skip aria-* and data-* ONLY if they look like HTML attribute values (no [ or :)
    // Allow Tailwind variants like data-[state=open]:animate-in or aria-checked:bg-blue-500
    if ((cls.startsWith('aria-') || cls.startsWith('data-')) && !cls.includes('[') && !cls.includes(':')) return false

    // Single word utilities that are valid Tailwind classes
    const singleWordUtilities = /^(flex|grid|block|inline|contents|flow-root|hidden|invisible|visible|static|fixed|absolute|relative|sticky|isolate|isolation-auto|overflow-auto|overflow-hidden|overflow-clip|overflow-visible|overflow-scroll|overflow-x-auto|overflow-y-auto|overscroll-auto|overscroll-contain|overscroll-none|truncate|antialiased|subpixel-antialiased|italic|not-italic|underline|overline|line-through|no-underline|uppercase|lowercase|capitalize|normal-case|ordinal|slashed-zero|lining-nums|oldstyle-nums|proportional-nums|tabular-nums|diagonal-fractions|stacked-fractions|sr-only|not-sr-only|resize|resize-none|resize-x|resize-y|snap-start|snap-end|snap-center|snap-align-none|snap-normal|snap-always|touch-auto|touch-none|touch-pan-x|touch-pan-left|touch-pan-right|touch-pan-y|touch-pan-up|touch-pan-down|touch-pinch-zoom|touch-manipulation|select-none|select-text|select-all|select-auto|will-change-auto|will-change-scroll|will-change-contents|will-change-transform|grow|grow-0|shrink|shrink-0|transform|transform-cpu|transform-gpu|transform-none|transition|transition-none|transition-all|transition-colors|transition-opacity|transition-shadow|transition-transform|animate-none|animate-spin|animate-ping|animate-pulse|animate-bounce)$/
    if (singleWordUtilities.test(cls)) return true

    // Classes with hyphens are likely Tailwind (bg-*, text-*, p-*, m-*, etc.)
    if (cls.includes('-')) return true

    // Classes with arbitrary values like bg-[#343E55]
    if (cls.includes('[') && cls.includes(']')) return true

    // Classes with variant prefixes like hover:, focus:, sm:
    if (cls.includes(':')) return true

    return false
  })
}

// Helper to prefix a single class string
function prefixClassString(classString: string, prefix: string): string {
  return classString
    .split(' ')
    .map((cls: string) => {
      if (!cls) return cls

      // Skip aria-* and data-* ONLY if they look like HTML attribute values (no [ or :)
      // Allow Tailwind variants like data-[state=open]:animate-in or aria-checked:bg-blue-500
      if ((cls.startsWith('aria-') || cls.startsWith('data-')) && !cls.includes('[') && !cls.includes(':')) return cls

      // Handle variant prefixes like hover:, focus:, sm:, data-[state=open]:, aria-[checked]:, etc.
      const variantMatch = cls.match(/^(([a-z][a-z0-9]*(-[a-z0-9]+)*:)|((data|aria)-\[[^\]]+\]:))+/)
      if (variantMatch) {
        const variants = variantMatch[0]
        const utility = cls.slice(variants.length)
        if (!utility) return cls
        // Prefix the utility part, keep variants as-is
        if (utility.startsWith('-')) {
          return `${variants}-${prefix}${utility.slice(1)}`
        }
        return `${variants}${prefix}${utility}`
      }

      // Handle negative values like -mt-4
      if (cls.startsWith('-') && cls.length > 1) {
        return `-${prefix}${cls.slice(1)}`
      }

      // Handle arbitrary selector values like [&_svg]:pointer-events-none
      if (cls.startsWith('[&')) {
        const closeBracket = cls.indexOf(']:')
        if (closeBracket !== -1) {
          const selector = cls.slice(0, closeBracket + 2)
          const utility = cls.slice(closeBracket + 2)
          if (!utility) return cls
          return `${selector}${prefix}${utility}`
        }
        return cls
      }

      // Regular class (including arbitrary values like bg-[#343E55])
      return `${prefix}${cls}`
    })
    .join(' ')
}

// Context-aware Tailwind class prefixing
function prefixTailwindClasses(content: string, prefix: string): string {
  if (!prefix) return content

  // 1. Handle cva() base classes: cva("base classes here", ...)
  content = content.replace(
    /\bcva\s*\(\s*"([^"]*)"/g,
    (match: string, baseClasses: string) => {
      if (!looksLikeTailwindClasses(baseClasses)) return match
      const prefixed = prefixClassString(baseClasses, prefix)
      return match.replace(`"${baseClasses}"`, `"${prefixed}"`)
    }
  )

  // 2. Handle cn() function calls with nested parentheses support
  // Process cn() calls by finding them and properly matching closing parens
  let result = ''
  let lastIndex = 0
  const cnRegex = /\bcn\s*\(/g
  let cnMatch

  while ((cnMatch = cnRegex.exec(content)) !== null) {
    // Add everything before this cn(
    result += content.slice(lastIndex, cnMatch.index)

    // Find matching closing paren
    let depth = 1
    let i = cnMatch.index + cnMatch[0].length
    while (i < content.length && depth > 0) {
      if (content[i] === '(') depth++
      else if (content[i] === ')') depth--
      i++
    }

    const args = content.slice(cnMatch.index + cnMatch[0].length, i - 1)

    // Prefix class strings within the cn() arguments (both double and single quotes)
    let prefixedArgs = args.replace(
      /"([^"]*)"/g,
      (m: string, classes: string) => {
        if (!looksLikeTailwindClasses(classes)) return m
        const prefixed = prefixClassString(classes, prefix)
        return `"${prefixed}"`
      }
    )
    // Also handle single-quoted strings
    prefixedArgs = prefixedArgs.replace(
      /'([^']*)'/g,
      (m: string, classes: string) => {
        if (!looksLikeTailwindClasses(classes)) return m
        const prefixed = prefixClassString(classes, prefix)
        return `'${prefixed}'`
      }
    )

    result += `cn(${prefixedArgs})`
    lastIndex = i
  }
  result += content.slice(lastIndex)
  content = result

  // 3. Handle className="..." direct attributes
  content = content.replace(
    /className\s*=\s*"([^"]*)"/g,
    (match: string, classes: string) => {
      if (!looksLikeTailwindClasses(classes)) return match
      const prefixed = prefixClassString(classes, prefix)
      return `className="${prefixed}"`
    }
  )

  // 4. Handle variant values in cva config objects
  // Pattern: key: "class string" or key: 'class string' within variants/defaultVariants objects
  // Handles both unquoted keys (default:) and quoted keys ("icon-sm":)
  // But be careful not to match non-class string values
  // IMPORTANT: [^"\n]+ prevents matching across newlines to avoid greedy captures

  // Skip keys that are definitely not class values
  const nonClassKeys = ['name', 'description', 'displayName', 'type', 'role', 'id', 'htmlFor', 'for', 'placeholder', 'title', 'alt', 'src', 'href', 'target', 'rel', 'method', 'action', 'enctype', 'accept', 'pattern', 'autocomplete', 'value', 'defaultValue', 'label', 'text', 'message', 'helperText', 'ariaLabel', 'ariaDescribedBy']

  // Handle double-quoted values
  content = content.replace(
    /(\w+|"[^"]+"):\s*"([^"\n]+)"/g,
    (match: string, key: string, value: string) => {
      // Remove quotes from key if present for comparison
      const cleanKey = key.replace(/"/g, '')

      if (nonClassKeys.includes(cleanKey)) return match

      // Only prefix if the value looks like Tailwind classes
      if (!looksLikeTailwindClasses(value)) return match

      const prefixed = prefixClassString(value, prefix)
      return `${key}: "${prefixed}"`
    }
  )

  // Handle single-quoted values
  content = content.replace(
    /(\w+|'[^']+'):\s*'([^'\n]+)'/g,
    (match: string, key: string, value: string) => {
      // Remove quotes from key if present for comparison
      const cleanKey = key.replace(/'/g, '')

      if (nonClassKeys.includes(cleanKey)) return match

      // Only prefix if the value looks like Tailwind classes
      if (!looksLikeTailwindClasses(value)) return match

      const prefixed = prefixClassString(value, prefix)
      return `${key}: '${prefixed}'`
    }
  )

  // 5. Handle function calls with class string arguments
  // Recognizes patterns like: functionName("mt-3") or helperFunc("flex gap-2")
  // where the string argument looks like Tailwind classes

  // Function names that commonly receive class strings
  const classArgFunctions = [
    'renderExpandableActions',
    'getClassName',
    'getClasses',
    'classNames',
    'mergeClasses',
    'combineClasses',
  ]

  // Handle double-quoted function arguments
  const funcArgRegex = new RegExp(
    `\\b(${classArgFunctions.join('|')})\\s*\\(\\s*"([^"\\n]*)"`,
    'g'
  )
  content = content.replace(
    funcArgRegex,
    (match: string, funcName: string, classes: string) => {
      if (!looksLikeTailwindClasses(classes)) return match
      // Skip if already prefixed
      if (classes.includes(prefix)) return match
      const prefixed = prefixClassString(classes, prefix)
      return `${funcName}("${prefixed}"`
    }
  )

  // Handle single-quoted function arguments
  const funcArgRegexSingle = new RegExp(
    `\\b(${classArgFunctions.join('|')})\\s*\\(\\s*'([^'\\n]*)'`,
    'g'
  )
  content = content.replace(
    funcArgRegexSingle,
    (match: string, funcName: string, classes: string) => {
      if (!looksLikeTailwindClasses(classes)) return match
      // Skip if already prefixed
      if (classes.includes(prefix)) return match
      const prefixed = prefixClassString(classes, prefix)
      return `${funcName}('${prefixed}'`
    }
  )

  return content
}

export function getCustomRegistry(prefix: string = ''): Registry {
  return {
    'event-selector': {
      name: 'event-selector',
      description: 'A component for selecting webhook events with groups, categories, and tri-state checkboxes',
      dependencies: [
            "clsx",
            "tailwind-merge"
      ],
      internalDependencies: [
            "checkbox",
            "accordion"
      ],
      isMultiFile: true,
      directory: 'event-selector',
      mainFile: 'event-selector.tsx',
      files: [
        {
          name: 'event-selector.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cn } from "../../../lib/utils"
import { EventGroupComponent } from "./event-group"
import type { EventSelectorProps, EventCategory, EventGroup } from "./types"

/**
 * EventSelector - A component for selecting webhook events
 *
 * Install via CLI:
 * \`\`\`bash
 * npx myoperator-ui add event-selector
 * \`\`\`
 *
 * Or import directly from npm:
 * \`\`\`tsx
 * import { EventSelector } from "@myoperator/ui"
 * \`\`\`
 *
 * @example
 * \`\`\`tsx
 * <EventSelector
 *   events={events}
 *   groups={groups}
 *   selectedEvents={selected}
 *   onSelectionChange={setSelected}
 * />
 * \`\`\`
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
            <h3 className="m-0 text-base font-semibold text-[#333333]">{title}</h3>
            {description && (
              <p className="m-0 text-sm text-[#6B7280] mt-1">{description}</p>
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
`, prefix),
        },
        {
          name: 'event-group.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cn } from "../../../lib/utils"
import { Checkbox, type CheckedState } from "../checkbox"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion"
import { EventItemComponent } from "./event-item"
import type { EventGroupComponentProps } from "./types"

/**
 * Event group with accordion section and group-level checkbox
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

    // Single event in group: render as flat item (no accordion)
    if (events.length === 1) {
      const event = events[0]
      const isSelected = selectedEvents.includes(event.id)

      return (
        <div
          ref={ref}
          className={cn("bg-white p-4", className)}
          {...props}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) =>
                handleEventSelection(event.id, checked === true)
              }
              aria-label={\`Select \${event.name}\`}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-[#333333]">{event.name}</span>
              <p className="m-0 text-sm text-[#6B7280] mt-0.5">{event.description}</p>
            </div>
          </div>
        </div>
      )
    }

    // Multiple events: render as collapsible accordion
    return (
      <div
        ref={ref}
        className={cn("bg-white", className)}
        {...props}
      >
        <Accordion type="multiple">
          <AccordionItem value={group.id}>
            <AccordionTrigger
              showChevron={true}
              className="w-full p-4 hover:bg-[#F9FAFB]"
            >
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  checked={checkboxState}
                  onCheckedChange={handleGroupCheckbox}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={\`Select all \${group.name}\`}
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
            </AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  }
)
EventGroupComponent.displayName = "EventGroupComponent"
`, prefix),
        },
        {
          name: 'event-item.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { cn } from "../../../lib/utils"
import { Checkbox } from "../checkbox"
import type { EventItemComponentProps } from "./types"

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
      className={cn(
        "flex items-start gap-3 py-2 pl-8 pr-4",
        className
      )}
      {...props}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onSelectionChange(checked === true)}
        aria-label={\`Select \${event.name}\`}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[#333333]">{event.name}</div>
        <div className="text-sm text-[#6B7280] mt-0.5 leading-relaxed">
          {event.description}
        </div>
      </div>
    </div>
  )
})
EventItemComponent.displayName = "EventItemComponent"
`, prefix),
        },
        {
          name: 'types.ts',
          content: prefixTailwindClasses(`import * as React from "react"

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
`, prefix),
        }
      ],
    },
    'key-value-input': {
      name: 'key-value-input',
      description: 'A component for managing key-value pairs with validation and duplicate detection',
      dependencies: [
            "clsx",
            "tailwind-merge",
            "lucide-react"
      ],
      internalDependencies: [
            "button",
            "input"
      ],
      isMultiFile: true,
      directory: 'key-value-input',
      mainFile: 'key-value-input.tsx',
      files: [
        {
          name: 'key-value-input.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Button } from "../button"
import { KeyValueRow } from "./key-value-row"
import type { KeyValueInputProps, KeyValuePair } from "./types"

// Helper to generate unique IDs
const generateId = () =>
  \`kv-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`

/**
 * KeyValueInput - A component for managing key-value pairs
 *
 * Install via CLI:
 * \`\`\`bash
 * npx myoperator-ui add key-value-input
 * \`\`\`
 *
 * Or import directly from npm:
 * \`\`\`tsx
 * import { KeyValueInput } from "@myoperator/ui"
 * \`\`\`
 *
 * @example
 * \`\`\`tsx
 * <KeyValueInput
 *   title="HTTP Headers"
 *   description="Add custom headers for the webhook request"
 *   value={headers}
 *   onChange={setHeaders}
 * />
 * \`\`\`
 */
export const KeyValueInput = React.forwardRef<
  HTMLDivElement,
  KeyValueInputProps
>(
  (
    {
      title,
      description,
      addButtonText = "Add Header",
      maxItems = 10,
      keyPlaceholder = "Key",
      valuePlaceholder = "Value",
      keyLabel = "Key",
      valueLabel = "Value",
      value: controlledValue,
      onChange,
      defaultValue = [],
      className,
      ...props
    },
    ref
  ) => {
    // Controlled vs uncontrolled state
    const [internalPairs, setInternalPairs] =
      React.useState<KeyValuePair[]>(defaultValue)

    const isControlled = controlledValue !== undefined
    const pairs = isControlled ? controlledValue : internalPairs

    // Track which keys have been touched for validation
    const [touchedKeys, setTouchedKeys] = React.useState<Set<string>>(new Set())

    const handlePairsChange = React.useCallback(
      (newPairs: KeyValuePair[]) => {
        if (!isControlled) {
          setInternalPairs(newPairs)
        }
        onChange?.(newPairs)
      },
      [isControlled, onChange]
    )

    // Check for duplicate keys (case-insensitive)
    const getDuplicateKeys = React.useCallback((): Set<string> => {
      const keyCount = new Map<string, number>()
      pairs.forEach((pair) => {
        if (pair.key.trim()) {
          const key = pair.key.toLowerCase()
          keyCount.set(key, (keyCount.get(key) || 0) + 1)
        }
      })
      const duplicates = new Set<string>()
      keyCount.forEach((count, key) => {
        if (count > 1) duplicates.add(key)
      })
      return duplicates
    }, [pairs])

    const duplicateKeys = getDuplicateKeys()

    // Add new row
    const handleAdd = () => {
      if (pairs.length >= maxItems) return
      const newPair: KeyValuePair = {
        id: generateId(),
        key: "",
        value: "",
      }
      handlePairsChange([...pairs, newPair])
    }

    // Update key
    const handleKeyChange = (id: string, key: string) => {
      handlePairsChange(
        pairs.map((pair) => (pair.id === id ? { ...pair, key } : pair))
      )
      setTouchedKeys((prev) => new Set(prev).add(id))
    }

    // Update value
    const handleValueChange = (id: string, value: string) => {
      handlePairsChange(
        pairs.map((pair) => (pair.id === id ? { ...pair, value } : pair))
      )
    }

    // Delete row
    const handleDelete = (id: string) => {
      handlePairsChange(pairs.filter((pair) => pair.id !== id))
      setTouchedKeys((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }

    const isAtLimit = pairs.length >= maxItems
    const addButtonTitle = isAtLimit
      ? \`Maximum of \${maxItems} items allowed\`
      : undefined

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {/* Header */}
        <div className="mb-3">
          <h3 className="m-0 text-base font-semibold text-[#333333]">{title}</h3>
          {description && (
            <p className="m-0 text-sm text-[#6B7280] mt-1">{description}</p>
          )}
        </div>

        {/* Content Container with Background - only show when there are items */}
        {pairs.length > 0 && (
          <div className="bg-[#F9FAFB] rounded-lg p-4 mb-4">
            {/* Column Headers */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <span className="text-sm font-medium text-[#333333]">
                  {keyLabel}
                  <span className="text-[#FF3B3B] ml-0.5">*</span>
                </span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-[#333333]">
                  {valueLabel}
                </span>
              </div>
              {/* Spacer for delete button column */}
              <div className="w-8 flex-shrink-0" />
            </div>

            {/* Rows */}
            <div className="space-y-3">
              {pairs.map((pair) => (
                <KeyValueRow
                  key={pair.id}
                  pair={pair}
                  isDuplicateKey={duplicateKeys.has(pair.key.toLowerCase())}
                  isKeyEmpty={touchedKeys.has(pair.id) && !pair.key.trim()}
                  keyPlaceholder={keyPlaceholder}
                  valuePlaceholder={valuePlaceholder}
                  onKeyChange={handleKeyChange}
                  onValueChange={handleValueChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Button using dashed variant - outside the gray container */}
        <Button
          type="button"
          variant="dashed"
          onClick={handleAdd}
          disabled={isAtLimit}
          title={addButtonTitle}
          className="w-full justify-center"
        >
          <Plus className="h-4 w-4" />
          {addButtonText}
        </Button>

        {/* Limit indicator */}
        {isAtLimit && (
          <p className="m-0 text-xs text-[#6B7280] mt-2 text-center">
            Maximum of {maxItems} items reached
          </p>
        )}
      </div>
    )
  }
)
KeyValueInput.displayName = "KeyValueInput"
`, prefix),
        },
        {
          name: 'key-value-row.tsx',
          content: prefixTailwindClasses(`import * as React from "react"
import { Trash2 } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Input } from "../input"
import { Button } from "../button"
import type { KeyValueRowProps } from "./types"

/**
 * Individual key-value pair row with inputs and delete button
 */
export const KeyValueRow = React.forwardRef<
  HTMLDivElement,
  KeyValueRowProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      pair,
      isDuplicateKey,
      isKeyEmpty,
      keyPlaceholder = "Key",
      valuePlaceholder = "Value",
      onKeyChange,
      onValueChange,
      onDelete,
      className,
      ...props
    },
    ref
  ) => {
    // Determine if key input should show error state
    const keyHasError = isDuplicateKey || isKeyEmpty

    // Determine error message
    const errorMessage = isDuplicateKey
      ? "Duplicate key"
      : isKeyEmpty
      ? "Key is required"
      : null

    return (
      <div
        ref={ref}
        className={cn("flex items-start gap-3", className)}
        {...props}
      >
        {/* Key Input */}
        <div className="flex-1">
          <Input
            value={pair.key}
            onChange={(e) => onKeyChange(pair.id, e.target.value)}
            placeholder={keyPlaceholder}
            state={keyHasError ? "error" : "default"}
            aria-label="Key"
          />
          {errorMessage && (
            <span className="text-xs text-[#FF3B3B] mt-1 block">
              {errorMessage}
            </span>
          )}
        </div>

        {/* Value Input */}
        <div className="flex-1">
          <Input
            value={pair.value}
            onChange={(e) => onValueChange(pair.id, e.target.value)}
            placeholder={valuePlaceholder}
            aria-label="Value"
          />
        </div>

        {/* Delete Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(pair.id)}
          className="text-gray-400 hover:text-[#EF4444] hover:bg-[#FEF2F2] flex-shrink-0"
          aria-label="Delete row"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }
)
KeyValueRow.displayName = "KeyValueRow"
`, prefix),
        },
        {
          name: 'types.ts',
          content: prefixTailwindClasses(`/**
 * Represents a single key-value pair
 */
export interface KeyValuePair {
  /** Unique identifier for the pair */
  id: string
  /** The key (e.g., header name) */
  key: string
  /** The value (e.g., header value) */
  value: string
}

/**
 * Props for the KeyValueInput component
 */
export interface KeyValueInputProps {
  // Customization
  /** Title displayed at the top (e.g., "HTTP Headers") */
  title: string
  /** Description displayed below the title */
  description?: string
  /** Text for the add button (default: "Add Header") */
  addButtonText?: string
  /** Maximum number of items allowed (default: 10) */
  maxItems?: number
  /** Placeholder for key input */
  keyPlaceholder?: string
  /** Placeholder for value input */
  valuePlaceholder?: string
  /** Label for key column header (default: "Key") */
  keyLabel?: string
  /** Label for value column header (default: "Value") */
  valueLabel?: string

  // State (controlled mode)
  /** Array of key-value pairs (controlled) */
  value?: KeyValuePair[]
  /** Callback when pairs change */
  onChange?: (pairs: KeyValuePair[]) => void

  // State (uncontrolled mode)
  /** Default key-value pairs for uncontrolled usage */
  defaultValue?: KeyValuePair[]

  // Styling
  /** Additional CSS classes for the root element */
  className?: string
}

/**
 * Internal props for KeyValueRow component
 */
export interface KeyValueRowProps {
  /** The key-value pair data */
  pair: KeyValuePair
  /** Whether the key is a duplicate */
  isDuplicateKey: boolean
  /** Whether key is empty (for validation) */
  isKeyEmpty: boolean
  /** Placeholder for key input */
  keyPlaceholder?: string
  /** Placeholder for value input */
  valuePlaceholder?: string
  /** Callback when key changes */
  onKeyChange: (id: string, key: string) => void
  /** Callback when value changes */
  onValueChange: (id: string, value: string) => void
  /** Callback when row is deleted */
  onDelete: (id: string) => void
}
`, prefix),
        }
      ],
    }
  }
}
