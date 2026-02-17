import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import type { LetUsDriveCardProps } from "./types";

/**
 * LetUsDriveCard displays a managed service offering with pricing, billing
 * frequency badge, and a CTA. Used in the "Let us drive — Full-service
 * management" section of the pricing page.
 *
 * Supports a "free/discount" state where the original price is shown with
 * strikethrough and a green label (e.g., "FREE") replaces it.
 *
 * @example
 * ```tsx
 * <LetUsDriveCard
 *   title="Account Manager"
 *   price="15,000"
 *   period="/month"
 *   billingBadge="Annually"
 *   description="One expert who knows your business. And moves it forward."
 *   onShowDetails={() => console.log("details")}
 *   onCtaClick={() => console.log("talk")}
 * />
 * ```
 */
const LetUsDriveCard = React.forwardRef<HTMLDivElement, LetUsDriveCardProps>(
  (
    {
      title,
      price,
      period,
      startsAt = false,
      billingBadge,
      description,
      freeLabel,
      showDetailsLabel = "Show details",
      ctaLabel = "Talk to us",
      onShowDetails,
      onCtaClick,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-6 rounded-[14px] border border-semantic-border-layout bg-card p-5",
          className
        )}
        {...props}
      >
        {/* Header: title + optional billing badge */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-semantic-text-primary m-0">
            {title}
          </h3>
          {billingBadge && (
            <Badge
              size="sm"
              className="bg-semantic-info-surface text-semantic-info-primary font-normal"
            >
              {billingBadge}
            </Badge>
          )}
        </div>

        {/* Price section */}
        <div className="flex flex-col gap-2.5">
          {startsAt && (
            <span className="text-xs text-semantic-text-muted tracking-[0.048px]">
              Starts at
            </span>
          )}
          <div className="flex gap-1 items-end">
            {freeLabel ? (
              <span className="text-[28px] font-semibold leading-[36px]">
                <span className="line-through text-semantic-text-muted">
                  ₹{price}
                </span>{" "}
                <span className="text-semantic-success-primary">
                  {freeLabel}
                </span>
              </span>
            ) : (
              <span className="text-[28px] font-semibold leading-[36px] text-semantic-text-primary">
                ₹{price}
              </span>
            )}
            {period && (
              <span className="text-sm text-semantic-text-muted tracking-[0.035px]">
                {period}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-semantic-text-secondary tracking-[0.035px] m-0">
            {description}
          </p>
        </div>

        {/* Actions: Show details link + CTA button */}
        <div className="flex flex-col gap-3 w-full">
          {onShowDetails && (
            <Button
              variant="link"
              className="text-semantic-text-link p-0 h-auto min-w-0 justify-start"
              onClick={onShowDetails}
            >
              {showDetailsLabel}
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={onCtaClick}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    );
  }
);

LetUsDriveCard.displayName = "LetUsDriveCard";

export { LetUsDriveCard };
