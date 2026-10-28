import * as React from "react";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size as floatingSize,
  useFloating,
  type Placement,
} from "@floating-ui/react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input, type InputProps } from "./input";

const searchFilterVariants = cva(
  "relative flex min-w-0 flex-col font-[family-name:var(--font-v2,Inter,sans-serif)]",
  {
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
  }
);

const searchFilterDropdownVariants = cva("flex flex-col overflow-hidden p-0");

/**
 * The corner of the panel that touches the field, from the placement
 * floating-ui actually used, so a flipped (above) or end-aligned panel still
 * grows out of the field instead of out of a fixed top-left corner.
 */
function panelTransformOrigin(placement: Placement): string {
  const [side, align] = placement.split("-");
  if (side === "top" || side === "bottom") {
    const x = align === "end" ? "right" : align === "start" ? "left" : "center";
    return `${side === "top" ? "bottom" : "top"} ${x}`;
  }
  const y = align === "end" ? "bottom" : align === "start" ? "top" : "center";
  return `${y} ${side === "left" ? "right" : "left"}`;
}

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
    const reducedMotion = useReducedMotion() ?? false;

    const { refs, floatingStyles, placement } = useFloating({
      open: isOpen,
      placement: "bottom-start",
      strategy: "fixed",
      transform: false,
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

    /**
     * The pending focus frame has to be cancellable. Opening the menu schedules
     * a frame that refocuses the input, and the input's `onFocus` reopens the
     * menu. If that frame lands AFTER an option has been picked, it reopens the
     * dropdown that `selectOption` just closed — so selecting an option looks
     * like it does nothing. Whether the frame lands before or after the click is
     * pure timing, which is why the bug comes and goes.
     */
    const focusFrameRef = React.useRef<number | null>(null);

    const cancelPendingFocus = React.useCallback(() => {
      if (focusFrameRef.current === null) return;
      window.cancelAnimationFrame(focusFrameRef.current);
      focusFrameRef.current = null;
    }, []);

    const focusSearchInput = React.useCallback(() => {
      cancelPendingFocus();
      focusFrameRef.current = window.requestAnimationFrame(() => {
        focusFrameRef.current = null;
        searchInputRef.current?.focus();
      });
    }, [cancelPendingFocus]);

    // Never let a queued frame fire into an unmounted component.
    React.useEffect(() => cancelPendingFocus, [cancelPendingFocus]);

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
        // Drop any queued refocus first, or it reopens what we are closing.
        cancelPendingFocus();
        setOpen(false);
      },
      [
        cancelPendingFocus,
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
          disabled && "pointer-events-none",
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
                  // 4px radius = panel 8px minus its 4px list padding. Rows are real Tab
                  // stops, so the focus-visible pseudo-class separates a keyboard highlight (ring)
                  // from a mouse hover (fill only).
                  "relative flex min-h-12 w-full min-w-0 cursor-pointer select-none items-center gap-2 rounded-sm border-0 bg-transparent px-1.5 py-2.5 pr-9 text-left text-base font-normal text-[var(--v2-text-secondary,#5E5E5E)] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--v2-semantic-border-focus,var(--semantic-primary))]",
                  !isSelected &&
                    "hover:bg-v2-semantic-bg-ui focus:bg-v2-semantic-bg-ui",
                  isSelected &&
                    "bg-v2-semantic-bg-ui text-[var(--v2-text-primary,#484848)]",
                  optionDisabled &&
                    "cursor-not-allowed text-[var(--v2-semantic-disabled-text,var(--semantic-disabled-primary))]"
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
                  // Centred with auto margins, not `-translate-y-1/2`: the pop keyframe
                  // writes `transform` and would shove the icon 8px down while it plays.
                  <Check className="pointer-events-none absolute inset-y-0 right-3 my-auto size-4 text-v2-semantic-border-accent motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.85] motion-safe:[animation-duration:180ms] [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))]" />
                ) : null}
              </button>
            );
          })
        ) : (
          <div className="px-4 py-6 text-center text-xs text-[var(--v2-text-muted,#707070)]">
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
        <div
          ref={setAnchorRef}
          className="group relative"
          data-filled={displaySearchValue ? "true" : undefined}
        >
          {/* Reserve 40px before text: 13px inset + 18px icon + 9px breathing room. */}
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-[13px] top-1/2 size-[18px] -translate-y-1/2 text-[var(--v2-text-muted,#707070)] transition-[color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms] group-focus-within:text-[var(--v2-text-primary,#484848)] group-data-[filled=true]:text-[var(--v2-text-primary,#484848)]"
          />
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
            // The list takes focus on Tab, so keep the focused look while it is open
            // (`aria-expanded`). The extra `hover` selector outranks the grey hover
            // border from Input (0,4,0 vs 0,3,0).
            className={cn(
              "pl-10 pr-11 aria-expanded:border-[var(--v2-semantic-border-focus,var(--semantic-primary))] aria-expanded:shadow-none enabled:aria-expanded:hover:border-[var(--v2-semantic-border-focus,var(--semantic-primary))]",
              inputClassName
            )}
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
          {/* Arc: a 24px clear button in a slot inset 12px; it scales up out of a 2px blur on a snappy spring
              and leaves the same way. Reduced motion keeps only a fade. */}
          <AnimatePresence initial={false}>
            {displaySearchValue && !disabled && !searchDisabled ? (
              <motion.button
                key="clear"
                type="button"
                aria-label="Clear search"
                className="absolute right-[13px] top-1/2 -mt-3 grid size-6 place-items-center rounded border-0 bg-transparent p-0 text-[var(--v2-text-muted,#707070)] transition-[background-color,color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms] [@media(hover:hover)]:hover:bg-v2-semantic-bg-ui [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)] focus-visible:outline focus-visible:[outline-width:2px] focus-visible:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))] focus-visible:outline-offset-[3px]"
                onClick={handleClearSearch}
                initial={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.8, filter: "blur(2px)" }
                }
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={
                  reducedMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : {
                        opacity: 0,
                        scale: 0.8,
                        filter: "blur(2px)",
                        transition: {
                          duration: 0.12,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                }
                whileTap={
                  reducedMotion
                    ? undefined
                    : {
                        scale: 0.96,
                        transition: {
                          duration: 0.12,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                }
                transition={
                  reducedMotion
                    ? { duration: 0.12 }
                    : {
                        type: "spring",
                        visualDuration: 0.26,
                        bounce: 0.12,
                        opacity: { duration: 0.16 },
                        filter: { duration: 0.16 },
                      }
                }
              >
                <X className="size-4" aria-hidden="true" />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
        {isOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              ref={setDropdownRef}
              data-side={placement.split("-")[0]}
              data-align={placement.split("-")[1] ?? "center"}
              className={cn(
                "rounded-lg border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary text-[var(--v2-text-secondary,#5E5E5E)] shadow-md font-[family-name:var(--font-v2,Inter,sans-serif)]",
                "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.98] data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 motion-safe:[animation-duration:200ms] [animation-timing-function:var(--v2-ease-spring,cubic-bezier(0.22,1,0.36,1))] motion-reduce:animate-[v2-fade-in_120ms_ease-out]",
                searchFilterDropdownVariants()
              )}
              style={{
                ...floatingStyles,
                transformOrigin: panelTransformOrigin(placement),
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
