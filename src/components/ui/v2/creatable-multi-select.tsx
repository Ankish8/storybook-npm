import * as React from "react";
import { animate, useReducedMotion } from "motion/react";
import { ChevronDown, Plus, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  creatableSelectTriggerVariants,
  creatableEnterHintKbdClassName,
  creatablePrimaryRoleHintRowClassName,
} from "./creatable-select";

/** @deprecated Use `creatableSelectTriggerVariants` from `./creatable-select` — aliases the same trigger styles as Primary Role. */
const creatableMultiSelectTriggerVariants = creatableSelectTriggerVariants;

export interface CreatableMultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CreatableMultiSelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** Currently selected values */
  value?: string[];
  /** Callback when values change */
  onValueChange?: (values: string[]) => void;
  /** Available preset options */
  options?: CreatableMultiSelectOption[];
  /** Placeholder when no values selected */
  placeholder?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Error state */
  state?: "default" | "error";
  /** Helper text shown below the trigger */
  helperText?: string;
  /**
   * Shown inside the open dropdown (e.g. "Type to create a custom tone").
   * Pair with {@link maxItems} so users see guidance when no preset matches their typing.
   */
  createHintText?: string;
  /** Max number of items that can be selected (default: unlimited) */
  maxItems?: number;
  /** Max character length per item when typing/creating (default: unlimited) */
  maxLengthPerItem?: number;
  /**
   * When true (default), shows `current/max` under the trigger while typing when `maxLengthPerItem` is set.
   * Set to false to match Figma (counter lives only in the field flow / not under the control).
   */
  showPerItemCharacterCounter?: boolean;
  /**
   * Closed trigger: show removable chips (default) or a single comma-separated summary line (Figma Tone).
   * In summary mode the field shows that line both closed and open and never draws chips, so while open the only way
   * to drop a value is Backspace on an empty draft (it removes the last one).
   */
  triggerDisplay?: "chips" | "summary";
  /**
   * When set, the text input is transformed (e.g. strip invalid characters).
   * If the raw value differs from the sanitized value, `onInvalidCharacters` is called.
   */
  sanitizeInput?: (raw: string) => string;
  /**
   * Applied after `sanitizeInput` on typed draft values (e.g. collapse spaces).
   * Does not affect invalid-character detection.
   */
  normalizeInput?: (sanitized: string) => string;
  /** Fired when `sanitizeInput` removed one or more characters from the raw input. */
  onInvalidCharacters?: () => void;
  /**
   * When `sanitizeInput` is set, fired on input change if the raw value is already valid.
   * Use to clear validation errors when the user corrects input.
   */
  onValidInput?: () => void;
  /** Fired with the current open-dropdown draft text so parents can validate while typing. */
  onInputValueChange?: (value: string) => void;
}

function joinSelectedLabels(
  values: string[],
  options: CreatableMultiSelectOption[],
  sanitizeInput?: (raw: string) => string,
  maxLengthPerItem?: number
): string {
  return values
    .map((val) => labelForValue(val, options, sanitizeInput, maxLengthPerItem))
    .join(", ");
}

function storedValueCandidates(
  option: CreatableMultiSelectOption,
  sanitizeInput?: (raw: string) => string,
  maxLengthPerItem?: number
): string[] {
  const values = [option.value];
  if (sanitizeInput) values.push(sanitizeInput(option.value).trim());
  if (maxLengthPerItem != null) {
    values.push(option.value.slice(0, maxLengthPerItem));
    if (sanitizeInput) {
      values.push(
        sanitizeInput(option.value).trim().slice(0, maxLengthPerItem)
      );
    }
  }
  return Array.from(new Set(values.filter(Boolean)));
}

function labelForValue(
  val: string,
  options: CreatableMultiSelectOption[],
  sanitizeInput?: (raw: string) => string,
  maxLengthPerItem?: number
): string {
  const direct = options.find((o) => o.value === val);
  if (direct) return direct.label;
  const byStoredForm = options.find((o) =>
    storedValueCandidates(o, sanitizeInput, maxLengthPerItem).includes(val)
  );
  if (byStoredForm) return byStoredForm.label;
  return val;
}

