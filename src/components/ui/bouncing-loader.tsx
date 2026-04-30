import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const DOT_KEYS = [0, 1, 2] as const;
const DOT_DELAYS_SEC = [0, 0.2, 0.4] as const;
const ANIMATION_NAME = "bouncing-typing-wave";
const KEYFRAMES_CSS = `
@keyframes ${ANIMATION_NAME} {
  0%, 60%, 100% { transform: translate3d(0, 0, 0); }
  30% { transform: translate3d(0, -6px, 0); }
}`;

function toCssLength(value: number | string, unit: string): string {
  if (typeof value === "string") {
    return value;
  }
  return `${value}${unit}`;
}

const bouncingLoaderVariants = cva(
  "bouncing-loader inline-flex shrink-0 min-w-0 items-center justify-center leading-[0] align-middle gap-[var(--bouncing-loader-spacing,0.375rem)]"
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
   */
  color?: string;
  /**
   * Space between dots. Number is pixel gap; string is a CSS length (e.g. `"0.5rem"`).
   */
  spacing?: number | string;
}

const BouncingLoader = React.forwardRef<HTMLSpanElement, BouncingLoaderProps>(
  ({ className, size, color, spacing, style, ...props }, ref) => {
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
    };

    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label="Loading"
        className={cn(bouncingLoaderVariants(), className)}
        style={mergedStyle}
        {...props}
      >
        <style>{KEYFRAMES_CSS}</style>
        {DOT_KEYS.map((i) => (
          <span
            key={i}
            className="bouncing-loader__dot box-border block h-[var(--bouncing-loader-size,8px)] w-[var(--bouncing-loader-size,8px)] shrink-0 rounded-full bg-[var(--bouncing-loader-color,var(--semantic-text-placeholder,currentColor))]"
            style={{
              animation: `${ANIMATION_NAME} 1.4s cubic-bezier(0.4, 0, 0.2, 1) ${DOT_DELAYS_SEC[i]}s infinite`,
            }}
            aria-hidden
          />
        ))}
      </span>
    );
  }
);
BouncingLoader.displayName = "BouncingLoader";

export { BouncingLoader, bouncingLoaderVariants };
