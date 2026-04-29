import * as React from "react"
import { cn } from "../../../lib/utils"
import "./bouncing-loader.css"

const DOT_KEYS = [0, 1, 2] as const

function toCssLength(value: number | string, unit: string): string {
  if (typeof value === "string") {
    return value
  }
  return `${value}${unit}`
}

export interface BouncingLoaderProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Dot diameter. Number is treated as pixels; string is used as a CSS length
   * (e.g. `"0.5rem"`, `"12px"`).
   */
  size?: number | string
  /**
   * Dot fill. Any valid CSS color (e.g. semantic token: `var(--semantic-text-placeholder)`).
   * When omitted, uses `--bouncing-loader-color` default from CSS (placeholder token).
   */
  color?: string
  /**
   * Space between dots. Number is pixel gap; string is a CSS length (e.g. `"0.5rem"`).
   */
  spacing?: number | string
  /**
   * Extra delay per dot for the wave (seconds), mapped to CSS `--bouncing-loader-stagger`.
   */
  staggerDelay?: number
  /**
   * One animation cycle length (seconds) for the bounce keyframes.
   */
  duration?: number
  /**
   * If true, the root spans full width and centers the row (useful inside flex parents).
   */
  fullWidth?: boolean
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
      ...(color !== undefined && { ["--bouncing-loader-color" as string]: color }),
      ...(spacing !== undefined && {
        ["--bouncing-loader-spacing" as string]: toCssLength(spacing, "px"),
      }),
      ["--bouncing-loader-stagger" as string]: `${staggerDelay}s`,
      ["--bouncing-loader-duration" as string]: `${duration}s`,
    }

    return (
      <span
        ref={ref}
        className={cn(
          "bouncing-loader",
          fullWidth && "bouncing-loader--full-width",
          className
        )}
        style={mergedStyle}
        {...props}
      >
        {DOT_KEYS.map((i) => (
          <span key={i} className="bouncing-loader__dot" aria-hidden />
        ))}
      </span>
    )
  }
)
BouncingLoader.displayName = "BouncingLoader"

export { BouncingLoader }
