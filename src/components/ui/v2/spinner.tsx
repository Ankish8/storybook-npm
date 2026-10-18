import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Spinner variants for loading indicators.
 * Uses semantic color tokens for consistent theming. The partial ring stays
 * visible without rotating when reduced motion is requested.
 */
const spinnerVariants = cva(
  "block animate-spin [animation-duration:var(--v2-spinner-duration,700ms)] [animation-timing-function:linear] [animation-iteration-count:infinite] [animation-play-state:var(--v2-spinner-play-state,running)] motion-reduce:animate-none",
  {
    variants: {
      size: {
        sm: "size-4",
        default: "size-6",
        lg: "size-8",
        xl: "size-12",
      },
      variant: {
        default: "text-[color:var(--v2-indicator,var(--semantic-primary))]",
        secondary: "text-v2-semantic-text-secondary",
        muted: "text-v2-semantic-text-muted",
        inverted: "text-v2-semantic-text-inverted",
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
 * A 1.5px ring at the smallest size scales with the indicator. The inset keeps
 * the stroke inside the viewBox at every size.
 */
const STROKE_WIDTH = 2.25;

/**
 * A loading spinner component with customizable size and color variants.
 * Draws a three-quarter ring with an open gap and no visible track.
 * Defaults to a named status; use aria-hidden when a parent already announces
 * the loading state. Rotation pauses outside the viewport or on hidden pages.
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

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      size = "default",
      variant,
      "aria-label": ariaLabel = "Loading",
      "aria-hidden": ariaHidden,
      "aria-labelledby": ariaLabelledBy,
      role,
      style,
      ...props
    },
    ref
  ) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = React.useState(true);
    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") return ref(node);
        if (ref) ref.current = node;
      },
      [ref]
    );

    React.useEffect(() => {
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
    }, []);

    const decorative = ariaHidden === true || ariaHidden === "true";
    // Explicit CSS properties read these values even when a consumer's Tailwind
    // animation shorthand is important. Native wrapper styles stay intact.
    const callerStyle = style as
      | (React.CSSProperties & { "--v2-spinner-play-state"?: string })
      | undefined;
    const spinnerStyle = {
      "--v2-spinner-duration": style?.animationDuration ?? "700ms",
      ...style,
      "--v2-spinner-play-state": visible
        ? (callerStyle?.["--v2-spinner-play-state"] ??
          style?.animationPlayState ??
          "running")
        : "paused",
    } as React.CSSProperties;
    const radius = 10.5;
    const circumference = 2 * Math.PI * radius;

    return (
      <div
        ref={setRootRef}
        role={role ?? (decorative ? undefined : "status")}
        aria-label={decorative ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-hidden={ariaHidden}
        className={cn(
          "inline-flex shrink-0 items-center justify-center align-middle leading-none [&[hidden]]:hidden",
          className
        )}
        style={spinnerStyle}
        {...props}
      >
        <svg
          className={cn(spinnerVariants({ size, variant }))}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          {/* Retain the existing track element while the open ring supplies the visual indicator. */}
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            opacity="0"
          />
          {/* The 270-degree arc leaves a clear gap on the right. */}
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
        {!decorative && !ariaLabelledBy && (
          <span className="sr-only">{ariaLabel}</span>
        )}
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
