import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Check, Info } from "lucide-react";
import type { PricingCardProps } from "./types";

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
      className,
      ...props
    }: PricingCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const buttonText =
      ctaText || (isCurrentPlan ? "Current plan" : "Select plan");

    // Strip trailing decimal zeros: "500000000.000" → "500000000", "5,000.50" → "5,000.5"
    const cleanPrice = price.includes(".")
      ? price.replace(/0+$/, "").replace(/\.$/, "")
      : price;

    const hasFeatureList = features.length > 0;
    const showAddon = !!(
      addon || (usageDetails && usageDetails.length > 0)
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-md border border-solid",
          showPopularBadge
            ? "border-semantic-info-primary shadow-lg"
            : "border-semantic-border-layout",
          className
        )}
        {...props}
      >
        {/* Popular badge bar */}
        {showPopularBadge && (
          <div className="flex h-6 items-center justify-center bg-semantic-info-primary">
            <p className="m-0 text-sm font-medium text-white">
              {badgeText}
            </p>
          </div>
        )}

        {/* Main content — 24px horizontal; balanced vertical padding. */}
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-5 px-4 pb-5 sm:gap-6 sm:px-6 sm:pb-6",
            showPopularBadge
              ? "pt-2"
              : "pt-6 sm:pt-8"
          )}
        >
          {/* Plan name + description */}
          <div className="flex min-w-0 flex-col gap-2">
            <h3 className="m-0 min-w-0 break-words text-xl font-semibold leading-7 text-semantic-text-primary sm:text-2xl sm:leading-8">
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
                <span className="text-3xl leading-9 text-semantic-text-primary sm:text-4xl sm:leading-[44px]">
                  ₹
                </span>
                <span className="text-3xl font-semibold leading-9 text-semantic-text-primary sm:text-4xl sm:leading-[44px]">
                  {cleanPrice}
                </span>
                <span className="text-xs tracking-[0.035px] text-semantic-text-muted sm:text-sm">
                  {period}
                </span>
              </div>
              {planDetails && (
                <p className="m-0 text-base text-semantic-text-secondary">
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
              <div className="flex flex-col gap-3">
                {features.map((feature, index) => {
                  const hasParts =
                    typeof feature !== "string" && "parts" in feature;
                  const text =
                    typeof feature === "string"
                      ? feature
                      : hasParts
                        ? ""
                        : (feature as { text: string }).text;
                  const isBold =
                    typeof feature !== "string" &&
                    !hasParts &&
                    (feature as { bold?: boolean }).bold;
                  return (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-semantic-text-secondary" />
                      {hasParts ? (
                        <span className="text-sm tracking-[0.035px] text-semantic-text-secondary">
                          {(
                            feature as {
                              parts: Array<{
                                text: string;
                                bold?: boolean;
                              }>;
                            }
                          ).parts.map((part, i) =>
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
                })}
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
                <div className="flex items-center justify-center border-t border-solid border-semantic-border-layout pt-2.5">
                  <p className="m-0 text-center text-sm tracking-[0.035px] text-semantic-primary">
                    {addon.text}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

PricingCard.displayName = "PricingCard";

export { PricingCard };
