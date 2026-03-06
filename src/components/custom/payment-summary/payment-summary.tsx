import * as React from "react";
import { Info, Wallet } from "lucide-react";
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
  /** Small 12px link-colored hint text shown below the label (e.g. remaining prepaid amount) */
  hint?: string;
}

/** Right-side wallet info displayed in the card header */
export interface PaymentSummaryHeaderInfo {
  /** Label text e.g. "Prepaid Wallet Amount:" */
  label: string;
  /** Value text e.g. "₹6,771.48" */
  value: string;
  /** Color variant for the value — defaults to "success" */
  valueColor?: "default" | "success" | "error";
}

/** A single row inside the breakdown card */
export interface BreakdownCardItem {
  label: string;
  value: string;
  /** Color variant for the label */
  labelColor?: "default" | "success" | "muted";
  /** Color variant for the value */
  valueColor?: "default" | "success" | "muted";
}

/** The light-blue bordered breakdown card shown below the subtotal */
export interface PaymentSummaryBreakdownCard {
  /** Top items separated by an inner border (e.g. Gross Charges, Prepaid Deduction) */
  topItems: BreakdownCardItem[];
  /** Bottom items (e.g. Amount Due Without GST, Applicable GST) */
  bottomItems?: BreakdownCardItem[];
}

export interface PaymentSummaryProps {
  /** Line items displayed in the top section */
  items?: PaymentSummaryItem[];
  /** Summary items displayed below the main sections (e.g. totals) */
  summaryItems?: PaymentSummaryItem[];
  /** Custom className for the outer container */
  className?: string;
  /** Card header title e.g. "Detailed Bill Breakdown" */
  title?: string;
  /** Right-side header wallet info badge */
  headerInfo?: PaymentSummaryHeaderInfo;
  /** Bold subtotal row shown after line items */
  subtotal?: { label: string; value: string };
  /** Light-blue bordered breakdown card shown below the subtotal */
  breakdownCard?: PaymentSummaryBreakdownCard;
  /** Credit limit row shown at the bottom, separated by a top border */
  creditLimit?: { value: string; tooltip?: string };
}

const valueColorMap: Record<string, string> = {
  default: "text-semantic-text-primary",
  success: "text-semantic-success-primary",
  error: "text-semantic-error-primary",
};

const breakdownColorMap: Record<string, string> = {
  default: "text-semantic-text-primary",
  success: "text-semantic-success-primary",
  muted: "text-semantic-text-muted",
};

