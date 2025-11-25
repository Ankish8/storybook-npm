import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#343E55] text-white hover:bg-[#343E55]/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[#343E55] bg-transparent text-[#343E55] hover:bg-[#343E55] hover:text-white",
        secondary:
          "bg-[#343E55]/20 text-[#343E55] hover:bg-[#343E55]/30",
        ghost: "hover:bg-[#343E55]/10 hover:text-[#343E55]",
        link: "text-[#343E55] underline-offset-4 hover:underline",
      },
      size: {
        default: "py-2.5 px-4",
        sm: "py-2 px-3 text-xs",
        lg: "py-3 px-6",
        icon: "p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button component for user interactions.
 *
 * @example
 * ```tsx
 * <Button variant="default" size="default">
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child element using Radix Slot */
  asChild?: boolean
  /** Icon displayed on the left side of the button text */
  leftIcon?: React.ReactNode
  /** Icon displayed on the right side of the button text */
  rightIcon?: React.ReactNode
  /** Shows loading spinner and disables button */
  loading?: boolean
  /** Text shown during loading state */
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    leftIcon,
    rightIcon,
    loading = false,
    loadingText,
    children,
    disabled,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
