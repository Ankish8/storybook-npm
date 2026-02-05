import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Spinner variants for loading indicators.
 * Uses semantic color tokens for consistent theming.
 */
const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-6",
      lg: "size-8",
      xl: "size-12",
    },
    variant: {
      default: "text-semantic-primary",
      secondary: "text-semantic-text-secondary",
      muted: "text-semantic-text-muted",
      inverted: "text-white",
      current: "text-current",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

/**
 * SVG stroke widths that decrease as size increases for visual balance.
 */
const strokeWidths: Record<string, number> = {
  sm: 3,
  default: 3,
  lg: 2.5,
  xl: 2,
};

/**
 * A loading spinner component with customizable size and color variants.
 * Uses a custom SVG circle with a visible track and animated arc.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner size="sm" variant="muted" />
 * <Spinner size="lg" variant="current" />
 * <Spinner variant="inverted" aria-label="Saving changes" />
 * ```
 */
export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label for the spinner (default: "Loading") */
  "aria-label"?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      size = "default",
      variant,
      "aria-label": ariaLabel = "Loading",
      ...props
    },
    ref
  ) => {
    const strokeWidth = strokeWidths[size || "default"] ?? 3;
    const radius = 10;
    const circumference = 2 * Math.PI * radius;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={cn("inline-flex shrink-0", className)}
        {...props}
      >
        <svg
          className={cn(spinnerVariants({ size, variant }))}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track circle */}
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            opacity="0.25"
          />
          {/* Active arc */}
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
          />
        </svg>
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
