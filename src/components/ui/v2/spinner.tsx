import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Spinner variants for loading indicators.
 * Uses semantic color tokens for consistent theming. One turn takes 700ms, linear (Arc's button spinner). Reduced
 * motion keeps turning, slower, because a stopped spinner stops saying "busy".
 */
const spinnerVariants = cva(
  "animate-spin [animation-duration:700ms] motion-reduce:[animation-duration:2s]",
  {
    variants: {
      size: {
        sm: "size-4",
        default: "size-6",
        lg: "size-8",
        xl: "size-12",
      },
      variant: {
        default: "text-semantic-primary",
        secondary: "text-[var(--v2-text-secondary,#5E5E5E)]",
        muted: "text-[var(--v2-text-muted,#707070)]",
        inverted: "text-semantic-text-inverted",
        current: "text-current",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

/**
 * Ring thickness in viewBox units. Arc's loader is a 1.5px ring on a 16px box, so the ratio (2.25 of 24) is constant
 * and the ring scales with the spinner instead of thinning out.
 */
const STROKE_WIDTH = 2.25;

/**
 * A loading spinner component with customizable size and color variants.
 * Draws Arc's loader: a three-quarter ring with no track, open on the right, turning clockwise.
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
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label for the spinner (default: "Loading") */
  "aria-label"?: string;
}

const Spinner = React.forwardRef(
  (
    {
      className,
      size = "default",
      variant,
      "aria-label": ariaLabel = "Loading",
      ...props
    }: SpinnerProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    // The ring's outer edge sits on the 24-unit box, so the centre line is half a stroke inside it.
    const radius = 12 - STROKE_WIDTH / 2;
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
          {/* v1 draws a track beneath the arc and callers' tests may count circles, so the element stays; Arc has no track, so it is invisible. */}
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            opacity="0"
          />
          {/* A 270-degree arc: the dash starts at 4:30 so the gap is centred on the right, like a border with border-right-color: transparent. */}
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            transform="rotate(45 12 12)"
          />
        </svg>
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
