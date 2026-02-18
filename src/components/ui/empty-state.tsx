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
        "flex flex-col items-center justify-center gap-5 py-16 px-4",
        className
      )}
    >
      {icon && (
        <div className="bg-semantic-primary-surface rounded-[40px] size-[90px] flex items-center justify-center text-semantic-text-secondary">
          {icon}
        </div>
      )}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="m-0 text-base font-semibold text-semantic-text-primary">
          {title}
        </p>
        {description && (
          <p className="m-0 text-sm text-semantic-text-muted max-w-xs">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-4">{actions}</div>
      )}
    </div>
  );
}
EmptyState.displayName = "EmptyState";

export { EmptyState };
