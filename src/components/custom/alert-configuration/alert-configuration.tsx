import * as React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertConfigurationProps {
  /** Minimum balance threshold */
  minimumBalance: number;
  /** Minimum top-up amount */
  minimumTopup: number;
  /** Currency symbol (default: ₹) */
  currencySymbol?: string;
  /** Callback when edit button is clicked */
  onEdit?: () => void;
  /** Custom className for the container */
  className?: string;
}

/**
 * AlertConfiguration component displays current alert values for minimum balance and top-up.
 * Used in payment auto-pay setup to show notification thresholds.
 */
export const AlertConfiguration = React.forwardRef<
  HTMLDivElement,
  AlertConfigurationProps
>(
  (
    {
      minimumBalance,
      minimumTopup,
      currencySymbol = "₹",
      onEdit,
      className,
    },
    ref
  ) => {
    const formatCurrency = (amount: number) => {
      const formatted = amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${currencySymbol} ${formatted}`;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-semantic-border-layout bg-semantic-bg-primary",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="m-0 text-base font-semibold text-semantic-text-primary tracking-[0px]">
              Alert configurations
            </h3>
            <p className="m-0 text-sm text-semantic-text-muted tracking-[0.035px]">
              Define when and how you receive balance notifications
            </p>
          </div>
          <Button
            variant="default"
            size="default"
            leftIcon={<Pencil className="h-3.5 w-3.5" />}
            onClick={onEdit}
            className="shrink-0"
          >
            Edit alert values
          </Button>
        </div>

        {/* Alert Values Section with Top Border */}
        <div className="border-t border-semantic-border-layout px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            {/* Minimum Balance */}
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.014px]">
                  Minimum balance
                </span>
                <span
                  className={cn(
                    "text-sm tracking-[0.035px]",
                    minimumBalance < 0
                      ? "text-semantic-error-primary"
                      : "text-semantic-text-primary"
                  )}
                >
                  {minimumBalance < 0 ? "-" : ""}{formatCurrency(Math.abs(minimumBalance))}
                </span>
              </div>
              <p className="m-0 text-sm text-semantic-text-muted tracking-[0.035px] leading-relaxed">
                You'll be notified by email and SMS when your balance falls below this level.
              </p>
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-14 bg-semantic-border-layout shrink-0" />

            {/* Minimum Top-up */}
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.014px]">
                  Minimum topup
                </span>
                <span className="text-sm text-semantic-text-link tracking-[0.035px]">
                  {formatCurrency(minimumTopup)}
                </span>
              </div>
              <p className="m-0 text-sm text-semantic-text-muted tracking-[0.035px] leading-relaxed">
                A suggested recharge amount to top up your balance when it falls below the minimum.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AlertConfiguration.displayName = "AlertConfiguration";
