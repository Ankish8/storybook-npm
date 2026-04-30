import * as React from "react"
import { ChevronRight, Plus, Info, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  creatableSelectTriggerVariants,
  creatableEnterHintKbdClassName,
  creatableToneHintRowClassName,
} from "./creatable-select"

/** @deprecated Use `creatableSelectTriggerVariants` from `./creatable-select` — aliases the same trigger styles as Primary Role. */
const creatableMultiSelectTriggerVariants = creatableSelectTriggerVariants

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
   * When true (default), shows `current/max` under the trigger while typing when `maxLengthPerItem` is set.
   * Set to false to match Figma (counter lives only in the field flow / not under the control).
   */
  showPerItemCharacterCounter?: boolean
  /**
   * Closed trigger: show removable chips (default) or a single comma-separated summary line (Figma Tone).
   * While open, the trigger always shows the summary line; selected chips with remove controls appear in the panel.
   */
  triggerDisplay?: "chips" | "summary"
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

function joinSelectedLabels(
  values: string[],
  options: CreatableMultiSelectOption[]
): string {
  return values
    .map((val) => options.find((o) => o.value === val)?.label ?? val)
    .join(", ")
}

function labelForValue(
  val: string,
  options: CreatableMultiSelectOption[]
): string {
  return options.find((o) => o.value === val)?.label ?? val
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

    const derivedState = state === "error" ? "error" : "default"

    const selectedSummary = joinSelectedLabels(value, options)

    const addValue = (val: string) => {
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
    }

    const removeValue = (val: string) => {
      onValueChange?.(value.filter((v) => v !== val))
    }

    const handleOpen = React.useCallback(() => {
      if (disabled) return
      setIsOpen(true)
      setInputValue("")
    }, [disabled])

    React.useEffect(() => {
      if (!isOpen) return
      requestAnimationFrame(() => inputRef.current?.focus())
    }, [isOpen])

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

    const panelInputPlaceholder = createHintText ?? placeholder

    const summaryTriggerLabel =
      value.length === 0 ? placeholder : selectedSummary

    return (
      <div
        ref={containerRef}
        className={cn("relative w-full", className)}
        {...props}
      >
        <div className="relative w-full">
          {isOpen && (
            <div
              className={cn(
                creatableSelectTriggerVariants({ state: derivedState }),
                "flex h-auto min-h-[42px] cursor-text items-start gap-2 py-2 text-left"
              )}
              onClick={() => !disabled && inputRef.current?.focus()}
              aria-hidden="true"
            >
              <span
                className={cn(
                  "line-clamp-2 min-w-0 flex-1 text-base",
                  value.length === 0
                    ? "text-semantic-text-muted"
                    : "text-semantic-text-primary"
                )}
              >
                {summaryTriggerLabel}
              </span>
              <ChevronRight
                className="mt-1 size-5 shrink-0 self-start text-semantic-text-muted opacity-70"
                aria-hidden
              />
            </div>
          )}

          {!isOpen && (
            <div
              role="combobox"
              tabIndex={disabled ? -1 : 0}
              aria-haspopup="listbox"
              aria-expanded={false}
              aria-controls={listboxId}
              aria-disabled={disabled || undefined}
              onKeyDown={(e) => {
                if (disabled) return
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleOpen()
                }
              }}
              onClick={(e) => {
                if (disabled) return
                if ((e.target as HTMLElement).closest("[data-chip-remove]")) {
                  return
                }
                handleOpen()
              }}
              className={cn(
                creatableSelectTriggerVariants({ state: derivedState }),
                "flex h-auto min-h-[42px] cursor-pointer items-start gap-2 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-semantic-bg-primary",
                disabled && "pointer-events-none cursor-not-allowed"
              )}
            >
              <div className="flex min-h-0 min-w-0 flex-1 flex-wrap content-start items-center gap-1.5">
                {triggerDisplay === "summary" ? (
                  <span
                    className={cn(
                      "line-clamp-2 flex-1 text-base",
                      value.length === 0
                        ? "text-semantic-text-muted"
                        : "text-semantic-text-primary"
                    )}
                  >
                    {summaryTriggerLabel}
                  </span>
                ) : value.length === 0 ? (
                  <span
                    className={cn(
                      "line-clamp-2 flex-1 text-base",
                      "text-semantic-text-muted"
                    )}
                  >
                    {placeholder}
                  </span>
                ) : (
                  value.map((val) => (
                    <span
                      key={val}
                      className="inline-flex max-w-full items-center gap-0.5 rounded bg-semantic-bg-ui py-1 pl-2 pr-0.5 text-sm text-semantic-text-primary"
                    >
                      <span className="min-w-0 truncate">
                        {labelForValue(val, options)}
                      </span>
                      <button
                        type="button"
                        data-chip-remove
                        disabled={disabled}
                        aria-label={`Remove ${labelForValue(val, options)}`}
                        className={cn(
                          "inline-flex size-6 shrink-0 items-center justify-center rounded text-semantic-text-muted transition-colors",
                          !disabled &&
                            "hover:bg-semantic-bg-hover hover:text-semantic-text-primary"
                        )}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!disabled) removeValue(val)
                        }}
                      >
                        <X className="size-3.5" strokeWidth={2} aria-hidden />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <ChevronRight
                className="mt-1 size-5 shrink-0 self-start text-semantic-text-muted opacity-70"
                aria-hidden
              />
            </div>
          )}

          {/* Dropdown panel: input + limits + presets (Figma: summary row stays above; type-to-create lives here) */}
          {isOpen && (
            <div
              className="absolute left-0 top-full z-[9999] mt-1 flex w-full flex-col overflow-hidden rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary shadow-sm animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
            >
              <div className="-mx-0 flex shrink-0 flex-col border-b border-solid border-semantic-border-layout">
                <div className={creatableToneHintRowClassName}>
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
                    }}
                    maxLength={maxLengthPerItem}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    placeholder={panelInputPlaceholder}
                    className="min-w-0 flex-1 bg-transparent text-base text-semantic-text-primary outline-none placeholder:text-semantic-text-muted"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                  />
                  <button
                    type="button"
                    disabled={disabled || !canShowEnterAffordance}
                    onMouseDown={(e) => {
                      e.preventDefault()
                    }}
                    onClick={() => {
                      if (draftForCreate) addValue(inputValue)
                    }}
                    className={cn(
                      creatableEnterHintKbdClassName,
                      "shrink-0 enabled:cursor-pointer enabled:hover:bg-semantic-bg-hover disabled:opacity-50"
                    )}
                  >
                    Enter ↵
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 px-4 pb-4 pt-0">
                {maxItems != null ? (
                  <p className="m-0 py-1 text-sm text-semantic-text-muted">
                    Max selections allowed: {maxItems}
                  </p>
                ) : null}

                {value.length > 0 ? (
                  <div
                    className="flex flex-wrap gap-1.5 border-b border-solid border-semantic-border-layout pb-2.5"
                    aria-label="Selected values"
                  >
                    {value.map((val) => (
                      <span
                        key={val}
                        className="inline-flex max-w-full items-center gap-0.5 rounded bg-semantic-bg-ui py-1 pl-2 pr-0.5 text-sm text-semantic-text-primary"
                      >
                        <span className="min-w-0 truncate">
                          {labelForValue(val, options)}
                        </span>
                        <button
                          type="button"
                          data-chip-remove
                          disabled={disabled}
                          aria-label={`Remove ${labelForValue(val, options)}`}
                          className={cn(
                            "inline-flex size-6 shrink-0 items-center justify-center rounded text-semantic-text-muted transition-colors",
                            !disabled &&
                              "hover:bg-semantic-bg-hover hover:text-semantic-text-primary"
                          )}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!disabled) removeValue(val)
                          }}
                        >
                          <X className="size-3.5" strokeWidth={2} aria-hidden />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}

                <div
                  id={listboxId}
                  role="listbox"
                  className="flex flex-wrap gap-1.5"
                >
                  {filteredPresets.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        addValue(option.value)
                      }}
                      className="inline-flex items-center gap-2.5 whitespace-nowrap rounded border-0 bg-semantic-bg-ui px-2 py-1 text-left text-sm text-semantic-text-primary transition-colors hover:bg-semantic-bg-hover"
                    >
                      <Plus
                        className="size-2.5 shrink-0 text-semantic-text-muted"
                        strokeWidth={2}
                        aria-hidden
                      />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {maxLengthPerItem != null &&
        showPerItemCharacterCounter &&
        isOpen ? (
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
