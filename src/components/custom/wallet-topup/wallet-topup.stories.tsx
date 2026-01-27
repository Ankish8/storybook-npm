import type { Meta, StoryObj } from "@storybook/react";
import { CreditCard, Gift } from "lucide-react";
import { WalletTopup } from "./wallet-topup";

/**
 * ## Wallet Topup
 *
 * A collapsible panel for wallet recharge with preset amount selection,
 * custom amount input, voucher link, and payment CTA.
 *
 * ### Design Tokens
 *
 * | Token | CSS Variable | Usage |
 * |-------|--------------|-------|
 * | Info Surface | `--semantic-info-surface` | Header icon background |
 * | Primary | `--semantic-primary` | Selected amount border, check icon |
 * | Text Primary | `--semantic-text-primary` | Title, amount labels |
 * | Text Muted | `--semantic-text-muted` | Description, section labels |
 * | Text Link | `--semantic-text-link` | Voucher link text |
 * | Text Placeholder | `--semantic-text-placeholder` | Input placeholder |
 * | Border Input | `--semantic-border-input` | Unselected amount borders, input border |
 * | Border Layout | `--semantic-border-layout` | Card border, content separator |
 * | Success Primary | `--semantic-success-primary` | Redeem voucher CTA button |
 * | Success Hover | `--semantic-success-hover` | Redeem voucher CTA hover |
 *
 * ### Typography
 *
 * | Element | Font Size | Weight | Letter Spacing |
 * |---------|-----------|--------|----------------|
 * | Title | 14px | 600 (SemiBold) | 0.01px |
 * | Description | 12px | 400 (Regular) | 0.048px |
 * | Section Label | 12px | 400 (Regular) | 0.048px |
 * | Amount Text | 14px | 400 (Regular) | 0.035px |
 * | CTA Button | 14px | 600 (SemiBold) | 0.01px |
 *
 * ### Usage
 *
 * ```tsx
 * import { WalletTopup } from "@/components/custom/wallet-topup";
 * import { CreditCard } from "lucide-react";
 *
 * <WalletTopup
 *   icon={<CreditCard className="size-5 text-semantic-primary" />}
 *   amounts={[500, 1000, 5000, 10000]}
 *   defaultSelectedAmount={500}
 *   onPay={(amount) => handlePayment(amount)}
 *   onRedeem={(code) => redeemVoucher(code)}
 * />
 * ```
 */
const meta: Meta<typeof WalletTopup> = {
  title: "Custom/Plan & Payment/WalletTopup",
  component: WalletTopup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "440px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [500, 1000, 5000, 10000],
    defaultSelectedAmount: 500,
  },
};

export const NoPreselection: Story = {
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [500, 1000, 5000, 10000],
  },
};

export const CustomLabels: Story = {
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [
      { value: 500, label: "Basic - ₹500" },
      { value: 1000, label: "Standard - ₹1,000" },
      { value: 5000, label: "Premium - ₹5,000" },
      { value: 10000, label: "Enterprise - ₹10,000" },
    ],
  },
};

export const DollarCurrency: Story = {
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [10, 25, 50, 100],
    currencySymbol: "$",
    title: "Add credits",
    description: "Purchase credits for your account",
  },
};

export const CustomVoucherIcon: Story = {
  name: "Custom Voucher Icon",
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [500, 1000, 5000, 10000],
    defaultSelectedAmount: 500,
    voucherIcon: <Gift className="size-4" />,
  },
};

export const NoVoucherLink: Story = {
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [500, 1000, 5000, 10000],
    showVoucherLink: false,
  },
};

export const Loading: Story = {
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [500, 1000, 5000, 10000],
    defaultSelectedAmount: 500,
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [500, 1000, 5000, 10000],
    defaultSelectedAmount: 1000,
    disabled: true,
  },
};

export const CollapsedByDefault: Story = {
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [500, 1000, 5000, 10000],
    defaultOpen: false,
  },
};

export const WithoutIcon: Story = {
  args: {
    amounts: [500, 1000, 5000, 10000],
    defaultSelectedAmount: 500,
  },
};

export const CustomCTAText: Story = {
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [500, 1000, 5000, 10000],
    defaultSelectedAmount: 500,
    ctaText: "Proceed to Payment",
  },
};

export const VoucherWithPattern: Story = {
  name: "Voucher with Pattern Validation",
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [500, 1000, 5000, 10000],
    defaultSelectedAmount: 500,
    voucherCodePattern: /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
    voucherCodePlaceholder: "ABCD-1234-EFGH",
  },
};

export const VoucherWithCustomValidator: Story = {
  name: "Voucher with Custom Validator",
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [500, 1000, 5000, 10000],
    defaultSelectedAmount: 500,
    validateVoucherCode: (code: string) => code.length >= 8,
    voucherCodePlaceholder: "Min 8 characters",
  },
};

export const CustomVoucherLabels: Story = {
  name: "Custom Voucher Labels",
  args: {
    icon: <CreditCard className="size-5 text-semantic-primary" />,
    amounts: [500, 1000, 5000, 10000],
    defaultSelectedAmount: 500,
    voucherCodeLabel: "Promo Code",
    voucherCodePlaceholder: "Enter promo code",
    voucherCancelText: "Go back",
    redeemText: "Apply code",
  },
};
