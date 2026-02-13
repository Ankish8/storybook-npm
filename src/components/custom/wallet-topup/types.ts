import * as React from "react";

/**
 * Represents a preset amount option in the selector grid
 */
export interface AmountOption {
  /** The numeric value of the amount */
  value: number;
  /** Optional custom display label (defaults to formatted currency) */
  label?: string;
}

/**
 * Props for the WalletTopup component
 */
export interface WalletTopupProps {
  // Header
  /** Title displayed in the accordion header */
  title?: string;
  /** Description displayed below the title */
  description?: string;
  /** Icon displayed in the header (rendered inside a rounded container) */
  icon?: React.ReactNode;

  // Amount selection
  /** Preset amount options to display in the grid */
  amounts?: number[] | AmountOption[];
  /** Currently selected amount (controlled) */
  selectedAmount?: number | null;
  /** Default selected amount (uncontrolled) */
  defaultSelectedAmount?: number;
  /** Callback when amount selection changes */
  onAmountChange?: (amount: number | null) => void;
  /** Label for the amount selection section */
  amountSectionLabel?: string;

  // Custom amount
  /** Custom amount input value (controlled) */
  customAmount?: string;
  /** Callback when custom amount input changes */
  onCustomAmountChange?: (value: string) => void;
  /** Placeholder text for custom amount input */
  customAmountPlaceholder?: string;
  /** Label for the custom amount field */
  customAmountLabel?: string;

  // Currency
  /** Currency symbol (default: "₹") */
  currencySymbol?: string;

  // Tax / Summary
  /** Static tax amount to display in the summary section */
  taxAmount?: number;
  /** Function to dynamically compute tax from the recharge amount. Takes priority over taxAmount. */
  taxCalculator?: (amount: number) => number;
  /** Label for the tax line in the summary (default: "Taxes (GST)") */
  taxLabel?: string;
  /** Label for the recharge amount line in the summary (default: "Recharge amount") */
  rechargeAmountLabel?: string;

  // Outstanding balance
  /** Outstanding balance. When set, auto-prepends an outstanding-only option and shows breakdowns in each amount button. */
  outstandingAmount?: number;
  /** Label for the outstanding breakdown in amount buttons (default: "Outstanding") */
  outstandingLabel?: string;
  /** Label for the topup breakdown in amount buttons (default: "Top-up") */
  topupLabel?: string;

  // Voucher link
  /** Whether to show the voucher/code link */
  showVoucherLink?: boolean;
  /** Custom text for the voucher link */
  voucherLinkText?: string;
  /** Icon for the voucher link */
  voucherIcon?: React.ReactNode;
  /** Callback when voucher link is clicked (also toggles inline code input) */
  onVoucherClick?: () => void;

  // Voucher input visibility
  /** Whether the voucher input is visible (controlled). When provided, the component won't toggle visibility internally. */
  showVoucherInput?: boolean;
  /** Callback when voucher input visibility changes (from link click or cancel) */
  onShowVoucherInputChange?: (show: boolean) => void;

  // Voucher code input
  /** Voucher code value (controlled) */
  voucherCode?: string;
  /** Callback when voucher code changes */
  onVoucherCodeChange?: (code: string) => void;
  /** Placeholder for voucher code input */
  voucherCodePlaceholder?: string;
  /** Label for voucher code input */
  voucherCodeLabel?: string;
  /** Text for cancel link in voucher mode */
  voucherCancelText?: string;
  /** Regex pattern the voucher code must match to enable redeem (e.g. /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/) */
  voucherCodePattern?: RegExp;
  /** Custom validator function — return true if code is valid. Takes priority over voucherCodePattern. */
  validateVoucherCode?: (code: string) => boolean;
  /** Text for the redeem button */
  redeemText?: string;
  /** Callback when redeem voucher is clicked */
  onRedeem?: (code: string) => void;

  // CTA
  /** Text for the pay button (defaults to "Pay {amount} now") */
  ctaText?: string;
  /** Callback when pay button is clicked */
  onPay?: (amount: number) => void;
  /** Whether the pay button shows loading state */
  loading?: boolean;
  /** Whether the pay button is disabled */
  disabled?: boolean;

  // Accordion
  /** Whether the accordion is open by default */
  defaultOpen?: boolean;

  // Styling
  /** Additional className for the root element */
  className?: string;
}
