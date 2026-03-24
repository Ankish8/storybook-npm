import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { CircleCheck } from "lucide-react";
import type { LetUsDriveCardProps } from "./types";

/**
 * LetUsDriveCard displays a managed service offering with pricing, billing
 * frequency badge, and a CTA. Used in the "Let us drive — Full-service
 * management" section of the pricing page.
 *
 * Supports expandable "Show details" / "Hide details" with an "Includes:"
 * checklist when detailsContent is provided. Supports controlled expanded
 * state (expanded / onExpandedChange) for accordion behavior on PricingPage.
 *
 * @example
 * ```tsx
 * <LetUsDriveCard
 *   title="Account Manager"
 *   price="15,000"
 *   period="/month"
 *   billingBadge="Annually"
 *   description="One expert who knows your business. And moves it forward."
 *   detailsContent={{ heading: "Includes:", items: [{ title: "Start Your Channels", description: "Get help setting up." }] }}
 *   onShowDetails={() => console.log("details")}
 *   onCtaClick={() => console.log("talk")}
 * />
 * ```
 */
const LetUsDriveCard = React.forwardRef(
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
      hideDetailsLabel = "Hide details",
      ctaLabel = "Talk to us",
      detailsContent,
      expanded: controlledExpanded,
      onExpandedChange,
      onShowDetails,
      onCtaClick,
      className,
      ...props
    }: LetUsDriveCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [internalExpanded, setInternalExpanded] = React.useState(false);
    const isControlled = controlledExpanded !== undefined;
    const expanded = isControlled ? controlledExpanded : internalExpanded;

    const hasExpandableDetails = detailsContent && detailsContent.items.length > 0;
    const showDetailsLink = hasExpandableDetails || onShowDetails;

    const handleDetailsClick = () => {
      if (hasExpandableDetails) {
        const next = !expanded;
        if (!isControlled) setInternalExpanded(next);
        onExpandedChange?.(next);
        if (next) onShowDetails?.();
      } else {
        onShowDetails?.();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-0 flex-col gap-6 rounded-[14px] border border-solid border-semantic-border-layout bg-card p-5 shadow-sm",
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

        {/* Price section — min-height so "Includes:" starts at same vertical position across cards when details are expanded */}
        <div className="flex min-h-[7rem] flex-col gap-2.5">
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

        {/* Bottom section: flex-1 fills space so "Hide details" and button align across cards; flex column, button at bottom */}
        <div className="mt-auto flex min-h-0 flex-1 flex-col gap-3 w-full">
          {showDetailsLink && !(hasExpandableDetails && expanded) && (
            <>
              <div className="min-h-0 flex-1" aria-hidden />
              <Button
                variant="link"
                className="text-semantic-text-link p-0 h-auto min-w-0 justify-start shrink-0"
                onClick={handleDetailsClick}
              >
                {showDetailsLabel}
              </Button>
            </>
          )}
          {!showDetailsLink && <div className="min-h-0 flex-1" aria-hidden />}
          {hasExpandableDetails && expanded && (
            <>
              <div
                className="flex min-h-0 flex-1 flex-col gap-3 w-full border-t border-solid border-semantic-border-layout pt-4"
                data-testid="let-us-drive-details-block"
              >
                <p className="text-sm font-semibold text-semantic-text-primary tracking-[0.014px] m-0">
                  {detailsContent.heading ?? "Includes:"}
                </p>
                <ul className="flex flex-col gap-3 list-none m-0 p-0" aria-label="Included features">
                  {detailsContent.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex w-4 shrink-0 items-start" aria-hidden>
                        <CircleCheck className="size-4 text-semantic-success-primary" />
                      </span>
                      <span className="min-w-0 flex-1 text-left text-sm text-semantic-text-secondary tracking-[0.035px] leading-[20px]">
                        <strong className="font-semibold text-semantic-text-primary">
                          {item.title}
                        </strong>
                        {" "}
                        {item.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="link"
                className="text-semantic-text-link p-0 h-auto min-w-0 justify-start shrink-0"
                onClick={handleDetailsClick}
              >
                {hideDetailsLabel}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            className="min-h-[44px] w-full shrink-0 rounded-[4px]"
            onClick={onCtaClick}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    );
  }
);

LetUsDriveCard.displayName = "LetUsDriveCard";

export { LetUsDriveCard };
