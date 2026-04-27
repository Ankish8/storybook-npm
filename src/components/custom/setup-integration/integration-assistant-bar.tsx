import * as React from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface IntegrationAssistantBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label next to the leading icon (default: "AI Assistant") */
  label?: string;
  /** Reset control label (default: "Reset Chat") */
  resetLabel?: string;
  onResetClick?: () => void;
  leadingIcon?: React.ReactNode;
  resetIcon?: React.ReactNode;
}

const IntegrationAssistantBar = React.forwardRef<
  HTMLDivElement,
  IntegrationAssistantBarProps
>(
  (
    {
      className,
      label = "AI Assistant",
      resetLabel = "Reset Chat",
      onResetClick,
      leadingIcon,
      resetIcon,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[52px] shrink-0 flex-wrap items-center justify-between gap-2 border-b border-solid border-semantic-border-layout bg-semantic-info-surface-subtle px-4 py-2.5 sm:h-[52px] sm:flex-nowrap sm:px-6 sm:py-0",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2 px-0.5 sm:gap-2.5 sm:px-1">
        {leadingIcon ?? (
          <Sparkles className="size-[18px] text-semantic-text-secondary" />
        )}
        <span className="text-sm font-semibold tracking-wide text-semantic-text-primary">
          {label}
        </span>
      </div>
      {onResetClick && (
        <button
          type="button"
          onClick={onResetClick}
          className="flex items-center gap-1 text-sm font-semibold tracking-wide text-semantic-text-muted hover:text-semantic-text-secondary transition-colors"
        >
          {resetIcon ?? <RotateCcw className="size-[11px]" />}
          {resetLabel}
        </button>
      )}
    </div>
  )
);
IntegrationAssistantBar.displayName = "IntegrationAssistantBar";

export { IntegrationAssistantBar };
