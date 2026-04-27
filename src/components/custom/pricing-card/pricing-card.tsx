import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Check, Info } from "lucide-react";
import type { PricingCardFeature, PricingCardProps } from "./types";

/**
 * PricingCard displays a plan tier with pricing, features, and a CTA button.
 * Supports current-plan state (outlined disabled button), popularity badge
 * (full-width blue banner), and an optional add-on footer.
 *
 * @example
 * ```tsx
 * <PricingCard
 *   planName="Compact"
 *   price="2,500"
 *   planDetails="10 Users"
 *   description="For small teams that need WhatsApp Business API & missed calls."
 *   features={["WhatsApp Campaigns", "Missed Call Tracking"]}
 *   onCtaClick={() => console.log("selected")}
 *   onFeatureDetails={() => console.log("details")}
 * />
 * ```
 */
const PricingCard = React.forwardRef(
  (
    {
      planName,
      price,
      period = "per month, billed yearly",
      planDetails,
      planIcon,
      description,
      headerBgColor,
      features = [],
      isCurrentPlan = false,
      showPopularBadge = false,
      badgeText = "Most Popular",
      ctaText,
      ctaLoading = false,
      ctaDisabled = false,
      onCtaClick,
      onFeatureDetails,
      addon,
      usageDetails,
      infoText,
      layout = "default",
      className,
      ...props
    }: PricingCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const isFeaturedLayout = layout === "featured";
    const buttonText =
      ctaText || (isCurrentPlan ? "Current plan" : "Select plan");

    // Strip trailing decimal zeros: "500000000.000" → "500000000", "5,000.50" → "5,000.5"
    const cleanPrice = price.includes(".")
      ? price.replace(/0+$/, "").replace(/\.$/, "")
      : price;

    const hasFeatureList = features.length > 0;
    const showAddon = !!(addon || (usageDetails && usageDetails.length > 0));

    const renderFeatureItem = (feature: PricingCardFeature, index: number) => {
      const hasParts = typeof feature !== "string" && "parts" in feature;
      const text =
        typeof feature === "string" ? feature : hasParts ? "" : feature.text;
      const isBold = typeof feature !== "string" && !hasParts && feature.bold;

      return (
        <div key={index} className="flex items-start gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-semantic-text-secondary" />
          {hasParts ? (
            <span className="text-sm tracking-[0.035px] text-semantic-text-secondary">
              {feature.parts.map((part, i) =>
                part.bold ? (
                  <span key={i} className="font-semibold">
                    {part.text}
                  </span>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )}
            </span>
          ) : (
            <span
              className={cn(
                "text-sm tracking-[0.035px] text-semantic-text-secondary",
                isBold && "font-semibold"
              )}
            >
              {text}
            </span>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        data-pricing-card-layout={layout}
        className={cn(
          "flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-md border border-solid shadow-none",
          showPopularBadge
            ? "border-semantic-info-primary"
            : "border-semantic-border-layout",
          className
        )}
        {...props}
      >
        {/* Popular badge bar */}
        {showPopularBadge && (
          <div className="flex h-6 items-center justify-center bg-semantic-info-primary">
            <p className="m-0 text-sm font-medium text-white">{badgeText}</p>
          </div>
        )}

        {isFeaturedLayout ? (
          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1px_minmax(18rem,22rem)]">
            <div className="flex min-w-0 flex-col gap-5 px-4 py-6 sm:px-6 lg:py-7 lg:pr-8">
              <div className="flex min-w-0 flex-col gap-2">
                <h3 className="m-0 min-w-0 break-words text-2xl font-semibold leading-8 text-semantic-text-primary">
                  {planName}
                </h3>
                {description && (
                  <p className="m-0 text-sm tracking-[0.035px] text-semantic-text-secondary">
                    {description}
                  </p>
                )}
              </div>

              {features.length > 0 && (
                <div className="-mx-4 flex flex-col gap-5 border-t border-solid border-semantic-border-layout px-4 pt-5 sm:-mx-6 sm:px-6 lg:-ml-6 lg:-mr-8 lg:pl-6 lg:pr-8">
                  <p className="m-0 text-sm font-semibold tracking-[0.014px] text-semantic-text-secondary">
                    Includes:
                  </p>
                  <div
                    data-pricing-card-feature-list="featured"
                    className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2"
                  >
                    {features.map(renderFeatureItem)}
                  </div>
                </div>
              )}
            </div>

            <div
              aria-hidden="true"
              className="hidden bg-semantic-border-layout lg:block"
            />

            <div className="flex min-w-0 flex-col gap-4 border-t border-solid border-semantic-border-layout px-4 py-6 sm:px-6 lg:border-t-0 lg:py-7 lg:pl-8">
              <div className="flex min-w-0 flex-col gap-4">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0.5">
                  <span className="text-4xl font-normal leading-[44px] text-semantic-text-primary">
                    ₹
                  </span>
                  <span className="text-4xl font-semibold leading-[44px] text-semantic-text-primary">
                    {cleanPrice}
                  </span>
                  <span className="text-sm tracking-[0.035px] text-semantic-text-muted">
                    {period}
                  </span>
                </div>
                {planDetails && (
                  <p className="m-0 text-base text-semantic-text-primary">
                    {planDetails}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3.5">
                <Button
                  variant={showPopularBadge ? "default" : "outline"}
                  className="w-full"
                  onClick={onCtaClick}
                  loading={ctaLoading}
                  disabled={ctaDisabled || isCurrentPlan}
                >
                  {buttonText}
                </Button>
                {onFeatureDetails && (
                  <Button
                    variant="link"
                    className="h-auto min-w-0 justify-start p-0 text-semantic-text-link"
                    onClick={onFeatureDetails}
                  >
                    Check feature details
                  </Button>
                )}
              </div>

              {infoText && (
                <div className="flex items-start gap-1.5">
                  <Info className="mt-0.5 size-3.5 shrink-0 text-semantic-info-primary" />
                  <p className="m-0 text-xs tracking-[0.035px] text-semantic-info-primary">
                    {infoText}
                  </p>
                </div>
              )}

              {usageDetails && usageDetails.length > 0 && (
                <div className="flex flex-col gap-2.5 rounded-md border border-solid border-semantic-border-layout bg-semantic-info-surface-subtle px-4 py-2.5">
                  {usageDetails.map((detail, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-semantic-primary" />
                      <span className="text-sm tracking-[0.035px] text-semantic-text-primary">
                        <strong>{detail.label}:</strong> {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {addon && (
                <div className="-mx-4 border-t border-solid border-semantic-border-layout px-4 pt-3 sm:-mx-6 sm:px-6 lg:-ml-8 lg:pl-8">
                  <p className="m-0 text-sm tracking-[0.035px] text-semantic-primary">
                    {addon.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Main content — 24px horizontal; balanced vertical padding. */
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col gap-6 px-4 sm:px-6",
              showPopularBadge ? "pt-2" : "pt-9",
              showAddon ? "pb-8 sm:pb-10 md:pb-12 lg:pb-[60px]" : "pb-6"
            )}
          >
            {/* Plan name + description — Figma `1119:3358`: 24/32 title, 8px title↔description */}
            <div className="flex min-w-0 flex-col gap-2">
              <h3 className="m-0 min-w-0 break-words text-2xl font-semibold leading-8 text-semantic-text-primary">
                {planName}
              </h3>
              {description && (
                <p className="m-0 text-sm tracking-[0.035px] text-semantic-text-secondary">
                  {description}
                </p>
              )}
            </div>

            {/* Price block (16px rhythm) + CTA block (14px between its parts); 14px from plan line → primary button. */}
            <div className="flex flex-col gap-3.5">
              <div className="flex min-w-0 flex-col gap-4">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0.5">
                  <span className="text-4xl font-normal leading-[44px] text-semantic-text-primary">
                    ₹
                  </span>
                  <span className="text-4xl font-semibold leading-[44px] text-semantic-text-primary">
                    {cleanPrice}
                  </span>
                  <span className="text-sm tracking-[0.035px] text-semantic-text-muted">
                    {period}
                  </span>
                </div>
                {planDetails && (
                  <p className="m-0 text-base text-semantic-text-primary">
                    {planDetails}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3.5">
                <Button
                  variant={showPopularBadge ? "default" : "outline"}
                  className="w-full"
                  onClick={onCtaClick}
                  loading={ctaLoading}
                  disabled={ctaDisabled || isCurrentPlan}
                >
                  {buttonText}
                </Button>
                {onFeatureDetails && (
                  <Button
                    variant="link"
                    className="h-auto min-w-0 justify-start p-0 text-semantic-text-link"
                    onClick={onFeatureDetails}
                  >
                    Check feature details
                  </Button>
                )}
              </div>
            </div>

            {/* Info text */}
            {infoText && (
              <div className="flex items-start gap-1.5">
                <Info className="mt-0.5 size-3.5 shrink-0 text-semantic-info-primary" />
                <p className="m-0 text-xs tracking-[0.035px] text-semantic-info-primary">
                  {infoText}
                </p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="flex flex-col gap-5 border-t border-solid border-semantic-border-layout pt-6">
                <p className="m-0 text-sm font-semibold tracking-[0.014px] text-semantic-text-secondary">
                  Includes:
                </p>
                <div
                  data-pricing-card-feature-list="default"
                  className="flex flex-col gap-3"
                >
                  {features.map(renderFeatureItem)}
                </div>
              </div>
            )}

            {/* Footer: only pin to the bottom with mt-auto when a feature list needs the same baseline across cards; otherwise keep a fixed gap to the CTA. */}
            {showAddon && (
              <div
                className={cn(
                  "flex flex-col gap-6",
                  hasFeatureList ? "mt-auto" : "mt-4"
                )}
              >
                {/* Usage Details */}
                {usageDetails && usageDetails.length > 0 && (
                  <div className="flex flex-col gap-2.5 rounded-md border border-solid border-semantic-border-layout bg-semantic-info-surface-subtle px-4 py-2.5">
                    {usageDetails.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-semantic-primary" />
                        <span className="text-sm tracking-[0.035px] text-semantic-text-primary">
                          <strong>{detail.label}:</strong> {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Addon */}
                {addon && (
                  <div className="flex flex-col items-center justify-center border-t border-solid border-semantic-border-layout pt-2.5 pb-1">
                    <p className="m-0 text-center text-sm tracking-[0.035px] text-semantic-primary">
                      {addon.text}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

PricingCard.displayName = "PricingCard";

export { PricingCard };
