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
  /**
   * "default" is the full empty view. "sm" is compact for cards, panels and table bodies: a 48px icon
   * tile (its icon is sized to 24px), 16px title, 14px description and 16px padding.
   */
  size?: "default" | "sm";
  /** Additional CSS classes for the root container */
  className?: string;
}

function EmptyState({
  icon,
  title,
  description,
  actions,
  size = "default",
  className,
}: EmptyStateProps) {
  // The default classes are kept as whole literals so the default output is byte-for-byte unchanged.
  const small = size === "sm";
  return (
    <div
      data-slot="empty-state"
      className={cn(
        small
          ? "flex flex-col items-center justify-center gap-4 p-4 font-[family-name:var(--font-v2,Inter,sans-serif)]"
          : "flex flex-col items-center justify-center gap-5 p-6 font-[family-name:var(--font-v2,Inter,sans-serif)]",
        className
      )}
    >
      {icon && (
        <div
          className={
            small
              ? "bg-semantic-bg-primary border border-semantic-border-layout rounded-[60px] shadow-[0_1px_2px_0_rgba(12,15,18,0.05),0_0_0_1px_rgba(10,13,18,0.18)_inset,0_-2px_0_0_rgba(12,15,18,0.05)_inset] size-12 flex items-center justify-center text-[var(--v2-text-secondary,#5E5E5E)] [&>svg]:size-6"
              : "bg-semantic-bg-primary border border-semantic-border-layout rounded-[60px] shadow-[0_1px_2px_0_rgba(12,15,18,0.05),0_0_0_1px_rgba(10,13,18,0.18)_inset,0_-2px_0_0_rgba(12,15,18,0.05)_inset] size-[90px] flex items-center justify-center text-[var(--v2-text-secondary,#5E5E5E)]"
          }
        >
          {icon}
        </div>
      )}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p
          className={
            small
              ? "m-0 text-base leading-6 font-semibold text-[var(--v2-text-primary,#484848)]"
              : "m-0 text-2xl leading-8 font-semibold text-[var(--v2-text-primary,#484848)]"
          }
        >
          {title}
        </p>
        {description && (
          <p
            className={
              small
                ? "m-0 text-sm leading-5 text-[var(--v2-text-secondary,#5E5E5E)]"
                : "m-0 text-base leading-[normal] text-[var(--v2-text-secondary,#5E5E5E)]"
            }
          >
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
