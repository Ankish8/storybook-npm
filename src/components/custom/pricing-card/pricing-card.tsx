import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleCheck } from "lucide-react";
import type { PricingCardProps } from "./types";

/**
 * PricingCard displays a plan tier with pricing, features, and a CTA button.
 * Supports current-plan state (outlined button), popularity badge, and an
 * optional add-on footer.
 *
 * @example
 * ```tsx
 * <PricingCard
 *   planName="Compact"
 *   price="2,5000"
 *   planDetails="3 Users | 12 Month plan"
 *   description="For small teams that need a WhatsApp-first plan"
 *   headerBgColor="#d7eae9"
 *   features={["WhatsApp Campaigns", "Missed Call Tracking"]}
 *   onCtaClick={() => console.log("selected")}
 *   onFeatureDetails={() => console.log("details")}
 * />
 * ```
 */
const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      planName,
      price,
      period = "/Month",
      planDetails,
      planIcon,
      description,
      headerBgColor,
      features = [],
      isCurrentPlan = false,
      showPopularBadge = false,
      badgeText = "MOST POPULAR",
      ctaText,
      onCtaClick,
      onFeatureDetails,
      addon,
      usageDetails,
      className,
      ...props
    },
    ref
  ) => {
    const buttonText =
      ctaText || (isCurrentPlan ? "Current plan" : "Select plan");

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 rounded-t-xl rounded-b-lg border border-semantic-border-layout p-4",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div
          className="flex flex-col gap-4 rounded-t-xl rounded-b-lg p-4"
          style={
            headerBgColor ? { backgroundColor: headerBgColor } : undefined
          }
        >
          {/* Plan name + badge */}
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold text-semantic-text-primary m-0">
              {planName}
            </h3>
            {showPopularBadge && (
              <Badge
                size="sm"
                className="bg-[#e3fdfe] text-[#119ba8] uppercase tracking-wider font-semibold"
              >
                {badgeText}
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-end gap-1">
              <span className="text-4xl leading-[44px] text-semantic-text-primary">
                ₹{price}
              </span>
              <span className="text-sm text-semantic-text-muted tracking-[0.035px]">
                {period}
              </span>
            </div>
            {planDetails && (
              <p className="text-sm tracking-[0.035px] text-semantic-text-primary m-0">
                {planDetails}
              </p>
            )}
          </div>

          {/* Plan icon */}
          {planIcon && <div className="size-[30px]">{planIcon}</div>}

          {/* Description */}
          {description && (
            <p className="text-sm text-semantic-text-secondary tracking-[0.035px] m-0">
              {description}
            </p>
          )}

          {/* Feature details link + CTA */}
          <div className="flex flex-col gap-3.5 w-full">
            {onFeatureDetails && (
              <div className="flex justify-center">
                <Button
                  variant="link"
                  className="text-semantic-text-link p-0 h-auto min-w-0"
                  onClick={onFeatureDetails}
                >
                  Feature details
                </Button>
              </div>
            )}
            <Button
              variant={isCurrentPlan ? "outline" : "default"}
              className="w-full"
              onClick={onCtaClick}
            >
              {buttonText}
            </Button>
          </div>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-semantic-text-primary tracking-[0.014px] uppercase m-0">
              Includes
            </p>
            <div className="flex flex-col gap-4">
              {features.map((feature, index) => {
                const text =
                  typeof feature === "string" ? feature : feature.text;
                const isBold =
                  typeof feature !== "string" && feature.bold;
                return (
                  <div key={index} className="flex items-start gap-2">
                    <CircleCheck className="size-[18px] text-semantic-text-secondary shrink-0 mt-0.5" />
                    <span
                      className={cn(
                        "text-sm text-semantic-text-secondary tracking-[0.035px]",
                        isBold && "font-semibold"
                      )}
                    >
                      {text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Addon */}
        {addon && (
          <div className="flex items-center gap-2.5 rounded-md bg-[var(--color-info-25)] border border-[#f3f5f6] pl-4 py-2.5">
            {addon.icon && (
              <div className="size-5 shrink-0">{addon.icon}</div>
            )}
            <span className="text-sm text-semantic-text-primary tracking-[0.035px]">
              {addon.text}
            </span>
          </div>
        )}

        {/* Usage Details */}
        {usageDetails && usageDetails.length > 0 && (
          <div className="flex flex-col gap-2.5 rounded-md bg-[var(--color-info-25)] border border-[#f3f5f6] px-4 py-2.5">
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
      </div>
    );
  }
);

PricingCard.displayName = "PricingCard";

export { PricingCard };
