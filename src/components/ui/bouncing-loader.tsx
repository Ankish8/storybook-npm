import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const DOT_KEYS = [0, 1, 2] as const;

/** Delays (seconds) for `type="staggered"` — matches the common 0.1s / 0.3s / 0.6s pattern. */
const STAGGERED_BOUNCE_DELAYS_SEC = [0.1, 0.3, 0.6] as const;

export type BouncingLoaderType = "default" | "staggered";

export type BouncingLoaderFrame = "none" | "pill";

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
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "type">,
    VariantProps<typeof bouncingLoaderVariants> {
  /**
   * `default` — `effect` controls the animation.
   * `staggered` — Tailwind `animate-bounce` with **0.5s** duration and per-dot delays
   * **0.1s / 0.3s / 0.6s** (overrides `effect` for the animation). Sensible defaults: 20px dots,
   * 12px gap, `var(--color-neutral-800)` (override with `size` / `spacing` / `color`).
   */
  type?: BouncingLoaderType;
  /**
   * `pill` — white rounded container with padding (like `bg-white p-5 rounded-full` around the row).
   */
  frame?: BouncingLoaderFrame;
  /**
   * Dot diameter. Number is treated as pixels; string is used as a CSS length
   * (e.g. `"0.5rem"`, `"12px"`).
   */
  size?: number | string;
  /**
   * Dot fill. Any valid CSS color (e.g. semantic token: `var(--semantic-text-placeholder)`).
   * When omitted, the placeholder token is used via the default background chain.
   * Use with `colorDark` to mirror `bg-…` / `dark:bg-…` in plain HTML.
   */
  color?: string;
  /**
   * Optional dot fill when `.dark` is on an ancestor. If omitted, one fill (from `color` or
   * the default placeholder) is used in both themes.
   */
  colorDark?: string;
  /**
   * Space between dots. Number is pixel gap; string is a CSS length (e.g. `"0.5rem"`).
   */
  spacing?: number | string;
  /**
   * Extra delay per dot (seconds) as `i * delay`. `wave` defaults to `duration/3`;
   * `dots-bounce` / `tailwind-bounce` default to `0.2` (0s / 0.2s / 0.4s); `bounce` defaults
   * to `0.12s`.
   */
  staggerDelay?: number;
  /**
   * One full animation loop (seconds) per dot, via `--bouncing-loader-duration`.
   */
  duration?: number;
  /**
   * Vertical travel at the peak. Number = pixels; string = any CSS length. Sets
   * `--bouncing-loader-bounce`.
   */
  bounce?: number | string;
  /**
   * `wave` (default) — one quick lift per cycle, staggered: classic typing-dot wave.
   * `bounce` — each dot runs a continuous up/down loop (sine-like bounce, not a row wave).
   * `dots-bounce` — Tailwind’s `animate-bounce` with staggered delays
   * (default 0.2s, like 0s / 0.2s / 0.4s). Alias: `tailwind-bounce`.
   */
  effect?: "wave" | "bounce" | "dots-bounce" | "tailwind-bounce";
}

const BouncingLoader = React.forwardRef<HTMLSpanElement, BouncingLoaderProps>(
  (
    {
      className,
      type: typeProp = "default",
      frame = "none",
      size,
      color,
      colorDark,
      spacing,
      staggerDelay: staggerProp,
      duration: userDuration,
      bounce = 4,
      effect = "wave",
      fullWidth,
      style,
      ...props
    },
    ref
  ) => {
    const isStaggeredType = typeProp === "staggered";
    const isDotsBounce =
      isStaggeredType || effect === "dots-bounce" || effect === "tailwind-bounce";

    const duration = userDuration ?? (isStaggeredType ? 0.5 : isDotsBounce ? 1 : 0.6);

    const staggerDelay =
      staggerProp ??
      (effect === "wave" && !isStaggeredType
        ? duration / 3
        : isDotsBounce
          ? 0.2
          : 0.12);

    const waveClass = !isDotsBounce && effect === "wave" && "animate-bouncing-typing-wave";
    const bounceClass = !isDotsBounce && effect === "bounce" && "animate-bouncing-bounce";
    const dotsBounceClass = isDotsBounce && "animate-bounce";

    const effectiveSize = size ?? (isStaggeredType ? 20 : undefined);
    const effectiveSpacing = spacing ?? (isStaggeredType ? 12 : undefined);
    const effectiveColor = color ?? (isStaggeredType ? "var(--color-neutral-800)" : undefined);

    const dotBgClass =
      colorDark !== undefined
        ? "bg-[var(--bouncing-loader-color,var(--semantic-text-placeholder,currentColor))] dark:bg-[var(--bouncing-loader-color-dark)]"
        : "bg-[var(--bouncing-loader-color,var(--semantic-text-placeholder,currentColor))]";

    const animationDelayForDot = (i: number): string => {
      if (isStaggeredType) {
        if (staggerProp !== undefined) {
          return `${i * staggerProp}s`;
        }
        return `${STAGGERED_BOUNCE_DELAYS_SEC[i]}s`;
      }
      return `${i * staggerDelay}s`;
    };

    const mergedStyle: React.CSSProperties = {
      ...style,
      ...(effectiveSize !== undefined && {
        ["--bouncing-loader-size" as string]: toCssLength(effectiveSize, "px"),
      }),
      ...(effectiveColor !== undefined && {
        ["--bouncing-loader-color" as string]: effectiveColor,
      }),
      ...(colorDark !== undefined && {
        ["--bouncing-loader-color-dark" as string]: colorDark,
      }),
      ...(effectiveSpacing !== undefined && {
        ["--bouncing-loader-spacing" as string]: toCssLength(effectiveSpacing, "px"),
      }),
      ["--bouncing-loader-duration" as string]: `${duration}s`,
      ["--bouncing-loader-bounce" as string]: toCssLength(bounce, "px"),
    };

    return (
      <span
        ref={ref}
        className={cn(
          bouncingLoaderVariants({ fullWidth }),
          frame === "pill" && "rounded-full bg-white p-5",
          className
        )}
        style={mergedStyle}
        {...props}
      >
        {DOT_KEYS.map((i) => (
          <span
            key={i}
            className={cn(
              "bouncing-loader__dot box-border block h-[var(--bouncing-loader-size,8px)] w-[var(--bouncing-loader-size,8px)] shrink-0 rounded-full",
              dotBgClass,
              waveClass,
              bounceClass,
              dotsBounceClass
            )}
            style={{
              animationDelay: animationDelayForDot(i),
              ...(isDotsBounce && {
                animationDuration: `${duration}s`,
              }),
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
