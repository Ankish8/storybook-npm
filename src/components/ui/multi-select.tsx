import * as React from "react";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, CircleAlert, Loader2, X } from "lucide-react";

import { cn } from "../../lib/utils";
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
  "tw-flex tw-min-h-[42px] tw-w-full tw-items-center tw-justify-between tw-rounded tw-bg-[var(--semantic-bg-primary,#FFFFFF)] tw-px-4 tw-py-2 tw-text-base tw-text-[var(--semantic-text-primary,#181D27)] tw-transition-all disabled:tw-cursor-not-allowed disabled:tw-opacity-50 disabled:tw-bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default: "tw-border tw-border-solid tw-border-[var(--semantic-border-input,#E9EAEB)] focus:tw-outline-none focus:tw-border-semantic-border-input-focus/50 focus:tw-shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error: "tw-border tw-border-solid tw-border-semantic-error-primary/40 focus:tw-outline-none focus:tw-border-semantic-error-primary/60 focus:tw-shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
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
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const { refs, floatingStyles, isPositioned } = useFloating({
      open: isOpen,
      placement: "bottom-start",
      strategy: "fixed",
      middleware: [
        offset(4),
        flip({ padding: 8 }),
        shift({ padding: 8 }),
        size({
          padding: 8,
          apply({ rects, elements }) {
            elements.floating.style.width = `${rects.reference.width}px`;
          },
        }),
      ],
      whileElementsMounted: (reference, floating, update) =>
        autoUpdate(reference, floating, update, { animationFrame: true }),
    });

    const setAnchorRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        refs.setReference(node);
      },
      [refs]
    );

    const setDropdownRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        refs.setFloating(node);
      },
      [refs]
    );

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

    // Close dropdown when clicking outside (defer so opening click does not close immediately)
    React.useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          containerRef.current?.contains(target) ||
          refs.floating.current?.contains(target)
        ) {
          return;
        }
        setIsOpen(false);
        setSearchQuery("");
      };

      const timeoutId = window.setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, refs.floating]);

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
        className={cn("tw-flex tw-flex-col tw-gap-1", wrapperClassName)}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "tw-text-xs tw-font-normal tw-text-[var(--semantic-text-muted,#717680)]",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="tw-text-[var(--semantic-error-primary,#F04438)] tw-ml-0.5">*</span>
            )}
          </label>
        )}

        {/* Anchor for floating menu (portaled to body to escape overflow:hidden scroll areas). */}
        <div
          ref={setAnchorRef}
          className="tw-relative tw-w-full tw-min-w-0 tw-flex tw-flex-col tw-gap-1"
        >
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
              "tw-text-left tw-gap-2",
              triggerClassName
            )}
          >
          <div className="tw-flex-1 tw-flex tw-flex-wrap tw-gap-1">
            {selectedValues.length === 0 ? (
              <span className="tw-text-[var(--semantic-text-placeholder,#A2A6B1)]">
                {placeholder}
              </span>
            ) : (
              selectedLabels.map((label, index) => (
                <span
                  key={selectedValues[index]}
                  className="tw-inline-flex tw-items-center tw-gap-1 tw-bg-[var(--semantic-bg-ui,#F5F5F5)] tw-text-[var(--semantic-text-primary,#181D27)] tw-text-xs tw-px-2 tw-py-0.5 tw-rounded"
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
                    className="tw-cursor-pointer hover:tw-text-[var(--semantic-error-primary,#F04438)] focus:tw-outline-none"
                    aria-label={`Remove ${label}`}
                  >
                    <X className="tw-size-3" />
                  </span>
                </span>
              ))
            )}
          </div>
          <div className="tw-flex tw-items-center tw-gap-2 tw-shrink-0">
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
                className="tw-p-0.5 tw-cursor-pointer hover:tw-text-[var(--semantic-error-primary,#F04438)] focus:tw-outline-none"
                aria-label="Clear all"
              >
                <X className="tw-size-4 tw-text-[var(--semantic-text-muted,#717680)]" />
              </span>
            )}
            {showSeparatorBeforeChevron && (
              <div
                className="tw-w-px tw-h-5 tw-self-center tw-border-l tw-border-solid tw-border-[var(--semantic-border-layout,#E9EAEB)] tw-shrink-0"
                aria-hidden
              />
            )}
            {loading ? (
              <Loader2 className="tw-size-4 tw-animate-spin tw-text-[var(--semantic-text-muted,#717680)]" />
            ) : (
              <ChevronDown
                className={cn(
                  "tw-size-4 tw-text-[var(--semantic-text-muted,#717680)] tw-transition-transform tw-shrink-0",
                  isOpen && "tw-rotate-180"
                )}
              />
            )}
          </div>
        </button>

          {/* Helper / error sits between trigger and dropdown (normal flow), matching Figma */}
          {(error || helperText) && (
            <div className="tw-flex tw-justify-between tw-items-start tw-gap-2">
              {error ? (
                <div
                  id={errorId}
                  role="alert"
                  className="tw-flex tw-items-center tw-gap-1.5 tw-min-w-0"
                >
                  <CircleAlert
                    className="tw-size-3.5 tw-shrink-0 tw-text-[var(--semantic-error-primary,#F04438)]"
                    aria-hidden
                  />
                  <span className="tw-text-xs tw-text-[var(--semantic-error-primary,#F04438)]">
                    {error}
                  </span>
                </div>
              ) : helperText ? (
                <span
                  id={helperId}
                  className="tw-text-xs tw-text-[var(--semantic-text-muted,#717680)]"
                >
                  {helperText}
                </span>
              ) : null}
            </div>
          )}

          {isOpen &&
            typeof document !== "undefined" &&
            createPortal(
              <TooltipProvider delayDuration={200}>
                <div
                  ref={setDropdownRef}
                  id={listboxId}
                  role="listbox"
                  aria-multiselectable="true"
                  className="tw-rounded tw-bg-[var(--semantic-bg-primary,#FFFFFF)] tw-border tw-border-solid tw-border-[var(--semantic-border-layout,#E9EAEB)] tw-shadow-md"
                  style={{
                    ...floatingStyles,
                    zIndex: 10050,
                    visibility: isPositioned ? undefined : "hidden",
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
              {/* Search input */}
              {searchable && (
                <div className="tw-p-2 tw-border-b tw-border-solid tw-border-[var(--semantic-border-layout,#E9EAEB)]">
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="tw-w-full tw-h-8 tw-px-3 tw-text-sm tw-border tw-border-solid tw-border-[var(--semantic-border-input,#E9EAEB)] tw-rounded tw-bg-[var(--semantic-bg-primary,#FFFFFF)] placeholder:tw-text-[var(--semantic-text-placeholder,#A2A6B1)] focus:tw-outline-none focus:tw-border-semantic-border-input-focus/50"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Options */}
              <div className="tw-max-h-60 tw-overflow-auto tw-p-1">
                {filteredOptions.length === 0 ? (
                  <div className="tw-py-6 tw-text-center tw-text-sm tw-text-[var(--semantic-text-muted,#717680)]">
                    No results found
                  </div>
                ) : (
                  displayItems.map((item, itemIndex) => {
                    if (item.type === "divider") {
                      return (
                        <div
                          key={`divider-${itemIndex}`}
                          role="separator"
                          className="tw-my-1 tw-h-px tw-bg-[var(--semantic-border-layout,#E9EAEB)]"
                        />
                      );
                    }
                    if (item.type === "header") {
                      return (
                        <div
                          key={`header-${item.label}-${itemIndex}`}
                          className="tw-px-3 tw-pt-2 tw-pb-1 tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wide tw-text-[var(--semantic-text-muted,#717680)]"
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
                      "tw-relative tw-flex tw-w-full tw-min-w-0 tw-cursor-pointer tw-select-none tw-items-center tw-rounded-sm tw-text-left tw-text-[var(--semantic-text-primary,#181D27)] tw-outline-none",
                      optionVariant === "detailed"
                        ? "tw-gap-2 tw-px-2 tw-py-2 tw-text-sm"
                        : "tw-py-2 tw-pl-4 tw-pr-8 tw-text-base",
                      !isSelected &&
                        "hover:tw-bg-[var(--semantic-bg-ui,#F5F5F5)] focus:tw-bg-[var(--semantic-bg-ui,#F5F5F5)]",
                      isDisabled && "tw-opacity-50 tw-cursor-not-allowed",
                      option.isDeleted && "tw-line-through tw-opacity-70"
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
                        <span className="tw-absolute tw-right-2 tw-flex tw-size-4 tw-items-center tw-justify-center">
                          {isSelected && (
                            <Check className="tw-size-4 tw-text-[var(--semantic-brand,#2BBCCA)]" />
                          )}
                        </span>
                        <span className="tw-min-w-0 tw-flex-1 tw-whitespace-normal tw-break-words tw-text-left">
                          {option.label}
                        </span>
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
                          className="tw-pointer-events-none tw-shrink-0"
                          aria-hidden
                          tabIndex={-1}
                        />
                        <span className="tw-min-w-0 tw-flex-1 tw-truncate tw-text-left">
                          {option.label}
                        </span>
                        {secondaryLine ? (
                          <span className="tw-shrink-0 tw-max-w-[55%] tw-truncate tw-text-right tw-text-xs tw-text-[var(--semantic-text-muted,#717680)]">
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
                            <span className="tw-block tw-w-full tw-cursor-default">
                              {node}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="tw-max-w-xs tw-bg-[var(--semantic-primary,#343E55)] tw-text-[var(--semantic-text-inverted,#FFFFFF)] tw-border-[var(--semantic-primary,#343E55)] tw-border-solid"
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
                <div className="tw-p-2 tw-border-t tw-border-solid tw-border-[var(--semantic-border-layout,#E9EAEB)] tw-text-xs tw-text-[var(--semantic-text-muted,#717680)]">
                  {selectedValues.length} / {maxSelections} selected
                </div>
              ) : null}
                </div>
              </TooltipProvider>,
              document.body
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
