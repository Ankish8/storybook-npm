import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Badge variants for status indicators.
 * Pill-shaped badges with different colors for different states.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center gap-2 box-border rounded-[25px] border-[0.4px] border-solid font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs font-normal leading-4 transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        // Status-based variants (existing)
        active:
          "bg-semantic-success-surface border-[var(--color-success-200)] text-semantic-success-text",
        information:
          "bg-semantic-info-surface border-[var(--color-black)] text-semantic-info-text",
        warning:
          "bg-semantic-warning-surface border-[var(--color-warning-200)] text-semantic-warning-text",
        failed:
          "bg-semantic-error-surface border-[var(--color-error-200)] text-semantic-error-text",
        disabled:
          "border-0 bg-semantic-bg-ui text-[var(--v2-text-muted,#707070)]",
        default:
          "bg-semantic-bg-ui border-semantic-border-layout text-[var(--v2-text-secondary,#5E5E5E)]",
        primary:
          "bg-semantic-bg-ui border-semantic-border-layout text-[var(--v2-text-secondary,#5E5E5E)]",
        // shadcn-style variants (new)
        secondary:
          "bg-semantic-brand-surface border-semantic-border-accent text-[var(--v2-text-secondary,#5E5E5E)]",
        outline:
          "border border-solid border-semantic-border-layout bg-semantic-bg-primary text-[var(--v2-text-secondary,#5E5E5E)]",
        destructive:
          "bg-semantic-error-surface border-[var(--color-error-200)] text-semantic-error-text",
      },
      size: {
        default: "h-6 px-3 py-1",
        sm: "h-5 px-2 py-0.5",
        lg: "h-[30px] px-4 py-1.5 text-sm leading-[18px]",
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
 * <Badge variant="information">Coming Soon</Badge>
 * <Badge variant="warning">Warning</Badge>
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

const Badge = React.forwardRef(
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
    }: BadgeProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const Comp = asChild ? Slot : "div";

    // When using asChild, we can't wrap the child with extra elements
    // The child must receive the className and ref directly
    if (asChild) {
      return (
        <Comp
          className={cn(badgeVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(badgeVariants({ variant, size, className }))}
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
