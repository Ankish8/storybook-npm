import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Skeleton variants for content placeholders.
 * Uses semantic background tokens for consistent theming.
 *
 * `animation` is listed first so the default output keeps today's class order ("animate-pulse
 * motion-reduce:animate-none ..."). Shimmer sweeps a highlight band (the ::after) over the fill using
 * tailwindcss-animate's `enter` keyframes, which animate from a start offset to the element's own
 * resting state. The band rests just right of the placeholder (left-full) and starts 200% of its
 * width to the left, so one pass crosses the whole fill. No transform class is used on purpose: a
 * host stylesheet that marks utilities !important would pin it and freeze the animation. The band
 * rests off-canvas, so reduced motion (no animation) leaves the plain static fill.
 */
const skeletonVariants = cva("", {
  variants: {
    animation: {
      pulse: "animate-pulse motion-reduce:animate-none",
      shimmer:
        "relative overflow-hidden after:pointer-events-none after:absolute after:inset-y-0 after:left-full after:w-full after:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--semantic-bg-primary,#FFFFFF)_50%,transparent),transparent)] motion-safe:after:animate-in motion-safe:after:[--tw-enter-translate-x:-200%] motion-safe:after:[animation-duration:1.6s] motion-safe:after:[animation-timing-function:linear] motion-safe:after:[animation-iteration-count:infinite] motion-safe:after:[animation-delay:var(--v2-skeleton-delay,0ms)]",
      none: "",
    },
    variant: {
      default: "bg-semantic-bg-grey",
      subtle: "bg-semantic-bg-ui",
    },
    shape: {
      line: "rounded",
      circle: "rounded-full",
      rectangle: "rounded",
    },
  },
  defaultVariants: {
    animation: "pulse",
    variant: "default",
    shape: "line",
  },
});

/**
 * A placeholder loading component with pulse animation (or a shimmer sweep, or none) for content loading states.
 * Use shape, width, and height props to match the content being loaded.
 *
 * @example
 * ```tsx
 * // Text line placeholder
 * <Skeleton />
 *
 * // Avatar placeholder
 * <Skeleton shape="circle" width={40} height={40} />
 *
 * // Image/card placeholder
 * <Skeleton shape="rectangle" width="100%" height={200} />
 *
 * // Subtle variant
 * <Skeleton variant="subtle" />
 *
 * // Shimmer sweep instead of pulse
 * <Skeleton animation="shimmer" />
 * ```
 */
export interface SkeletonProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Width of the skeleton (number for px, string for any CSS value) */
  width?: number | string;
  /** Height of the skeleton (number for px, string for any CSS value) */
  height?: number | string;
}

const Skeleton = React.forwardRef(
  (
    {
      className,
      variant,
      animation,
      shape,
      width,
      height,
      style,
      ...props
    }: SkeletonProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const dimensionStyle: React.CSSProperties = {
      ...style,
      ...(width !== undefined
        ? { width: typeof width === "number" ? `${width}px` : width }
        : {}),
      ...(height !== undefined
        ? { height: typeof height === "number" ? `${height}px` : height }
        : {}),
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          skeletonVariants({ variant, shape, animation }),
          (shape === undefined || shape === null || shape === "line") &&
            width === undefined &&
            style?.width === undefined &&
            "w-full",
          (shape === undefined || shape === null || shape === "line") &&
            height === undefined &&
            style?.height === undefined &&
            "h-4",
          className
        )}
        style={dimensionStyle}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
