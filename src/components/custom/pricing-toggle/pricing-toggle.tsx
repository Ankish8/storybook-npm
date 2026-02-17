import * as React from "react";
import { cn } from "../../../lib/utils";
import { Switch } from "../../ui/switch";
import type { PricingToggleProps } from "./types";

/**
 * PricingToggle provides a plan type tab selector with an optional
 * billing period toggle. The pill-shaped tabs switch between plan
 * categories (e.g. "Team-Led Plans" vs "Go-AI First"), and the
 * billing toggle switches between monthly/yearly pricing.
 *
 * @example
 * ```tsx
 * <PricingToggle
 *   tabs={[
 *     { label: "Team-Led Plans", value: "team" },
 *     { label: "Go-AI First", value: "ai" },
 *   ]}
 *   activeTab="team"
 *   onTabChange={(value) => setActiveTab(value)}
 *   showBillingToggle
 *   billingPeriod="monthly"
 *   onBillingPeriodChange={(period) => setBillingPeriod(period)}
 * />
 * ```
 */
const PricingToggle = React.forwardRef<HTMLDivElement, PricingToggleProps>(
  (
    {
      tabs,
      activeTab,
      onTabChange,
      showBillingToggle = false,
      billingPeriod = "monthly",
      onBillingPeriodChange,
      monthlyLabel = "Monthly",
      yearlyLabel = "Yearly (Save 20%)",
      className,
      ...props
    },
    ref
  ) => {
    const isYearly = billingPeriod === "yearly";

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center gap-4", className)}
        {...props}
      >
        {/* Plan type tabs */}
        <div className="inline-flex items-start gap-1 rounded-full bg-semantic-bg-ui p-1">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "h-10 shrink-0 rounded-full px-4 py-1 text-base transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-brand focus-visible:ring-offset-2",
                  isActive
                    ? "bg-semantic-brand font-semibold text-white shadow-sm"
                    : "font-normal text-semantic-text-primary"
                )}
                onClick={() => onTabChange(tab.value)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Billing period toggle */}
        {showBillingToggle && (
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "text-sm font-semibold tracking-[0.014px]",
                !isYearly
                  ? "text-semantic-text-secondary"
                  : "text-semantic-text-muted"
              )}
            >
              {monthlyLabel}
            </span>
            <Switch
              size="sm"
              checked={isYearly}
              onCheckedChange={(checked) =>
                onBillingPeriodChange?.(checked ? "yearly" : "monthly")
              }
            />
            <span
              className={cn(
                "text-sm font-semibold tracking-[0.014px]",
                isYearly
                  ? "text-semantic-text-secondary"
                  : "text-semantic-text-muted"
              )}
            >
              {yearlyLabel}
            </span>
          </div>
        )}
      </div>
    );
  }
);

PricingToggle.displayName = "PricingToggle";

export { PricingToggle };
