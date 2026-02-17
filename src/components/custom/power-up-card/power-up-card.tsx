import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { PowerUpCardProps } from "./types";

/**
 * PowerUpCard displays an add-on service with icon, pricing, description,
 * and a CTA button. Used in the "Power-ups and charges" section of
 * the pricing page.
 *
 * @example
 * ```tsx
 * <PowerUpCard
 *   icon={<PhoneCall className="size-6" />}
 *   title="Auto-Dialer"
 *   price="Starts @ ₹700/user/month"
 *   description="Available for SUV & Enterprise plans as an add-on per user."
 *   onCtaClick={() => console.log("clicked")}
 * />
 * ```
 */
const PowerUpCard = React.forwardRef<HTMLDivElement, PowerUpCardProps>(
  (
    {
      icon,
      title,
      price,
      description,
      ctaLabel = "Talk to us",
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
          "flex flex-col justify-between gap-8 rounded-md border border-semantic-border-layout bg-card p-5",
          className
        )}
        {...props}
      >
        {/* Content */}
        <div className="flex flex-col gap-4">
          {/* Icon + title/price row */}
          <div className="flex gap-4 items-start">
            {icon && (
              <div className="flex items-center justify-center size-[47px] rounded bg-[var(--color-info-25)] shrink-0">
                {icon}
              </div>
            )}
            <div className="flex flex-col gap-2 min-w-0">
              <h3 className="text-base font-semibold text-semantic-text-primary m-0 leading-normal">
                {title}
              </h3>
              <p className="text-sm text-semantic-text-primary tracking-[0.035px] m-0 leading-normal">
                {price}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-semantic-text-secondary tracking-[0.035px] m-0 leading-normal">
            {description}
          </p>
        </div>

        {/* CTA */}
        <Button variant="outline" className="w-full" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      </div>
    );
  }
);

PowerUpCard.displayName = "PowerUpCard";

export { PowerUpCard };
