import * as React from "react";
import { cn } from "../../../lib/utils";
import { PageHeader } from "../../ui/page-header";
import { Button } from "../../ui/button";
import { PricingCard } from "../pricing-card/pricing-card";
import { PowerUpCard } from "../power-up-card/power-up-card";
import { LetUsDriveCard } from "../let-us-drive-card/let-us-drive-card";
import { ExternalLink } from "lucide-react";
import { PricingPlanCardsRow } from "./pricing-plan-cards-row";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import type {
  PricingPageProps,
  PricingPlanAlertConfig,
  PricingPlanAlertStatus,
} from "./types";

/**
 * Constrains plan / add-on sections; PageHeader is rendered full-width above this.
 */
const pageBodyMaxClass =
  "mx-auto flex w-full min-w-0 max-w-[1200px] flex-col";

/** Figma: `px-[24px]` on the plan row, header, Let us drive (1119:3357, 2785, 3030). */
const pageGutterX = "px-4 md:px-6";

/** Tighter top on small viewports, 24px from `sm` up. */
const planSectionPaddingTop = "pt-4 sm:pt-6";

/**
 * Spacing *between* plan, Power-ups, and Let us drive — `gap` (no margin on sections).
 * 24px → 32px → 60px from sm to md+.
 */
const interSectionStackClass =
  "flex w-full min-w-0 flex-col gap-6 sm:gap-8 md:gap-[60px]";

/** Inset for band content; outer separation comes from `interSectionStackClass` gap, not `py` doubling. */
const sectionBandPaddingTop = "pt-6 sm:pt-8 md:pt-10";

const sectionBandPaddingBottom = "pb-10 sm:pb-12 md:pb-[60px]";

/** 1119:2985 — `pl-[24px] pr-[48px]`. */
const powerUpsGutterX = "px-4 md:pl-6 md:pr-12";

function planAlertStatusToVariant(
  status: PricingPlanAlertStatus
): "success" | "warning" | "info" | "error" {
  if (status === "failed") return "error";
  return status;
}

/** Uses `variant` when set, else maps `status`, else Alert `default`. */
function resolvePlanAlertVariant(
  config: PricingPlanAlertConfig
): NonNullable<PricingPlanAlertConfig["variant"]> {
  if (config.variant) return config.variant;
  if (config.status) return planAlertStatusToVariant(config.status);
  return "default";
}

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
      planAlert,
      showPlanAlert = true,
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

    const planAlertVisible =
      !!planAlert && showPlanAlert !== false;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col bg-card h-full overflow-y-auto", className)}
        {...props}
      >
        <div className="flex min-w-0 w-full flex-col">
          <PageHeader
            title={title}
            actions={headerActions}
            layout="horizontal"
            className={cn("w-full", pageGutterX)}
          />
          <div
            className={cn(interSectionStackClass, "w-full min-w-0")}
          >
            {/* ───── Plan (max 1200) ───── */}
            <div className={pageBodyMaxClass}>
              <div
                className={cn(
                  "flex min-w-0 w-full flex-col items-stretch",
                  pageGutterX,
                  planSectionPaddingTop,
                  hasPowerUps || hasLetUsDrive ? "pb-0" : "pb-6"
                )}
              >
                {(planAlertVisible || planCards.length > 0) && (
                  <div className="flex min-w-0 w-full flex-col gap-4 sm:gap-6">
                    {planAlertVisible && planAlert && (
                      <Alert
                        variant={resolvePlanAlertVariant(planAlert)}
                        {...planAlert.alertProps}
                      >
                        <AlertTitle>{planAlert.title}</AlertTitle>
                        {planAlert.description ? (
                          <AlertDescription>
                            {planAlert.description}
                          </AlertDescription>
                        ) : null}
                      </Alert>
                    )}
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
                            <div key={index} className="h-full min-w-0">
                              <PricingCard {...merged} />
                            </div>
                          );
                        })}
                      </PricingPlanCardsRow>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ───── Power-ups: full-bleed band; content stays max 1200 ───── */}
            {hasPowerUps && (
              <div className="w-full min-w-0 bg-semantic-bg-ui">
                <div
                  className={cn(
                    pageBodyMaxClass,
                    sectionBandPaddingTop,
                    sectionBandPaddingBottom,
                    powerUpsGutterX
                  )}
                >
                  <div className="flex w-full min-w-0 flex-col gap-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                      <h2 className="m-0 text-base sm:text-lg font-semibold text-semantic-text-primary">
                        {powerUpsTitle}
                      </h2>
                      {onFeatureComparisonClick && (
                        <Button
                          variant="link"
                          className="h-auto min-w-0 gap-1 self-start p-0 text-semantic-text-link sm:shrink-0"
                          onClick={onFeatureComparisonClick}
                        >
                          {featureComparisonText}
                          <ExternalLink className="size-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {powerUpCards.map((cardProps, index) => (
                        <PowerUpCard key={index} {...cardProps} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ───── Let us drive (max 1200) ───── */}
            {hasLetUsDrive && (
              <div className={pageBodyMaxClass}>
                <div
                  className={cn(
                    "w-full min-w-0 bg-card pt-0",
                    pageGutterX,
                    sectionBandPaddingBottom
                  )}
                >
                  <div className="flex w-full min-w-0 flex-col gap-4">
                    <h2 className="m-0 text-base sm:text-lg font-semibold text-semantic-text-primary">
                      {letUsDriveTitle}
                    </h2>
                    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {letUsDriveCards.map((cardProps, index) => (
                        <LetUsDriveCard key={index} {...cardProps} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PricingPage.displayName = "PricingPage";

export { PricingPage };
