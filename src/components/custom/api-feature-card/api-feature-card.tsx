import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Capability {
  /** Unique identifier for the capability */
  id: string;
  /** Display text for the capability */
  label: string;
}

export interface ApiFeatureCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon component to display */
  icon: React.ReactNode;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** List of key capabilities */
  capabilities?: Capability[];
  /** Text for the action button */
  actionLabel?: string;
  /** Icon for the action button */
  actionIcon?: React.ReactNode;
  /** Callback when action button is clicked */
  onAction?: () => void;
  /** Label for the capabilities section */
  capabilitiesLabel?: string;
}

/**
 * ApiFeatureCard displays an API feature with icon, title, description,
 * action button, and a list of key capabilities.
 *
 * @example
 * ```tsx
 * <ApiFeatureCard
 *   icon={<Phone className="h-5 w-5" />}
 *   title="Calling API"
 *   description="Manage real-time call flow, recordings, and intelligent routing."
 *   capabilities={[
 *     { id: "1", label: "Real-time Call Control" },
 *     { id: "2", label: "Live Call Events (Webhooks)" },
 *   ]}
 *   onAction={() => console.log("Manage clicked")}
 * />
 * ```
 */
export const ApiFeatureCard = React.forwardRef<
  HTMLDivElement,
  ApiFeatureCardProps
>(
  (
    {
      icon,
      title,
      description,
      capabilities = [],
      actionLabel = "Manage",
      actionIcon,
      onAction,
      capabilitiesLabel = "Key Capabilities",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 rounded-lg border border-[var(--semantic-border-layout,#E9EAEB)] bg-[var(--semantic-bg-primary,#FFFFFF)] p-6 overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Icon Container */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[var(--semantic-info-surface,#ECF1FB)]">
              <span className="text-[var(--semantic-info-primary,#4275D6)] [&_svg]:h-5 [&_svg]:w-5">
                {icon}
              </span>
            </div>

            {/* Title and Description */}
            <div className="flex flex-col gap-1.5">
              <h3 className="m-0 text-base font-semibold text-[var(--semantic-text-primary,#181D27)]">
                {title}
              </h3>
              <p className="m-0 text-sm text-[var(--semantic-text-muted,#717680)] tracking-[0.035px]">
                {description}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="default"
            size="default"
            leftIcon={actionIcon}
            onClick={onAction}
            className="shrink-0"
          >
            {actionLabel}
          </Button>
        </div>

        {/* Capabilities Section */}
        {capabilities.length > 0 && (
          <div className="flex flex-col gap-2.5 border-t border-[var(--semantic-border-layout,#E9EAEB)] bg-[var(--color-neutral-50,#FAFAFA)] -mx-6 -mb-6 p-6">
            <span className="text-sm font-semibold uppercase tracking-[0.014px] text-[var(--color-neutral-400,#A4A7AE)]">
              {capabilitiesLabel}
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {capabilities.map((capability) => (
                <div
                  key={capability.id}
                  className="flex items-center gap-1.5"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-info-primary,#4275D6)]" />
                  <span className="text-sm text-[var(--semantic-text-primary,#181D27)] tracking-[0.035px]">
                    {capability.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ApiFeatureCard.displayName = "ApiFeatureCard";
