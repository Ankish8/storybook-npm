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
      onClick,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState<CheckedState>(defaultChecked)

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
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          checkboxVariants({ size, className }),
          "cursor-pointer",
          isChecked || isIndeterminate
            ? "bg-[#343E55] border-[#343E55] text-white"
            : "bg-white border-[#E5E7EB] hover:border-[#9CA3AF]"
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
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          {labelPosition === "left" && (
            <span className={cn(labelSizeVariants({ size }), "text-[#333333]", disabled && "opacity-50")}>
              {label}
            </span>
          )}
          {checkbox}
          {labelPosition === "right" && (
            <span className={cn(labelSizeVariants({ size }), "text-[#333333]", disabled && "opacity-50")}>
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
