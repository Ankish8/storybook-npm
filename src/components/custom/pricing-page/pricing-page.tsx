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
 * Figma `1119:2782` / `1119:2783`: plan surface uses max **1200px** for the content column.
 */
const pageBodyMaxClass =
  "mx-auto flex w-full min-w-0 max-w-[1200px] flex-col";

/** Figma `1119:2785`, plan stack `1119:9739`, let-us-drive: horizontal padding **24px**. */
const pageGutterX = "px-6";

/**
 * Figma `1119:2784` — 24px between the title row and the plan stack (not extra `pt` on the plan).
 */
const planSectionPaddingTop = "pt-0";

/**
 * Figma `1119:2784` — **24px** between the main column sections (header band → plan / lower sections).
 */
const pageHeaderToBodyGapClass = "gap-6";

/**
 * Vertical stack for plan area → lower bands: **60px** between children.
 */
const interSectionStackClass =
  "flex w-full min-w-0 flex-col gap-[60px]";

/**
 * **60px** between a section title row and the card grid (Power-ups, Let us drive).
 */
const sectionTitleToGridGapClass = "gap-[60px]";

/** Figma `1119:9740` — **18px** between the plan alert and the plan cards row. */
const planAlertToCardsGapClass = "gap-[18px]";

/**
 * Figma: `60px` vertical padding on each band; scales down on small viewports.
 */
const sectionBandPaddingY = "py-8 sm:py-10 md:py-12 lg:py-[60px]";

/**
 * Figma `1119:2985` — `pl-[24px] pr-[48px]`; matches page gutters, then `md` right pad.
 */
const powerUpsGutterX = "px-4 sm:pl-6 sm:pr-4 md:pr-12";

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
        className={cn("flex h-full flex-col overflow-y-auto bg-card", className)}
        {...props}
      >
        <div
          className={cn(
            "flex min-w-0 w-full flex-col",
            pageHeaderToBodyGapClass
          )}
        >
          <PageHeader
            title={title}
            actions={headerActions}
            layout="horizontal"
            className={cn("w-full", pageGutterX)}
          />
          <div className={cn(interSectionStackClass, "w-full min-w-0")}>
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
                  <div
                    className={cn(
                      "flex min-w-0 w-full flex-col",
                      planAlertToCardsGapClass
                    )}
                  >
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

            {/* ───── Power-ups + Let us drive: Figma `1119:2984` stacks both with no flex gap. ───── */}
            {(hasPowerUps || hasLetUsDrive) && (
              <div className="flex w-full min-w-0 flex-col">
                {hasPowerUps && (
                  <div className="min-w-0 w-full bg-semantic-bg-ui">
                    <div
                      className={cn(
                        pageBodyMaxClass,
                        sectionBandPaddingY,
                        powerUpsGutterX
                      )}
                    >
                      <div
                        className={cn(
                          "flex w-full min-w-0 flex-col",
                          sectionTitleToGridGapClass
                        )}
                      >
                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6 md:gap-8">
                          <h2 className="m-0 min-w-0 text-balance text-base font-semibold leading-6 text-semantic-text-primary sm:text-[18px]">
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
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                          {powerUpCards.map((cardProps, index) => (
                            <PowerUpCard key={index} {...cardProps} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {hasLetUsDrive && (
                  <div className="min-w-0 w-full bg-card">
                    <div
                      className={cn(
                        pageBodyMaxClass,
                        sectionBandPaddingY,
                        pageGutterX
                      )}
                    >
                      <div
                        className={cn(
                          "flex w-full min-w-0 flex-col",
                          sectionTitleToGridGapClass
                        )}
                      >
                        <h2 className="m-0 min-w-0 text-balance text-base font-semibold leading-6 text-semantic-text-primary sm:text-[18px]">
                          {letUsDriveTitle}
                        </h2>
                        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                          {letUsDriveCards.map((cardProps, index) => (
                            <LetUsDriveCard key={index} {...cardProps} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
