import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col rounded-md border overflow-hidden",
          showPopularBadge
            ? "border-[#4275d6] shadow-lg"
            : "border-semantic-border-layout",
          className
        )}
        {...props}
      >
        {/* Popular badge bar */}
        {showPopularBadge && (
          <div className="bg-[#4275d6] flex items-center justify-center h-6">
            <p className="text-sm text-white font-medium m-0">
              {badgeText}
            </p>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col gap-6 px-6 py-8 flex-1">
          {/* Plan name + description */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-semantic-text-primary leading-8 m-0">
              {planName}
            </h3>
            {description && (
              <p className="text-sm text-semantic-text-secondary tracking-[0.035px] m-0">
                {description}
              </p>
            )}
          </div>

          {/* Price + plan details */}
          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-1">
              <span className="text-4xl leading-[44px] text-semantic-text-primary">
                ₹
              </span>
              <span className="text-4xl leading-[44px] font-semibold text-semantic-text-primary">
                {cleanPrice}
              </span>
              <span className="text-sm text-semantic-text-muted tracking-[0.035px]">
                {period}
              </span>
            </div>
            {planDetails && (
              <p className="text-base text-semantic-text-secondary m-0">
                {planDetails}
              </p>
            )}
          </div>

          {/* CTA + feature details */}
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
                className="text-semantic-text-link p-0 h-auto min-w-0 justify-start"
                onClick={onFeatureDetails}
              >
                Check feature details
              </Button>
            )}
          </div>

          {/* Info text */}
          {infoText && (
            <div className="flex items-start gap-1.5">
              <Info className="size-3.5 text-semantic-info-primary shrink-0 mt-0.5" />
              <p className="text-xs text-semantic-info-primary tracking-[0.035px] m-0">
                {infoText}
              </p>
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="flex flex-col gap-5 border-t border-semantic-border-layout pt-6">
              <p className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px] m-0">
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
                      <Check className="size-4 text-semantic-text-secondary shrink-0 mt-0.5" />
                      {hasParts ? (
                        <span className="text-sm text-semantic-text-secondary tracking-[0.035px]">
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
                            "text-sm text-semantic-text-secondary tracking-[0.035px]",
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

          {/* Bottom sections pushed to card bottom for grid alignment */}
          {(addon || (usageDetails && usageDetails.length > 0)) && (
            <div className="mt-auto flex flex-col gap-6">
              {/* Usage Details */}
              {usageDetails && usageDetails.length > 0 && (
                <div className="flex flex-col gap-2.5 rounded-md bg-[var(--color-info-25)] border border-solid border-[#f3f5f6] px-4 py-2.5">
                  {usageDetails.map((detail, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-semantic-primary shrink-0 mt-[7px]" />
                      <span className="text-sm text-semantic-text-primary tracking-[0.035px]">
                        <strong>{detail.label}:</strong> {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Addon */}
              {addon && (
                <div className="border-t border-semantic-border-layout pt-2.5 flex items-center justify-center">
                  <p className="text-sm text-semantic-primary tracking-[0.035px] text-center m-0">
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
