import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, Check } from "lucide-react"

import { cn } from "@/lib/utils"

const creatableSelectTriggerVariants = cva(
  "flex h-[42px] w-full items-center justify-between rounded bg-semantic-bg-primary px-4 py-2 text-base text-semantic-text-primary outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-neutral-50)]",
  {
    variants: {
      state: {
        default:
          "border border-semantic-border-input focus-within:border-semantic-border-input-focus/50 focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)]",
        error:
          "border border-semantic-error-primary/40 focus-within:border-semantic-error-primary/60 focus-within:shadow-[0_0_0_1px_rgba(240,68,56,0.1)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

export interface CreatableSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface CreatableSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof creatableSelectTriggerVariants> {
  /** Currently selected value */
  value?: string
  /** Callback when value changes (selection or creation) */
  onValueChange?: (value: string) => void
  /** Available options */
  options?: CreatableSelectOption[]
  /** Placeholder when no value selected */
  placeholder?: string
  /** Hint text shown above options when dropdown is open */
  creatableHint?: string
  /** Whether the select is disabled */
  disabled?: boolean
  /** Max character length for the value (enforced when open and when creating) */
  maxLength?: number
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
      creatableHint = "Type to create a custom option",
      disabled = false,
      maxLength,
      ...props
    }: CreatableSelectProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const [highlightIndex, setHighlightIndex] = React.useState(-1)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLDivElement>(null)

    // Merge forwarded ref with internal ref
    React.useImperativeHandle(ref, () => containerRef.current!)

    const selectedLabel = React.useMemo(() => {
      const found = options.find((o) => o.value === value)
      return found ? found.label : value || ""
    }, [options, value])

    const filtered = React.useMemo(() => {
      if (!search.trim()) return options
      const q = search.toLowerCase()
      return options.filter((o) => o.label.toLowerCase().includes(q))
    }, [options, search])

    const isCustom =
      search.trim().length > 0 &&
      !options.some((o) => o.label.toLowerCase() === search.trim().toLowerCase())

    const handleOpen = () => {
      if (disabled) return
      setOpen(true)
      setSearch("")
      setHighlightIndex(-1)
      requestAnimationFrame(() => inputRef.current?.focus())
    }

    const handleSelect = React.useCallback(
      (val: string) => {
        onValueChange?.(val)
        setOpen(false)
        setSearch("")
      },
      [onValueChange]
    )

    const handleCreate = React.useCallback(() => {
      const trimmed = search.trim()
      if (trimmed) {
        const value = maxLength != null ? trimmed.slice(0, maxLength) : trimmed
        onValueChange?.(value)
        setOpen(false)
        setSearch("")
      }
    }, [search, onValueChange, maxLength])

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setOpen(false)
        return
      }

      if (e.key === "Enter") {
        e.preventDefault()
        if (highlightIndex >= 0 && highlightIndex < filtered.length) {
          const opt = filtered[highlightIndex]
          if (!opt.disabled) handleSelect(opt.value)
        } else if (isCustom) {
          handleCreate()
        } else if (filtered.length === 1 && !filtered[0].disabled) {
          handleSelect(filtered[0].value)
        }
        return
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setHighlightIndex((prev) => {
          const next = prev + 1
          return next >= filtered.length ? 0 : next
        })
        return
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setHighlightIndex((prev) => {
          const next = prev - 1
          return next < 0 ? filtered.length - 1 : next
        })
        return
      }
    }

    // Scroll highlighted item into view
    React.useEffect(() => {
      if (highlightIndex >= 0 && listRef.current) {
        const item = listRef.current.children[highlightIndex] as HTMLElement
        item?.scrollIntoView({ block: "nearest" })
      }
    }, [highlightIndex])

    // Close on outside click
    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false)
        }
      }
      document.addEventListener("mousedown", handler)
      return () => document.removeEventListener("mousedown", handler)
    }, [open])

    // Reset highlight when filter changes
    React.useEffect(() => {
      setHighlightIndex(-1)
    }, [search])

    return (
      <div
        ref={containerRef}
        className={cn("relative w-full", className)}
        {...props}
      >
        {/* Trigger / Input */}
        {open ? (
          <div
            className={cn(
              creatableSelectTriggerVariants({ state }),
              "cursor-text"
            )}
            onClick={() => inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                const v = e.target.value
                setSearch(maxLength != null ? v.slice(0, maxLength) : v)
              }}
              maxLength={maxLength}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 bg-transparent outline-none text-base text-semantic-text-primary placeholder:text-semantic-text-muted"
              placeholder={selectedLabel || placeholder}
              aria-expanded="true"
              aria-haspopup="listbox"
              role="combobox"
              aria-autocomplete="list"
            />
            <ChevronDown className="size-4 text-semantic-text-muted opacity-70 shrink-0 rotate-180 transition-transform" />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleOpen}
            disabled={disabled}
            className={cn(
              creatableSelectTriggerVariants({ state }),
              "cursor-pointer text-left"
            )}
            aria-haspopup="listbox"
            aria-expanded="false"
          >
            <span
              className={cn(
                "line-clamp-1",
                !selectedLabel && "text-semantic-text-muted"
              )}
            >
              {selectedLabel || placeholder}
            </span>
            <ChevronDown className="size-4 text-semantic-text-muted opacity-70 shrink-0" />
          </button>
        )}

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 top-full z-[9999] mt-1 w-full rounded border border-semantic-border-layout bg-semantic-bg-primary shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
            {/* Creatable hint */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-semantic-border-layout">
              <span className="text-sm text-semantic-text-muted">
                {creatableHint}
              </span>
              <kbd className="inline-flex items-center gap-0.5 rounded border border-semantic-border-layout bg-semantic-bg-ui px-1.5 py-0.5 text-[10px] text-semantic-text-muted font-medium">
                Enter ↵
              </kbd>
            </div>

            {/* Options list */}
            <div
              ref={listRef}
              role="listbox"
              className="max-h-60 overflow-y-auto p-1"
            >
              {filtered.length === 0 && !isCustom && (
                <div className="px-4 py-2 text-sm text-semantic-text-muted">
                  No options found
                </div>
              )}
              {filtered.map((opt, i) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  disabled={opt.disabled}
                  onClick={() => !opt.disabled && handleSelect(opt.value)}
                  onMouseEnter={() => setHighlightIndex(i)}
                  className={cn(
                    "relative flex w-full items-center rounded-sm py-2 pl-4 pr-8 text-base text-semantic-text-primary outline-none cursor-pointer select-none",
                    "hover:bg-semantic-bg-ui",
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
    )
  }
)
CreatableSelect.displayName = "CreatableSelect"

export { CreatableSelect, creatableSelectTriggerVariants }
