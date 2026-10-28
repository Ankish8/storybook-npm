"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

const metricCardVariants = cva(
  "flex min-w-0 flex-col rounded-xl border border-solid border-v2-semantic-border-layout font-[family-name:var(--font-v2,Inter,sans-serif)] text-[var(--v2-text-primary,var(--v2-semantic-text-primary,var(--semantic-text-primary)))]",
  {
    variants: {
      variant: {
        default:
          "bg-v2-semantic-bg-primary shadow-[var(--v2-shadow-sm,var(--shadow-sm))]",
        subtle: "bg-v2-semantic-bg-ui",
      },
      size: {
        sm: "gap-3 p-4",
        default: "gap-4 p-5",
        lg: "gap-5 p-6",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

const trendVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium leading-4 tabular-nums",
  {
    variants: {
      tone: {
        positive:
          "bg-v2-semantic-success-surface text-v2-semantic-success-text",
        negative: "bg-v2-semantic-error-surface text-v2-semantic-error-text",
        neutral:
          "bg-v2-semantic-bg-ui text-[var(--v2-text-secondary,var(--v2-semantic-text-secondary,var(--semantic-text-secondary)))]",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const reducedMotionServerSnapshot = () => true;

function reducedMotionSnapshot() {
  return (
    typeof window !== "undefined" &&
    Boolean(window.matchMedia?.(reducedMotionQuery).matches)
  );
}

function subscribeReducedMotion(listener: () => void) {
  const media = window.matchMedia?.(reducedMotionQuery);
  media?.addEventListener("change", listener);
  return () => media?.removeEventListener("change", listener);
}

export interface MetricCardTrend {
  /** Readable change, including its sign or unit when relevant. */
  change: string;
  /** Direction and whether a change is desirable are deliberately independent. */
  direction?: "up" | "down" | "flat";
  /** Neutral by default. For example, fewer missed calls can be positive. */
  tone?: "positive" | "negative" | "neutral";
}

export interface MetricCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  /** What the value measures. Also names the card's accessible group. */
  label: string;
  /** A number or an already formatted value, such as "₹24,500" or "2m 18s". */
  value: number | string;
  /** Optional unit after the value, such as "%" or " ms". */
  suffix?: string;
  /** Context for the measurement, such as "Compared with the previous 7 days". */
  comparison?: React.ReactNode;
  trend?: MetricCardTrend;
  /** Small supporting graphic. Give meaningful graphics an accessible name. */
  graphic?: React.ReactNode;
  /** Briefly settle a changed value. Never animates the first render. */
  animateValue?: boolean;
}

/** A focused metric summary; the surface stays still while its value changes. */
const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      className,
      variant,
      size,
      label,
      value,
      suffix,
      comparison,
      trend,
      graphic,
      animateValue = true,
      children,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...props
    },
    ref
  ) => {
    const labelId = React.useId();
    const valueRef = React.useRef<HTMLSpanElement>(null);
    const previous = React.useRef<{
      text: string;
      value: number | string;
    } | null>(null);
    const reducedMotion = React.useSyncExternalStore(
      subscribeReducedMotion,
      reducedMotionSnapshot,
      reducedMotionServerSnapshot
    );
    const text = String(value) + (suffix ?? "");

    React.useEffect(() => {
      const last = previous.current;
      previous.current = { text, value };
      const node = valueRef.current;
      if (
        !last ||
        last.text === text ||
        !animateValue ||
        reducedMotion ||
        !node?.animate
      ) {
        return;
      }

      const offset =
        typeof value === "number" &&
        typeof last.value === "number" &&
        value < last.value
          ? -3
          : 3;
      // One accessible copy of the latest value remains in flow throughout.
      const animation = node.animate(
        [
          { opacity: 0.5, transform: "translateY(" + offset + "px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 180, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
      // New values, disabling animation, live preference changes, and unmount all cancel.
      return () => animation.cancel();
    }, [text, value, animateValue, reducedMotion]);

    const TrendIcon =
      trend?.direction === "up"
        ? ArrowUpRight
        : trend?.direction === "down"
          ? ArrowDownRight
          : trend?.direction === "flat"
            ? Minus
            : null;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : labelId)}
        data-slot="metric-card"
        className={cn(metricCardVariants({ variant, size, className }))}
        {...props}
      >
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
          <p
            id={labelId}
            data-slot="metric-card-label"
            className="m-0 min-w-0 break-words text-sm font-medium leading-5 text-[var(--v2-text-secondary,var(--v2-semantic-text-secondary,var(--semantic-text-secondary)))]"
          >
            {label}
          </p>
          {trend && (
            <span
              data-slot="metric-card-trend"
              data-direction={trend.direction}
              data-tone={trend.tone ?? "neutral"}
              className={trendVariants({ tone: trend.tone })}
            >
              {TrendIcon && (
                <TrendIcon
                  aria-hidden="true"
                  focusable="false"
                  className="size-3"
                />
              )}
              {trend.direction && (
                <span className="sr-only">
                  {trend.direction === "up"
                    ? "Increased by "
                    : trend.direction === "down"
                      ? "Decreased by "
                      : "No change: "}
                </span>
              )}
              {trend.change}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <p
            data-slot="metric-card-value"
            className={cn(
              "m-0 min-w-0 break-words text-3xl font-medium leading-tight tracking-[-0.03em] tabular-nums text-v2-semantic-text-primary",
              size === "sm" && "text-2xl",
              size === "lg" && "text-4xl"
            )}
          >
            <span ref={valueRef} className="inline-block max-w-full">
              {text}
            </span>
          </p>
          {comparison !== undefined && comparison !== null && (
            <div
              data-slot="metric-card-comparison"
              className="min-w-0 break-words text-sm leading-5 text-[var(--v2-text-muted,var(--v2-semantic-text-muted,var(--semantic-text-muted)))]"
            >
              {comparison}
            </div>
          )}
        </div>
        {graphic !== undefined && graphic !== null && graphic !== false && (
          <div data-slot="metric-card-graphic" className="min-w-0">
            {graphic}
          </div>
        )}
        {children !== undefined && children !== null && children !== false && (
          <div
            data-slot="metric-card-footer"
            className="min-w-0 border-t border-solid border-v2-semantic-border-layout pt-3 text-sm leading-5 text-[var(--v2-text-secondary,var(--v2-semantic-text-secondary,var(--semantic-text-secondary)))]"
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);
MetricCard.displayName = "MetricCard";

export { MetricCard, metricCardVariants };
