import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface SelectOption {
  /** The value of the option */
  value: string;
  /** The display label of the option */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Group name for grouping options */
  group?: string;
}

export interface SelectFieldProps {
  /** Label text displayed above the select */
  label?: string;
  /** Shows red asterisk next to label when true */
  required?: boolean;
  /** Helper text displayed below the select */
  helperText?: string;
  /** Error message - shows error state with red styling */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state with spinner */
  loading?: boolean;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Currently selected value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Callback when an option is selected, provides the full option object */
  onSelect?: (option: SelectOption) => void;
  /**
   * Intercept a value change before it commits. Return `false` to prevent
   * `onValueChange` from firing (only `onSelect` will fire). Useful for
   * "action" items like "Add custom date" that should open a modal instead
   * of committing a value. Requires controlled mode (`value` prop) to
   * visually revert the selection.
   */
  interceptValue?: (value: string) => boolean;
  /** Options to display */
  options: SelectOption[];
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Additional class for wrapper */
  wrapperClassName?: string;
  /** Additional class for trigger */
  triggerClassName?: string;
  /** Additional class for label */
  labelClassName?: string;
  /** ID for the select */
  id?: string;
  /** Name attribute for form submission */
  name?: string;
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
      onSelect,
      interceptValue,
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
    const [searchQuery, setSearchQuery] = React.useState("");

    // Combined value change handler that also fires onSelect with full option object.
    // When interceptValue returns false, onValueChange is skipped (only onSelect fires).
    const handleValueChange = React.useCallback(
      (newValue: string) => {
        const intercepted = interceptValue?.(newValue) === false;

        if (!intercepted) {
          onValueChange?.(newValue);
        }

        if (onSelect) {
          const option = options.find((o) => o.value === newValue);
          if (option) {
            onSelect(option);
          }
        }
      },
      [onValueChange, onSelect, interceptValue, options]
    );

    // Support re-selection: fire onSelect when clicking the already-selected
    // item. Radix only fires onValueChange for *new* values, so without this
    // clicking an action item like "Add custom date" a second time would be a
    // no-op.
    const handleItemClick = React.useCallback(
      (option: SelectOption) => {
        if (option.value === value) {
          handleValueChange(option.value);
        }
      },
      [value, handleValueChange]
    );

    // Derive state from props
    const derivedState = error ? "error" : "default";

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    // Group options by group property
    const groupedOptions = React.useMemo(() => {
      const groups: Record<string, SelectOption[]> = {};
      const ungrouped: SelectOption[] = [];

      options.forEach((option) => {
        // Filter by search query if searchable
        if (searchable && searchQuery) {
          if (!option.label.toLowerCase().includes(searchQuery.toLowerCase())) {
            return;
          }
        }

        if (option.group) {
          if (!groups[option.group]) {
            groups[option.group] = [];
          }
          groups[option.group].push(option);
        } else {
          ungrouped.push(option);
        }
      });

      return { groups, ungrouped };
    }, [options, searchable, searchQuery]);

    const hasGroups = Object.keys(groupedOptions.groups).length > 0;

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };

    // Reset search when dropdown closes
    const handleOpenChange = (open: boolean) => {
      if (!open) {
        setSearchQuery("");
      }
    };

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "text-xs font-normal text-semantic-text-muted",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-semantic-error-primary ml-0.5">*</span>
            )}
          </label>
        )}

        {/* Select */}
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          disabled={disabled || loading}
          name={name}
          onOpenChange={handleOpenChange}
        >
          <SelectTrigger
            ref={ref}
            id={selectId}
            state={derivedState}
            className={cn(loading && "pr-10", triggerClassName)}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
          >
            <SelectValue placeholder={placeholder} />
            {loading && (
              <Loader2 className="absolute right-8 size-4 animate-spin text-semantic-text-muted" />
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
                  className="w-full h-8 px-3 text-sm border border-semantic-border-input rounded bg-semantic-bg-primary placeholder:text-semantic-text-placeholder focus:outline-none focus:border-semantic-border-input-focus/50"
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
                onPointerUp={() => handleItemClick(option)}
              >
                {option.label}
              </SelectItem>
            ))}

            {/* Grouped options */}
            {hasGroups &&
              Object.entries(groupedOptions.groups).map(
                ([groupName, groupOptions]) => (
                  <SelectGroup key={groupName}>
                    <SelectLabel>{groupName}</SelectLabel>
                    {groupOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        onPointerUp={() => handleItemClick(option)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )
              )}

            {/* No results message */}
            {searchable &&
              searchQuery &&
              groupedOptions.ungrouped.length === 0 &&
              Object.keys(groupedOptions.groups).length === 0 && (
                <div className="py-6 text-center text-sm text-semantic-text-muted">
                  No results found
                </div>
              )}
          </SelectContent>
        </Select>

        {/* Helper text / Error message */}
        {(error || helperText) && (
          <div className="flex justify-between items-start gap-2">
            {error ? (
              <span
                id={errorId}
                className="text-xs text-semantic-error-primary"
              >
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-xs text-semantic-text-muted">
                {helperText}
              </span>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

export { SelectField };
