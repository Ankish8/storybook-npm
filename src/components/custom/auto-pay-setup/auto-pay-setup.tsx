import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { AutoPaySetupProps } from "./types";

/**
 * AutoPaySetup provides a collapsible panel for setting up automatic payments.
 * It displays a description, an informational note callout, and a CTA button.
 *
 * @example
 * ```tsx
 * <AutoPaySetup
 *   icon={<RefreshCw className="size-5 text-semantic-primary" />}
 *   onCtaClick={() => console.log("Enable auto-pay")}
 * />
 * ```
 */
export const AutoPaySetup = React.forwardRef<HTMLDivElement, AutoPaySetupProps>(
  (
    {
      title = "Auto-pay setup",
      subtitle = "Hassle-free monthly billing",
      icon,
      bodyText = "Link your internet banking account or enroll your card for recurring payments on MyOperator, where your linked account/card is charged automatically for your subsequent bills and usages on MyOperator",
      noteText = "For card based subscriptions, your card would be charged minimum of \u20B91 every month even if there are no usages to keep the subscription active, and \u20B91 will be added as prepaid amount for your service. Initial deduction of \u20B95 would be made for subscription, which will be auto-refunded.",
      noteLabel = "Note:",
      showCta = true,
      ctaText = "Enable Auto-Pay",
      onCtaClick,
      loading = false,
      disabled = false,
      defaultOpen = true,
      className,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("w-full", className)}>
        <Accordion
          type="single"
          variant="bordered"
          defaultValue={defaultOpen ? ["auto-pay-setup"] : []}
        >
          <AccordionItem value="auto-pay-setup">
            <AccordionTrigger className="px-4 py-4">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="flex items-center justify-center size-10 rounded-[10px] bg-[var(--semantic-info-surface)] shrink-0">
                    {icon}
                  </div>
                )}
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.01px]">
                    {title}
                  </span>
                  <span className="text-xs font-normal text-semantic-text-muted tracking-[0.048px]">
                    {subtitle}
                  </span>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-col gap-4 border-t border-semantic-border-layout pt-4">
                {/* Description */}
                {bodyText && (
                  <div className="m-0 text-sm font-normal text-semantic-text-primary leading-5 tracking-[0.035px]">
                    {bodyText}
                  </div>
                )}

                {/* Note callout */}
                {noteText && (
                  <div className="rounded bg-[var(--semantic-info-25,#f0f7ff)] border border-[#BEDBFF] px-4 py-3">
                    <p className="m-0 text-sm font-normal text-semantic-text-muted leading-5 tracking-[0.035px]">
                      {noteLabel && (
                        <span className="font-medium text-semantic-text-primary">
                          {noteLabel}{" "}
                        </span>
                      )}
                      {noteText}
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                {showCta && (
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={onCtaClick}
                    loading={loading}
                    disabled={disabled}
                  >
                    {ctaText}
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);

AutoPaySetup.displayName = "AutoPaySetup";
