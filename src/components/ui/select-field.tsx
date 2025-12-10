import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select"

export interface SelectOption {
  /** The value of the option */
  value: string
  /** The display label of the option */
  label: string
  /** Whether the option is disabled */
  disabled?: boolean
  /** Group name for grouping options */
  group?: string
}

export interface SelectFieldProps {
  /** Label text displayed above the select */
  label?: string
  /** Shows red asterisk next to label when true */
  required?: boolean
  /** Helper text displayed below the select */
  helperText?: string
  /** Error message - shows error state with red styling */
  error?: string
  /** Disabled state */
  disabled?: boolean
  /** Loading state with spinner */
  loading?: boolean
  /** Placeholder text when no value selected */
  placeholder?: string
  /** Currently selected value (controlled) */
  value?: string
  /** Default value (uncontrolled) */
  defaultValue?: string
  /** Callback when value changes */
  onValueChange?: (value: string) => void
  /** Options to display */
  options: SelectOption[]
  /** Enable search/filter functionality */
  searchable?: boolean
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Additional class for wrapper */
  wrapperClassName?: string
  /** Additional class for trigger */
  triggerClassName?: string
  /** Additional class for label */
  labelClassName?: string
  /** ID for the select */
  id?: string
  /** Name attribute for form submission */
  name?: string
}

/**
 * A comprehensive select field component with label, icons, validation states, and more.
 *
 * @example
 * ```tsx
 * <SelectField
 *   label="Authentication"
 *   placeholder="Select authentication method"
 *   options={[
 *     { value: 'none', label: 'None' },
 *     { value: 'basic', label: 'Basic Auth' },
 *     { value: 'bearer', label: 'Bearer Token' },
 *   ]}
 *   required
 * />
 * ```
 */
const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(
  (
    {
      label,
      required,
      helperText,
      error,
      disabled,
      loading,
      placeholder = "Select an option",
      value,
      defaultValue,
      onValueChange,
      options,
      searchable,
      searchPlaceholder = "Search...",
      wrapperClassName,
      triggerClassName,
      labelClassName,
      id,
      name,
    },
    ref
  ) => {
    // Internal state for search
    const [searchQuery, setSearchQuery] = React.useState("")

    // Derive state from props
    const derivedState = error ? "error" : "default"

    // Generate unique IDs for accessibility
    const generatedId = React.useId()
    const selectId = id || generatedId
    const helperId = `${selectId}-helper`
    const errorId = `${selectId}-error`

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined

    // Group options by group property
    const groupedOptions = React.useMemo(() => {
      const groups: Record<string, SelectOption[]> = {}
      const ungrouped: SelectOption[] = []

      options.forEach((option) => {
        // Filter by search query if searchable
        if (searchable && searchQuery) {
          if (!option.label.toLowerCase().includes(searchQuery.toLowerCase())) {
            return
          }
        }

        if (option.group) {
          if (!groups[option.group]) {
            groups[option.group] = []
          }
          groups[option.group].push(option)
        } else {
          ungrouped.push(option)
        }
      })

      return { groups, ungrouped }
    }, [options, searchable, searchQuery])

    const hasGroups = Object.keys(groupedOptions.groups).length > 0

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    }

    // Reset search when dropdown closes
    const handleOpenChange = (open: boolean) => {
      if (!open) {
        setSearchQuery("")
      }
    }

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn("text-sm font-medium text-[#181D27]", labelClassName)}
          >
            {label}
            {required && <span className="text-[#F04438] ml-0.5">*</span>}
          </label>
        )}

        {/* Select */}
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled || loading}
          name={name}
          onOpenChange={handleOpenChange}
        >
          <SelectTrigger
            ref={ref}
            id={selectId}
            state={derivedState}
            className={cn(
              loading && "pr-10",
              triggerClassName
            )}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
          >
            <SelectValue placeholder={placeholder} />
            {loading && (
              <Loader2 className="absolute right-8 size-4 animate-spin text-[#717680]" />
            )}
          </SelectTrigger>
          <SelectContent>
            {/* Search input */}
            {searchable && (
              <div className="px-2 pb-2">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full h-8 px-3 text-sm border border-[#E9EAEB] rounded bg-white placeholder:text-[#A2A6B1] focus:outline-none focus:border-[#2BBCCA]/50"
                  // Prevent closing dropdown when clicking input
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Ungrouped options */}
            {groupedOptions.ungrouped.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}

            {/* Grouped options */}
            {hasGroups &&
              Object.entries(groupedOptions.groups).map(([groupName, groupOptions]) => (
                <SelectGroup key={groupName}>
                  <SelectLabel>{groupName}</SelectLabel>
                  {groupOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}

            {/* No results message */}
            {searchable &&
              searchQuery &&
              groupedOptions.ungrouped.length === 0 &&
              Object.keys(groupedOptions.groups).length === 0 && (
                <div className="py-6 text-center text-sm text-[#717680]">
                  No results found
                </div>
              )}
          </SelectContent>
        </Select>

        {/* Helper text / Error message */}
        {(error || helperText) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span id={errorId} className="text-xs text-[#F04438]">
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-xs text-[#717680]">
                {helperText}
              </span>
            ) : null}
          </div>
        )}
      </div>
    )
  }
)
SelectField.displayName = "SelectField"

export { SelectField }
