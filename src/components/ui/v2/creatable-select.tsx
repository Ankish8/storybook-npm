import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { animate, useReducedMotion } from "motion/react";
import { ChevronDown, Check } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Arc's chevron turns on a 580ms spring that settles with a hint of life; the
 * sampled curve is Arc's own `--ease-spring`. Wrapped in `cn(...)` so the CLI
 * prefixer transforms the literal. `creatable-multi-select` repeats it.
 */
const chevronSpringClassName = cn(
  "[stroke-width:1.75] [transition-property:transform,color] [transition-duration:580ms] [transition-timing-function:linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)] motion-reduce:transition-none"
);

const creatableSelectTriggerVariants = cva(
  "flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-semantic-bg-primary px-3 py-2 font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal text-sm leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)] outline-none transition-[border-color,box-shadow,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms] disabled:cursor-not-allowed disabled:bg-semantic-bg-ui disabled:border-semantic-border-layout disabled:opacity-50 disabled:shadow-none disabled:hover:border-semantic-border-layout",
  {
    variants: {
      state: {
        default:
          // The open field is its own element (data-state open), and clicking the
          // list moves focus out of it, so `focus-within` alone lets the glow drop while
          // the panel is still open. The `hover` variant outranks the grey hover border.
          // Arc also tints the field on hover, press and while open (its muted surface).
          "border border-solid border-semantic-border-input hover:border-[var(--color-primary-100,#C0C3CA)] [@media(hover:hover)]:enabled:hover:bg-semantic-bg-ui enabled:active:bg-semantic-bg-ui focus-within:shadow-none data-[state=open]:border-semantic-primary data-[state=open]:bg-semantic-bg-ui data-[state=open]:shadow-none data-[state=open]:hover:border-semantic-primary",
        error:
          "border border-solid border-semantic-error-primary shadow-[0_0_4px_0_rgba(240,68,56,0.4)]  ",
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

/**
 * Arc's combobox follows its list height on a critically damped spring (about
 * 400ms, no overshoot), so filtering never snaps the panel. The wrapper clips
 * while it moves; the first measurement is applied without animation and
 * reduced motion applies every change at once.
 */
function AutoHeight({ children }: { children: React.ReactNode }) {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner || typeof ResizeObserver === "undefined") return;
    let measured = false;
    let controls: ReturnType<typeof animate> | undefined;
    const observer = new ResizeObserver(() => {
      const next = inner.offsetHeight;
      if (!measured || reduceMotion) {
        measured = true;
        controls?.stop();
        outer.style.height = `${next}px`;
        return;
      }
      controls?.stop();
      controls = animate(
        outer,
        { height: next },
        { type: "spring", visualDuration: 0.4, bounce: 0 }
      );
    });
    observer.observe(inner);
    return () => {
      observer.disconnect();
      controls?.stop();
    };
  }, [reduceMotion]);

  return (
    <div ref={outerRef} className="overflow-hidden">
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

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
    // Focus stays in the input, so the ring cannot come from the focus-visible pseudo-class.
    // Track who moved the highlight instead: only arrow keys earn the ring.
    const [highlightByKeyboard, setHighlightByKeyboard] = React.useState(false);
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
        setHighlightByKeyboard(true);
        setHighlightIndex((prev) => {
          const next = prev + 1;
          return next >= filtered.length ? 0 : next;
        });
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightByKeyboard(true);
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
      setHighlightByKeyboard(false);
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
            data-state="open"
            className={cn(
              creatableSelectTriggerVariants({ state }),
              "cursor-text",
              disabled &&
                "bg-semantic-bg-ui border-semantic-border-layout shadow-none hover:border-semantic-border-layout focus-within:shadow-none"
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
              className="flex-1 min-w-0 bg-transparent outline-none text-sm text-[var(--v2-text-secondary,#5E5E5E)] placeholder:text-[var(--v2-text-placeholder,#707070)]"
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
            <ChevronDown
              className={cn(
                "size-4 text-[var(--v2-text-muted,#707070)] opacity-70 shrink-0 rotate-180 motion-safe:animate-in spin-in-0 motion-safe:[animation-duration:580ms] motion-safe:[animation-timing-function:linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)]",
                chevronSpringClassName
              )}
            />
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
            <ChevronDown className="size-4 text-[var(--v2-text-muted,#707070)] opacity-70 shrink-0 [stroke-width:1.75]" />
          </button>
        )}

        {/* Dropdown. CSS-anchored 8px below the field (no flip), so it always grows from the
            top edge; there is no placement to derive the origin from. */}
        {open && (
          <div className="absolute left-0 top-full z-[9999] mt-2 w-full origin-top rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary shadow-[0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045)] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.97] motion-safe:[animation-duration:260ms] [animation-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-[v2-fade-in_120ms_ease-out] motion-safe:slide-in-from-top-[6px]">
            {creatableHint ? (
              <div className={creatablePrimaryRoleHintRowClassName}>
                <span className="text-sm text-[var(--v2-text-muted,#707070)]">
                  {creatableHint}
                </span>
                <kbd className={creatableEnterHintKbdClassName}>Enter ↵</kbd>
              </div>
            ) : null}

            {/* Options list. The panel height follows it on a spring while filtering. */}
            <AutoHeight>
              <div
                ref={listRef}
                id={listboxId}
                role="listbox"
                className="max-h-[min(300px,40vh)] overflow-y-auto p-[5px]"
              >
                {filtered.length === 0 && !isCustom && (
                  <div className="p-3 text-sm text-[var(--v2-text-muted,#707070)]">
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
                    onMouseEnter={() => {
                      setHighlightIndex(i);
                      setHighlightByKeyboard(false);
                    }}
                    className={cn(
                      // 4px radius = panel 8px minus its 4px padding (concentric corners). Arc: 36px
                      // rows with the check inline, an 80ms highlight, and no weight change on selection.
                      "relative flex min-h-9 w-full items-center justify-between gap-3 rounded-sm px-3 py-2 text-left text-sm leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)] outline-none cursor-pointer select-none transition-[background-color,color] [transition-duration:80ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                      "hover:bg-semantic-bg-ui",
                      opt.value === value &&
                        "text-[var(--v2-text-primary,#484848)]",
                      highlightIndex === i && "bg-semantic-bg-ui",
                      highlightIndex === i &&
                        highlightByKeyboard &&
                        "ring-1 ring-inset ring-semantic-border-accent",
                      opt.disabled &&
                        "pointer-events-none opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span className="min-w-0 flex-1 break-words">
                      {opt.label}
                    </span>
                    {opt.value === value && (
                      <Check className="size-4 shrink-0 text-semantic-primary [stroke-width:1.75]" />
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
                    onMouseEnter={() => {
                      setHighlightIndex(filtered.length);
                      setHighlightByKeyboard(false);
                    }}
                    className={cn(
                      "flex min-h-9 w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm leading-[1.4] tracking-[-0.01em] outline-none cursor-pointer select-none transition-[background-color,color] [transition-duration:80ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                      "text-semantic-text-link hover:bg-semantic-bg-ui",
                      highlightIndex === filtered.length && "bg-semantic-bg-ui",
                      highlightIndex === filtered.length &&
                        highlightByKeyboard &&
                        "ring-1 ring-inset ring-semantic-border-accent"
                    )}
                  >
                    Create &ldquo;{search.trim()}&rdquo;
                  </button>
                )}
              </div>
            </AutoHeight>
          </div>
        )}
      </div>
    );
  }
);
CreatableSelect.displayName = "CreatableSelect";

export { CreatableSelect, creatableSelectTriggerVariants };
