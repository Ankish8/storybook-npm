import * as React from "react";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { AmountOption, WalletTopupProps } from "./types";

/**
 * Normalize amount option to a consistent format
 */
function normalizeAmountOption(option: number | AmountOption): AmountOption {
  return typeof option === "number" ? { value: option } : option;
}

/**
 * Format currency amount with symbol
 */
function formatCurrency(amount: number, symbol: string = "₹"): string {
  const hasDecimals = amount % 1 !== 0;
  return `${symbol}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  })}`;
}

/**
 * WalletTopup provides a collapsible panel for wallet recharge with
 * preset amount selection, custom amount input, voucher link, and payment CTA.
 *
 * @example
 * ```tsx
 * <WalletTopup
 *   icon={<CreditCard className="size-5 text-semantic-primary" />}
 *   amounts={[500, 1000, 5000, 10000]}
 *   onPay={(amount) => console.log("Pay", amount)}
 * />
 * ```
 */
export const WalletTopup = React.forwardRef<HTMLDivElement, WalletTopupProps>(
  (
    {
      title = "Instant wallet top-up",
      description = "Add funds to your account balance",
      icon,
      amounts = [500, 1000, 5000, 10000],
      selectedAmount: controlledAmount,
      defaultSelectedAmount,
      onAmountChange,
      amountSectionLabel = "Select Amount",
      customAmount: controlledCustomAmount,
      onCustomAmountChange,
      customAmountPlaceholder = "Enter amount",
      customAmountLabel = "Custom Amount",
      currencySymbol = "₹",
      taxAmount: taxAmountProp,
      taxCalculator,
      taxLabel = "Taxes (GST)",
      taxes,
      rechargeAmountLabel = "Recharge amount",
      outstandingAmount,
      outstandingLabel = "Outstanding",
      topupLabel = "Top-up",
      showVoucherLink = true,
      voucherLinkText = "Have an offline code or voucher?",
      voucherIcon = <Ticket className="size-4" />,
      onVoucherClick,
      showVoucherInput: controlledShowVoucherInput,
      onShowVoucherInputChange,
      voucherCode: controlledVoucherCode,
      onVoucherCodeChange,
      voucherCodePlaceholder = "XXXX-XXXX-XXXX",
      voucherCodeLabel = "Enter Offline Code",
      voucherCancelText = "Cancel",
      voucherCodePattern,
      validateVoucherCode,
      redeemText = "Redeem voucher",
      onRedeem,
      ctaText,
      onPay,
      loading = false,
      disabled = false,
      defaultOpen = true,
      className,
    },
    ref
  ) => {
    // Controlled/uncontrolled amount selection
    const isControlled = controlledAmount !== undefined;
    const [internalAmount, setInternalAmount] = React.useState<number | null>(
      defaultSelectedAmount ?? null
    );
    const selectedValue = isControlled ? controlledAmount : internalAmount;

    // Custom amount state
    const isCustomControlled = controlledCustomAmount !== undefined;
    const [internalCustom, setInternalCustom] = React.useState("");
    const customValue = isCustomControlled
      ? controlledCustomAmount
      : internalCustom;

    // Voucher input visibility (controlled/uncontrolled)
    const isVoucherInputControlled = controlledShowVoucherInput !== undefined;
    const [internalShowVoucherInput, setInternalShowVoucherInput] =
      React.useState(false);
    const showVoucherInput = isVoucherInputControlled
      ? controlledShowVoucherInput
      : internalShowVoucherInput;

    // Voucher code input state
    const isVoucherCodeControlled = controlledVoucherCode !== undefined;
    const [internalVoucherCode, setInternalVoucherCode] = React.useState("");
    const voucherCodeValue = isVoucherCodeControlled
      ? controlledVoucherCode
      : internalVoucherCode;

    const handleVoucherLinkClick = () => {
      if (!isVoucherInputControlled) {
        setInternalShowVoucherInput(true);
      }
      onShowVoucherInputChange?.(true);
      onVoucherClick?.();
    };

    const handleVoucherCancel = () => {
      if (!isVoucherInputControlled) {
        setInternalShowVoucherInput(false);
      }
      onShowVoucherInputChange?.(false);
      if (!isVoucherCodeControlled) {
        setInternalVoucherCode("");
      }
      onVoucherCodeChange?.("");
    };

    const handleVoucherCodeChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value;
      if (!isVoucherCodeControlled) {
        setInternalVoucherCode(value);
      }
      onVoucherCodeChange?.(value);
    };

    const isVoucherCodeValid = React.useMemo(() => {
      if (!voucherCodeValue) return false;
      if (validateVoucherCode) return validateVoucherCode(voucherCodeValue);
      if (voucherCodePattern) return voucherCodePattern.test(voucherCodeValue);
      return true;
    }, [voucherCodeValue, validateVoucherCode, voucherCodePattern]);

    const handleRedeem = () => {
      if (isVoucherCodeValid) {
        onRedeem?.(voucherCodeValue);
      }
    };

    const normalizedAmounts = amounts.map(normalizeAmountOption);
    const displayAmounts =
      outstandingAmount && outstandingAmount > 0
        ? [{ value: 0 } as AmountOption, ...normalizedAmounts]
        : normalizedAmounts;

    const handleAmountSelect = (value: number) => {
      const newValue = selectedValue === value ? null : value;
      if (!isControlled) {
        setInternalAmount(newValue);
      }
      // Clear custom amount when preset is selected
      if (!isCustomControlled && newValue !== null) {
        setInternalCustom("");
      }
      onAmountChange?.(newValue);
    };

    const handleCustomAmountChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value;
      if (!isCustomControlled) {
        setInternalCustom(value);
      }
      // Clear preset selection when custom amount is entered
      if (value && !isControlled) {
        setInternalAmount(null);
      }
      if (value) {
        onAmountChange?.(null);
      }
      onCustomAmountChange?.(value);
    };

    // Determine the effective pay amount
    const baseSelection =
      selectedValue ?? (customValue ? Number(customValue) : null);

    // Effective recharge amount (includes outstanding if present)
    const effectiveRechargeAmount =
      baseSelection !== null
        ? outstandingAmount
          ? outstandingAmount + baseSelection
          : baseSelection
        : 0;

    // Tax computation — multi-line takes priority over legacy single-line props
    const hasTax =
      taxes !== undefined ||
      taxCalculator !== undefined ||
      taxAmountProp !== undefined;

    // Resolve each tax line's computed value (multi-line takes priority over legacy single-line)
    const resolvedTaxLines =
      effectiveRechargeAmount <= 0
        ? []
        : taxes
          ? taxes.map((line) => ({
              label: line.label,
              value: line.calculator
                ? line.calculator(effectiveRechargeAmount)
                : (line.amount ?? 0),
            }))
          : taxCalculator !== undefined || taxAmountProp !== undefined
            ? [
                {
                  label: taxLabel,
                  value: taxCalculator
                    ? taxCalculator(effectiveRechargeAmount)
                    : (taxAmountProp ?? 0),
                },
              ]
            : [];

    const computedTax = resolvedTaxLines.reduce((sum, l) => sum + l.value, 0);

    // Total payable (recharge + all taxes)
    const totalPayable = effectiveRechargeAmount + computedTax;

    const handlePay = () => {
      if (totalPayable > 0) {
        onPay?.(totalPayable);
      }
    };

    const buttonText =
      ctaText ||
      (totalPayable > 0
        ? `Pay ${formatCurrency(totalPayable, currencySymbol)} now`
        : "Select an amount");

    return (
      <div ref={ref} className={cn("w-full", className)}>
        <Accordion
          type="single"
          variant="bordered"
          defaultValue={defaultOpen ? ["wallet-topup"] : []}
        >
          <AccordionItem value="wallet-topup">
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
                    {description}
                  </span>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-col gap-6 border-t border-semantic-border-layout pt-4">
                {/* Amount Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-normal text-semantic-text-muted tracking-[0.048px]">
                    {amountSectionLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {displayAmounts.map((option) => {
                      const isSelected = selectedValue === option.value;
                      const hasOutstanding =
                        outstandingAmount !== undefined &&
                        outstandingAmount > 0;
                      const totalForOption = hasOutstanding
                        ? outstandingAmount + option.value
                        : option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleAmountSelect(option.value)}
                          className={cn(
                            "flex px-4 rounded text-sm transition-all cursor-pointer",
                            hasOutstanding
                              ? "flex-col items-start gap-0.5 h-auto py-3"
                              : "items-center h-10 py-2.5",
                            isSelected
                              ? "border border-[var(--semantic-brand)] shadow-sm"
                              : "border border-semantic-border-input hover:border-semantic-text-muted"
                          )}
                        >
                          <span
                            className={cn(
                              isSelected
                                ? "text-semantic-primary"
                                : "text-semantic-text-primary",
                              hasOutstanding && "font-medium"
                            )}
                          >
                            {hasOutstanding
                              ? formatCurrency(
                                  totalForOption,
                                  currencySymbol
                                )
                              : option.label ||
                                formatCurrency(
                                  option.value,
                                  currencySymbol
                                )}
                          </span>
                          {hasOutstanding && (
                            <>
                              <span className="text-xs text-semantic-text-muted">
                                {outstandingLabel}:{" "}
                                {formatCurrency(
                                  outstandingAmount,
                                  currencySymbol
                                )}
                              </span>
                              <span className="text-xs text-semantic-text-muted">
                                {topupLabel}:{" "}
                                {option.value > 0
                                  ? formatCurrency(
                                      option.value,
                                      currencySymbol
                                    )
                                  : "-"}
                              </span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-normal text-semantic-text-muted tracking-[0.048px]">
                    {customAmountLabel}
                  </label>
                  <Input
                    type="number"
                    placeholder={customAmountPlaceholder}
                    value={customValue}
                    onChange={handleCustomAmountChange}
                  />
                </div>

                {/* Recharge Summary */}
                {hasTax && effectiveRechargeAmount > 0 && (
                  <div className="flex flex-col gap-2 rounded-lg bg-semantic-info-surface-subtle border border-semantic-info-surface px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-semantic-text-primary">
                        {rechargeAmountLabel}
                      </span>
                      <span className="text-semantic-text-primary font-medium">
                        {formatCurrency(
                          effectiveRechargeAmount,
                          currencySymbol
                        )}
                      </span>
                    </div>
                    {resolvedTaxLines.map((line) => (
                      <div
                        key={line.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-semantic-text-muted">
                          {line.label}
                        </span>
                        <span className="text-semantic-text-muted">
                          {formatCurrency(line.value, currencySymbol)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Voucher Link or Voucher Code Input */}
                {showVoucherLink && !showVoucherInput && (
                  <button
                    type="button"
                    onClick={handleVoucherLinkClick}
                    className="flex items-center gap-2 text-sm text-semantic-text-link tracking-[0.035px] hover:underline w-fit"
                  >
                    {voucherIcon}
                    <span>{voucherLinkText}</span>
                  </button>
                )}

                {showVoucherInput && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-normal text-semantic-text-muted tracking-[0.048px]">
                        {voucherCodeLabel}
                      </label>
                      <button
                        type="button"
                        onClick={handleVoucherCancel}
                        className="text-xs text-semantic-text-link tracking-[0.048px] hover:underline"
                      >
                        {voucherCancelText}
                      </button>
                    </div>
                    <Input
                      placeholder={voucherCodePlaceholder}
                      value={voucherCodeValue}
                      onChange={handleVoucherCodeChange}
                    />
                  </div>
                )}

                {/* CTA Button */}
                {showVoucherInput ? (
                  <Button
                    variant="default"
                    className="w-full bg-[var(--semantic-success-primary)] hover:bg-[var(--semantic-success-hover)]"
                    onClick={handleRedeem}
                    loading={loading}
                    disabled={disabled || !isVoucherCodeValid}
                  >
                    {redeemText}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={handlePay}
                    loading={loading}
                    disabled={disabled || totalPayable <= 0}
                  >
                    {buttonText}
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

WalletTopup.displayName = "WalletTopup";
