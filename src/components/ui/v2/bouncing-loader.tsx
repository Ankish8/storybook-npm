"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const DOT_KEYS = [0, 1, 2] as const;
const DOT_DELAYS_SEC = [0, 0.16, 0.32] as const;
// A distinct name keeps v1 and v2 loaders independent during migration.
const ANIMATION_NAME = "myoperator-v2-bouncing-typing-wave";
// Ship the wave with the component: CLI consumers do not need a global keyframe
// or a Tailwind animation preset. Reduced motion leaves all three dots still.
const KEYFRAMES_CSS = `
@keyframes ${ANIMATION_NAME} {
  0%, 60%, 100% { opacity: 0.5; transform: translate3d(0, 0, 0); }
  30% { opacity: 1; transform: translate3d(0, -3px, 0); }
}
@media (prefers-reduced-motion: reduce) {
  [data-v2-bounce-dot] { animation: none !important; transform: none !important; opacity: 0.6; }
}`;

function toCssLength(value: number | string, unit: string): string {
  if (typeof value === "string") {
    return value;
  }
  return `${value}${unit}`;
}

// `bouncing-loader` and `bouncing-loader__dot` are v1 hook classes: consumer stylesheets and tests may target
// them, so a drop-in replacement keeps them even though they carry no styling of their own.
const bouncingLoaderVariants = cva(
  "bouncing-loader inline-flex shrink-0 min-w-0 items-center justify-center leading-[0] align-middle gap-[var(--bouncing-loader-spacing,0.375rem)] [&[hidden]]:hidden"
);

export interface BouncingLoaderProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof bouncingLoaderVariants> {
  /**
   * Dot diameter. Number is treated as pixels; string is used as a CSS length
   * (e.g. `"0.5rem"`, `"12px"`). Defaults to 8px, as in v1.
   */
  size?: number | string;
  /**
   * Dot fill. Any valid CSS color (e.g. semantic token: `var(--semantic-text-placeholder)`).
   */
  color?: string;
  /**
   * Space between dots. Number is pixel gap; string is a CSS length (e.g. `"0.5rem"`).
   * Defaults to 0.375rem, as in v1.
   */
  spacing?: number | string;
}

const BouncingLoader = React.forwardRef<HTMLSpanElement, BouncingLoaderProps>(
  ({ className, size, color, spacing, style, ...props }, ref) => {
    const rootRef = React.useRef<HTMLSpanElement | null>(null);
    const [visible, setVisible] = React.useState(true);
    const setRootRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
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

    const decorative =
      props["aria-hidden"] === true ||
      props["aria-hidden"] === "true" ||
      props.role === "presentation" ||
      props.role === "none";
    const callerStyle = style as
      | (React.CSSProperties & {
          "--v2-bouncing-loader-play-state"?: string;
        })
      | undefined;
    const paused = !visible || props.hidden || style?.visibility === "hidden";
    const mergedStyle: React.CSSProperties = {
      ["--v2-bouncing-loader-duration" as string]:
        style?.animationDuration ?? "1.4s",
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
      ["--v2-bouncing-loader-play-state" as string]: paused
        ? "paused"
        : (callerStyle?.["--v2-bouncing-loader-play-state"] ??
          style?.animationPlayState ??
          "running"),
    };

    return (
      <span
        ref={setRootRef}
        role={decorative ? undefined : "status"}
        aria-live={decorative ? undefined : "polite"}
        aria-label={
          decorative || props["aria-labelledby"] ? undefined : "Loading"
        }
        className={cn(bouncingLoaderVariants(), className)}
        style={mergedStyle}
        {...props}
      >
        <style>{KEYFRAMES_CSS}</style>
        {DOT_KEYS.map((i) => (
          <span
            key={i}
            data-v2-bounce-dot=""
            className="bouncing-loader__dot box-border block h-[var(--bouncing-loader-size,8px)] w-[var(--bouncing-loader-size,8px)] shrink-0 rounded-full bg-[var(--bouncing-loader-color,var(--semantic-text-placeholder,currentColor))] [animation-name:myoperator-v2-bouncing-typing-wave] [animation-duration:var(--v2-bouncing-loader-duration,1.4s)] [animation-timing-function:cubic-bezier(0.4,0,0.2,1)] [animation-delay:var(--v2-bouncing-loader-delay,0s)] [animation-iteration-count:infinite] [animation-fill-mode:both] [animation-play-state:var(--v2-bouncing-loader-play-state,running)]"
            style={{
              ["--v2-bouncing-loader-delay" as string]: `${DOT_DELAYS_SEC[i]}s`,
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
