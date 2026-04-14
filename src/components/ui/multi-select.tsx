import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, X, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

/**
 * Single selectable row (similar to legacy OptionType — different name).
 * Selection state is driven by `value` / `onValueChange`, not by a prop.
 */
export interface MultiSelectChoice {
  value: string;
  label: string;
  /** Secondary line (e.g. “Assigned to …”) — alias of `secondaryText` on `MultiSelectOption` */
  caption?: string;
  /** Disabled row — alias of `disabled` */
  isDisabled?: boolean;
  /** Tooltip on disabled row — alias of `disabledTooltip` */
  overlayMsg?: string;
  isDeleted?: boolean;
  isLast?: boolean;
}

/**
 * Grouped options (similar to legacy GroupBase — different name).
 */
export interface MultiSelectGroupedSection<
  T extends MultiSelectChoice = MultiSelectChoice,
> {
  readonly label?: string;
  readonly options: readonly T[];
}

/** Flat list or grouped sections */
export type MultiSelectOptionInput =
  | MultiSelectOption[]
  | readonly MultiSelectGroupedSection[];

/**
 * Normalized option: supports both `caption` / `isDisabled` / `overlayMsg` and
 * `secondaryText` / `disabled` / `disabledTooltip`.
 */
export interface MultiSelectOption extends MultiSelectChoice {
  secondaryText?: string;
  disabled?: boolean;
  disabledTooltip?: string;
  group?: string;
}

/**
 * Use when typing **object literals** for fixtures, stories, or tests so TypeScript applies
 * [excess property checking](https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks)
 * (catches typos like `captoin` and mistaken duplicate keys).
 *
 * This omits `secondaryText`; use `caption` for the secondary line — runtime code still accepts
 * both via {@link normalizeMultiSelectOption}. Widen to {@link MultiSelectOption} where a
 * consumer expects both aliases.
 */
export type MultiSelectOptionAuthoring = Omit<MultiSelectOption, "secondaryText">;

function isGroupedSections(
  input: MultiSelectOptionInput
): input is readonly MultiSelectGroupedSection[] {
  if (!Array.isArray(input) || input.length === 0) return false;
  return input.every(
    (item) =>
      item !== null &&
      typeof item === "object" &&
      "options" in item &&
      Array.isArray((item as MultiSelectGroupedSection).options)
  );
}

export function normalizeMultiSelectOption(
  o: MultiSelectOption | MultiSelectChoice
): MultiSelectOption {
  const merged = { ...(o as MultiSelectOption) };
  merged.disabled = merged.disabled ?? merged.isDisabled ?? false;
  merged.secondaryText = merged.secondaryText ?? merged.caption;
  merged.disabledTooltip = merged.disabledTooltip ?? merged.overlayMsg;
  return merged;
}

export function flattenMultiSelectOptions(
  input: MultiSelectOptionInput
): MultiSelectOption[] {
  if (!input?.length) return [];
  if (isGroupedSections(input)) {
    const out: MultiSelectOption[] = [];
    for (const section of input) {
      const groupLabel = section.label ?? "";
      for (const raw of section.options) {
        const n = normalizeMultiSelectOption(raw as MultiSelectOption);
        out.push({
          ...n,
          group: n.group ?? groupLabel,
        });
      }
    }
    return out;
  }
  return (input as MultiSelectOption[]).map(normalizeMultiSelectOption);
}

/**
 * MultiSelect trigger variants matching TextField styling
 */
