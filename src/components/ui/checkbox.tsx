import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Checkbox box variants (the outer container)
 */
const checkboxVariants = cva(
  "inline-flex items-center justify-center rounded border-2 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343E55] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-5 w-5",
        sm: "h-4 w-4",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

/**
 * Icon size variants based on checkbox size
 */
const iconSizeVariants = cva("", {
  variants: {
    size: {
      default: "h-3.5 w-3.5",
      sm: "h-3 w-3",
      lg: "h-4 w-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

/**
 * Label text size variants
 */
const labelSizeVariants = cva("", {
  variants: {
    size: {
      default: "text-sm",
      sm: "text-xs",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export type CheckedState = boolean | "indeterminate"

/**
 * A tri-state checkbox component with label support
 *
 * @example
 * ```tsx
 * <Checkbox checked={isEnabled} onCheckedChange={setIsEnabled} />
 * <Checkbox size="sm" disabled />
 * <Checkbox checked="indeterminate" label="Select all" />
 * <Checkbox label="Accept terms" labelPosition="right" />
 * <Checkbox id="terms" label="Accept terms" separateLabel />
 * ```
 */
export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof checkboxVariants> {
  /** Whether the checkbox is checked, unchecked, or indeterminate */
  checked?: CheckedState
  /** Default checked state for uncontrolled usage */
  defaultChecked?: boolean
  /** Callback when checked state changes */
  onCheckedChange?: (checked: CheckedState) => void
  /** Optional label text */
  label?: string
  /** Position of the label */
  labelPosition?: "left" | "right"
  /** The label of the checkbox for accessibility */
  ariaLabel?: string
  /** The ID of an element describing the checkbox */
  ariaLabelledBy?: string
  /** If true, the checkbox automatically receives focus */
  autoFocus?: boolean
  /** Class name applied to the checkbox element */
  checkboxClassName?: string
  /** Class name applied to the label element */
  labelClassName?: string
  /** The name of the checkbox, used for form submission */
  name?: string
  /** The value submitted with the form when checked */
  value?: string
  /** If true, uses separate labels with htmlFor/id association instead of wrapping the input. Requires id prop. */
  separateLabel?: boolean
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      size,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      label,
      labelPosition = "right",
      ariaLabel,
      ariaLabelledBy,
      autoFocus,
      checkboxClassName,
      labelClassName,
      name,
      value,
      separateLabel = false,
      id,
      onClick,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState<CheckedState>(defaultChecked)
    const checkboxRef = React.useRef<HTMLButtonElement>(null)

    // Merge refs
    React.useImperativeHandle(ref, () => checkboxRef.current!)

    // Handle autoFocus
    React.useEffect(() => {
      if (autoFocus && checkboxRef.current) {
        checkboxRef.current.focus()
      }
    }, [autoFocus])

    const isControlled = controlledChecked !== undefined
    const checkedState = isControlled ? controlledChecked : internalChecked

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      // Cycle through states: unchecked -> checked -> unchecked
      // (indeterminate is typically set programmatically, not through user clicks)
      const newValue = checkedState === true ? false : true

      if (!isControlled) {
        setInternalChecked(newValue)
      }

      onCheckedChange?.(newValue)

      // Call external onClick if provided
      onClick?.(e)
    }

    const isChecked = checkedState === true
    const isIndeterminate = checkedState === "indeterminate"

    const checkbox = (
      <button
        type="button"
        role="checkbox"
        aria-checked={isIndeterminate ? "mixed" : isChecked}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        ref={checkboxRef}
        id={id}
        disabled={disabled}
        onClick={handleClick}
        data-name={name}
        data-value={value}
        className={cn(
          checkboxVariants({ size }),
          "cursor-pointer",
          isChecked || isIndeterminate
            ? "bg-[#343E55] border-[#343E55] text-white"
            : "bg-white border-[#E5E7EB] hover:border-[#9CA3AF]",
          className,
          checkboxClassName
        )}
        {...props}
      >
        {isChecked && (
          <Check className={cn(iconSizeVariants({ size }), "stroke-[3]")} />
        )}
        {isIndeterminate && (
          <Minus className={cn(iconSizeVariants({ size }), "stroke-[3]")} />
        )}
      </button>
    )

    if (label) {
      // separateLabel mode: use htmlFor/id association instead of wrapping
      if (separateLabel && id) {
        return (
          <div className="inline-flex items-center gap-2">
            {labelPosition === "left" && (
              <label
                htmlFor={id}
                className={cn(
                  labelSizeVariants({ size }),
                  "text-[#333333] cursor-pointer",
                  disabled && "opacity-50 cursor-not-allowed",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
            {checkbox}
            {labelPosition === "right" && (
              <label
                htmlFor={id}
                className={cn(
                  labelSizeVariants({ size }),
                  "text-[#333333] cursor-pointer",
                  disabled && "opacity-50 cursor-not-allowed",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
          </div>
        )
      }

      // Default: wrapping label
      return (
        <label className={cn("inline-flex items-center gap-2 cursor-pointer", disabled && "cursor-not-allowed")}>
          {labelPosition === "left" && (
            <span className={cn(labelSizeVariants({ size }), "text-[#333333]", disabled && "opacity-50", labelClassName)}>
              {label}
            </span>
          )}
          {checkbox}
          {labelPosition === "right" && (
            <span className={cn(labelSizeVariants({ size }), "text-[#333333]", disabled && "opacity-50", labelClassName)}>
              {label}
            </span>
          )}
        </label>
      )
    }

    return checkbox
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox, checkboxVariants }
