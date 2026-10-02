import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  /** Icon element rendered inside the icon circle */
  icon?: React.ReactNode;
  /** Bold heading text */
  title: React.ReactNode;
  /** Optional subtitle / description text */
  description?: React.ReactNode;
  /** Optional action buttons rendered below the description */
  actions?: React.ReactNode;
  /** Additional CSS classes for the root container */
  className?: string;
}

function EmptyState({
  icon,
  title,
  description,
  actions,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-5 p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]",
        className
      )}
    >
      {icon && (
        <div className="bg-semantic-bg-primary border border-semantic-border-layout rounded-[60px] shadow-[0_1px_2px_0_rgba(12,15,18,0.05),0_0_0_1px_rgba(10,13,18,0.18)_inset,0_-2px_0_0_rgba(12,15,18,0.05)_inset] size-[90px] flex items-center justify-center text-[var(--v2-text-secondary,#5E5E5E)]">
          {icon}
        </div>
      )}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="m-0 text-2xl leading-8 font-semibold text-[var(--v2-text-primary,#484848)]">
          {title}
        </p>
        {description && (
          <p className="m-0 text-base leading-[normal] text-[var(--v2-text-secondary,#5E5E5E)]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
EmptyState.displayName = "EmptyState";

export { EmptyState };
