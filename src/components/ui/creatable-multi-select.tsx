import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronDown, ChevronRight, Plus, X, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const creatableMultiSelectTriggerVariants = cva(
  "flex items-center gap-2 flex-wrap min-h-[42px] w-full px-4 py-2 rounded bg-semantic-bg-primary cursor-text transition-shadow",
  {
    variants: {
      state: {
        default:
          "border border-solid border-semantic-border-input hover:border-semantic-border-input-focus",
        error:
          "border border-solid border-semantic-error-primary/40 hover:border-semantic-error-primary",
        focused:
          "border border-solid border-semantic-border-focus shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        "focused-error":
          "border border-solid border-semantic-error-primary/60 shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

export interface CreatableMultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface CreatableMultiSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Currently selected values */
  value?: string[]
  /** Callback when values change */
  onValueChange?: (values: string[]) => void
  /** Available preset options */
  options?: CreatableMultiSelectOption[]
  /** Placeholder when no values selected */
  placeholder?: string
  /** Whether the component is disabled */
  disabled?: boolean
  /** Error state */
  state?: "default" | "error"
  /** Helper text shown below the trigger */
  helperText?: string
  /**
   * Shown inside the open dropdown (e.g. "Type to create a custom tone").
   * Pair with {@link maxItems} so users see guidance when no preset matches their typing.
   */
  createHintText?: string
  /** Max number of items that can be selected (default: unlimited) */
  maxItems?: number
  /** Max character length per item when typing/creating (default: unlimited) */
  maxLengthPerItem?: number
  /**
   * When set, the text input is transformed (e.g. strip invalid characters).
   * If the raw value differs from the sanitized value, `onInvalidCharacters` is called.
   */
  sanitizeInput?: (raw: string) => string
  /** Fired when `sanitizeInput` removed one or more characters from the raw input. */
  onInvalidCharacters?: () => void
  /**
   * When `sanitizeInput` is set, fired on input change if the raw value is already valid.
   * Use to clear validation errors when the user corrects input.
   */
  onValidInput?: () => void
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
      sanitizeInput,
      onInvalidCharacters,
      onValidInput,
      ...props
    }: CreatableMultiSelectProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listboxId = React.useId()

    React.useImperativeHandle(ref, () => containerRef.current!)

    const addValue = React.useCallback(
      (val: string) => {
        const afterSanitize = sanitizeInput ? sanitizeInput(val) : val
        const trimmed = afterSanitize.trim()
        if (!trimmed || value.includes(trimmed)) return
        if (maxItems != null && value.length >= maxItems) return
        const toAdd =
          maxLengthPerItem != null
            ? trimmed.slice(0, maxLengthPerItem)
            : trimmed
        if (toAdd) {
          onValueChange?.([...value, toAdd])
          setInputValue("")
        }
      },
      [value, onValueChange, maxItems, maxLengthPerItem, sanitizeInput]
    )

    const removeValue = React.useCallback(
      (val: string) => {
        onValueChange?.(value.filter((v) => v !== val))
      },
      [value, onValueChange]
    )

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        if (inputValue.trim()) addValue(inputValue)
      } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
        removeValue(value[value.length - 1])
      } else if (e.key === "Escape") {
        setIsOpen(false)
        setInputValue("")
      }
    }

    // Close on outside click
    React.useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false)
          setInputValue("")
        }
      }
      document.addEventListener("mousedown", handler)
      return () => document.removeEventListener("mousedown", handler)
    }, [])

    const availablePresets = options.filter(
      (o) => !value.includes(o.value) && !o.disabled
    )
    const filteredPresets = inputValue.trim()
      ? availablePresets.filter((o) =>
          o.label.toLowerCase().includes(inputValue.trim().toLowerCase())
        )
      : availablePresets

    const afterSanitizeDraft = sanitizeInput
      ? sanitizeInput(inputValue)
      : inputValue
    const trimmedDraft = afterSanitizeDraft.trim()
    const draftForCreate = trimmedDraft
      ? maxLengthPerItem != null
        ? trimmedDraft.slice(0, maxLengthPerItem)
        : trimmedDraft
      : ""

    const canShowEnterAffordance =
      Boolean(draftForCreate) &&
      !value.includes(draftForCreate) &&
      (maxItems == null || value.length < maxItems)

    const hasHintCopy = Boolean(createHintText) || maxItems != null

    const showHintsRow =
      hasHintCopy || canShowEnterAffordance

    const triggerState = isOpen
      ? state === "error"
        ? "focused-error"
        : "focused"
      : state

    /** Must match `CreatableSelect` hint-row `<kbd>` (Primary Role) — includes `font-sans` to override UA monospace on `<kbd>`. */
    const creatableHintEnterKbdClassName =
      "inline-flex items-center gap-0.5 rounded border border-solid border-semantic-border-layout bg-semantic-bg-ui px-1.5 py-0.5 font-sans text-[10px] font-medium text-semantic-text-muted"

    return (
      <div
        ref={containerRef}
        className={cn("relative w-full", className)}
        {...props}
      >
        {/* Positioning context = trigger only so the dropdown aligns like CreatableSelect (counter sits below, not above the panel). */}
        <div className="relative w-full">
          {/* Trigger */}
          <div
            className={cn(
              creatableMultiSelectTriggerVariants({ state: triggerState }),
              disabled && "cursor-not-allowed opacity-50"
            )}
            onClick={() => {
              if (disabled) return
              setIsOpen(true)
              inputRef.current?.focus()
            }}
          >
            {/* Selected chips */}
            {value.map((val) => {
              const optLabel =
                options.find((o) => o.value === val)?.label || val
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-2 bg-semantic-info-surface px-2 py-1 rounded text-sm text-semantic-text-primary whitespace-nowrap"
                >
                  {optLabel}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      removeValue(val)
                    }}
                    className="shrink-0 flex items-center justify-center text-semantic-text-muted hover:text-semantic-text-primary transition-colors"
                    aria-label={`Remove ${optLabel}`}
                  >
                    <X className="size-2.5" />
                  </button>
                </span>
              )
            })}

            {/* Text input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                const raw = e.target.value
                const sanitized = sanitizeInput ? sanitizeInput(raw) : raw
                if (sanitizeInput) {
                  if (raw !== sanitized) onInvalidCharacters?.()
                  else onValidInput?.()
                }
                setInputValue(
                  maxLengthPerItem != null
                    ? sanitized.slice(0, maxLengthPerItem)
                    : sanitized
                )
                if (!isOpen) setIsOpen(true)
              }}
              maxLength={maxLengthPerItem}
              onFocus={() => {
                if (!disabled) setIsOpen(true)
              }}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={value.length === 0 ? placeholder : ""}
              className="flex-1 min-w-[100px] text-base bg-transparent outline-none text-semantic-text-primary placeholder:text-semantic-text-muted"
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={listboxId}
              aria-haspopup="listbox"
            />

            {/* Chevron */}
            {isOpen ? (
              <ChevronRight className="size-5 text-semantic-text-muted shrink-0 ml-auto" />
            ) : (
              <ChevronDown className="size-5 text-semantic-text-muted shrink-0 ml-auto" />
            )}
          </div>

          {/* Dropdown panel — top-full is bottom of trigger row only (matches Primary Role / CreatableSelect). */}
          {isOpen && (
            <div
              id={listboxId}
              role="listbox"
              className="absolute left-0 top-full z-[9999] mt-1 w-full rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
            >
              {showHintsRow && (
                <div
                  className={cn(
                    "flex items-center justify-between gap-2 px-4 py-2",
                    filteredPresets.length > 0 &&
                      "border-b border-solid border-semantic-border-layout",
                    !hasHintCopy && "justify-end"
                  )}
                >
                  {hasHintCopy ? (
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      {createHintText ? (
                        <span className="text-sm text-semantic-text-muted">
                          {createHintText}
                        </span>
                      ) : null}
                      {maxItems != null ? (
                        <span className="text-xs text-semantic-text-muted">
                          Max selections allowed: {maxItems}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  <span
                    role="button"
                    tabIndex={canShowEnterAffordance ? 0 : -1}
                    aria-label="Add using Enter key"
                    aria-disabled={!canShowEnterAffordance}
                    className={cn(
                      "inline-flex shrink-0",
                      !canShowEnterAffordance && "pointer-events-none"
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      if (canShowEnterAffordance) addValue(inputValue)
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter" && e.key !== " ") return
                      e.preventDefault()
                      if (canShowEnterAffordance) addValue(inputValue)
                    }}
                  >
                    <kbd className={creatableHintEnterKbdClassName}>
                      Enter ↵
                    </kbd>
                  </span>
                </div>
              )}

              {/* Preset option chips — pt-1 px-4 matches CreatableSelect listbox padding above first option */}
              {filteredPresets.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-4 pt-1 pb-2">
                  {filteredPresets.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        addValue(option.value)
                      }}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded bg-semantic-bg-ui px-2.5 py-1.5 text-sm text-semantic-text-primary transition-colors hover:bg-semantic-bg-hover"
                    >
                      <Plus className="size-3 shrink-0 text-semantic-text-muted" />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Helper row below trigger: when maxLengthPerItem show dynamic hint + counter (Figma); else optional static helperText */}
        {maxLengthPerItem != null ? (
          <div className="mt-1.5 flex items-center justify-end gap-2">
            <span className="shrink-0 text-sm text-semantic-text-muted">
              {inputValue.length}/{maxLengthPerItem}
            </span>
          </div>
        ) : (
          helperText &&
          !isOpen && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <Info className="size-[18px] shrink-0 text-semantic-text-muted" />
              <p className="m-0 text-sm text-semantic-text-muted">
                {helperText}
              </p>
            </div>
          )
        )}
      </div>
    )
  }
)
CreatableMultiSelect.displayName = "CreatableMultiSelect"

export { CreatableMultiSelect, creatableMultiSelectTriggerVariants }
