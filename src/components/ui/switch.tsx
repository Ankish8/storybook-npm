import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Switch track variants (the outer container)
 */
const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343E55] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#343E55] data-[state=unchecked]:bg-[#E5E7EB]",
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
 * Switch thumb variants (the sliding circle)
 */
const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        default: "h-5 w-5 data-[state=checked]:translate-x-5",
        sm: "h-4 w-4 data-[state=checked]:translate-x-4",
        lg: "h-6 w-6 data-[state=checked]:translate-x-7",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

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

/**
 * A switch/toggle component for boolean inputs with on/off states
 *
 * @example
 * ```tsx
 * <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
 * <Switch size="sm" disabled />
 * <Switch size="lg" checked label="Enable notifications" />
 * ```
 */
export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>, "onChange">,
    VariantProps<typeof switchVariants> {
  /** Optional label text */
  label?: string
  /** Position of the label */
  labelPosition?: "left" | "right"
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    {
      className,
      size,
      label,
      labelPosition = "right",
      disabled,
      ...props
    },
    ref
  ) => {
    const switchElement = (
      <SwitchPrimitives.Root
        className={cn(switchVariants({ size, className }))}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ size }))} />
      </SwitchPrimitives.Root>
    )

    if (label) {
      return (
        <label className={cn(
          "inline-flex items-center gap-2 cursor-pointer",
          disabled && "cursor-not-allowed"
        )}>
          {labelPosition === "left" && (
            <span className={cn(
              labelSizeVariants({ size }),
              "text-[#333333]",
              disabled && "opacity-50"
            )}>
              {label}
            </span>
          )}
          {switchElement}
          {labelPosition === "right" && (
            <span className={cn(
              labelSizeVariants({ size }),
              "text-[#333333]",
              disabled && "opacity-50"
            )}>
              {label}
            </span>
          )}
        </label>
      )
    }

    return switchElement
  }
)
Switch.displayName = "Switch"

export { Switch, switchVariants }
