import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { BankDetailsProps, BankDetailItem } from "./types";

/**
 * BankDetails displays bank account information inside a collapsible accordion
 * card. Each row shows a label-value pair, with optional copy-to-clipboard
 * support for individual values.
 *
 * @example
 * ```tsx
 * <BankDetails
 *   icon={<Landmark className="size-5 text-semantic-primary" />}
 *   items={[
 *     { label: "Account holder's name", value: "MyOperator" },
 *     { label: "Account Number", value: "2223330026552601", copyable: true },
 *     { label: "IFSC Code", value: "UTIB000RAZP", copyable: true },
 *     { label: "Bank Name", value: "AXIS BANK" },
 *   ]}
 * />
 * ```
 */
export const BankDetails = React.forwardRef<HTMLDivElement, BankDetailsProps>(
  (
    {
      title = "Bank details",
      subtitle = "Direct NEFT/RTGS transfer",
      icon,
      items,
      defaultOpen = true,
      onCopy,
      className,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("w-full", className)}>
        <Accordion
          type="single"
          variant="bordered"
          defaultValue={defaultOpen ? ["bank-details"] : []}
        >
          <AccordionItem value="bank-details">
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
              <div className="border-t border-semantic-border-layout pt-4">
                <div className="rounded-md border border-[var(--semantic-info-200,#e8f1fc)] bg-[var(--semantic-info-25,#f6f8fd)] p-3">
                  <div className="flex flex-col gap-4">
                    {items.map((item, index) => (
                      <BankDetailRow
                        key={index}
                        item={item}
                        onCopy={onCopy}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);

BankDetails.displayName = "BankDetails";

/* ─── Internal row component ─── */

function BankDetailRow({
  item,
  onCopy,
}: {
  item: BankDetailItem;
  onCopy?: (item: BankDetailItem) => void;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.value);
      setCopied(true);
      onCopy?.(item);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may fail in insecure contexts; silently ignore
    }
  };

  return (
    <div className="group flex items-center justify-between text-sm tracking-[0.035px]">
      <span className="text-semantic-text-muted">{item.label}</span>
      <div className="flex items-center">
        <span className="text-semantic-text-primary text-right">
          {item.value}
        </span>
        {item.copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "inline-flex items-center justify-center rounded p-0.5 transition-all duration-200 overflow-hidden",
              copied
                ? "w-5 ml-1.5 opacity-100 text-semantic-success-primary"
                : "w-0 opacity-0 group-hover:w-5 group-hover:ml-1.5 group-hover:opacity-100 text-semantic-text-muted hover:text-semantic-text-primary"
            )}
            aria-label={`Copy ${item.label}`}
          >
            {copied ? (
              <Check className="size-3.5 shrink-0" />
            ) : (
              <Copy className="size-3.5 shrink-0" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