/** Whether a preset option is already in the selection (including legacy stored forms). */
function isOptionSelected(
  option: CreatableMultiSelectOption,
  selected: string[],
  sanitizeInput?: (raw: string) => string,
  maxLengthPerItem?: number
): boolean {
  return storedValueCandidates(option, sanitizeInput, maxLengthPerItem).some(
    (candidate) => selected.includes(candidate)
  );
}

/** Whether a candidate value is already selected (matches raw or legacy preset forms). */
function isValueAlreadySelected(
  candidate: string,
  selected: string[],
  options: CreatableMultiSelectOption[],
  sanitizeInput?: (raw: string) => string,
  maxLengthPerItem?: number
): boolean {
  if (selected.includes(candidate)) return true;
  return options.some((o) => {
    const candidates = storedValueCandidates(
      o,
      sanitizeInput,
      maxLengthPerItem
    );
    return (
      candidates.includes(candidate) &&
      candidates.some((stored) => selected.includes(stored))
    );
  });
}

/**
 * The field stays white while it is hovered, pressed and open. Chips are filled `bg-v2-semantic-bg-ui` (#F5F5F5), the
 * colour the shared trigger variants tint a hovered or open field, so on that tint a chip was told apart from its
 * field by a 1px border alone. Interaction shows on the border instead (hover, then the primary border when open).
 * A disabled field is grey, so its chips are filled white.
 *
 * Arc's tag input chip: a 28px pill with a 1px border, 9px / 4px padding and a
 * 3px gap to its remove button. It grows in from .9 through a soft blur
 * (`@starting-style` gives the freshly mounted node its start; keyed chips stay
 * mounted, so only a new one plays it). Wrapped in `cn(...)` so the CLI prefixer
 * transforms the literal.
 */
const chipClassName = cn(
  "inline-flex min-h-7 max-w-full items-center gap-[3px] rounded-lg border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-ui pl-[9px] pr-1 text-sm font-normal leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-primary,#484848)] [transition:opacity_160ms_cubic-bezier(0.16,1,0.3,1),transform_260ms_cubic-bezier(0.16,1,0.3,1),filter_240ms_cubic-bezier(0.16,1,0.3,1)] [@starting-style]:scale-90 [@starting-style]:opacity-0 [@starting-style]:blur-[4px] motion-reduce:[@starting-style]:scale-100 motion-reduce:[@starting-style]:blur-0"
);

/**
 * Arc's chevron turns on a 580ms spring that settles with a hint of life; the
 * sampled curve is Arc's own `--ease-spring`. Wrapped in `cn(...)` so the CLI
 * prefixer transforms the literal.
 */
const chevronSpringClassName = cn(
  "[stroke-width:1.75] [transition-property:transform,color] [transition-duration:580ms] [transition-timing-function:linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)] motion-reduce:transition-none"
);

/**
 * Chip remove button: 22px plate (Arc), 24px hit area (the invisible `::before`
 * reaches 1px past the plate), 14px icon. The plate is `bg-v2-semantic-bg-grey`, one step
 * darker than the chip fill: `bg-v2-semantic-bg-ui` / `bg-v2-semantic-bg-hover` are
 * both #F5F5F5, identical to the chip, so a hover plate in either was invisible.
 * Hover is gated so a tap on touch does not leave the plate stuck. Arc's press:
 * a quick dip to .96 (120ms) and a spring release (580ms).
 */
function chipRemoveClassName(disabled: boolean) {
  return cn(
    "relative inline-flex size-[22px] shrink-0 items-center justify-center rounded-md focus-visible:[outline:2px_solid_var(--v2-semantic-border-focus,var(--semantic-primary))] focus-visible:outline-offset-[-2px] text-[var(--v2-text-muted,#707070)] [transition-property:background-color,color,transform] [transition-duration:160ms,160ms,580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)] before:absolute before:-inset-px before:content-[''] motion-reduce:transition-none",
    !disabled &&
      "[@media(hover:hover)]:hover:bg-v2-semantic-bg-grey [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)] active:scale-[0.96] active:[transition-duration:160ms,160ms,120ms] active:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:active:scale-100"
  );
}

