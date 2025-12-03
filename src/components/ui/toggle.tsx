import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Toggle track variants (the outer container)
 */
const toggleVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343E55] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-6 w-11",
        sm: "h-5 w-9",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

/**
 * Toggle thumb variants (the sliding circle)
 */
const toggleThumbVariants = cva(
  "pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
  {
    variants: {
      size: {
        default: "h-5 w-5",
        sm: "h-4 w-4",
        lg: "h-6 w-6",
      },
      checked: {
        true: "",
        false: "translate-x-0",
      },
    },
    compoundVariants: [
      { size: "default", checked: true, className: "translate-x-5" },
      { size: "sm", checked: true, className: "translate-x-4" },
      { size: "lg", checked: true, className: "translate-x-7" },
    ],
    defaultVariants: {
      size: "default",
      checked: false,
    },
  }
)

/**
 * A toggle/switch component for boolean inputs with on/off states
 *
 * @example
 * ```tsx
 * <Toggle checked={isEnabled} onCheckedChange={setIsEnabled} />
 * <Toggle size="sm" disabled />
 * <Toggle size="lg" checked label="Enable notifications" />
 * ```
 */
export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  /** Whether the toggle is checked/on */
  checked?: boolean
  /** Default checked state for uncontrolled usage */
  defaultChecked?: boolean
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void
  /** Optional label text */
  label?: string
  /** Position of the label */
  labelPosition?: "left" | "right"
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
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
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)

    const isControlled = controlledChecked !== undefined
    const isChecked = isControlled ? controlledChecked : internalChecked

    const handleClick = () => {
      if (disabled) return

      const newValue = !isChecked

      if (!isControlled) {
        setInternalChecked(newValue)
      }

      onCheckedChange?.(newValue)
    }

    const toggle = (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          toggleVariants({ size, className }),
          isChecked ? "bg-[#343E55]" : "bg-[#E5E7EB]"
        )}
        {...props}
      >
        <span
          className={cn(
            toggleThumbVariants({ size, checked: isChecked })
          )}
        />
      </button>
    )

    if (label) {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          {labelPosition === "left" && (
            <span className={cn("text-sm text-[#333333]", disabled && "opacity-50")}>
              {label}
            </span>
          )}
          {toggle}
          {labelPosition === "right" && (
            <span className={cn("text-sm text-[#333333]", disabled && "opacity-50")}>
              {label}
            </span>
          )}
        </label>
      )
    }

    return toggle
  }
)
Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }
