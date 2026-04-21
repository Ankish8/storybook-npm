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
 * Figma main column (node 1119:2783): `w-[1139px]` with `px-[24px]` content gutters.
 * We cap the page and apply 24px horizontal padding from `md` so the content width
 * matches the 1091px inner frame without double gutters + separate max-width.
 */
const pageShellClass = "w-full max-w-[1139px] mx-auto min-w-0 flex flex-col";

/** Horizontal gutters: mobile 16px, Figma 24px (`px-24`) from `md` up. */
const pageGutterX = "px-4 md:px-6";

/**
 * Figma Power-ups band (1119:2985): `pl-[24px] pr-[48px]` — more space on the right
 * (matches design; common when balancing scrollbar / visual balance).
 */
const powerUpsGutterX = "px-4 md:pl-6 md:pr-12";

/** Vertical rhythm between header and plan blocks — scales up at `md`. */
const planSectionPaddingY =
  "pt-4 pb-4 sm:pt-5 sm:pb-5 md:pt-6 md:pb-6";

/** Section bands (Power-ups / Let us drive): Figma 60px vertical at desktop. */
const sectionPaddingY =
  "py-10 sm:py-12 md:py-[60px]";

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
        <div className={pageShellClass}>
          {/* ───── Header ───── */}
          <PageHeader
            title={title}
            actions={headerActions}
            layout="horizontal"
            className={pageGutterX}
          />

          {/* ───── Plan Selection Area ───── */}
          <div
            className={cn(
              "flex flex-col items-center w-full min-w-0",
              pageGutterX,
              planSectionPaddingY
            )}
          >
            {(planAlertVisible || planCards.length > 0) && (
              <div className="flex w-full flex-col gap-4 sm:gap-[18px] min-w-0">
                {planAlertVisible && planAlert && (
                  <Alert
                    variant={resolvePlanAlertVariant(planAlert)}
                    {...planAlert.alertProps}
                  >
                    <AlertTitle>{planAlert.title}</AlertTitle>
                    {planAlert.description ? (
                      <AlertDescription>{planAlert.description}</AlertDescription>
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
                        <div key={index} className="min-w-0">
                          <PricingCard {...merged} />
                        </div>
                      );
                    })}
                  </PricingPlanCardsRow>
                )}
              </div>
            )}
          </div>

          {/* ───── Power-ups Section ───── */}
          {hasPowerUps && (
            <div
              className={cn(
                "bg-semantic-bg-ui w-full min-w-0",
                sectionPaddingY,
                powerUpsGutterX
              )}
            >
              <div className="flex flex-col gap-3 sm:gap-4 w-full min-w-0">
                {/* Section header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <h2 className="text-base sm:text-lg font-semibold text-semantic-text-primary m-0">
                    {powerUpsTitle}
                  </h2>
                  {onFeatureComparisonClick && (
                    <Button
                      variant="link"
                      className="text-semantic-text-link p-0 h-auto min-w-0 gap-1 self-start sm:shrink-0"
                      onClick={onFeatureComparisonClick}
                    >
                      {featureComparisonText}
                      <ExternalLink className="size-3.5" />
                    </Button>
                  )}
                </div>

                {/* Power-up cards — Figma row gap 24px between cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {powerUpCards.map((cardProps, index) => (
                    <PowerUpCard key={index} {...cardProps} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ───── Let Us Drive Section ───── */}
          {hasLetUsDrive && (
            <div
              className={cn("bg-card w-full min-w-0", pageGutterX, sectionPaddingY)}
            >
              <div className="flex flex-col gap-3 sm:gap-4 w-full min-w-0">
                {/* Section header */}
                <h2 className="text-base sm:text-lg font-semibold text-semantic-text-primary m-0">
                  {letUsDriveTitle}
                </h2>

                {/* Service cards — items-start so expanding one card doesn't stretch others */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 items-start">
                  {letUsDriveCards.map((cardProps, index) => (
                    <LetUsDriveCard key={index} {...cardProps} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

PricingPage.displayName = "PricingPage";

export { PricingPage };
