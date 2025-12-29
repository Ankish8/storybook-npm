import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, X, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * MultiSelect trigger variants matching TextField styling
 */
const multiSelectTriggerVariants = cva(
  "flex min-h-10 w-full items-center justify-between rounded bg-semantic-bg-primary px-4 py-2 text-sm text-semantic-text-primary transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary/60 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export interface MultiSelectOption {
  /** The value of the option */
  value: string;
  /** The display label of the option */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
}

export interface MultiSelectProps extends VariantProps<
  typeof multiSelectTriggerVariants
> {
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
  /** Currently selected values (controlled) */
  value?: string[];
  /** Default values (uncontrolled) */
  defaultValue?: string[];
  /** Callback when values change */
  onValueChange?: (value: string[]) => void;
  /** Options to display */
  options: MultiSelectOption[];
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Maximum selections allowed */
  maxSelections?: number;
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
 * A multi-select component with tags, search, and validation states.
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   label="Skills"
 *   placeholder="Select skills"
 *   options={[
 *     { value: 'react', label: 'React' },
 *     { value: 'vue', label: 'Vue' },
 *     { value: 'angular', label: 'Angular' },
 *   ]}
 *   onValueChange={(values) => console.log(values)}
 * />
 * ```
 */
const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      label,
      required,
      helperText,
      error,
      disabled,
      loading,
      placeholder = "Select options",
      value,
      defaultValue = [],
      onValueChange,
      options,
      searchable,
      searchPlaceholder = "Search...",
      maxSelections,
      wrapperClassName,
      triggerClassName,
      labelClassName,
      state,
      id,
      name,
    },
    ref
  ) => {
    // Internal state for selected values (uncontrolled mode)
    const [internalValue, setInternalValue] =
      React.useState<string[]>(defaultValue);
    // Dropdown open state
    const [isOpen, setIsOpen] = React.useState(false);
    // Search query
    const [searchQuery, setSearchQuery] = React.useState("");

    // Container ref for click outside detection
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Determine if controlled
    const isControlled = value !== undefined;
    const selectedValues = isControlled ? value : internalValue;

    // Derive state from props
    const derivedState = error ? "error" : (state ?? "default");

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    // Filter options by search query
    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchQuery) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchable, searchQuery]);

    // Get selected option labels
    const selectedLabels = React.useMemo(() => {
      return selectedValues
        .map((v) => options.find((o) => o.value === v)?.label)
        .filter(Boolean) as string[];
    }, [selectedValues, options]);

    // Handle toggle selection
    const toggleOption = (optionValue: string) => {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : maxSelections && selectedValues.length >= maxSelections
          ? selectedValues
          : [...selectedValues, optionValue];

      if (!isControlled) {
        setInternalValue(newValues);
      }
      onValueChange?.(newValues);
    };

    // Handle remove tag
    const removeValue = (valueToRemove: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const newValues = selectedValues.filter((v) => v !== valueToRemove);
      if (!isControlled) {
        setInternalValue(newValues);
      }
      onValueChange?.(newValues);
    };

    // Handle clear all
    const clearAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isControlled) {
        setInternalValue([]);
      }
      onValueChange?.([]);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      } else if (e.key === "Enter" || e.key === " ") {
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn("flex flex-col gap-1 relative", wrapperClassName)}
      >
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

        {/* Trigger */}
        <button
          ref={ref}
          id={selectId}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          disabled={disabled || loading}
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={cn(
            multiSelectTriggerVariants({ state: derivedState }),
            "text-left gap-2",
            triggerClassName
          )}
        >
          <div className="flex-1 flex flex-wrap gap-1">
            {selectedValues.length === 0 ? (
              <span className="text-semantic-text-placeholder">
                {placeholder}
              </span>
            ) : (
              selectedLabels.map((label, index) => (
                <span
                  key={selectedValues[index]}
                  className="inline-flex items-center gap-1 bg-semantic-bg-ui text-semantic-text-primary text-xs px-2 py-0.5 rounded"
                >
                  {label}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => removeValue(selectedValues[index], e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        removeValue(
                          selectedValues[index],
                          e as unknown as React.MouseEvent
                        );
                      }
                    }}
                    className="cursor-pointer hover:text-semantic-error-primary focus:outline-none"
                    aria-label={`Remove ${label}`}
                  >
                    <X className="size-3" />
                  </span>
                </span>
              ))
            )}
          </div>
          <div className="flex items-center gap-1">
            {selectedValues.length > 0 && (
              <span
                role="button"
                tabIndex={0}
                onClick={clearAll}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    clearAll(e as unknown as React.MouseEvent);
                  }
                }}
                className="p-0.5 cursor-pointer hover:text-semantic-error-primary focus:outline-none"
                aria-label="Clear all"
              >
                <X className="size-4 text-semantic-text-muted" />
              </span>
            )}
            {loading ? (
              <Loader2 className="size-4 animate-spin text-semantic-text-muted" />
            ) : (
              <ChevronDown
                className={cn(
                  "size-4 text-semantic-text-muted transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            )}
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className={cn(
              "absolute z-50 mt-1 w-full rounded bg-semantic-bg-primary border border-semantic-border-layout shadow-md",
              "top-full"
            )}
            role="listbox"
            aria-multiselectable="true"
          >
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-semantic-border-layout">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 px-3 text-sm border border-semantic-border-input rounded bg-semantic-bg-primary placeholder:text-semantic-text-placeholder focus:outline-none focus:border-semantic-border-input-focus/50"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options */}
            <div className="max-h-60 overflow-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-semantic-text-muted">
                  No results found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isDisabled =
                    option.disabled ||
                    (!isSelected &&
                      maxSelections !== undefined &&
                      maxSelections > 0 &&
                      selectedValues.length >= maxSelections);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && toggleOption(option.value)}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-4 pr-8 text-sm text-semantic-text-primary outline-none",
                        "hover:bg-semantic-bg-ui focus:bg-semantic-bg-ui",
                        isSelected && "bg-semantic-bg-ui",
                        isDisabled && "pointer-events-none opacity-50"
                      )}
                    >
                      <span className="absolute right-2 flex size-4 items-center justify-center">
                        {isSelected && (
                          <Check className="size-4 text-semantic-brand" />
                        )}
                      </span>
                      {option.label}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with count */}
            {maxSelections && (
              <div className="p-2 border-t border-semantic-border-layout text-xs text-semantic-text-muted">
                {selectedValues.length} / {maxSelections} selected
              </div>
            )}
          </div>
        )}

        {/* Hidden input for form submission */}
        {name &&
          selectedValues.map((v) => (
            <input key={v} type="hidden" name={name} value={v} />
          ))}

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
MultiSelect.displayName = "MultiSelect";

export { MultiSelect, multiSelectTriggerVariants };
