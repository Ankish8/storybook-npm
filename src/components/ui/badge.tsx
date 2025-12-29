import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

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
        active: "bg-semantic-success-surface text-semantic-success-primary",
        failed: "bg-semantic-error-surface text-semantic-error-primary",
        disabled: "bg-semantic-bg-ui text-semantic-text-muted",
        default: "bg-semantic-bg-ui text-semantic-text-primary",
        primary: "bg-semantic-bg-ui text-semantic-text-primary",
        // shadcn-style variants (new)
        secondary: "bg-semantic-bg-ui text-semantic-text-primary",
        outline: "border border-semantic-border-layout bg-transparent text-semantic-text-primary",
        destructive: "bg-semantic-error-surface text-semantic-error-primary",
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
);

/**
 * Badge component for displaying status indicators.
 *
 * @example
 * ```tsx
 * <Badge variant="active">Active</Badge>
 * <Badge variant="failed">Failed</Badge>
 * <Badge variant="disabled">Disabled</Badge>
 * <Badge variant="default">Default</Badge>
 * <Badge variant="primary">Primary</Badge>
 * <Badge variant="outline">Outline</Badge>
 * <Badge variant="secondary">Secondary</Badge>
 * <Badge variant="destructive">Destructive</Badge>
 * <Badge variant="active" leftIcon={<CheckIcon />}>Active</Badge>
 * <Badge asChild><a href="/status">View Status</a></Badge>
 * ```
 */
export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon displayed on the left side of the badge text */
  leftIcon?: React.ReactNode;
  /** Icon displayed on the right side of the badge text */
  rightIcon?: React.ReactNode;
  /** Render as child element using Radix Slot */
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";

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
      );
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
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
