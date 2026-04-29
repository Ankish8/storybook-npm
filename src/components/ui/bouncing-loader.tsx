import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const DOT_KEYS = [0, 1, 2] as const;

function toCssLength(value: number | string, unit: string): string {
  if (typeof value === "string") {
    return value;
  }
  return `${value}${unit}`;
}

const bouncingLoaderVariants = cva(
  "bouncing-loader min-w-0 items-center justify-center leading-[0] align-middle gap-[var(--bouncing-loader-spacing,0.375rem)]",
  {
    variants: {
      fullWidth: {
        true: "bouncing-loader--full-width flex w-full",
        false: "inline-flex shrink-0",
      },
    },
    defaultVariants: {
      fullWidth: false,
    },
  }
);

export interface BouncingLoaderProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof bouncingLoaderVariants> {
  /**
   * Dot diameter. Number is treated as pixels; string is used as a CSS length
   * (e.g. `"0.5rem"`, `"12px"`).
   */
  size?: number | string;
  /**
   * Dot fill. Any valid CSS color (e.g. semantic token: `var(--semantic-text-placeholder)`).
   * When omitted, the placeholder token is used via the default background chain.
   */
  color?: string;
  /**
   * Space between dots. Number is pixel gap; string is a CSS length (e.g. `"0.5rem"`).
   */
  spacing?: number | string;
  /**
   * Extra delay per dot for the wave (seconds), applied as animation delay per index.
   */
  staggerDelay?: number;
  /**
   * One animation cycle length (seconds) for the bounce, via `--bouncing-loader-duration`.
   */
  duration?: number;
}

const BouncingLoader = React.forwardRef<HTMLSpanElement, BouncingLoaderProps>(
  (
    {
      className,
      size,
      color,
      spacing,
      staggerDelay = 0.12,
      duration = 0.55,
      fullWidth,
      style,
      ...props
    },
    ref
  ) => {
    const mergedStyle: React.CSSProperties = {
      ...style,
      ...(size !== undefined && {
        ["--bouncing-loader-size" as string]: toCssLength(size, "px"),
      }),
      ...(color !== undefined && {
        ["--bouncing-loader-color" as string]: color,
      }),
      ...(spacing !== undefined && {
        ["--bouncing-loader-spacing" as string]: toCssLength(spacing, "px"),
      }),
      ["--bouncing-loader-duration" as string]: `${duration}s`,
    };

    return (
      <span
        ref={ref}
        className={cn(bouncingLoaderVariants({ fullWidth }), className)}
        style={mergedStyle}
        {...props}
      >
        {DOT_KEYS.map((i) => (
          <span
            key={i}
            className="bouncing-loader__dot box-border block h-[var(--bouncing-loader-size,8px)] w-[var(--bouncing-loader-size,8px)] shrink-0 rounded-full bg-[var(--bouncing-loader-color,var(--semantic-text-placeholder,currentColor))] animate-bouncing-bounce"
            style={{ animationDelay: `${i * staggerDelay}s` }}
            aria-hidden
          />
        ))}
      </span>
    );
  }
);
BouncingLoader.displayName = "BouncingLoader";

export { BouncingLoader, bouncingLoaderVariants };
