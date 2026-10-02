import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: "bar" | "circle" | "semi-circle";
  labelPosition?: "right" | "bottom" | "none";
  indeterminate?: boolean;
}
const ProgressIndicator = React.forwardRef<
  HTMLDivElement,
  ProgressIndicatorProps
>(
  (
    {
      value = 0,
      variant = "bar",
      labelPosition = "right",
      indeterminate = false,
      className,
      "aria-label": ariaLabel = "Progress",
      ...props
    },
    ref
  ) => {
    const percentage = Math.max(
      0,
      Math.min(100, Number.isFinite(value) ? value : 0)
    );
    const circle = variant !== "bar";
    const semi = variant === "semi-circle";
    const radius = 24.43256;
    const circumference = 2 * Math.PI * radius;
    const length = semi ? circumference / 2 : circumference;
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : percentage}
        className={cn(
          "font-[family-name:var(--font-v2,Inter,sans-serif)] text-xs leading-[15px] text-semantic-text-primary",
          circle
            ? "relative inline-flex w-[54px] items-center justify-center"
            : "flex w-[320px] max-w-full items-center gap-3",
          !circle && labelPosition === "bottom" && "flex-col items-end gap-2",
          !circle &&
            labelPosition === "right" &&
            !indeterminate &&
            "min-h-[17px]",
          className
        )}
        {...props}
      >
        {circle ? (
          <>
            <svg
              aria-hidden="true"
              viewBox={semi ? "0 0 54 27" : "0 0 54 54"}
              className={cn(
                "block w-[54px] shrink-0",
                semi ? "h-[27px]" : "h-[54px]"
              )}
            >
              {semi ? (
                <>
                  <path
                    d={`M ${27 - radius} 27 A ${radius} ${radius} 0 0 1 ${27 + radius} 27`}
                    fill="none"
                    stroke="var(--semantic-border-layout,#E9EAEB)"
                    strokeWidth="5.13488"
                  />
                  <path
                    d={`M ${27 - radius} 27 A ${radius} ${radius} 0 0 1 ${27 + radius} 27`}
                    fill="none"
                    stroke="var(--semantic-info-primary,#4275D6)"
                    strokeWidth="5.13488"
                    strokeDasharray={length}
                    strokeDashoffset={length * (1 - percentage / 100)}
                  />
                </>
              ) : (
                <g transform="rotate(-90 27 27)">
                  <circle
                    cx="27"
                    cy="27"
                    r={radius}
                    fill="none"
                    stroke="var(--semantic-border-layout,#E9EAEB)"
                    strokeWidth="5.13488"
                  />
                  <circle
                    cx="27"
                    cy="27"
                    r={radius}
                    fill="none"
                    stroke="var(--semantic-info-primary,#4275D6)"
                    strokeWidth="5.13488"
                    strokeDasharray={length}
                    strokeDashoffset={length * (1 - percentage / 100)}
                    className={
                      indeterminate
                        ? "origin-center animate-spin motion-reduce:animate-none"
                        : undefined
                    }
                  />
                </g>
              )}
            </svg>
            {labelPosition !== "none" && !indeterminate && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute text-xs font-semibold tracking-[0.06px]",
                  semi && "bottom-0"
                )}
              >
                {Math.round(percentage)}%
              </span>
            )}
          </>
        ) : (
          <>
            <div
              className={cn(
                "relative h-2 w-full min-w-0 overflow-hidden rounded-lg border-[0.2px] border-solid border-semantic-border-layout bg-semantic-border-layout",
                labelPosition === "bottom" ? "shrink-0" : "flex-1"
              )}
            >
              <div
                className={cn(
                  "h-full rounded-lg bg-semantic-info-primary transition-[width] duration-200 motion-reduce:transition-none",
                  indeterminate && "animate-pulse motion-reduce:animate-none"
                )}
                style={{ width: indeterminate ? "30%" : `${percentage}%` }}
              />
            </div>
            {labelPosition !== "none" && !indeterminate && (
              <span
                aria-hidden="true"
                className="shrink-0 text-xs leading-[15px]"
              >
                {Math.round(percentage)}%
              </span>
            )}
          </>
        )}
      </div>
    );
  }
);
ProgressIndicator.displayName = "ProgressIndicator";
export { ProgressIndicator };
