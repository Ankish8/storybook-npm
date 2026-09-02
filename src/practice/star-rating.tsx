import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StarRatingProps {
  /** Controlled rating value (1–max). Use with `onChange`. */
  value?: number;
  /** Initial rating for uncontrolled usage. */
  defaultValue?: number;
  /** Number of stars to render. */
  max?: number;
  /** Disable interaction and hover preview. */
  readOnly?: boolean;
  /** Star size. */
  size?: "sm" | "md" | "lg";
  /** Called with the new rating when a star is clicked. */
  onChange?: (value: number) => void;
  className?: string;
}

const sizeMap = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
} as const;

/**
 * StarRating — a click-to-rate control with hover preview.
 *
 * Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 *
 * @example
 * ```tsx
 * <StarRating defaultValue={3} onChange={(v) => console.log(v)} />
 * <StarRating value={4} readOnly size="sm" />
 * ```
 */
const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      value,
      defaultValue = 0,
      max = 5,
      readOnly = false,
      size = "md",
      onChange,
      className,
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState(defaultValue);
    const [hover, setHover] = React.useState<number | null>(null);

    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;
    const display = hover ?? current;

    const setValue = (next: number) => {
      if (readOnly) return;
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label="Star rating"
        className={cn("inline-flex items-center gap-1", className)}
      >
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= display;

          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={starValue === current}
              aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
              disabled={readOnly}
              onClick={() => setValue(starValue)}
              onMouseEnter={() => !readOnly && setHover(starValue)}
              onMouseLeave={() => !readOnly && setHover(null)}
              className={cn(
                "rounded-sm bg-transparent p-0 transition-transform focus:outline-none focus:ring-2 focus:ring-semantic-primary",
                readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
              )}
            >
              <Star
                className={cn(
                  sizeMap[size],
                  "transition-colors",
                  filled
                    ? "fill-semantic-warning-primary text-semantic-warning-primary"
                    : "fill-transparent text-semantic-border-primary"
                )}
              />
            </button>
          );
        })}
      </div>
    );
  }
);
StarRating.displayName = "StarRating";

export { StarRating };
