import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Trend label variants — colors the delta text/arrow by direction.
 */
const trendVariants = cva(
  "m-0 inline-flex items-center gap-1 text-sm font-medium",
  {
    variants: {
      trend: {
        up: "text-semantic-success-primary",
        down: "text-semantic-error-primary",
        neutral: "text-semantic-text-muted",
      },
    },
    defaultVariants: {
      trend: "neutral",
    },
  }
);

export interface StatCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof trendVariants> {
  /** Short metric name, e.g. "Active chats". */
  label: string;
  /** The headline figure, e.g. "1,248" or "98%". */
  value: React.ReactNode;
  /** Optional change indicator, e.g. "+12.5%". */
  delta?: string;
  /** Optional icon shown in the top-right corner. */
  icon?: React.ReactNode;
}

/**
 * StatCard — a compact KPI tile for dashboards.
 *
 * @example
 * ```tsx
 * <StatCard label="Revenue" value="$12.4k" delta="+8.2%" trend="up" />
 * ```
 */
const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, delta, trend = "neutral", icon, ...props }, ref) => {
    const TrendIcon =
      trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-2 rounded-xl border border-solid border-semantic-border-layout bg-semantic-bg-primary p-5",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <p className="m-0 text-sm font-medium text-semantic-text-muted">
            {label}
          </p>
          {icon && (
            <span className="text-semantic-text-muted [&_svg]:size-5">
              {icon}
            </span>
          )}
        </div>

        <p className="m-0 text-3xl font-semibold leading-none text-semantic-text-primary">
          {value}
        </p>

        {delta && (
          <p className={cn(trendVariants({ trend }))}>
            {TrendIcon && <TrendIcon className="size-4" />}
            {delta}
          </p>
        )}
      </div>
    );
  }
);
StatCard.displayName = "StatCard";

export { StatCard, trendVariants };
