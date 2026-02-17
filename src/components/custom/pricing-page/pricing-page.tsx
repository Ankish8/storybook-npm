import * as React from "react";
import { cn } from "../../../lib/utils";
import { PageHeader } from "../../ui/page-header";
import { Button } from "../../ui/button";
import { PricingToggle } from "../pricing-toggle/pricing-toggle";
import { PricingCard } from "../pricing-card/pricing-card";
import { PowerUpCard } from "../power-up-card/power-up-card";
import { LetUsDriveCard } from "../let-us-drive-card/let-us-drive-card";
import { ExternalLink } from "lucide-react";
import type { PricingPageProps } from "./types";

/**
 * PricingPage composes all plan-selection sub-components into a full
 * page layout: header, plan-type tabs with billing toggle, pricing
 * cards grid, power-ups section, and let-us-drive section.
 *
 * Supports controlled or uncontrolled tab / billing state.
 *
 * @example
 * ```tsx
 * <PricingPage
 *   tabs={[
 *     { label: "Team-Led Plans", value: "team" },
 *     { label: "Go-AI First", value: "ai" },
 *   ]}
 *   planCards={compactCard, sedanCard, suvCard}
 *   powerUpCards={[truecaller, tollFree, autoDialer]}
 *   letUsDriveCards={[onboarding, accountMgr, managed]}
 * />
 * ```
 */
const PricingPage = React.forwardRef<HTMLDivElement, PricingPageProps>(
  (
    {
      title = "Select business plan",
      headerActions,
      tabs = [],
      activeTab: controlledTab,
      onTabChange,
      showBillingToggle = false,
      billingPeriod: controlledBilling,
      onBillingPeriodChange,
      planCards = [],
      powerUpCards = [],
      powerUpsTitle = "Power-ups and charges",
      featureComparisonText = "See full feature comparison",
      onFeatureComparisonClick,
      letUsDriveCards = [],
      letUsDriveTitle = "Let us drive — Full-service management",
      className,
      ...props
    },
    ref
  ) => {
    // Internal state for uncontrolled mode
    const [internalTab, setInternalTab] = React.useState(
      tabs[0]?.value ?? ""
    );
    const [internalBilling, setInternalBilling] = React.useState<
      "monthly" | "yearly"
    >("monthly");

    const currentTab = controlledTab ?? internalTab;
    const currentBilling = controlledBilling ?? internalBilling;

    const handleTabChange = (value: string) => {
      if (!controlledTab) setInternalTab(value);
      onTabChange?.(value);
    };

    const handleBillingChange = (period: "monthly" | "yearly") => {
      if (!controlledBilling) setInternalBilling(period);
      onBillingPeriodChange?.(period);
    };

    const hasPowerUps = powerUpCards.length > 0;
    const hasLetUsDrive = letUsDriveCards.length > 0;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col bg-card", className)}
        {...props}
      >
        {/* ───── Header ───── */}
        <PageHeader
          title={title}
          actions={headerActions}
          layout="horizontal"
        />

        {/* ───── Plan Selection Area ───── */}
        <div className="flex flex-col gap-6 px-6 py-6">
          {/* Tabs + billing toggle */}
          {tabs.length > 0 && (
            <PricingToggle
              tabs={tabs}
              activeTab={currentTab}
              onTabChange={handleTabChange}
              showBillingToggle={showBillingToggle}
              billingPeriod={currentBilling}
              onBillingPeriodChange={handleBillingChange}
            />
          )}

          {/* Plan cards grid */}
          {planCards.length > 0 && (
            <div
              className={cn(
                "grid gap-6 justify-center",
                planCards.length <= 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-[960px] mx-auto"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {planCards.map((cardProps, index) => (
                <PricingCard key={index} {...cardProps} />
              ))}
            </div>
          )}
        </div>

        {/* ───── Power-ups Section ───── */}
        {hasPowerUps && (
          <div className="bg-semantic-bg-ui px-6 py-[60px]">
            <div className="flex flex-col gap-4">
              {/* Section header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-semantic-text-primary m-0">
                  {powerUpsTitle}
                </h2>
                {onFeatureComparisonClick && (
                  <Button
                    variant="link"
                    className="text-semantic-text-link p-0 h-auto min-w-0 gap-1"
                    onClick={onFeatureComparisonClick}
                  >
                    {featureComparisonText}
                    <ExternalLink className="size-3.5" />
                  </Button>
                )}
              </div>

              {/* Power-up cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {powerUpCards.map((cardProps, index) => (
                  <PowerUpCard key={index} {...cardProps} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ───── Let Us Drive Section ───── */}
        {hasLetUsDrive && (
          <div className="bg-card px-6 py-[60px]">
            <div className="flex flex-col gap-4">
              {/* Section header */}
              <h2 className="text-lg font-semibold text-semantic-text-primary m-0">
                {letUsDriveTitle}
              </h2>

              {/* Service cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {letUsDriveCards.map((cardProps, index) => (
                  <LetUsDriveCard key={index} {...cardProps} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PricingPage.displayName = "PricingPage";

export { PricingPage };
