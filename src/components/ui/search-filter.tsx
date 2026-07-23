import * as React from "react";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size as floatingSize,
  useFloating,
} from "@floating-ui/react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input, type InputProps } from "./input";

const searchFilterVariants = cva("relative flex min-w-0 flex-col", {
  variants: {
    size: {
      sm: "w-full max-w-80",
      default: "w-full max-w-[360px]",
      lg: "w-full max-w-[420px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const searchFilterDropdownVariants = cva("flex flex-col overflow-hidden p-0");

export type SearchFilterSearchMode = "text" | "numeric";

function normalizeSearchText(
  value: string,
  searchMode: SearchFilterSearchMode
) {
  if (searchMode === "numeric") {
    return value.replace(/\D/g, "");
  }

  return value.trim().toLowerCase();
}

function renderHighlightedNumericLabel(label: string, query: string) {
  if (!query) return label;

  const digitCharacterIndexes: number[] = [];
  const labelDigits = Array.from(label)
    .filter((character, index) => {
      const isDigit = /\d/.test(character);
      if (isDigit) {
        digitCharacterIndexes.push(index);
      }
      return isDigit;
    })
    .join("");
  const matchStart = labelDigits.indexOf(query);

  if (matchStart === -1) return label;

  const highlightedIndexes = new Set(
    digitCharacterIndexes.slice(matchStart, matchStart + query.length)
  );

  const chunks: Array<{ text: string; highlighted: boolean }> = [];

  Array.from(label).forEach((character, index) => {
    const highlighted = highlightedIndexes.has(index);
    const previousChunk = chunks[chunks.length - 1];

    if (previousChunk && previousChunk.highlighted === highlighted) {
      previousChunk.text += character;
      return;
    }

    chunks.push({ text: character, highlighted });
  });

  return chunks.map((chunk, index) => (
    <span
      key={`${chunk.text}-${index}`}
      className={chunk.highlighted ? "font-semibold" : undefined}
    >
      {chunk.text}
    </span>
  ));
}

export interface SearchFilterOption {
  /** Unique option value returned in selection callbacks */
  value: string;
  /** Display label shown in the option list and input after selection */
  label: string;
  /** Disables selection for this row */
  disabled?: boolean;
}

export interface SearchFilterProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof searchFilterVariants> {
  /** Options displayed in the filter list */
  options: SearchFilterOption[];
  /** Controlled selected option value */
  value?: string;
  /** Initial selected option value for uncontrolled usage */
  defaultValue?: string;
  /** Called when a single option is selected */
  onValueChange?: (value: string) => void;
  /** Called with the full option when a single option is selected */
  onOptionSelect?: (option: SearchFilterOption) => void;
  /** Controlled search text */
  searchValue?: string;
  /** Initial search text for uncontrolled usage */
  defaultSearchValue?: string;
  /** Called whenever search text changes */
  onSearchChange?: (value: string) => void;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Search input behavior. Defaults to "numeric" for phone-number filtering. */
  searchMode?: SearchFilterSearchMode;
  /** Minimum query length before internal option filtering runs. Below it, all options are shown. Defaults to 0. */
  minSearchLength?: number;
  /** Message shown when filtering returns no options */
  emptyMessage?: string;
  /** Disables the whole filter */
  disabled?: boolean;
  /** Disables only the search input */
  searchDisabled?: boolean;
  /** Class name for the scrollable options region */
  listClassName?: string;
  /** Additional props for the search input */
  inputProps?: Omit<InputProps, "value" | "defaultValue" | "type">;
}

const SearchFilter = React.forwardRef<HTMLDivElement, SearchFilterProps>(
  (
    {
      className,
      size,
      options,
      value,
      defaultValue,
      onValueChange,
      onOptionSelect,
      searchValue,
      defaultSearchValue = "",
      onSearchChange,
      searchPlaceholder = "Search...",
      searchMode = "numeric",
      minSearchLength = 0,
      emptyMessage = "No options found",
      disabled = false,
      searchDisabled = false,
      listClassName,
      inputProps,
      ...props
    },
    ref
  ) => {
    const {
      className: inputClassName,
      onChange: inputOnChange,
      onClick: inputOnClick,
      onFocus: inputOnFocus,
      onKeyDown: inputOnKeyDown,
      inputMode: inputInputMode,
      pattern: inputPattern,
      ...searchInputProps
    } = inputProps ?? {};
    const searchInputRef = React.useRef<HTMLInputElement | null>(null);
    const inputId = React.useId();
    const dropdownId = React.useId();
    const optionIdPrefix = React.useId();
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? ""
    );
    const [internalSearchValue, setInternalSearchValue] =
      React.useState(defaultSearchValue);
    const [isOpen, setIsOpen] = React.useState(false);
    const selectedValue = value ?? internalValue;
    const selectedOption = React.useMemo(
      () => options.find((option) => option.value === selectedValue),
      [options, selectedValue]
    );
    const currentSearchValue = searchValue ?? internalSearchValue;
    const displaySearchValue =
      currentSearchValue && searchMode === "numeric"
        ? normalizeSearchText(currentSearchValue, searchMode)
        : currentSearchValue || selectedOption?.label || "";
    const normalizedSearchQuery = normalizeSearchText(
      currentSearchValue,
      searchMode
    );

    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const { refs, floatingStyles } = useFloating({
      open: isOpen,
      placement: "bottom-start",
      strategy: "fixed",
      middleware: [
        offset(8),
        flip({ padding: 8 }),
        shift({ padding: 8 }),
        floatingSize({
          padding: 8,
          apply({ availableHeight, rects, elements }) {
            elements.floating.style.width = `${rects.reference.width}px`;
            elements.floating.style.maxHeight = `${Math.min(
              368,
              availableHeight
            )}px`;
          },
        }),
      ],
      whileElementsMounted: (reference, floating, update) =>
        autoUpdate(reference, floating, update, { animationFrame: true }),
    });

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (disabled) return;

        setIsOpen(nextOpen);
      },
      [disabled]
    );

    const focusSearchInput = React.useCallback(() => {
      window.requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }, []);

    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

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
        setOpen(false);
      };

      const timeoutId = window.setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, refs.floating, setOpen]);

    const filteredOptions = React.useMemo(() => {
      if (normalizedSearchQuery.length < minSearchLength) return options;
      if (!normalizedSearchQuery) return options;

      return options.filter((option) =>
        normalizeSearchText(option.label, searchMode).includes(
          normalizedSearchQuery
        )
      );
    }, [normalizedSearchQuery, options, searchMode, minSearchLength]);

    const selectOption = React.useCallback(
      (option: SearchFilterOption) => {
        if (disabled || option.disabled) return;

        if (value === undefined) {
          setInternalValue(option.value);
        }

        if (searchValue === undefined) {
          setInternalSearchValue(option.label);
        }

        onValueChange?.(option.value);
        onOptionSelect?.(option);
        onSearchChange?.(option.label);
        setOpen(false);
      },
      [
        disabled,
        onSearchChange,
        onOptionSelect,
        onValueChange,
        searchValue,
        setOpen,
        value,
      ]
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextSearchValue = normalizeSearchText(
        event.target.value,
        searchMode
      );
      event.target.value = nextSearchValue;

      if (searchValue === undefined) {
        setInternalSearchValue(nextSearchValue);
      }
      if (value === undefined && selectedOption?.label !== nextSearchValue) {
        setInternalValue("");
      }
      setOpen(true);
      onSearchChange?.(nextSearchValue);
    };

    const handleClearSearch = () => {
      if (searchValue === undefined) {
        setInternalSearchValue("");
      }
      if (value === undefined) {
        setInternalValue("");
      }
      onValueChange?.("");
      onSearchChange?.("");
      setOpen(true);
      focusSearchInput();
    };

    const dropdownPanel = (
      <div
        className={cn(
          "max-h-60 overflow-auto p-1",
          disabled && "pointer-events-none opacity-60",
          listClassName
        )}
        id={dropdownId}
        role="listbox"
        aria-label="Filter options"
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => {
            const isSelected = selectedValue === option.value;
            const optionDisabled = disabled || option.disabled;

            const optionLabelId = `${optionIdPrefix}-${index}`;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={optionDisabled}
                disabled={optionDisabled}
                className={cn(
                  "relative flex w-full min-w-0 cursor-pointer select-none items-center gap-2 rounded-sm px-4 py-2 pr-9 text-left text-sm text-semantic-text-primary outline-none",
                  !isSelected &&
                    "hover:bg-semantic-bg-ui focus:bg-semantic-bg-ui",
                  isSelected && "bg-semantic-bg-ui",
                  optionDisabled && "cursor-not-allowed opacity-50"
                )}
                onClick={() => selectOption(option)}
              >
                <span
                  id={optionLabelId}
                  className="min-w-0 flex-1 truncate text-left"
                >
                  {searchMode === "numeric"
                    ? renderHighlightedNumericLabel(
                        option.label,
                        normalizedSearchQuery
                      )
                    : option.label}
                </span>
                {isSelected ? (
                  <Check className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-semantic-brand" />
                ) : null}
              </button>
            );
          })
        ) : (
          <div className="px-4 py-6 text-center text-sm text-semantic-text-muted">
            {emptyMessage}
          </div>
        )}
      </div>
    );

    return (
      <div
        ref={setRootRef}
        className={cn(searchFilterVariants({ size }), className)}
        {...props}
      >
        <div ref={setAnchorRef} className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-semantic-text-muted" />
          <Input
            ref={searchInputRef}
            id={inputId}
            type="text"
            role="searchbox"
            placeholder={searchPlaceholder}
            value={displaySearchValue}
            disabled={disabled || searchDisabled}
            inputMode={searchMode === "numeric" ? "numeric" : inputInputMode}
            pattern={searchMode === "numeric" ? "[0-9]*" : inputPattern}
            aria-controls={dropdownId}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className={cn("pl-10 pr-9", inputClassName)}
            {...searchInputProps}
            onClick={(event) => {
              setOpen(true);
              focusSearchInput();
              inputOnClick?.(event);
            }}
            onFocus={(event) => {
              setOpen(true);
              focusSearchInput();
              inputOnFocus?.(event);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
              }
              inputOnKeyDown?.(event);
            }}
            onChange={(event) => {
              handleSearchChange(event);
              inputOnChange?.(event);
            }}
          />
          {displaySearchValue && !disabled && !searchDisabled ? (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded text-semantic-text-muted transition-colors hover:text-semantic-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary focus-visible:ring-offset-1"
              onClick={handleClearSearch}
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        {isOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              ref={setDropdownRef}
              className={cn(
                "rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-primary shadow-md",
                searchFilterDropdownVariants()
              )}
              style={{
                ...floatingStyles,
                zIndex: 10050,
              }}
              role="presentation"
              aria-labelledby={inputId}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {dropdownPanel}
            </div>,
            document.body
          )}
      </div>
    );
  }
);
SearchFilter.displayName = "SearchFilter";

export { SearchFilter, searchFilterVariants };
