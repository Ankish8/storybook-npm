import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-semantic-primary text-semantic-text-inverted hover:bg-semantic-primary-hover",
        primary:
          "bg-semantic-primary text-semantic-text-inverted hover:bg-semantic-primary-hover",
        destructive:
          "bg-semantic-error-primary text-semantic-text-inverted hover:bg-semantic-error-hover",
        outline:
          "border border-semantic-border-layout bg-semantic-bg-primary text-semantic-text-secondary hover:bg-semantic-primary-surface",
        secondary:
          "bg-semantic-primary-surface text-semantic-text-secondary hover:bg-semantic-bg-hover",
        ghost:
          "text-semantic-text-muted hover:bg-semantic-bg-ui hover:text-semantic-text-primary",
        link: "text-semantic-text-secondary underline-offset-4 hover:underline",
        dashed:
          "border border-dashed border-semantic-bg-hover bg-transparent text-semantic-text-muted hover:border-semantic-border-primary hover:text-semantic-text-secondary hover:bg-[var(--color-neutral-50)]",
      },
      size: {
        default: "min-w-20 py-2.5 px-4 [&_svg]:size-4",
        sm: "min-w-16 py-2 px-3 text-xs [&_svg]:size-3.5",
        lg: "min-w-24 py-3 px-6 [&_svg]:size-5",
        icon: "h-8 w-8 rounded-md",
        "icon-sm": "h-7 w-7 rounded-md",
        "icon-lg": "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

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
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child element using Radix Slot */
  asChild?: boolean;
  /** Icon displayed on the left side of the button text */
  leftIcon?: React.ReactNode;
  /** Icon displayed on the right side of the button text */
  rightIcon?: React.ReactNode;
  /** Shows loading spinner and disables button */
  loading?: boolean;
  /** Text shown during loading state */
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
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
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

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
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