/**
 * Arc's chip group chip, which the preset suggestions follow: a 36px pill with a
 * 1px border and 14px side padding, 500 weight. Hover darkens the border
 * and text; a press dips to .97 in 120ms and springs back over 580ms.
 */
const presetChipClassName = cn(
  "inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-lg focus-visible:[outline:2px_solid_var(--v2-semantic-border-focus,var(--semantic-primary))] focus-visible:outline-offset-[-2px] border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary px-[14px] text-left text-sm font-medium leading-5 tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)] [transition-property:color,border-color,background-color,transform] [transition-duration:160ms,160ms,160ms,580ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),cubic-bezier(0.22,1,0.36,1),linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)] [@media(hover:hover)]:hover:border-[var(--v2-semantic-border-primary,var(--color-primary-100,#C0C3CA))] [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)] active:scale-[0.97] active:[transition-duration:160ms,160ms,160ms,120ms] active:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:active:scale-100"
);

/** Springs an element's height to `measure()` whenever `observed` resizes. Arc's tag input and combobox do this so wrapping chips and filtering never snap. */
function useSpringHeight(
  target: React.RefObject<HTMLElement | null>,
  observed: React.RefObject<HTMLElement | null>,
  measure: (target: HTMLElement, observed: HTMLElement) => number,
  deps: React.DependencyList
) {
  const reduceMotion = useReducedMotion();
  React.useEffect(() => {
    const el = target.current;
    const watched = observed.current;
    if (!el || !watched || typeof ResizeObserver === "undefined") return;
    let measured = false;
    let controls: ReturnType<typeof animate> | undefined;
    const observer = new ResizeObserver(() => {
      const next = measure(el, watched);
      controls?.stop();
      if (!measured || reduceMotion) {
        measured = true;
        el.style.height = `${next}px`;
        return;
      }
      controls = animate(
        el,
        { height: next },
        { type: "spring", visualDuration: 0.4, bounce: 0 }
      );
    });
    observer.observe(watched);
    return () => {
      observer.disconnect();
      controls?.stop();
    };
    // `measure` is a stable module-level function at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, ...deps]);
}

/** Shell height: the wrapped chip rows plus the shell's own padding and border, never under its minimum. */
function measureShell(shell: HTMLElement, content: HTMLElement) {
  const style = getComputedStyle(shell);
  const chrome =
    parseFloat(style.paddingTop) +
    parseFloat(style.paddingBottom) +
    parseFloat(style.borderTopWidth) +
    parseFloat(style.borderBottomWidth);
  return Math.max(
    parseFloat(style.minHeight) || 0,
    content.offsetHeight + chrome
  );
}

function measureContent(_target: HTMLElement, content: HTMLElement) {
  return content.offsetHeight;
}

/** Panel body that follows its content height on a spring while presets filter. */
function AutoHeight({ children }: { children: React.ReactNode }) {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  useSpringHeight(outerRef, innerRef, measureContent, []);
  return (
    <div ref={outerRef} className="overflow-hidden">
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

/**
 * The placeholder and the summary line. The wrapper is as tall as a chip (28px) and centres its text, so the
 * line sits in the middle of the 44px field the way a chip row does, instead of hugging its top edge.
 */
function FieldText({
  muted = false,
  grow = true,
  children,
}: {
  muted?: boolean;
  grow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "flex min-h-7 min-w-0 items-center px-[5px]",
        grow && "flex-1"
      )}
    >
      <span
        className={cn(
          "line-clamp-2 text-sm leading-[1.4] tracking-[-0.01em]",
          muted
            ? "text-[var(--v2-text-placeholder,#707070)]"
            : "text-[var(--v2-text-primary,#484848)]"
        )}
      >
        {children}
      </span>
    </span>
  );
}

function restoreInputCursor(input: HTMLInputElement, cursorPosition: number) {
  window.requestAnimationFrame(() => {
    input.setSelectionRange(cursorPosition, cursorPosition);
  });
}

const CreatableMultiSelect = React.forwardRef(
  (
    {
      className,
      value = [],
      onValueChange,
      options = [],
      placeholder = "Enter or select",
      disabled = false,
      state = "default",
      helperText,
      createHintText,
      maxItems,
      maxLengthPerItem,
      showPerItemCharacterCounter = true,
      triggerDisplay = "chips",
      sanitizeInput,
      normalizeInput,
      onInvalidCharacters,
      onValidInput,
      onInputValueChange,
      ...props
    }: CreatableMultiSelectProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    // Only one shell (open or closed) is mounted at a time, so they share these refs.
    const shellRef = React.useRef<HTMLDivElement>(null);
    const chipRowRef = React.useRef<HTMLDivElement>(null);
    useSpringHeight(shellRef, chipRowRef, measureShell, [isOpen]);
    const listboxId = React.useId();
    const helperId = React.useId();
    const descriptionId =
      props["aria-describedby"] ||
      (helperText && !isOpen ? helperId : undefined);

    React.useImperativeHandle(ref, () => containerRef.current!);

    const derivedState = state === "error" ? "error" : "default";

    const selectedSummary = joinSelectedLabels(
      value,
      options,
      sanitizeInput,
      maxLengthPerItem
    );

    const normalizeDraftValue = React.useCallback(
      (raw: string) => {
        const sanitized = sanitizeInput ? sanitizeInput(raw) : raw;
        const normalized = normalizeInput
          ? normalizeInput(sanitized)
          : sanitized;
        return maxLengthPerItem != null
          ? normalized.slice(0, maxLengthPerItem)
          : normalized;
      },
      [maxLengthPerItem, normalizeInput, sanitizeInput]
    );

    const addValue = (val: string) => {
      if (disabled) return;
      // A click passes an option's value; Enter passes whatever was typed. Typing a suggestion's name (any case)
      // has to pick that suggestion, not create a look-alike next to it, and a disabled option stays unavailable.
      const typed = val.trim().toLowerCase();
      const matched =
        options.find((o) => o.value === val) ??
        options.find(
          (o) =>
            o.value.toLowerCase() === typed || o.label.toLowerCase() === typed
        );
      if (matched?.disabled) return;
      const isPreset = Boolean(matched);
      const chosen = matched ? matched.value : val;
      const afterSanitize = isPreset
        ? chosen
        : sanitizeInput
          ? sanitizeInput(chosen)
          : chosen;
      const afterNormalize =
        isPreset || !normalizeInput
          ? afterSanitize
          : normalizeInput(afterSanitize);
      const trimmed = afterNormalize.trim();
      if (
        !trimmed ||
        isValueAlreadySelected(
          trimmed,
          value,
          options,
          sanitizeInput,
          maxLengthPerItem
        )
      ) {
        return;
      }
      if (maxItems != null && value.length >= maxItems) return;
      const toAdd =
        !isPreset && maxLengthPerItem != null
          ? trimmed.slice(0, maxLengthPerItem)
          : trimmed;
      if (toAdd) {
        const nextValue = [...value, toAdd];
        onValueChange?.(nextValue);
        setInputValue("");
        onInputValueChange?.("");
        const reachedMax = maxItems != null && nextValue.length >= maxItems;
        if (reachedMax) {
          setIsOpen(false);
        } else {
          requestAnimationFrame(() => inputRef.current?.focus());
        }
      }
    };

    const removeValue = (val: string) => {
      if (disabled) return;
      onValueChange?.(value.filter((v) => v !== val));
    };

    const handleOpen = React.useCallback(() => {
      if (disabled) return;
      setIsOpen(true);
      setInputValue("");
      onInputValueChange?.("");
    }, [disabled, onInputValueChange]);

    React.useEffect(() => {
      if (!isOpen) return;
      requestAnimationFrame(() => inputRef.current?.focus());
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (inputValue.trim()) addValue(inputValue);
      } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
        removeValue(value[value.length - 1]);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setInputValue("");
        onInputValueChange?.("");
      }
    };

    // Close on outside click
    React.useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
          setInputValue("");
          onInputValueChange?.("");
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [onInputValueChange]);

    const availablePresets = options.filter(
      (o) =>
        !isOptionSelected(o, value, sanitizeInput, maxLengthPerItem) &&
        !o.disabled
    );
    const trimmedInput = inputValue.trim();
    const filteredPresets = trimmedInput
      ? availablePresets.filter((o) =>
          o.label.toLowerCase().includes(trimmedInput.toLowerCase())
        )
      : availablePresets;

    const isCustomDraft =
      trimmedInput.length > 0 &&
      !options.some(
        (o) =>
          o.label.toLowerCase() === trimmedInput.toLowerCase() ||
          o.value.toLowerCase() === trimmedInput.toLowerCase()
      ) &&
      !isValueAlreadySelected(
        trimmedInput,
        value,
        options,
        sanitizeInput,
        maxLengthPerItem
      ) &&
      (maxItems == null || value.length < maxItems);

    const summaryTriggerLabel =
      value.length === 0 ? placeholder : selectedSummary;

    const canAddMore = maxItems == null || value.length < maxItems;
    // Typing stops silently at the limit, so the counter changes colour to say why.
    const atLimit =
      maxLengthPerItem != null && inputValue.length >= maxLengthPerItem;

    return (
      <div
        ref={containerRef}
        className={cn(
          "font-[family-name:var(--font-v2,Inter,sans-serif)] relative w-full",
          className
        )}
        {...props}
      >
        <div className="font-[family-name:var(--font-v2,Inter,sans-serif)] relative w-full">
          {isOpen && (
            <div
              ref={shellRef}
              data-state="open"
              className={cn(
                creatableSelectTriggerVariants({ state: derivedState }),
                "flex h-auto min-h-11 cursor-text items-start gap-2 overflow-hidden p-[7px] text-left",
                !disabled && "data-[state=open]:bg-v2-semantic-bg-primary",
                disabled &&
                  "bg-v2-semantic-bg-ui border-v2-semantic-border-layout shadow-none hover:border-v2-semantic-border-layout focus-within:shadow-none"
              )}
              onClick={(e) => {
                if (disabled) return;
                if ((e.target as HTMLElement).closest("[data-chip-remove]")) {
                  return;
                }
                inputRef.current?.focus();
              }}
            >
              <div
                ref={chipRowRef}
                className="flex min-h-0 min-w-0 flex-1 flex-wrap content-start items-center gap-1.5"
              >
                {triggerDisplay === "chips" &&
                  value.map((val) => (
                    <span
                      key={val}
                      className={cn(
                        chipClassName,
                        disabled && "bg-v2-semantic-bg-primary"
                      )}
                    >
                      <span className="min-w-0 truncate">
                        {labelForValue(
                          val,
                          options,
                          sanitizeInput,
                          maxLengthPerItem
                        )}
                      </span>
                      <button
                        type="button"
                        data-chip-remove
                        disabled={disabled}
                        aria-label={`Remove ${labelForValue(
                          val,
                          options,
                          sanitizeInput,
                          maxLengthPerItem
                        )}`}
                        className={chipRemoveClassName(disabled)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!disabled) removeValue(val);
                        }}
                      >
                        <X
                          className="size-3.5 [stroke-width:1.75]"
                          aria-hidden
                        />
                      </button>
                    </span>
                  ))}
                {triggerDisplay === "summary" && value.length > 0 ? (
                  <FieldText grow={false}>{selectedSummary}</FieldText>
                ) : null}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const sanitized = sanitizeInput ? sanitizeInput(raw) : raw;
                    if (sanitizeInput) {
                      if (raw !== sanitized) onInvalidCharacters?.();
                      else onValidInput?.();
                    }
                    const nextInput = normalizeDraftValue(raw);
                    setInputValue(nextInput);
                    onInputValueChange?.(nextInput);

                    if (nextInput !== raw) {
                      const input = e.currentTarget;
                      const rawCursor = input.selectionStart ?? raw.length;
                      const nextCursor = Math.min(
                        normalizeDraftValue(raw.slice(0, rawCursor)).length,
                        nextInput.length
                      );
                      restoreInputCursor(input, nextCursor);
                    }
                  }}
                  maxLength={maxLengthPerItem}
                  placeholder={value.length === 0 ? placeholder : undefined}
                  onKeyDown={handleKeyDown}
                  disabled={disabled}
                  aria-label={props["aria-label"] || placeholder}
                  aria-labelledby={props["aria-labelledby"]}
                  aria-describedby={descriptionId}
                  aria-invalid={props["aria-invalid"] ?? state === "error"}
                  className="min-h-7 min-w-[80px] flex-[1_1_100px] bg-transparent px-[5px] text-sm leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)] outline-none placeholder:text-[var(--v2-text-placeholder,#707070)]"
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls={listboxId}
                  aria-haspopup="listbox"
                  aria-autocomplete="list"
                />
              </div>
              {maxLengthPerItem != null && showPerItemCharacterCounter ? (
                <span
                  data-at-limit={atLimit || undefined}
                  className={cn(
                    "mr-2 mt-1 shrink-0 self-start text-sm leading-[1.4]",
                    atLimit
                      ? "text-v2-semantic-error-text"
                      : "text-[var(--v2-text-muted,#707070)]"
                  )}
                >
                  {inputValue.length}/{maxLengthPerItem}
                </span>
              ) : null}
              <ChevronDown
                className={cn(
                  "mr-1 mt-1.5 size-4 shrink-0 self-start rotate-180 text-[var(--v2-text-muted,#707070)] opacity-70 motion-safe:animate-in spin-in-0 motion-safe:[animation-duration:580ms] motion-safe:[animation-timing-function:linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)]",
                  chevronSpringClassName
                )}
                aria-hidden
              />
            </div>
          )}

          {!isOpen && (
            <div
              ref={shellRef}
              role="combobox"
              tabIndex={disabled ? -1 : 0}
              aria-haspopup="listbox"
              aria-expanded={false}
              aria-controls={listboxId}
              aria-disabled={disabled || undefined}
              aria-label={props["aria-label"] || placeholder}
              aria-labelledby={props["aria-labelledby"]}
              aria-describedby={descriptionId}
              aria-invalid={props["aria-invalid"] ?? state === "error"}
              onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpen();
                }
              }}
              onClick={(e) => {
                if (disabled) return;
                if ((e.target as HTMLElement).closest("[data-chip-remove]")) {
                  return;
                }
                handleOpen();
              }}
              className={cn(
                creatableSelectTriggerVariants({ state: derivedState }),
                "flex h-auto min-h-11 cursor-pointer items-start gap-2 overflow-hidden p-[7px] text-left outline-none",
                disabled &&
                  "cursor-not-allowed bg-v2-semantic-bg-ui border-v2-semantic-border-layout shadow-none hover:border-v2-semantic-border-layout focus-within:shadow-none"
              )}
            >
              <div
                ref={chipRowRef}
                className="flex min-h-0 min-w-0 flex-1 flex-wrap content-start items-center gap-1.5"
              >
                {triggerDisplay === "summary" ? (
                  <FieldText muted={value.length === 0}>
                    {summaryTriggerLabel}
                  </FieldText>
                ) : value.length === 0 ? (
                  <FieldText muted>{placeholder}</FieldText>
                ) : (
                  value.map((val) => (
                    <span
                      key={val}
                      className={cn(
                        chipClassName,
                        disabled && "bg-v2-semantic-bg-primary"
                      )}
                    >
                      <span className="min-w-0 truncate">
                        {labelForValue(
                          val,
                          options,
                          sanitizeInput,
                          maxLengthPerItem
                        )}
                      </span>
                      <button
                        type="button"
                        data-chip-remove
                        disabled={disabled}
                        aria-label={`Remove ${labelForValue(
                          val,
                          options,
                          sanitizeInput,
                          maxLengthPerItem
                        )}`}
                        className={chipRemoveClassName(disabled)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!disabled) removeValue(val);
                        }}
                      >
                        <X
                          className="size-3.5 [stroke-width:1.75]"
                          aria-hidden
                        />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <ChevronDown
                className={cn(
                  "mr-1 mt-1.5 size-4 shrink-0 self-start text-[var(--v2-text-muted,#707070)] opacity-70",
                  chevronSpringClassName
                )}
                aria-hidden
              />
            </div>
          )}

          {/* Dropdown panel: decorative hint row, counter, max-selections, presets. Input lives in the trigger above.
              CSS-anchored 8px below the field (no flip), so it always grows from the top edge. */}
          {isOpen && (
            <div className="absolute left-0 top-full z-[9999] mt-2 flex w-full origin-top flex-col overflow-hidden rounded-lg border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary shadow-[var(--v2-shadow-popover,0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045))] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.97] motion-safe:[animation-duration:260ms] [animation-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-[v2-fade-in_120ms_ease-out] motion-safe:slide-in-from-top-[6px]">
              {createHintText ? (
                <div className={creatablePrimaryRoleHintRowClassName}>
                  <span className="text-sm text-[var(--v2-text-muted,#707070)]">
                    {createHintText}
                  </span>
                  <kbd className={creatableEnterHintKbdClassName}>Enter ↵</kbd>
                </div>
              ) : null}

              <AutoHeight>
                {(canAddMore ||
                  filteredPresets.length > 0 ||
                  isCustomDraft) && (
                  <div className="flex flex-col gap-2 p-2">
                    {maxItems != null && canAddMore ? (
                      <p className="m-0 px-2 py-1 text-sm text-[var(--v2-text-muted,#707070)]">
                        Max selections allowed: {maxItems}
                      </p>
                    ) : null}

                    {filteredPresets.length > 0 ? (
                      <div
                        id={listboxId}
                        role="listbox"
                        className="flex flex-wrap gap-2"
                      >
                        {filteredPresets.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={false}
                            disabled={disabled}
                            onMouseDown={(e) => {
                              e.preventDefault();
                            }}
                            onClick={() => addValue(option.value)}
                            className={presetChipClassName}
                          >
                            <Plus
                              className="size-2.5 shrink-0 text-[var(--v2-text-muted,#707070)] [stroke-width:1.75]"
                              aria-hidden
                            />
                            {option.label}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {isCustomDraft ? (
                      <button
                        type="button"
                        role="option"
                        aria-selected={false}
                        disabled={disabled}
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        onClick={() => addValue(inputValue)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-v2-semantic-text-link outline-none focus-visible:[outline:2px_solid_var(--v2-semantic-border-focus,var(--semantic-primary))] focus-visible:outline-offset-[-2px] transition-colors cursor-pointer select-none hover:bg-v2-semantic-bg-ui"
                      >
                        Create &ldquo;{trimmedInput}&rdquo;
                      </button>
                    ) : null}
                  </div>
                )}
              </AutoHeight>
            </div>
          )}
        </div>

        {helperText && !isOpen ? (
          <div className="mt-2 flex items-center gap-1.5">
            <Info className="size-[18px] shrink-0 text-[var(--v2-text-muted,#707070)]" />
            <p
              id={helperId}
              className="m-0 text-xs leading-[1.4] text-[var(--v2-text-muted,#707070)]"
            >
              {helperText}
            </p>
          </div>
        ) : null}
      </div>
    );
  }
);
CreatableMultiSelect.displayName = "CreatableMultiSelect";

export { CreatableMultiSelect, creatableMultiSelectTriggerVariants };