const SummaryRow = ({ item }: { item: PaymentSummaryItem }) => (
  <div className={cn("flex justify-between w-full", item.hint ? "items-start" : "items-center")}>
    <div className={cn("flex gap-1.5", item.hint ? "items-start" : "items-center")}>
      {item.hint ? (
        <div className="flex flex-col gap-0.5">
          <span
            className={cn(
              "tracking-[0.035px]",
              item.bold
                ? "text-base font-semibold text-semantic-text-primary"
                : "text-sm text-semantic-text-muted"
            )}
          >
            {item.label}
          </span>
          <span className="text-sm text-semantic-text-link tracking-[0.06px]">
            {item.hint}
          </span>
        </div>
      ) : (
        <span
          className={cn(
            "tracking-[0.035px]",
            item.bold
              ? "text-base font-semibold text-semantic-text-primary"
              : "text-sm text-semantic-text-muted"
          )}
        >
          {item.label}
        </span>
      )}
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

const BreakdownCardRow = ({ item }: { item: BreakdownCardItem }) => (
  <div className="flex items-center justify-between w-full">
    <span
      className={cn(
        "text-sm tracking-[0.035px]",
        breakdownColorMap[item.labelColor ?? "default"]
      )}
    >
      {item.label}
    </span>
    <span
      className={cn(
        "text-sm tracking-[0.035px]",
        breakdownColorMap[item.valueColor ?? "default"]
      )}
    >
      {item.value}
    </span>
  </div>
);

/**
 * PaymentSummary displays a card with line-item rows, an optional breakdown card,
 * and a summary/totals section. Supports a rich header with wallet balance info,
 * a subtotal row, and a nested breakdown card for GST/prepaid deduction details.
 *
 * @example
 * ```tsx
 * <PaymentSummary
 *   title="Detailed Bill Breakdown"
 *   headerInfo={{ label: "Prepaid Wallet Amount:", value: "₹2,178.75" }}
 *   items={[
 *     { label: "Business Account Number (BAN)", value: "6LMVPG" },
 *     { label: "Pending Rental", value: "₹0.00" },
 *     { label: "Current Usage", value: "₹2,500.00" },
 *   ]}
 *   subtotal={{ label: "Total Charges", value: "₹2,500.00" }}
 *   breakdownCard={{
 *     topItems: [
 *       { label: "Gross Charges", value: "₹2,500.00" },
 *       { label: "(-) Prepaid Deduction", value: "₹2,178.75", labelColor: "success", valueColor: "success" },
 *     ],
 *     bottomItems: [
 *       { label: "Amount Due Without GST", value: "₹321.25" },
 *       { label: "(+) Applicable GST 18%", value: "₹57.83", labelColor: "muted", valueColor: "muted" },
 *     ],
 *   }}
 *   summaryItems={[
 *     { label: "Total amount due", value: "₹379.08", bold: true, valueSize: "lg", valueColor: "error" },
 *   ]}
 * />
 * ```
 */
export const PaymentSummary = React.forwardRef<HTMLDivElement, PaymentSummaryProps>(
  ({ items = [], summaryItems, className, title, headerInfo, subtotal, breakdownCard, creditLimit }, ref) => {
    const hasItemsBorder =
      items.length > 0 &&
      (!!subtotal || !!breakdownCard || (summaryItems && summaryItems.length > 0));

    return (
      <TooltipProvider delayDuration={100}>
        <div
          ref={ref}
          className={cn(
            "rounded-lg border border-semantic-border-layout bg-semantic-bg-primary p-5",
            className
          )}
        >
          <div className="flex flex-col gap-4">
            {/* Header: title + wallet info badge */}
            {(title || headerInfo) && (
              <div className="flex items-center justify-between border-b border-semantic-border-layout pb-4">
                {title && (
                  <span className="text-base font-semibold text-semantic-text-primary">
                    {title}
                  </span>
                )}
                {headerInfo && (
                  <div className="flex items-center gap-1.5">
                    <Wallet className="h-[18px] w-[18px] text-semantic-text-secondary" />
                    <span className="text-base text-semantic-text-secondary">
                      {headerInfo.label}
                    </span>
                    <span
                      className={cn(
                        "text-base font-semibold",
                        valueColorMap[headerInfo.valueColor ?? "success"]
                      )}
                    >
                      {headerInfo.value}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Line items */}
            {items.length > 0 && (
              <div
                className={cn(
                  "flex flex-col gap-5",
                  hasItemsBorder && "border-b border-semantic-border-layout pb-4"
                )}
              >
                {items.map((item, index) => (
                  <SummaryRow key={index} item={item} />
                ))}
              </div>
            )}

            {/* Subtotal row */}
            {subtotal && (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.035px]">
                  {subtotal.label}
                </span>
                <span className="text-sm font-semibold text-semantic-text-primary tracking-[0.035px]">
                  {subtotal.value}
                </span>
              </div>
            )}

            {/* Breakdown card */}
            {breakdownCard && (
              <div className="rounded-lg border border-semantic-border-layout bg-semantic-info-surface px-4 py-4 flex flex-col gap-2.5">
                <div
                  className={cn(
                    "flex flex-col gap-2.5",
                    breakdownCard.bottomItems &&
                      breakdownCard.bottomItems.length > 0 &&
                      "border-b border-semantic-border-layout pb-2.5"
                  )}
                >
                  {breakdownCard.topItems.map((item, index) => (
                    <BreakdownCardRow key={index} item={item} />
                  ))}
                </div>
                {breakdownCard.bottomItems && breakdownCard.bottomItems.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    {breakdownCard.bottomItems.map((item, index) => (
                      <BreakdownCardRow key={index} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Summary items (footer totals) */}
            {summaryItems && summaryItems.length > 0 && (
              <div className="flex flex-col gap-4">
                {summaryItems.map((item, index) => (
                  <SummaryRow key={index} item={item} />
                ))}
              </div>
            )}

            {/* Credit limit row */}
            {creditLimit && (
              <div className="flex items-center justify-between border-t border-semantic-border-layout pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-semantic-text-primary tracking-[0.035px]">
                    Credit limit
                  </span>
                  {creditLimit.tooltip && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full w-5 h-5 text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-ui transition-colors"
                          aria-label="Info about Credit limit"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <TooltipArrow />
                        {creditLimit.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <span className="text-sm text-semantic-text-primary tracking-[0.035px]">
                  {creditLimit.value}
                </span>
              </div>
            )}
          </div>
        </div>
      </TooltipProvider>
    );
  }
);

PaymentSummary.displayName = "PaymentSummary";
