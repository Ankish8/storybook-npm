import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "@/components/ui/tooltip";

/**
 * Represents a single row in the payment summary.
 */
export interface PaymentSummaryItem {
  /** Label text displayed on the left */
  label: string;
  /** Value text displayed on the right */
  value: string;
  /** Color variant for the value text */
  valueColor?: "default" | "success" | "error";
  /** Tooltip text shown when hovering the info icon next to the label */
  tooltip?: string;
  /** Whether to render label in bold (semibold weight) */
  bold?: boolean;
  /** Font size for the value — "lg" renders at 18px semibold */
  valueSize?: "default" | "lg";
}

export interface PaymentSummaryProps {
  /** Line items displayed in the top section */
  items: PaymentSummaryItem[];
  /** Summary items displayed below the divider (e.g. totals) */
  summaryItems?: PaymentSummaryItem[];
  /** Custom className for the outer container */
  className?: string;
}

const valueColorMap: Record<string, string> = {
  default: "text-semantic-text-primary",
  success: "text-semantic-success-primary",
  error: "text-semantic-error-primary",
};

const SummaryRow = ({ item }: { item: PaymentSummaryItem }) => (
  <div className="flex items-center justify-between w-full">
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "text-sm tracking-[0.035px]",
          item.bold
            ? "font-semibold text-semantic-text-primary"
            : "text-semantic-text-muted"
        )}
      >
        {item.label}
      </span>
      {item.tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full w-5 h-5 text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-ui transition-colors"
              aria-label={`Info about ${item.label}`}
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <TooltipArrow />
            {item.tooltip}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
    <span
      className={cn(
        "tracking-[0.035px]",
        item.valueSize === "lg" ? "text-lg font-semibold" : "text-sm",
        valueColorMap[item.valueColor ?? "default"]
      )}
    >
      {item.value}
    </span>
  </div>
);

/**
 * PaymentSummary displays a card with line-item rows and an optional totals section
 * separated by a divider. Values can be color-coded (default, success, error) and
 * labels can optionally show info tooltips.
 *
 * @example
 * ```tsx
 * <PaymentSummary
 *   items={[
 *     { label: "Pending Rental", value: "₹0.00" },
 *     { label: "Current Usage", value: "₹163.98" },
 *     { label: "Prepaid Wallet", value: "₹78,682.92", valueColor: "success" },
 *   ]}
 *   summaryItems={[
 *     { label: "Total amount due", value: "-₹78,518.94", valueColor: "error", valueSize: "lg", bold: true, tooltip: "Sum of all charges" },
 *     { label: "Credit limit", value: "₹10,000.00", tooltip: "Your current credit limit" },
 *   ]}
 * />
 * ```
 */
export const PaymentSummary = React.forwardRef<
  HTMLDivElement,
  PaymentSummaryProps
>(({ items, summaryItems, className }, ref) => {
  return (
    <TooltipProvider delayDuration={100}>
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-semantic-border-layout bg-semantic-bg-primary p-5",
          className
        )}
      >
        <div className="flex flex-col gap-5">
          {/* Line items */}
          {items.length > 0 && (
            <div
              className={cn(
                "flex flex-col gap-5",
                summaryItems && summaryItems.length > 0 &&
                  "border-b border-semantic-border-layout pb-5"
              )}
            >
              {items.map((item, index) => (
                <SummaryRow key={index} item={item} />
              ))}
            </div>
          )}

          {/* Summary items (below divider) */}
          {summaryItems && summaryItems.length > 0 && (
            <div className="flex flex-col gap-5">
              {summaryItems.map((item, index) => (
                <SummaryRow key={index} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
});

PaymentSummary.displayName = "PaymentSummary";
