import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Skeleton variants for content placeholders.
 * Uses semantic background tokens for consistent theming.
 *
 * Tailwind supplies the pulse keyframes; the existing tailwindcss-animate plugin supplies
 * shimmer's `enter` keyframes. The highlight rests outside the fill when motion is reduced.
 * Both animations run for about twenty seconds, then leave the plain loading surface at rest.
 */
const skeletonVariants = cva("", {
  variants: {
    animation: {
      // A finite pulse with an optional delay for neighbouring placeholders.
      pulse:
        "animate-pulse motion-reduce:animate-none [animation-delay:var(--v2-skeleton-delay,0ms)] [animation-duration:var(--v2-skeleton-duration,1.8s)] [animation-timing-function:var(--v2-skeleton-timing,cubic-bezier(0.65,0,0.35,1))] [animation-iteration-count:var(--v2-skeleton-iterations,11)] [animation-fill-mode:var(--v2-skeleton-fill,both)] [animation-play-state:var(--v2-skeleton-play-state,running)]",
      shimmer:
        "relative overflow-hidden after:pointer-events-none after:absolute after:inset-y-0 after:left-full after:w-full after:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--semantic-bg-primary)_50%,transparent),transparent)] motion-safe:after:animate-in motion-safe:after:[--tw-enter-translate-x:-200%] motion-safe:after:[animation-duration:var(--v2-skeleton-duration,1.6s)] motion-safe:after:[animation-timing-function:var(--v2-skeleton-timing,linear)] motion-safe:after:[animation-iteration-count:var(--v2-skeleton-iterations,12)] motion-safe:after:[animation-fill-mode:var(--v2-skeleton-fill,none)] motion-safe:after:[animation-delay:var(--v2-skeleton-delay,0ms)] motion-safe:after:[animation-play-state:var(--v2-skeleton-play-state,running)]",
      none: "",
    },
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

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    { className, variant, animation, shape, width, height, style, ...props },
    ref
  ) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = React.useState(true);
    const animated = animation !== "none" && animation !== null;
    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") return ref(node);
        if (ref) ref.current = node;
      },
      [ref]
    );

    React.useEffect(() => {
      if (!animated) return;
      let inView = true;
      const updateVisibility = () =>
        setVisible(inView && document.visibilityState !== "hidden");
      const node = rootRef.current;
      const observer =
        node && typeof IntersectionObserver !== "undefined"
          ? new IntersectionObserver(([entry]) => {
              if (!entry) return;
              inView = entry.isIntersecting;
              updateVisibility();
            })
          : null;
      if (node) observer?.observe(node);
      updateVisibility();
      document.addEventListener("visibilitychange", updateVisibility);
      return () => {
        observer?.disconnect();
        document.removeEventListener("visibilitychange", updateVisibility);
      };
    }, [animated]);

    // Variables let caller timing and visibility pauses survive !important utility rules.
    const dimensionStyle = {
      ...(animated
        ? {
            "--v2-skeleton-delay": style?.animationDelay,
            "--v2-skeleton-duration": style?.animationDuration,
            "--v2-skeleton-timing": style?.animationTimingFunction,
            "--v2-skeleton-iterations": style?.animationIterationCount,
            "--v2-skeleton-fill": style?.animationFillMode,
          }
        : {}),
      ...style,
      ...(width !== undefined
        ? { width: typeof width === "number" ? `${width}px` : width }
        : {}),
      ...(height !== undefined
        ? { height: typeof height === "number" ? `${height}px` : height }
        : {}),
      ...(animated
        ? {
            "--v2-skeleton-play-state": visible
              ? (style?.animationPlayState ?? "running")
              : "paused",
            ...(!visible ? { animationPlayState: "paused" } : {}),
          }
        : {}),
    } as React.CSSProperties;
    // Preserve the exported v1 line sizing while allowing explicit inline dimensions in
    // hosts that compile Tailwind utilities with !important.
    const classes = skeletonVariants({ variant, shape, animation })
      .split(" ")
      .filter(
        (value) =>
          !(
            value === "w-full" &&
            (width !== undefined || style?.width !== undefined)
          ) &&
          !(
            value === "h-4" &&
            (height !== undefined || style?.height !== undefined)
          )
      )
      .join(" ");

    return (
      <div
        ref={setRootRef}
        aria-hidden="true"
        className={cn(
          classes,
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
