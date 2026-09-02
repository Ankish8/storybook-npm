import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "../../../../lib/utils";
import type { LiveCallsBannerProps } from "./types";

/**
 * LiveCallsBanner sits above a call-logs table to surface how many calls are
 * currently live, with an optional toggle to hide/show them in the table below.
 *
 * @example
 * ```tsx
 * <LiveCallsBanner count={2} expanded onToggle={() => setExpanded((v) => !v)} />
 * ```
 */
const LiveCallsBanner = React.forwardRef(
  (
    {
      count,
      expanded = true,
      onToggle,
      className,
      ...props
    }: LiveCallsBannerProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-wrap items-center gap-2.5 border-t border-solid border-semantic-border-layout bg-semantic-info-surface px-4 py-2",
          className
        )}
        {...props}
      >
        <span
          className="size-[7px] shrink-0 animate-pulse rounded-full bg-semantic-success-hover"
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-semantic-success-text">
          {count} live {count === 1 ? "call" : "calls"}
        </span>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="flex items-center gap-1 text-xs text-semantic-text-link hover:underline"
          >
            {expanded ? "Hide" : "Show"}
            {expanded ? (
              <ChevronUp className="size-[9px]" aria-hidden="true" />
            ) : (
              <ChevronDown className="size-[9px]" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    );
  }
);
LiveCallsBanner.displayName = "LiveCallsBanner";

export { LiveCallsBanner };
