import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, Check } from "lucide-react";

import { cn } from "@/lib/utils";

const creatableSelectTriggerVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-lg bg-semantic-bg-primary px-4 py-2 font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal text-base text-[var(--v2-text-secondary,#5E5E5E)] outline-none transition-[border-color,box-shadow,background-color] duration-150 disabled:cursor-not-allowed disabled:bg-semantic-bg-ui disabled:border-semantic-border-layout disabled:shadow-none disabled:hover:border-semantic-border-layout",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input hover:border-[var(--color-primary-100,#C0C3CA)] focus-within:border-[var(--color-secondary-600,#27ABB8)] focus-within:shadow-[0_0_4px_0_rgba(39,171,184,0.4)]",
        error:
          "border border-solid border-semantic-error-primary shadow-[0_0_4px_0_rgba(240,68,56,0.4)] focus-within:border-semantic-error-primary focus-within:shadow-[0_0_4px_0_rgba(240,68,56,0.4)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

/**
 * Tailwind classes for the "Enter ↵" hint in creatable dropdown headers (shared by Primary Role and Tone).
 *
 * Wrapped in `cn(...)` so the CLI's prefixer transforms the inner literal at install time.
 * If you copy this source manually (rather than via `npx myoperator-ui add ...`) and your
 * Tailwind config uses `prefix` (e.g. `""`), prefix every utility yourself or these
 * strings will not compile.
 */
export const creatableEnterHintKbdClassName = cn(
  "inline-flex items-center gap-0.5 rounded border border-solid border-semantic-border-layout bg-semantic-bg-ui px-1.5 py-0.5 font-sans text-[10px] font-medium text-[var(--v2-text-muted,#707070)]"
);

/** Primary Role: hint row above the options list (custom role + Enter kbd). */
export const creatablePrimaryRoleHintRowClassName = cn(
  "flex items-center justify-between border-b border-solid border-semantic-border-layout px-4 py-2"
);

/** Tone / CreatableMultiSelect: inner hint row (place inside a full-bleed wrapper with `-mx-4` + `border-b` on the panel). Matches Roles' row dimensions for visual parity. */
export const creatableToneHintRowClassName = cn(
  "flex shrink-0 items-center justify-between gap-2 px-4 py-2"
);

function restoreInputCursor(input: HTMLInputElement, cursorPosition: number) {
  window.requestAnimationFrame(() => {
    input.setSelectionRange(cursorPosition, cursorPosition);
  });
}

export interface CreatableSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CreatableSelectProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof creatableSelectTriggerVariants> {
  /** Currently selected value */
  value?: string;
  /** Callback when value changes (selection or creation) */
  onValueChange?: (value: string) => void;
  /** Available options */
  options?: CreatableSelectOption[];
  /** Placeholder when no value selected */
  placeholder?: string;
  /**
   * Optional hint shown above the options when the dropdown is open.
   * When omitted, no hint row is shown.
   */
  creatableHint?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Max character length for the value (enforced when open and when creating). When set, an in-field `current/max` counter renders before the chevron while the dropdown is open. */
  maxLength?: number;
  /**
   * When set, combobox input is transformed (e.g. strip invalid characters).
   * If the raw value differs from the sanitized value, `onInvalidCharacters` is called.
   */
  sanitizeInput?: (raw: string) => string;
  /**
   * Applied after `sanitizeInput` on the combobox value (e.g. collapse spaces).
   * Does not affect invalid-character detection, which compares `raw` to `sanitizeInput(raw)` only.
   */
  normalizeComboboxInput?: (sanitized: string) => string;
  /** Fired when `sanitizeInput` removed one or more characters from the raw input. */
  onInvalidCharacters?: () => void;
  /**
   * When `sanitizeInput` is set, fired on input change if the raw value is already valid
   * (nothing was stripped). Use to clear validation errors when the user corrects input.
   */
  onValidInput?: () => void;
  /** Fired with the current open-dropdown draft text so parents can validate while typing. */
  onInputValueChange?: (value: string) => void;
}

const CreatableSelect = React.forwardRef(
  (
    {
      className,
      state,
      value,
      onValueChange,
      options = [],
      placeholder = "Select an option",
      creatableHint,
      disabled = false,
      maxLength,
      sanitizeInput,
      normalizeComboboxInput,
      onInvalidCharacters,
      onValidInput,
      onInputValueChange,
      ...props
    }: CreatableSelectProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [highlightIndex, setHighlightIndex] = React.useState(-1);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);
    const listboxId = React.useId();

    // Merge forwarded ref with internal ref
    React.useImperativeHandle(ref, () => containerRef.current!);

    const normalizeSearchValue = React.useCallback(
      (raw: string) => {
        const sanitized = sanitizeInput ? sanitizeInput(raw) : raw;
        const normalized = normalizeComboboxInput
          ? normalizeComboboxInput(sanitized)
          : sanitized;
        return maxLength != null ? normalized.slice(0, maxLength) : normalized;
      },
      [maxLength, normalizeComboboxInput, sanitizeInput]
    );

    const selectedLabel = React.useMemo(() => {
      const found = options.find((o) => o.value === value);
      return found ? found.label : value || "";
    }, [options, value]);

    const filtered = React.useMemo(() => {
      if (!search.trim()) return options;
      const q = search.toLowerCase();
      return options.filter((o) => o.label.toLowerCase().includes(q));
    }, [options, search]);

    const isCustom =
      search.trim().length > 0 &&
      !options.some(
        (o) => o.label.toLowerCase() === search.trim().toLowerCase()
      );

    const handleOpen = () => {
      if (disabled) return;
      setOpen(true);
      setSearch("");
      onInputValueChange?.("");
      setHighlightIndex(-1);
      requestAnimationFrame(() => inputRef.current?.focus());
    };

    const handleSelect = React.useCallback(
      (val: string) => {
        if (disabled) return;
        onValueChange?.(val);
        setOpen(false);
        setSearch("");
        onInputValueChange?.("");
      },
      [disabled, onInputValueChange, onValueChange]
    );

    const handleCreate = React.useCallback(() => {
      if (disabled) return;
      const afterSanitize = sanitizeInput ? sanitizeInput(search) : search;
      const normalized = normalizeComboboxInput
        ? normalizeComboboxInput(afterSanitize)
        : afterSanitize;
      const trimmed = normalized.trim();
      if (trimmed) {
        const value = maxLength != null ? trimmed.slice(0, maxLength) : trimmed;
        onValueChange?.(value);
        setOpen(false);
        setSearch("");
        onInputValueChange?.("");
      }
    }, [
      search,
      disabled,
      onValueChange,
      onInputValueChange,
      maxLength,
      sanitizeInput,
      normalizeComboboxInput,
    ]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        setSearch("");
        onInputValueChange?.("");
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < filtered.length) {
          const opt = filtered[highlightIndex];
          if (!opt.disabled) handleSelect(opt.value);
        } else if (isCustom) {
          handleCreate();
        } else if (filtered.length === 1 && !filtered[0].disabled) {
          handleSelect(filtered[0].value);
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((prev) => {
          const next = prev + 1;
          return next >= filtered.length ? 0 : next;
        });
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((prev) => {
          const next = prev - 1;
          return next < 0 ? filtered.length - 1 : next;
        });
        return;
      }
    };

    // Scroll highlighted item into view
    React.useEffect(() => {
      if (highlightIndex >= 0 && listRef.current) {
        const item = listRef.current.children[highlightIndex] as HTMLElement;
        item?.scrollIntoView({ block: "nearest" });
      }
    }, [highlightIndex]);

    // Close on outside click
    React.useEffect(() => {
      if (!open) return;
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
          onInputValueChange?.("");
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [onInputValueChange, open]);

    // Reset highlight when filter changes
    React.useEffect(() => {
      setHighlightIndex(-1);
    }, [search]);

    return (
      <div
        ref={containerRef}
        className={cn(
          "font-[family-name:var(--font-v2,Inter,sans-serif)] relative w-full",
          className
        )}
        {...props}
      >
        {/* Trigger / Input */}
        {open ? (
          <div
            className={cn(
              creatableSelectTriggerVariants({ state }),
              "cursor-text",
              disabled &&
                "bg-semantic-bg-ui border-semantic-border-layout shadow-none hover:border-semantic-border-layout focus-within:border-semantic-border-layout focus-within:shadow-none"
            )}
            onClick={() => inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              type="text"
              disabled={disabled}
              aria-label={props["aria-label"] || placeholder}
              aria-labelledby={props["aria-labelledby"]}
              aria-describedby={props["aria-describedby"]}
              aria-invalid={props["aria-invalid"] ?? state === "error"}
              value={search}
              onChange={(e) => {
                const raw = e.target.value;
                const sanitized = sanitizeInput ? sanitizeInput(raw) : raw;
                if (sanitizeInput) {
                  if (raw !== sanitized) onInvalidCharacters?.();
                  else onValidInput?.();
                }
                const nextSearch = normalizeSearchValue(raw);
                setSearch(nextSearch);
                onInputValueChange?.(nextSearch);

                if (nextSearch !== raw) {
                  const input = e.currentTarget;
                  const rawCursor = input.selectionStart ?? raw.length;
                  const nextCursor = Math.min(
                    normalizeSearchValue(raw.slice(0, rawCursor)).length,
                    nextSearch.length
                  );
                  restoreInputCursor(input, nextCursor);
                }
              }}
              maxLength={maxLength}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 bg-transparent outline-none text-base text-[var(--v2-text-secondary,#5E5E5E)] placeholder:text-[var(--v2-text-placeholder,#707070)]"
              placeholder={selectedLabel || placeholder}
              aria-expanded="true"
              aria-haspopup="listbox"
              aria-controls={listboxId}
              role="combobox"
              aria-autocomplete="list"
            />
            {maxLength != null ? (
              <span className="mr-2 shrink-0 text-sm text-[var(--v2-text-muted,#707070)]">
                {search.length}/{maxLength}
              </span>
            ) : null}
            <ChevronDown className="size-4 text-[var(--v2-text-muted,#707070)] opacity-70 shrink-0 rotate-180 transition-transform" />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleOpen}
            disabled={disabled}
            aria-label={props["aria-label"]}
            aria-labelledby={props["aria-labelledby"]}
            aria-describedby={props["aria-describedby"]}
            aria-invalid={props["aria-invalid"] ?? state === "error"}
            className={cn(
              creatableSelectTriggerVariants({ state }),
              "cursor-pointer text-left"
            )}
            aria-haspopup="listbox"
            aria-expanded="false"
            aria-controls={listboxId}
          >
            <span
              className={cn(
                "line-clamp-1",
                !selectedLabel && "text-[var(--v2-text-placeholder,#707070)]"
              )}
            >
              {selectedLabel || placeholder}
            </span>
            <ChevronDown className="size-4 text-[var(--v2-text-muted,#707070)] opacity-70 shrink-0" />
          </button>
        )}

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 top-full z-[9999] mt-1 w-full rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
            {creatableHint ? (
              <div className={creatablePrimaryRoleHintRowClassName}>
                <span className="text-sm text-[var(--v2-text-muted,#707070)]">
                  {creatableHint}
                </span>
                <kbd className={creatableEnterHintKbdClassName}>Enter ↵</kbd>
              </div>
            ) : null}

            {/* Options list */}
            <div
              ref={listRef}
              id={listboxId}
              role="listbox"
              className="max-h-60 overflow-y-auto p-1"
            >
              {filtered.length === 0 && !isCustom && (
                <div className="px-4 py-2 text-sm text-[var(--v2-text-muted,#707070)]">
                  No options found
                </div>
              )}
              {filtered.map((opt, i) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  disabled={disabled || opt.disabled}
                  onClick={() => !opt.disabled && handleSelect(opt.value)}
                  onMouseEnter={() => setHighlightIndex(i)}
                  className={cn(
                    "relative flex w-full items-center rounded-md py-2 pl-4 pr-8 text-base text-[var(--v2-text-secondary,#5E5E5E)] outline-none cursor-pointer select-none",
                    "hover:bg-semantic-bg-ui",
                    opt.value === value &&
                      "font-medium text-[var(--v2-text-primary,#484848)]",
                    highlightIndex === i && "bg-semantic-bg-ui",
                    opt.disabled &&
                      "pointer-events-none opacity-50 cursor-not-allowed"
                  )}
                >
                  {opt.label}
                  {opt.value === value && (
                    <span className="absolute right-2 flex size-4 items-center justify-center">
                      <Check className="size-4 text-semantic-brand" />
                    </span>
                  )}
                </button>
              ))}

              {/* Show custom creation option */}
              {isCustom && (
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  disabled={disabled}
                  onClick={handleCreate}
                  onMouseEnter={() => setHighlightIndex(filtered.length)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm py-2 pl-4 pr-8 text-base outline-none cursor-pointer select-none",
                    "text-semantic-text-link hover:bg-semantic-bg-ui",
                    highlightIndex === filtered.length && "bg-semantic-bg-ui"
                  )}
                >
                  Create &ldquo;{search.trim()}&rdquo;
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);
CreatableSelect.displayName = "CreatableSelect";

export { CreatableSelect, creatableSelectTriggerVariants };