const multiSelectTriggerVariants = cva(
  "flex min-h-[42px] w-full items-center justify-between rounded bg-semantic-bg-primary px-4 py-2 text-base text-semantic-text-primary transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input focus:outline-none focus:border-semantic-border-input-focus/50 focus:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-solid border-semantic-error-primary/40 focus:outline-none focus:border-semantic-error-primary/60 focus:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

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
  /** Flat options or grouped sections (`MultiSelectGroupedSection[]`) */
  options: MultiSelectOptionInput;
  /**
   * When false (default), the list only closes on outside click (not Escape).
   * Set true to also close on Escape.
   */
  closeOnEscape?: boolean;
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Maximum selections allowed */
  maxSelections?: number;
  /**
   * When `maxSelections` is set, a footer shows the count (e.g. "3 / 5 selected").
   * Set to false to hide that footer while still enforcing the limit.
   * @default true
   */
  showSelectionFooter?: boolean;
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
  /**
   * simple: checkmark on the right (default).
   * detailed: checkbox + primary + optional secondary text (Figma / WhatsApp-style rows).
   */
  optionVariant?: "simple" | "detailed";
  /** When true, selected options appear first with a divider before the rest */
  separateSelectedWithDivider?: boolean;
  /** Show the clear-all control in the trigger (hidden in compact / Figma-style triggers) */
  showClearAll?: boolean;
  /** Vertical rule before the chevron (Figma-style trigger) */
  showSeparatorBeforeChevron?: boolean;
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
const MultiSelect = React.forwardRef(
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
      showSelectionFooter = true,
      wrapperClassName,
      triggerClassName,
      labelClassName,
      state,
      id,
      name,
      optionVariant = "simple",
      separateSelectedWithDivider = false,
      showClearAll = true,
      showSeparatorBeforeChevron = false,
      closeOnEscape = false,
    }: MultiSelectProps,
    ref: React.Ref<HTMLButtonElement>
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

    const flatOptions = React.useMemo(
      () => flattenMultiSelectOptions(options),
      [options]
    );

    // Determine if controlled
    const isControlled = value !== undefined;
    const selectedValues = isControlled ? value : internalValue;

    // Derive state from props
    const derivedState = error ? "error" : (state ?? "default");

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const listboxId = `${selectId}-listbox`;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    // Determine aria-describedby
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    // Filter options by search query
    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchQuery.trim()) return flatOptions;
      const q = searchQuery.toLowerCase();
      return flatOptions.filter((option) => {
        const secondary = option.secondaryText ?? "";
        return (
          option.label.toLowerCase().includes(q) ||
          secondary.toLowerCase().includes(q) ||
          (option.group?.toLowerCase().includes(q) ?? false)
        );
      });
    }, [flatOptions, searchable, searchQuery]);

    type DisplayItem =
      | { type: "option"; option: MultiSelectOption }
      | { type: "divider" }
      | { type: "header"; label: string };

    const hasGroupedOptions = flatOptions.some(
      (o) => o.group !== undefined && o.group !== ""
    );

    const displayItems = React.useMemo((): DisplayItem[] => {
      const filtered = filteredOptions;

      if (separateSelectedWithDivider) {
        const selected = filtered.filter((o) =>
          selectedValues.includes(o.value)
        );
        const unselected = filtered.filter(
          (o) => !selectedValues.includes(o.value)
        );
        const items: DisplayItem[] = selected.map((o) => ({
          type: "option",
          option: o,
        }));
        if (selected.length > 0 && unselected.length > 0) {
          items.push({ type: "divider" });
        }
        items.push(
          ...unselected.map((o) => ({ type: "option" as const, option: o }))
        );
        return items;
      }

      if (hasGroupedOptions) {
        const order: string[] = [];
        const byGroup = new Map<string, MultiSelectOption[]>();
        for (const o of filtered) {
          const g = o.group ?? "";
          if (!byGroup.has(g)) {
            byGroup.set(g, []);
            order.push(g);
          }
          byGroup.get(g)!.push(o);
        }
        const items: DisplayItem[] = [];
        for (const g of order) {
          if (g) {
            items.push({ type: "header", label: g });
          }
          for (const o of byGroup.get(g)!) {
            items.push({ type: "option", option: o });
          }
        }
        return items;
      }

      return filtered.map((o) => ({ type: "option" as const, option: o }));
    }, [
      filteredOptions,
      hasGroupedOptions,
      separateSelectedWithDivider,
      selectedValues,
    ]);

    // Get selected option labels
    const selectedLabels = React.useMemo(() => {
      return selectedValues
        .map((v) => flatOptions.find((o) => o.value === v)?.label)
        .filter(Boolean) as string[];
    }, [selectedValues, flatOptions]);

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
      if (e.key === "Escape" && closeOnEscape) {
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
        className={cn("flex flex-col gap-1", wrapperClassName)}
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

        {/* Trigger + helper/error + listbox share one positioning context so the
            menu opens directly under the field (and under helper text when present). */}
        <div className="relative w-full min-w-0 flex flex-col gap-1">
          {/* Trigger */}
          <button
            ref={ref}
            id={selectId}
            type="button"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
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
          <div className="flex items-center gap-2 shrink-0">
            {showClearAll && selectedValues.length > 0 && (
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
            {showSeparatorBeforeChevron && (
              <div
                className="w-px h-5 self-center border-l border-solid border-semantic-border-layout shrink-0"
                aria-hidden
              />
            )}
            {loading ? (
              <Loader2 className="size-4 animate-spin text-semantic-text-muted" />
            ) : (
              <ChevronDown
                className={cn(
                  "size-4 text-semantic-text-muted transition-transform shrink-0",
                  isOpen && "rotate-180"
                )}
              />
            )}
          </div>
        </button>

          {/* Helper / error sits between trigger and dropdown (normal flow), matching Figma */}
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
                <span
                  id={helperId}
                  className="text-xs text-semantic-text-muted"
                >
                  {helperText}
                </span>
              ) : null}
            </div>
          )}

          {/* Dropdown */}
          {isOpen && (
            <TooltipProvider delayDuration={200}>
              <div
                id={listboxId}
                className={cn(
                  "absolute left-0 right-0 z-[100] mt-1 w-full rounded bg-semantic-bg-primary border border-solid border-semantic-border-layout shadow-md",
                  "top-full"
                )}
                role="listbox"
                aria-multiselectable="true"
              >
              {/* Search input */}
              {searchable && (
                <div className="p-2 border-b border-solid border-semantic-border-layout">
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 px-3 text-sm border border-solid border-semantic-border-input rounded bg-semantic-bg-primary placeholder:text-semantic-text-placeholder focus:outline-none focus:border-semantic-border-input-focus/50"
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
                  displayItems.map((item, itemIndex) => {
                    if (item.type === "divider") {
                      return (
                        <div
                          key={`divider-${itemIndex}`}
                          role="separator"
                          className="my-1 h-px bg-semantic-border-layout"
                        />
                      );
                    }
                    if (item.type === "header") {
                      return (
                        <div
                          key={`header-${item.label}-${itemIndex}`}
                          className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-semantic-text-muted"
                        >
                          {item.label}
                        </div>
                      );
                    }

                    const option = item.option;
                    const isSelected = selectedValues.includes(option.value);
                    const isMaxedOut =
                      !isSelected &&
                      maxSelections !== undefined &&
                      maxSelections > 0 &&
                      selectedValues.length >= maxSelections;
                    const isDisabled =
                      Boolean(option.disabled) || isMaxedOut;
                    const secondaryLine = option.secondaryText ?? option.caption;

                    const rowClass = cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm text-left text-semantic-text-primary outline-none",
                      optionVariant === "detailed"
                        ? "gap-2 px-2 py-2 text-sm"
                        : "py-2 pl-4 pr-8 text-base",
                      !isSelected &&
                        "hover:bg-semantic-bg-ui focus:bg-semantic-bg-ui",
                      isDisabled && "opacity-50 cursor-not-allowed",
                      option.isDeleted && "line-through opacity-70"
                    );

                    const simpleRow = (
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        disabled={isDisabled}
                        onClick={() =>
                          !isDisabled && toggleOption(option.value)
                        }
                        className={rowClass}
                      >
                        <span className="absolute right-2 flex size-4 items-center justify-center">
                          {isSelected && (
                            <Check className="size-4 text-semantic-brand" />
                          )}
                        </span>
                        {option.label}
                      </button>
                    );

                    const detailedRow = (
                      <div
                        role="option"
                        tabIndex={isDisabled ? -1 : 0}
                        aria-selected={isSelected}
                        aria-disabled={isDisabled}
                        data-disabled={isDisabled ? "" : undefined}
                        onClick={() =>
                          !isDisabled && toggleOption(option.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (!isDisabled) toggleOption(option.value);
                          }
                        }}
                        className={rowClass}
                      >
                        <Checkbox
                          checked={isSelected}
                          disabled={isDisabled}
                          size="sm"
                          className="pointer-events-none shrink-0"
                          aria-hidden
                          tabIndex={-1}
                        />
                        <span className="min-w-0 flex-1 truncate text-left">
                          {option.label}
                        </span>
                        {secondaryLine ? (
                          <span className="shrink-0 max-w-[55%] truncate text-right text-xs text-semantic-text-muted">
                            {secondaryLine}
                          </span>
                        ) : null}
                      </div>
                    );

                    const overlayCopy =
                      option.disabledTooltip ?? option.overlayMsg;

                    const withDisabledTooltip = (node: React.ReactElement) =>
                      isDisabled && overlayCopy ? (
                        <Tooltip key={option.value}>
                          <TooltipTrigger asChild>
                            <span className="block w-full cursor-default">
                              {node}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-xs bg-semantic-primary text-semantic-text-inverted border-semantic-primary"
                          >
                            {overlayCopy}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <React.Fragment key={option.value}>
                          {node}
                        </React.Fragment>
                      );

                    if (optionVariant === "detailed") {
                      return withDisabledTooltip(detailedRow);
                    }

                    return withDisabledTooltip(simpleRow);
                  })
                )}
              </div>

              {/* Footer with count */}
              {maxSelections && showSelectionFooter ? (
                <div className="p-2 border-t border-solid border-semantic-border-layout text-xs text-semantic-text-muted">
                  {selectedValues.length} / {maxSelections} selected
                </div>
              ) : null}
              </div>
            </TooltipProvider>
          )}
        </div>

        {/* Hidden input for form submission */}
        {name &&
          selectedValues.map((v) => (
            <input key={v} type="hidden" name={name} value={v} />
          ))}
      </div>
    );
  }
);
MultiSelect.displayName = "MultiSelect";

export { MultiSelect, multiSelectTriggerVariants };
