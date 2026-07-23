import * as React from "react";
import { Loader2, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./input";
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
  /**
   * Render a divider (top border) above each option group and display the
   * group labels in uppercase with letter-spacing — matches the Figma
   * "routing" dropdown style. Only affects grouped options.
   */
  separateGroups?: boolean;
  /**
   * Controlled search value. When provided, internal search state is
   * ignored and the consumer owns the value — typically used to drive
   * server-side filtering against a paginated API. The client-side
   * `option.label` filter is also skipped, since the consumer is expected
   * to have already filtered the options upstream.
   *
   * Pair with `onSearchChange`. Leave both undefined for the default
   * uncontrolled, client-side filtering behavior.
   */
  searchValue?: string;
  /**
   * Fires on every keystroke in the search input. Also fires with `""`
   * when the dropdown closes (so consumers can reset their query state).
   */
  onSearchChange?: (value: string) => void;
  /** Additional class for wrapper */
  wrapperClassName?: string;
  /** Additional class for trigger */
  triggerClassName?: string;
  /**
   * Additional class for the dropdown content. By default the content width is
   * bound to the trigger width (`--radix-select-trigger-width`); override here
   * (e.g. `w-[280px] max-w-[320px]`) when the trigger is intentionally narrow —
   * such as a "View all" text link — so the list isn't clipped to the link width.
   */
  contentClassName?: string;
  /** Additional class for label */
  labelClassName?: string;
  /** ID for the select */
  id?: string;
  /** Name attribute for form submission */
  name?: string;
  /**
   * Fires when the user scrolls to the bottom of the open dropdown.
   * Use this to load the next page from the server. The callback is
   * forwarded to SelectContent's `onViewportScrollEnd` (debounced by
   * the native `scrollend` event), so it won't fire while a scroll is
   * still in progress.
   *
   * No virtualization is applied — all loaded items render to the DOM.
   * For >2k items consumers may notice some lag; virtualization is a
   * separate ticket if it becomes a real-world problem.
   */
  onScrollEnd?: () => void;
  /**
   * When true, renders a small "Loading more…" row at the bottom of
   * the options list. Set this to true while your API call is in flight
   * so the user knows more items are on the way.
   */
  loadingMore?: boolean;
  /**
   * When false, prevents `onScrollEnd` from firing further and renders
   * an "End of list" footer row. Default true (keep firing).
   */
  hasMore?: boolean;
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
 *
 * @example Lazy-load on scroll
 * ```tsx
 * const [items, setItems] = useState<SelectOption[]>([]);
 * const [loadingMore, setLoadingMore] = useState(false);
 * const [hasMore, setHasMore] = useState(true);
 * const page = useRef(0);
 *
 * const loadNext = async () => {
 *   if (loadingMore || !hasMore) return;
 *   setLoadingMore(true);
 *   const { results, isLast } = await api.fetchTemplates(page.current);
 *   setItems(prev => [...prev, ...results]);
 *   setHasMore(!isLast);
 *   page.current += 1;
 *   setLoadingMore(false);
 * };
 *
 * useEffect(() => { loadNext(); }, []);
 *
 * <SelectField
 *   label="Template"
 *   options={items}
 *   onScrollEnd={loadNext}
 *   loadingMore={loadingMore}
 *   hasMore={hasMore}
 * />
 * ```
 */
const SelectField = React.forwardRef(
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
      separateGroups,
      searchValue,
      onSearchChange,
      wrapperClassName,
      triggerClassName,
      contentClassName,
      labelClassName,
      id,
      name,
      onScrollEnd,
      loadingMore,
      hasMore,
    }: SelectFieldProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    // Internal state for uncontrolled mode. When `searchValue` is provided,
    // the consumer owns the value and this state is unused.
    const [searchQuery, setSearchQuery] = React.useState("");
    const isSearchControlled = searchValue !== undefined;
    const effectiveSearchQuery = isSearchControlled ? searchValue : searchQuery;

    // Track the current selection ourselves so we always know which option is
    // selected — even in uncontrolled mode. This lets us keep the selected
    // option mounted while the search filter hides everything else (see the
    // filter below), which prevents Radix from blanking the trigger value and
    // stealing focus off the search input when the selected item unmounts.
    const isValueControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? ""
    );
    const selectedValue = isValueControlled ? value : uncontrolledValue;

    // Combined value change handler that also fires onSelect with full option object.
    // When interceptValue returns false, onValueChange is skipped (only onSelect fires).
    const handleValueChange = React.useCallback(
      (newValue: string) => {
        const intercepted = interceptValue?.(newValue) === false;

        if (!intercepted) {
          onValueChange?.(newValue);
          if (!isValueControlled) {
            setUncontrolledValue(newValue);
          }
        }

        if (onSelect) {
          const option = options.find((o) => o.value === newValue);
          if (option) {
            onSelect(option);
          }
        }
      },
      [onValueChange, onSelect, interceptValue, options, isValueControlled]
    );

    // Support re-selection: fire onSelect when clicking the already-selected
    // item. Radix only fires onValueChange for *new* values, so without this
    // clicking an action item like "Add custom date" a second time would be a
    // no-op.
    const handleItemClick = React.useCallback(
      (option: SelectOption) => {
        if (option.value === selectedValue) {
          handleValueChange(option.value);
        }
      },
      [selectedValue, handleValueChange]
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

    // Group options by group property.
    //
    // When client-side filtering is active, non-matching options are hidden
    // (rendered with `display:none`) rather than removed from the tree. The
    // one exception we *must* keep mounted is the currently-selected option:
    // if Radix's selected item unmounts, the trigger loses its displayed value
    // and focus is pulled off the search input. `matchCount` tracks how many
    // options are actually visible so the "no results" / footer states stay
    // accurate.
    const groupedOptions = React.useMemo(() => {
      const groups: Record<string, (SelectOption & { hidden?: boolean })[]> =
        {};
      const ungrouped: (SelectOption & { hidden?: boolean })[] = [];
      let matchCount = 0;

      const filtering =
        !!searchable && !isSearchControlled && !!searchQuery;
      const query = searchQuery.toLowerCase();

      options.forEach((option) => {
        const isMatch =
          !filtering || option.label.toLowerCase().includes(query);
        const isSelected = option.value === selectedValue && !!selectedValue;

        // Drop only options that neither match the query nor are selected.
        if (!isMatch && !isSelected) {
          return;
        }

        if (isMatch) matchCount++;
        const entry = { ...option, hidden: !isMatch };

        if (option.group) {
          if (!groups[option.group]) {
            groups[option.group] = [];
          }
          groups[option.group].push(entry);
        } else {
          ungrouped.push(entry);
        }
      });

      return { groups, ungrouped, matchCount };
    }, [options, searchable, isSearchControlled, searchQuery, selectedValue]);

    const hasGroups = Object.keys(groupedOptions.groups).length > 0;

    // Number of *visible* options — drives the empty-state and footer rows.
    const totalRendered = groupedOptions.matchCount;
    const showEndOfList = hasMore === false && totalRendered > 0 && !loadingMore;

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      if (!isSearchControlled) {
        setSearchQuery(next);
      }
      onSearchChange?.(next);
    };

    // Reset search when dropdown closes. In controlled mode we notify the
    // consumer so they can reset their state; in uncontrolled mode we clear
    // our own state directly.
    const handleOpenChange = (open: boolean) => {
      if (!open) {
        if (isSearchControlled) {
          onSearchChange?.("");
        } else {
          setSearchQuery("");
        }
      }
    };

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "text-sm font-semibold text-semantic-text-secondary",
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
            className={cn(
              loading && "pr-10",
              // Figma "routing" style uses a darker (text-muted) placeholder
              // instead of the default lighter placeholder token.
              separateGroups &&
                "[&>span[data-placeholder]]:text-semantic-text-muted",
              triggerClassName
            )}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
          >
            <SelectValue placeholder={placeholder} />
            {loading && (
              <Loader2 className="absolute right-8 size-4 animate-spin text-semantic-text-muted" />
            )}
          </SelectTrigger>
          <SelectContent
            onViewportScrollEnd={hasMore !== false ? onScrollEnd : undefined}
            hideScrollButtons={totalRendered === 0}
            className={contentClassName}
          >
            {/* Search input */}
            {searchable &&
              (separateGroups ? (
                // Figma "routing" style — a bordered, rounded search box that
                // reuses the shared Input component (no leading icon).
                <div className="px-1 pb-1.5">
                  <Input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={effectiveSearchQuery}
                    onChange={handleSearchChange}
                    // Prevent closing dropdown when clicking input
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 pb-1.5 border-b border-solid border-semantic-border-layout">
                  <Search className="size-4 text-semantic-text-muted shrink-0" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={effectiveSearchQuery}
                    onChange={handleSearchChange}
                    className="w-full h-[42px] text-base text-semantic-text-primary bg-transparent placeholder:text-semantic-text-placeholder focus:outline-none"
                    // Prevent closing dropdown when clicking input
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              ))}

            {/* Ungrouped options. Non-matching options stay mounted but hidden
                (only the selected option is ever kept while filtering). */}
            {groupedOptions.ungrouped.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={cn(option.hidden && "hidden")}
                onPointerUp={() => handleItemClick(option)}
              >
                {option.label}
              </SelectItem>
            ))}

            {/* Grouped options */}
            {hasGroups &&
              Object.entries(groupedOptions.groups).map(
                ([groupName, groupOptions]) => {
                  // Hide the group label when every option in it is filtered
                  // out (i.e. only a hidden selected item remains).
                  const hasVisible = groupOptions.some((o) => !o.hidden);
                  return (
                    <SelectGroup key={groupName}>
                      {hasVisible && (
                        <SelectLabel
                          className={cn(
                            separateGroups &&
                              "mt-1 border-t border-solid border-semantic-border-layout pt-2.5 uppercase tracking-[0.5px]"
                          )}
                        >
                          {groupName}
                        </SelectLabel>
                      )}
                      {groupOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                          className={cn(option.hidden && "hidden")}
                          onPointerUp={() => handleItemClick(option)}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                }
              )}

            {/* No results message — based on the count of *visible* options. */}
            {searchable && effectiveSearchQuery && totalRendered === 0 && (
              <div className="py-6 text-center text-sm text-semantic-text-muted">
                No results found
              </div>
            )}

            {/* Loading-more row (lazy-load) */}
            {loadingMore && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center justify-center gap-2 py-2 text-sm text-semantic-text-muted"
              >
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                <span>Loading more…</span>
              </div>
            )}

            {/* End-of-list footer (lazy-load) */}
            {showEndOfList && (
              <div
                role="status"
                className="py-2 text-center text-sm text-semantic-text-muted"
              >
                End of list
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
                className="text-sm text-semantic-error-primary"
              >
                {error}
              </span>
            ) : helperText ? (
              <span id={helperId} className="text-sm text-semantic-text-muted">
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
