import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { PaymentOptionCardProps } from "./types";

/**
 * PaymentOptionCard displays a selectable list of payment methods with icons,
 * titles, and descriptions. One option can be highlighted as selected.
 *
 * @example
 * ```tsx
 * <PaymentOptionCard
 *   options={[
 *     { id: "net-banking", icon: <Globe className="size-5" />, title: "Net banking", description: "Pay securely through your bank" },
 *     { id: "upi", icon: <Smartphone className="size-5" />, title: "UPI", description: "Pay using UPI ID or QR" },
 *   ]}
 *   onOptionSelect={(id) => console.log(id)}
 *   onCtaClick={() => console.log("proceed")}
 * />
 * ```
 */
export const PaymentOptionCard = React.forwardRef<
  HTMLDivElement,
  PaymentOptionCardProps
>(
  (
    {
      title = "Select payment method",
      subtitle = "Preferred method with secure transactions",
      options,
      selectedOptionId,
      defaultSelectedOptionId,
      onOptionSelect,
      ctaText = "Proceed to pay",
      onCtaClick,
      onClose,
      loading = false,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [internalSelected, setInternalSelected] = React.useState<
      string | undefined
    >(defaultSelectedOptionId);

    const isControlled = selectedOptionId !== undefined;
    const activeId = isControlled ? selectedOptionId : internalSelected;

    const handleSelect = (optionId: string) => {
      if (!isControlled) {
        setInternalSelected(optionId);
      }
      onOptionSelect?.(optionId);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg bg-background border-b border-[#e4e4e4] p-6",
          className
        )}
      >
        {/* Close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 text-semantic-text-muted hover:text-semantic-text-primary transition-colors"
            aria-label="Close"
          >
            <X className="size-3.5" />
          </button>
        )}

        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-semantic-text-primary m-0">
              {title}
            </h3>
            <p className="text-sm text-semantic-text-muted tracking-[0.035px] m-0">
              {subtitle}
            </p>
          </div>

          {/* Options list */}
          <div className="flex flex-col gap-2.5">
            {options.map((option) => {
              const isSelected = activeId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    "flex items-center gap-2.5 w-full rounded-lg border p-3 text-left transition-colors cursor-pointer bg-transparent",
                    isSelected
                      ? "border-[var(--semantic-brand)]"
                      : "border-semantic-border-layout hover:border-[var(--semantic-brand-selected-hover)]"
                  )}
                >
                  <div className="flex items-center justify-center size-[34px] rounded-lg bg-[var(--color-info-25)] shrink-0">
                    {option.icon}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm text-semantic-text-primary tracking-[0.035px]">
                      {option.title}
                    </span>
                    <span className="text-xs text-semantic-text-muted tracking-[0.048px]">
                      {option.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA button */}
          <Button
            variant="default"
            className="w-full"
            onClick={onCtaClick}
            loading={loading}
            disabled={disabled}
          >
            {ctaText}
          </Button>
        </div>
      </div>
    );
  }
);

PaymentOptionCard.displayName = "PaymentOptionCard";
