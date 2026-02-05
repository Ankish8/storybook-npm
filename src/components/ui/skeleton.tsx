import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Skeleton variants for content placeholders.
 * Uses semantic background tokens for consistent theming.
 */
const skeletonVariants = cva("animate-pulse", {
  variants: {
    variant: {
      default: "bg-semantic-bg-grey",
      subtle: "bg-semantic-bg-ui",
    },
    shape: {
      line: "h-4 w-full rounded",
      circle: "rounded-full",
      rectangle: "rounded",
    },
  },
  defaultVariants: {
    variant: "default",
    shape: "line",
  },
});

/**
 * A placeholder loading component with pulse animation for content loading states.
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
 * ```
 */
export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Width of the skeleton (number for px, string for any CSS value) */
  width?: number | string;
  /** Height of the skeleton (number for px, string for any CSS value) */
  height?: number | string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, shape, width, height, style, ...props }, ref) => {
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
        className={cn(skeletonVariants({ variant, shape, className }))}
        style={dimensionStyle}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
