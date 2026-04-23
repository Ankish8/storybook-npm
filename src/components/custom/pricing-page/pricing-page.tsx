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
 * **CLI / registry:** The published `myoperator-ui` package embeds this file in its registry at
 * build time (`packages/cli`: `npm run generate-registry`). After you edit this file or
 * `pricing-plan-cards-row.tsx`, run `cd packages/cli && npm run generate-registry` before
 * `npm run build` / release — otherwise `npx myoperator-ui update pricing-page` in consumer apps
 * can overwrite good layouts with an older embedded copy.
 *
 * Constrains plan / add-on sections; PageHeader is rendered full-width above this.
 * Figma `1119:2782` / `1119:2783`: main white column is **1139px** (inner rows use ~1091px for cards + gutters).
 *
 * **Registry / `tw-` prefix:** `generate-registry` only prefixes class strings that appear as
 * literals inside `cn()`, `cva(...)`, and `className="..."` — *not* bare
 * `const x = "flex ..."` values. In consumer apps with `prefix: "tw-"` those raw strings do not
 * match emitted utilities (broken max-width, grid, gaps). Use `const x = cn("flex ...")` for
 * shared layout class chunks.
 */
const pageBodyMaxClass = cn(
  "mx-auto flex w-full min-w-0 max-w-[1139px] flex-col"
);

/**
 * Horizontal padding for the **Let us drive** band (full-width below Power-ups / plan). Header +
 * plan use **no** outer shell `px` — `pageGutterX` on `PageHeader` and the plan column provides the
 * side inset so we do not double-stack shell + gutter padding.
 */
const pageShellPaddingX = cn("box-border px-4 sm:px-6 md:px-8 lg:px-10");

/**
 * Horizontal padding **inside** the 1139px content column (alert / plan row / let-us-drive).
 * Figma gutters: **~24px** from `sm+`.
 */
const pageGutterX = cn("box-border px-4 sm:px-6");

/**
 * Figma `1119:2784` — **24px** between the page header (bottom rule) and the plan block (alert / cards).
 * Applied as `pt-6` here; the header + plan sit in one padded column so the outer `gap-6` does not
 * create space between them.
 */
const planSectionPaddingTop = cn("pt-6");

/**
 * Figma `1119:2784` — **24px** between the main column sections (header band → plan / lower sections).
 */
const pageHeaderToBodyGapClass = cn("gap-6");

/** Plan column stack (header and plan share one full-width column; no outer shell `px`, gutters on header + plan). */
const planColumnStackClass = cn("flex w-full min-w-0 max-w-full flex-col gap-0");

/**
 * Figma `1119:2986`, `1119:3031` — **16px** between the section title row and the card grid.
 */
const sectionTitleToGridGapClass = cn("gap-4");

/** Figma `1119:9740` — **18px** between the plan alert and the plan cards row. */
const planAlertToCardsGapClass = cn("gap-[18px]");

/**
 * Figma: `60px` vertical padding on each band; scales down on small viewports.
 */
const sectionBandPaddingY = cn("py-8 sm:py-10 md:py-12 lg:py-[60px]");

/**
 * First band after the plan (**Power-ups**, or **Let us drive** when there are no power-ups).
 * **60px** top padding on the section (per design); bottom scales with viewport.
 */
const bandAfterPlanPaddingY = cn(
  "pt-[60px] pb-8 sm:pb-10 md:pb-12 lg:pb-[60px]"
);

/** **60px** space below the plan row (alert + cards + optional pagination) when a lower band follows. */
const planRowPaddingBottomWhenFollowed = cn("pb-[60px]");

/**
 * Power-ups **inner** content: side padding inside the full-width band (Figma: ~24px / 48px rhythm).
 */
const powerUpsGutterX = cn("box-border px-4 sm:px-6 md:px-8 lg:px-10");

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
        className={cn(
          "box-border flex min-h-0 w-full max-w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden break-words bg-semantic-bg-primary text-semantic-text-primary antialiased",
          "h-auto",
          className
        )}
        {...props}
      >
        {/*
         * Header + plan: no outer horizontal shell padding (avoids double `px` with `pageGutterX`).
         * **Power-ups** is a full-bleed grey band; **Let us drive** uses `pageShellPaddingX`.
         * Host: pass `className="h-full min-h-0"` when filling a flex panel.
         */}
        <div
          className={cn(
            "flex min-w-0 w-full max-w-full min-h-0 flex-col",
            pageHeaderToBodyGapClass
          )}
        >
          <div
            className={cn("box-border flex w-full min-w-0 max-w-full flex-col")}
          >
            <PageHeader
              title={title}
              actions={headerActions}
              layout="horizontal"
              className={cn(
                "w-full max-w-full shrink-0",
                pageGutterX,
                "sm:min-h-[55px] sm:!py-0 sm:items-center"
              )}
            />
            <div className={planColumnStackClass}>
              <div className={pageBodyMaxClass}>
                <div
                  className={cn(
                    "flex min-w-0 w-full max-w-full flex-col items-stretch",
                    pageGutterX,
                    planSectionPaddingTop,
                    hasPowerUps || hasLetUsDrive
                      ? planRowPaddingBottomWhenFollowed
                      : "pb-6"
                  )}
                >
                  {(planAlertVisible || planCards.length > 0) && (
                    <div
                      className={cn(
                        "flex min-w-0 w-full max-w-full flex-col",
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
                            const { className: cardClassName, ...cardRest } = merged;
                            return (
                              <div
                                key={index}
                                className="flex min-h-0 min-w-0 max-w-full flex-1 flex-col self-stretch"
                              >
                                <PricingCard
                                  {...cardRest}
                                  className={cn(
                                    "min-h-0 w-full max-w-full flex-1",
                                    cardClassName
                                  )}
                                />
                              </div>
                            );
                          })}
                        </PricingPlanCardsRow>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Full-bleed Power-ups (grey bg edge-to-edge of `PricingPage`); content stays max-w + px. ─── */}
          {(hasPowerUps || hasLetUsDrive) && (
            <div className="flex w-full min-w-0 max-w-full min-h-0 flex-col">
              {hasPowerUps && (
                <div className="min-w-0 w-full bg-semantic-bg-ui">
                  <div
                    className={cn(
                      pageBodyMaxClass,
                      "mx-auto w-full",
                      bandAfterPlanPaddingY,
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
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {powerUpCards.map((cardProps, index) => (
                          <PowerUpCard key={index} {...cardProps} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {hasLetUsDrive && (
                <div
                  className={cn(
                    "min-w-0 w-full bg-semantic-bg-primary",
                    pageShellPaddingX
                  )}
                >
                  <div
                    className={cn(
                      pageBodyMaxClass,
                      "mx-auto w-full",
                      hasPowerUps
                        ? sectionBandPaddingY
                        : bandAfterPlanPaddingY,
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
                      <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    );
  }
);

PricingPage.displayName = "PricingPage";

export { PricingPage };
