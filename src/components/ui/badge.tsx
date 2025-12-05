import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge variants for status indicators.
 * Pill-shaped badges with different colors for different states.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        // Status-based variants (existing)
        active: "bg-[#E5FFF5] text-[#00A651]",
        failed: "bg-[#FFECEC] text-[#FF3B3B]",
        disabled: "bg-[#F3F5F6] text-[#6B7280]",
        default: "bg-[#F3F5F6] text-[#333333]",
        // shadcn-style variants (new)
        secondary: "bg-[#F3F4F6] text-[#333333]",
        outline: "border border-[#E5E7EB] bg-transparent text-[#333333]",
        destructive: "bg-[#FFECEC] text-[#FF3B3B]",
      },
      size: {
        default: "px-3 py-1",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Badge component for displaying status indicators.
 *
 * @example
 * ```tsx
 * <Badge variant="active">Active</Badge>
 * <Badge variant="failed">Failed</Badge>
 * <Badge variant="disabled">Disabled</Badge>
 * <Badge variant="outline">Outline</Badge>
 * <Badge variant="secondary">Secondary</Badge>
 * <Badge variant="destructive">Destructive</Badge>
 * <Badge variant="active" leftIcon={<CheckIcon />}>Active</Badge>
 * <Badge asChild><a href="/status">View Status</a></Badge>
 * ```
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon displayed on the left side of the badge text */
  leftIcon?: React.ReactNode
  /** Icon displayed on the right side of the badge text */
  rightIcon?: React.ReactNode
  /** Render as child element using Radix Slot */
  asChild?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, leftIcon, rightIcon, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"

    // When using asChild, we can't wrap the child with extra elements
    // The child must receive the className and ref directly
    if (asChild) {
      return (
        <Comp
          className={cn(badgeVariants({ variant, size, className }), "gap-1")}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(badgeVariants({ variant, size, className }), "gap-1")}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="[&_svg]:size-3">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="[&_svg]:size-3">{rightIcon}</span>}
      </Comp>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
