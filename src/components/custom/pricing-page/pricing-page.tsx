import * as React from "react";
import { cn } from "../../../lib/utils";
import { PageHeader } from "../../ui/page-header";
import { Button } from "../../ui/button";
import { PricingCard } from "../pricing-card/pricing-card";
import { PowerUpCard } from "../power-up-card/power-up-card";
import { LetUsDriveCard } from "../let-us-drive-card/let-us-drive-card";
import { ExternalLink } from "lucide-react";
import { PricingPlanCardsRow } from "./pricing-plan-cards-row";
import type { PricingPageProps } from "./types";

/**
 * PricingPage composes all plan-selection sub-components into a full
 * page layout: header, plan-type tabs with billing toggle, pricing
 * cards row (equal-width columns for any plan count), power-ups section,
 * and let-us-drive section.
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
const PricingPage = React.forwardRef(
  (
    {
      title = "Select Business Plan",
      headerActions,
      tabs = [],
      showCategoryToggle = true,
      activeTab: controlledTab,
      onTabChange,
      showBillingToggle = false,
      billingPeriod: controlledBilling,
      onBillingPeriodChange,
      planCards = [],
      planCardColumnCount,
      planCardCtaStates,
      powerUpCards = [],
      powerUpsTitle = "Power-ups and charges",
      featureComparisonText = "See full feature comparison",
      onFeatureComparisonClick,
      letUsDriveCards = [],
      letUsDriveTitle = "Let us drive — Full-service management",
      className,
      ...props
    }: PricingPageProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const hasPowerUps = powerUpCards.length > 0;
    const hasLetUsDrive = letUsDriveCards.length > 0;
    const planRowColumns =
      planCardColumnCount !== undefined
        ? Math.max(planCards.length, planCardColumnCount)
        : planCards.length;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col bg-card h-full overflow-y-auto", className)}
        {...props}
      >
        {/* ───── Header ───── */}
        <PageHeader
          title={title}
          actions={headerActions}
          layout="horizontal"
        />

        {/* ───── Plan Selection Area ───── */}
        <div className="flex flex-col items-center gap-12 px-6 py-12">
          {/* Plan cards grid */}
          {planCards.length > 0 && (
            <PricingPlanCardsRow columnCount={planRowColumns}>
              {planCards.map((cardProps, index) => {
                const ctaState = planCardCtaStates?.[index];
                const merged = { ...cardProps };
                if (ctaState) {
                  if (ctaState.loading !== undefined)
                    merged.ctaLoading = ctaState.loading;
                  if (ctaState.disabled !== undefined)
                    merged.ctaDisabled = ctaState.disabled;
                }
                return (
                  <div key={index} className="min-w-0">
                    <PricingCard {...merged} />
                  </div>
                );
              })}
            </PricingPlanCardsRow>
          )}
        </div>

        {/* ───── Power-ups Section ───── */}
        {hasPowerUps && (
          <div className="bg-semantic-bg-ui px-6 py-[60px]">
            <div className="flex flex-col gap-4 max-w-[1200px] mx-auto w-full">
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
            <div className="flex flex-col gap-4 max-w-[1200px] mx-auto w-full">
              {/* Section header */}
              <h2 className="text-lg font-semibold text-semantic-text-primary m-0">
                {letUsDriveTitle}
              </h2>

              {/* Service cards — items-start so expanding one card doesn't stretch others */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
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
