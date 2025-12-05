import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Checkbox box variants (the outer container)
 */
const checkboxVariants = cva(
  "peer inline-flex items-center justify-center shrink-0 rounded border-2 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343E55] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#343E55] data-[state=checked]:border-[#343E55] data-[state=checked]:text-white data-[state=indeterminate]:bg-[#343E55] data-[state=indeterminate]:border-[#343E55] data-[state=indeterminate]:text-white data-[state=unchecked]:bg-white data-[state=unchecked]:border-[#E5E7EB] data-[state=unchecked]:hover:border-[#9CA3AF]",
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
 * A tri-state checkbox component with label support. Built on Radix UI Checkbox primitive.
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
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "onChange">,
    VariantProps<typeof checkboxVariants> {
  /** Optional label text */
  label?: string
  /** Position of the label */
  labelPosition?: "left" | "right"
  /** Class name applied to the checkbox element */
  checkboxClassName?: string
  /** Class name applied to the label element */
  labelClassName?: string
  /** If true, uses separate labels with htmlFor/id association instead of wrapping the input. Requires id prop. */
  separateLabel?: boolean
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      size,
      label,
      labelPosition = "right",
      checkboxClassName,
      labelClassName,
      separateLabel = false,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const checkbox = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        disabled={disabled}
        className={cn(
          checkboxVariants({ size }),
          "cursor-pointer",
          className,
          checkboxClassName
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          {props.checked === "indeterminate" ? (
            <Minus className={cn(iconSizeVariants({ size }), "stroke-[3]")} />
          ) : (
            <Check className={cn(iconSizeVariants({ size }), "stroke-[3]")} />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
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
